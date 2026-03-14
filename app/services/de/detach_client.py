"""
Event/Angle 拆分客户端。
调用大模型将输入文本拆分为客观事件（Event）和主观观点（Angle）。
"""

import os
import asyncio
from google import genai
from google.genai.errors import ServerError, ClientError
from loguru import logger
import uuid

from app.core.exceptions import LLMProviderError, ServiceUnavailableError
from app.schemas.deangle_schema import DetachResult, RawEvent, Angle


async def detach_events_and_angles(
    text: str, model: str = "gemini-2.5-flash"
) -> DetachResult:
    """
    调用 LLM 执行 Event-Angle Detach 任务。

    Args:
        text: 待拆分的纯文本

    Returns:
        DetachResult 包含 raw_events 和 original_angles
    """
    if not os.getenv("GEMINI_API_KEY"):
        raise LLMProviderError("Missing Gemini API Key")

    client = None
    try:
        client = genai.Client()

        prompt = (
            "You are an expert news analyst.\n"
            "I will provide you with a text, which might be a combination of different news sources.\n"
            "Your task is to detach the objective 'events' from the subjective 'angles' or interpretations.\n\n"
            "1. **Events (raw_events)**: Extract the core, objective, factual claims made in the text without any spin or narrative. These should be statements that can be verified as true or false.\n"
            "2. **Angles (original_angles)**: Identify the subjective narratives, opinions, spins, or viewpoints presented in the text. For each angle, provide a concise 'title' and a 'description' of what that angle attempts to convey.\n"
            "3. For the Angles, generate a short unique hex 'id', and pick a 'color' out of: ['blue', 'purple', 'orange', 'green', 'red'] that best fits the emotion of the angle.\n\n"
            "Please return the result strictly matching the provided JSON schema.\n\n"
            f"--- TEXT ---\n{text}\n"
        )

        max_retries = 3
        base_backoff = 2
        timeout_seconds = 45  # 允许最多等待 45 秒单次请求

        for attempt in range(1, max_retries + 1):
            try:
                logger.info(
                    f"[detach_client] Detaching events and angles using {model} (Attempt {attempt}/{max_retries})..."
                )

                # 使用 asyncio.wait_for 来强制控制最大等待时间
                response = await asyncio.wait_for(
                    client.aio.models.generate_content(
                        model=model,
                        contents=prompt,
                        config={
                            "response_mime_type": "application/json",
                            "response_schema": DetachResult.model_json_schema(),
                            "temperature": 0.2,
                        },
                    ),
                    timeout=timeout_seconds,
                )

                result = DetachResult.model_validate_json(response.text)

                # Ensure angles have IDs since the LLM might struggle to generate perfect UUIDs
                for angle in result.original_angles:
                    if not angle.id:
                        angle.id = "angle-" + str(uuid.uuid4())[:8]

                logger.info(
                    f"[detach_client] Extracted {len(result.raw_events)} events and {len(result.original_angles)} angles."
                )
                return result

            except asyncio.TimeoutError:
                logger.warning(
                    f"[detach] Gemini request timed out after {timeout_seconds} seconds on attempt {attempt}."
                )
                if attempt == max_retries:
                    raise ServiceUnavailableError(
                        "The AI service is currently taking too long to respond. Please try again later.",
                        details={"original_error": "TimeoutError"},
                    )

            except ClientError as e:
                # 429 配额/限流：免费 tier 每日 20 次等
                if getattr(e, "status_code", None) == 429 or "429" in str(e):
                    logger.warning(f"[detach] Gemini quota exceeded (429): {e}")
                    raise ServiceUnavailableError(
                        "Gemini 免费额度已用尽（每日约 20 次请求）。请明日再试，或前往 Google AI Studio 升级 API 计划。",
                        details={"original_error": "RESOURCE_EXHAUSTED", "code": 429},
                    )
                logger.exception("Gemini ClientError during Detach")
                raise LLMProviderError(f"Gemini API error: {type(e).__name__} - {str(e)}")

            except ServerError as e:
                if e.code in [503, 429]:  # 处理 High Demand 和 Rate Limit
                    logger.warning(
                        f"[detach] Gemini service unavailable/rate limited ({e.code}): {str(e)} on attempt {attempt}."
                    )
                    if attempt < max_retries:
                        sleep_time = base_backoff**attempt
                        logger.info(f"[detach_client] Retrying in {sleep_time} seconds...")
                        await asyncio.sleep(sleep_time)
                        continue
                    raise ServiceUnavailableError(
                        "Gemini model is currently experiencing high demand. Please try again in a moment.",
                        details={"original_error": str(e)},
                    )
                # 对于其他 ServerError 直接抛出
                logger.exception("Gemini ServerError during Detach")
                raise LLMProviderError(f"Gemini server error ({e.code}): {str(e)}")

            except Exception as e:
                # 解析错误或客户端错误直接抛出
                logger.exception("Detach events and angles failed")
                raise LLMProviderError(f"Detach API error: {type(e).__name__} - {str(e)}")
    finally:
        if client:
            client.close()
