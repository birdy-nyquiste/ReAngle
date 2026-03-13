"""
ReAngle 业务编排服务。
基于原文、用户选择的 facts/angles、以及用户自定义 prompt 调用 LLM 生成新叙事。
"""

from loguru import logger
from pydantic import BaseModel, Field

from app.schemas.reangle_schema import ReAngleResponse
from app.services.llm import generate_structured_output


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
    model: str,
    system_prompt: str,
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
    # ── 构建结构化 context ──────────────────────────
    context_parts: list[str] = []

    if selected_facts:
        facts_text = "\n".join(f"- {f.get('content', '')}" for f in selected_facts)
        context_parts.append(
            f"## Selected Facts (verified events the user wants to keep)\n{facts_text}"
        )

    if selected_angles:
        angles_text = "\n".join(
            f"- **{a.get('title', '')}**: {a.get('description', '')}"
            for a in selected_angles
        )
        context_parts.append(
            f"## Selected Original Angles (perspectives the user wants to reference)\n{angles_text}"
        )

    if prompt.strip():
        context_parts.append(f"## User Instruction\n{prompt.strip()}")

    context_block = (
        "\n\n".join(context_parts)
        if context_parts
        else "No specific angle or selection provided. Rewrite the article in a neutral, balanced tone."
    )

    article_block = clean_text
    llm_prompt = system_prompt
    if "{{ORIGINAL_ARTICLE}}" in llm_prompt:
        llm_prompt = llm_prompt.replace("{{ORIGINAL_ARTICLE}}", article_block)
    else:
        llm_prompt = f"{llm_prompt.rstrip()}\n\n--- ORIGINAL ARTICLE ---\n{article_block}"

    if "{{CONTEXT_BLOCK}}" in llm_prompt:
        llm_prompt = llm_prompt.replace("{{CONTEXT_BLOCK}}", context_block)
    else:
        llm_prompt = f"{llm_prompt.rstrip()}\n\n--- CONTEXT ---\n{context_block}"

    logger.info("[reangle] model={} | source_len={}", model, len(clean_text))
    result = await generate_structured_output(
        model=model,
        prompt=llm_prompt,
        schema=_ReAngleOutput,
        temperature=0.7,
        timeout_seconds=60,
        max_retries=3,
        base_backoff=2,
    )

    logger.info(
        "[reangle] Generated | summary_len={} | content_len={}",
        len(result.summary),
        len(result.rewritten_content),
    )
    return ReAngleResponse(
        summary=result.summary,
        rewritten_content=result.rewritten_content,
    )
