"""
事实核查客户端。
调用大模型对提取的事件列表进行真实性验证。
"""

import os
import asyncio
from google import genai
from google.genai.errors import ServerError
from loguru import logger
from pydantic import BaseModel, Field

from app.core.exceptions import LLMProviderError, ServiceUnavailableError
from app.schemas.deangle_schema import FactCheckResult, RawEvent


class FactCheckBatchResult(BaseModel):
    results: list[FactCheckResult] = Field(
        ...,
        description="List of fact check outcomes corresponding to the input events.",
    )


async def check_facts(
    events: list[RawEvent], model: str = "gemini-2.5-flash"
) -> list[FactCheckResult]:
    """
    调用 LLM 对事件列表执行 Fact Verification (5-tier accuracy assessment)。

    Args:
        events: 待核查的候选事件列表

    Returns:
        每个事件的核查结果列表（含 status 和 reason）
    """
    if not events:
        return []

    client = None
    try:
        if not os.getenv("GEMINI_API_KEY"):
            raise LLMProviderError("Missing Gemini API Key")

        client = genai.Client()

        prompt = (
            "You are an expert fact-checker.\n"
            "I will provide you with a list of objective events/claims extracted from articles.\n"
            "Your task is to independently fact-check EACH event based on your general knowledge and training data.\n\n"
            "Assess the accuracy of each event and assign ONE of the following statuses:\n"
            "- SUPPORTED: The claim is entirely accurate and supported by evidence.\n"
            "- MOSTLY_SUPPORTED: The core claim is true, but some minor details may be missing or slightly inaccurate.\n"
            "- PARTIALLY_SUPPORTED: The claim contains a mix of true and false information, or lacks crucial context.\n"
            "- CONTRADICTED: The claim is factually false or directly contradicts known evidence.\n"
            "- UNVERIFIABLE: There is not enough public evidence to prove or disprove the claim, or it is a subjective prediction.\n\n"
            "For each event, you MUST provide a detailed 'reason' explaining your assessment and noting any context.\n"
            "Ensure you return the 'content' exactly as provided in the input.\n"
            "Please return a JSON strictly matching the provided schema, containing the 'results' array.\n\n"
            "--- EVENTS TO CHECK ---\n"
        )

        for i, event in enumerate(events):
            prompt += f"[{i+1}] {event.content}\n"

        max_retries = 3
        base_backoff = 2
        timeout_seconds = 45  # 允许最多等待 45 秒单次请求

        for attempt in range(1, max_retries + 1):
            try:
                logger.info(
                    f"[fact_check_client] Fact checking {len(events)} events using {model} (Attempt {attempt}/{max_retries})..."
                )

                response = await asyncio.wait_for(
                    client.aio.models.generate_content(
                        model=model,
                        contents=prompt,
                        config={
                            "response_mime_type": "application/json",
                            "response_schema": FactCheckBatchResult.model_json_schema(),
                            "temperature": 0.1,
                        },
                    ),
                    timeout=timeout_seconds,
                )

                batch_result = FactCheckBatchResult.model_validate_json(response.text)
                logger.info(
                    f"[fact_check_client] Successfully fact-checked {len(batch_result.results)} events."
                )

                return batch_result.results

            except asyncio.TimeoutError:
                logger.warning(
                    f"[fact_check] Gemini request timed out after {timeout_seconds} seconds on attempt {attempt}."
                )
                if attempt == max_retries:
                    raise ServiceUnavailableError(
                        "The AI service is currently taking too long to respond. Please try again later.",
                        details={"original_error": "TimeoutError"},
                    )

            except ServerError as e:
                if e.code in [503, 429]:  # 处理 High Demand 和 Rate Limit
                    logger.warning(
                        f"[fact_check] Gemini service unavailable/rate limited ({e.code}): {str(e)} on attempt {attempt}."
                    )
                    if attempt < max_retries:
                        sleep_time = base_backoff**attempt
                        logger.info(
                            f"[fact_check_client] Retrying in {sleep_time} seconds..."
                        )
                        await asyncio.sleep(sleep_time)
                        continue
                    raise ServiceUnavailableError(
                        "Gemini model is currently experiencing high demand. Please try again in a moment.",
                        details={"original_error": str(e)},
                    )
                # 对于其他 ServerError 直接抛出
                logger.exception("Gemini ServerError during Fact Check")
                raise LLMProviderError(f"Gemini server error ({e.code}): {str(e)}")

            except Exception as e:
                logger.exception("Fact checking failed")
                raise LLMProviderError(
                    f"Fact Check API error: {type(e).__name__} - {str(e)}"
                )

    except Exception as e:
        logger.exception("Fact checking setup failed")
        raise LLMProviderError(f"Fact Check setup error: {str(e)}")
    finally:
        if client:
            client.close()
