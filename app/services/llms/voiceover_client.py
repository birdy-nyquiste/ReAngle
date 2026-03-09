"""
将改写后的文章转换为口播稿的 OpenAI 客户端。
"""

import os
import yaml
from openai import OpenAI
from loguru import logger

from app.configs.settings import SYSTEM_PROMPTS_DIR
from app.core.exceptions import LLMProviderError


async def get_voiceover_script(text: str, model: str = "gpt-5") -> str:
    """
    使用 OpenAI，将改写后的文章转换为适合数字人播报的口播稿。
    """
    try:
        # 加载口播稿系统提示词
        prompt_file = os.path.join(SYSTEM_PROMPTS_DIR, "voiceover_system_prompt.yaml")
        try:
            with open(prompt_file, "r", encoding="utf-8") as f:
                prompt_data = yaml.safe_load(f)
                system_prompt = prompt_data.get("system_prompt", "")
        except Exception as e:
            logger.error(f"Failed to load voiceover system prompt: {e}")
            raise LLMProviderError(
                f"Configuration error: Failed to load voiceover system prompt: {str(e)}"
            )

        if not os.getenv("OPENAI_API_KEY"):
            logger.error("OPENAI_API_KEY not found in environment")
            raise LLMProviderError("Server configuration error: Missing OpenAI API Key")

        client = OpenAI()

        logger.info(f"Calling OpenAI for voiceover script (model: {model})")
        # 某些新版模型不支持自定义 temperature，这里使用默认配置，不显式传 temperature
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": text,
                },
            ],
        )

        content = resp.choices[0].message.content or ""
        return content.strip()

    except LLMProviderError:
        raise
    except Exception as e:
        logger.exception("OpenAI voiceover call failed")
        raise LLMProviderError(f"OpenAI voiceover API error: {str(e)}")

