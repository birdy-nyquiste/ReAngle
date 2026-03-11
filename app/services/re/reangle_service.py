"""
ReAngle 业务编排服务。
基于原文、用户选择的 facts/angles、以及用户自定义 prompt 调用 LLM 生成新叙事。
"""

import os
import asyncio
from google import genai
from google.genai.errors import ServerError
from loguru import logger
from pydantic import BaseModel, Field

from app.schemas.reangle_schema import ReAngleResponse
from app.core.exceptions import LLMProviderError, ServiceUnavailableError


class _ReAngleOutput(BaseModel):
    """LLM 结构化输出。"""

    summary: str = Field(
        description="A concise 2-3 sentence abstract of the rewritten article."
    )
    rewritten_content: str = Field(description="The full rewritten article content.")


async def run_reangle(
    clean_text: str,
    selected_facts: list[dict],
    selected_angles: list[dict],
    prompt: str,
    model: str = "gemini-3-flash-preview",
) -> ReAngleResponse:
    """
    执行 ReAngle 内容生成流程。

    Args:
        clean_text: 原文合并后的纯文本
        selected_facts: 用户在前端选中的 fact 列表 (dict)
        selected_angles: 用户在前端选中的 angle 列表 (dict)
        prompt: 用户自定义的叙事角度/提示词

    Returns:
        ReAngleResponse 包含 summary 和 rewritten_content
    """
    client = None
    try:
        if not os.getenv("GEMINI_API_KEY"):
            raise LLMProviderError("Missing Gemini API Key")

        client = genai.Client()

        # ── 构建结构化 context ──────────────────────────
        context_parts: list[str] = []

        # 选中的事实
        if selected_facts:
            facts_text = "\n".join(f"- {f.get('content', '')}" for f in selected_facts)
            context_parts.append(
                f"## Selected Facts (verified events the user wants to keep)\n{facts_text}"
            )

        # 选中的视角
        if selected_angles:
            angles_text = "\n".join(
                f"- **{a.get('title', '')}**: {a.get('description', '')}"
                for a in selected_angles
            )
            context_parts.append(
                f"## Selected Original Angles (perspectives the user wants to reference)\n{angles_text}"
            )

        # 用户自定义指令
        if prompt.strip():
            context_parts.append(f"## User Instruction\n{prompt.strip()}")

        context_block = (
            "\n\n".join(context_parts)
            if context_parts
            else "No specific angle or selection provided. Rewrite the article in a neutral, balanced tone."
        )

        llm_prompt = (
            "You are an expert journalist and content rewriter.\n"
            "I will provide you with an ORIGINAL ARTICLE and a set of CONTEXT.\n"
            "Your task is to rewrite the article based on the context.\n\n"
            "Rules:\n"
            "1. Use ONLY the facts from the selected facts as the factual basis of the rewritten article. Do NOT fabricate new facts.\n"
            "2. If original angles are selected, use them as reference for tone or perspective, but adapt them according to the user instruction.\n"
            "3. If the user provides a specific instruction, follow it closely to shape the narrative angle of the rewritten article.\n"
            "4. The rewritten article should be coherent, well-structured, and professional.\n"
            "5. Generate a concise 2-3 sentence summary/abstract of the rewritten article.\n"
            "6. Write the rewritten article in the same language as the original article.\n\n"
            f"--- ORIGINAL ARTICLE ---\n{clean_text}\n\n"
            f"--- CONTEXT ---\n{context_block}\n"
        )

        max_retries = 3
        base_backoff = 2
        timeout_seconds = 60  # ReAngle 生成内容可能更多，给 60 秒超时

        for attempt in range(1, max_retries + 1):
            try:
                logger.info(
                    f"[reangle] Generating rewritten content using {model} (Attempt {attempt}/{max_retries})..."
                )

                response = await asyncio.wait_for(
                    client.aio.models.generate_content(
                        model=model,
                        contents=llm_prompt,
                        config={
                            "response_mime_type": "application/json",
                            "response_schema": _ReAngleOutput.model_json_schema(),
                            "temperature": 0.7,
                        },
                    ),
                    timeout=timeout_seconds,
                )

                result = _ReAngleOutput.model_validate_json(response.text)

                logger.info(
                    "[reangle] Generated | summary_len={} | content_len={}",
                    len(result.summary),
                    len(result.rewritten_content),
                )

                return ReAngleResponse(
                    summary=result.summary,
                    rewritten_content=result.rewritten_content,
                )

            except asyncio.TimeoutError:
                logger.warning(
                    f"[reangle] Gemini request timed out after {timeout_seconds} seconds on attempt {attempt}."
                )
                if attempt == max_retries:
                    raise ServiceUnavailableError(
                        "The AI service is currently taking too long to respond. Please try again later.",
                        details={"original_error": "TimeoutError"},
                    )

            except ServerError as e:
                if e.code in [503, 429]:
                    logger.warning(
                        f"[reangle] Gemini service unavailable/rate limited ({e.code}): {str(e)} on attempt {attempt}."
                    )
                    if attempt < max_retries:
                        sleep_time = base_backoff**attempt
                        logger.info(f"[reangle] Retrying in {sleep_time} seconds...")
                        await asyncio.sleep(sleep_time)
                        continue
                    raise ServiceUnavailableError(
                        "Gemini model is currently experiencing high demand. Please try again in a moment.",
                        details={"original_error": str(e)},
                    )
                logger.exception("Gemini ServerError during ReAngle")
                raise LLMProviderError(f"Gemini server error ({e.code}): {str(e)}")

            except Exception as e:
                logger.exception("ReAngle generation failed")
                raise LLMProviderError(
                    f"ReAngle API error: {type(e).__name__} - {str(e)}"
                )

    except Exception as e:
        logger.exception("ReAngle setup failed")
        raise LLMProviderError(f"ReAngle setup error: {str(e)}")
    finally:
        if client:
            client.close()
