"""
Event/Angle 拆分客户端。
调用大模型将输入文本拆分为客观事件（Event）和主观观点（Angle）。
"""

import uuid

from loguru import logger

from app.services.llm import generate_structured_output
from app.schemas.deangle_schema import DetachResult


def _build_prompt(system_prompt: str, text: str) -> str:
    payload = f"--- TEXT ---\n{text}"
    if "{{TEXT}}" in system_prompt:
        return system_prompt.replace("{{TEXT}}", text)
    return f"{system_prompt.rstrip()}\n\n{payload}"


async def detach_events_and_angles(
    text: str,
    model: str,
    system_prompt: str,
) -> DetachResult:
    """
    调用 LLM 执行 Event-Angle Detach 任务。
    """
    prompt = _build_prompt(system_prompt=system_prompt, text=text)
    logger.info("[detach_client] model={} | text_len={}", model, len(text))

    result = await generate_structured_output(
        model=model,
        prompt=prompt,
        schema=DetachResult,
        temperature=0.2,
        timeout_seconds=45,
        max_retries=3,
        base_backoff=2,
    )

    # Ensure angles have IDs even if model output misses them.
    for angle in result.original_angles:
        if not angle.id:
            angle.id = "angle-" + str(uuid.uuid4())[:8]

    logger.info(
        "[detach_client] Extracted {} events and {} angles.",
        len(result.raw_events),
        len(result.original_angles),
    )
    return result
