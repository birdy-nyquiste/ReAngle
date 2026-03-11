"""
验证多个输入源是否属于同一个事件主题。
调用大模型生成 structured output。
"""

import os
from google import genai
from google.genai.errors import ServerError
from pydantic import BaseModel, Field
from loguru import logger

from app.core.exceptions import LLMProviderError, ServiceUnavailableError


class ThemeValidationResult(BaseModel):
    is_valid: bool = Field(description="是否属于同一事件主题。")
    reason: str = Field(description="判断理由，验证失败时必须详细解释原因。")


async def validate_theme(
    texts: list[str], model: str = "gemini-3-flash-preview"
) -> ThemeValidationResult:
    """
    检查输入的内容列表是否主要讨论同一个核心事件。
    """
    if len(texts) <= 1:
        # 单个输入源默认通过一致性校验
        return ThemeValidationResult(
            is_valid=True, reason="单个输入源，无需一致性验证。"
        )

    client = None
    try:
        if not os.getenv("GEMINI_API_KEY"):
            raise LLMProviderError("Missing Gemini API Key")

        client = genai.Client()

        prompt = (
            "你是一个严格的新闻编辑。我将提供几段不同来源的文本内容。\n"
            "你需要判断这些文本内容是否在报道或描述【同一个核心事件】。\n"
            "如果是不同事件的拼凑，或者主题完全不同，请判定为 false。\n"
            "请仔细分析并返回 JSON 结果，必须包含 is_valid (boolean) 和 reason (解释)。\n\n"
        )

        for i, text in enumerate(texts):
            prompt += f"--- 来源 {i+1} ---\n{text}\n\n"

        logger.info(
            f"[theme_validator] Validating theme for {len(texts)} sources using {model}..."
        )

        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": ThemeValidationResult.model_json_schema(),
                "temperature": 0.1,
            },
        )

        result = ThemeValidationResult.model_validate_json(response.text)
        logger.info(
            f"[theme_validator] Result: {result.is_valid} | Reason: {result.reason}"
        )
        return result

    except LLMProviderError:
        raise
    except ServerError as e:
        if e.code == 503:
            logger.warning(
                f"[theme_validator] Gemini service unavailable (503): {str(e)}"
            )
            raise ServiceUnavailableError(
                "Gemini model is currently experiencing high demand. Please try again in a moment.",
                details={"original_error": str(e)},
            )
        logger.exception("Gemini ServerError during Theme Validation")
        raise LLMProviderError(f"Gemini server error ({e.code}): {str(e)}")
    except Exception as e:
        logger.exception("Theme validation failed")
        raise LLMProviderError(f"Theme validation API error: {str(e)}")
    finally:
        if client:
            client.close()
