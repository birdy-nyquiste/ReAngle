"""
跨模型的结构化输出调用封装。
"""

import asyncio
import json
import os
from typing import TypeVar

from google import genai
from google.genai.errors import ServerError
from loguru import logger
from openai import OpenAI
from pydantic import BaseModel

from app.core.config import MODEL_PROVIDER_MAP
from app.core.exceptions import LLMProviderError, ServiceUnavailableError

ModelT = TypeVar("ModelT", bound=BaseModel)


def _provider_for_model(model: str) -> str:
    provider = MODEL_PROVIDER_MAP.get(model)
    if not provider:
        raise LLMProviderError(f"Unsupported model: {model}")
    return provider


def _require_env(var_name: str):
    if not os.getenv(var_name):
        raise LLMProviderError(f"Missing {var_name}")


def _openai_generate_sync(
    model: str,
    prompt: str,
    schema: type[ModelT],
) -> ModelT:
    _require_env("OPENAI_API_KEY")
    client = OpenAI()
    response = client.responses.parse(
        model=model,
        text_format=schema,
        input=[{"role": "user", "content": prompt}],
    )
    return response.output_parsed


def _qwen_generate_sync(
    model: str,
    prompt: str,
    schema: type[ModelT],
    temperature: float,
) -> ModelT:
    _require_env("DASHSCOPE_API_KEY")
    client = OpenAI(
        api_key=os.getenv("DASHSCOPE_API_KEY"),
        base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    )
    completion = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
        response_format={"type": "json_object"},
    )
    content = completion.choices[0].message.content or "{}"
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError as e:
        logger.error("[llm] Failed to parse Qwen JSON output: {}", e)
        raise LLMProviderError("Qwen returned invalid JSON.")
    return schema.model_validate(parsed)


async def _gemini_generate(
    model: str,
    prompt: str,
    schema: type[ModelT],
    temperature: float,
    timeout_seconds: int,
    max_retries: int,
    base_backoff: int,
) -> ModelT:
    _require_env("GEMINI_API_KEY")
    client = None
    try:
        client = genai.Client()
        for attempt in range(1, max_retries + 1):
            try:
                response = await asyncio.wait_for(
                    client.aio.models.generate_content(
                        model=model,
                        contents=prompt,
                        config={
                            "response_mime_type": "application/json",
                            "response_schema": schema.model_json_schema(),
                            "temperature": temperature,
                        },
                    ),
                    timeout=timeout_seconds,
                )
                return schema.model_validate_json(response.text)
            except asyncio.TimeoutError:
                logger.warning(
                    "[llm] Gemini timeout on attempt {}/{}",
                    attempt,
                    max_retries,
                )
                if attempt == max_retries:
                    raise ServiceUnavailableError(
                        "The AI service is currently taking too long to respond. Please try again later.",
                        details={"original_error": "TimeoutError"},
                    )
            except ServerError as e:
                if e.code in [429, 503]:
                    logger.warning(
                        "[llm] Gemini unavailable/rate limited ({}) on attempt {}/{}",
                        e.code,
                        attempt,
                        max_retries,
                    )
                    if attempt < max_retries:
                        await asyncio.sleep(base_backoff**attempt)
                        continue
                    raise ServiceUnavailableError(
                        "Gemini model is currently experiencing high demand. Please try again in a moment.",
                        details={"original_error": str(e)},
                    )
                raise LLMProviderError(f"Gemini server error ({e.code}): {str(e)}")
    finally:
        if client:
            client.close()

    raise LLMProviderError("Gemini call failed unexpectedly.")


async def generate_structured_output(
    model: str,
    prompt: str,
    schema: type[ModelT],
    temperature: float = 0.2,
    timeout_seconds: int = 60,
    max_retries: int = 3,
    base_backoff: int = 2,
) -> ModelT:
    provider = _provider_for_model(model)
    logger.info(
        "[llm] generate_structured_output | model={} | provider={}", model, provider
    )

    try:
        if provider == "gemini":
            return await _gemini_generate(
                model=model,
                prompt=prompt,
                schema=schema,
                temperature=temperature,
                timeout_seconds=timeout_seconds,
                max_retries=max_retries,
                base_backoff=base_backoff,
            )

        if provider == "openai":
            return await asyncio.to_thread(_openai_generate_sync, model, prompt, schema)

        if provider == "qwen":
            return await asyncio.to_thread(
                _qwen_generate_sync, model, prompt, schema, temperature
            )

        raise LLMProviderError(f"Unsupported provider: {provider}")
    except (LLMProviderError, ServiceUnavailableError):
        raise
    except Exception as e:
        logger.exception("[llm] structured output generation failed")
        raise LLMProviderError(
            f"LLM API error ({provider}/{model}): {type(e).__name__} - {str(e)}"
        )
