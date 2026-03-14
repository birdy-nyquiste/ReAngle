"""
将改写后的文章转换为口播稿的 OpenAI 客户端。
从 app/services/re/prompts/voiceover_system_prompt.yaml 加载 system prompt，调用 OpenAI 生成口播稿。
"""

import os
import yaml
from openai import AsyncOpenAI
from loguru import logger

from app.core.config import SYSTEM_PROMPTS_DIR
from app.core.exceptions import LLMProviderError


async def get_voiceover_script(text: str, model: str | None = None) -> str:
    """
    使用 OpenAI，将改写后的文章转换为适合数字人播报的口播稿。

    Args:
        text: 改写后的文章全文（ReAngled content）。
        model: 模型，默认从环境变量 OPENAI_VOICEOVER_MODEL 读取，否则 gpt-4o。

    Returns:
        口播稿正文（纯文本）。
    """
    text = (text or "").strip()
    if not text:
        raise LLMProviderError("Article text is empty")

    try:
        prompt_file = os.path.join(SYSTEM_PROMPTS_DIR, "voiceover_system_prompt.yaml")
        try:
            with open(prompt_file, "r", encoding="utf-8") as f:
                prompt_data = yaml.safe_load(f)
                system_prompt = (prompt_data or {}).get("system_prompt", "")
        except Exception as e:
            logger.error(f"Failed to load voiceover system prompt: {e}")
            raise LLMProviderError(
                f"Configuration error: Failed to load voiceover system prompt: {str(e)}"
            )

        if not system_prompt.strip():
            raise LLMProviderError("Voiceover system prompt is empty")

        if not os.getenv("OPENAI_API_KEY"):
            logger.error("OPENAI_API_KEY not found in environment")
            raise LLMProviderError("Server configuration error: Missing OpenAI API Key")

        client = AsyncOpenAI()
        model = model or os.getenv("OPENAI_VOICEOVER_MODEL", "gpt-4o")

        logger.info(f"[voiceover_client] Calling OpenAI for voiceover script (model: {model}), text_len={len(text)}")

        resp = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text},
            ],
        )

        content = (resp.choices[0].message.content or "").strip()
        if not content:
            raise LLMProviderError("OpenAI voiceover returned empty content")

        logger.info(f"[voiceover_client] Script length={len(content)}")
        return content

    except LLMProviderError:
        raise
    except Exception as e:
        logger.exception("OpenAI voiceover call failed")
        raise LLMProviderError(f"OpenAI voiceover API error: {str(e)}")
