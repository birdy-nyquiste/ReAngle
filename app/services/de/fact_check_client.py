"""
事实核查客户端。
调用大模型对提取的事件列表进行真实性验证。
"""

from loguru import logger
from pydantic import BaseModel, Field

from app.services.llm import generate_structured_output
from app.schemas.deangle_schema import FactCheckResult, RawEvent


class FactCheckBatchResult(BaseModel):
    results: list[FactCheckResult] = Field(
        ...,
        description="List of fact check outcomes corresponding to the input events.",
    )


async def check_facts(
    events: list[RawEvent],
    model: str,
    system_prompt: str,
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

    events_lines = "\n".join(
        f"[{idx + 1}] {event.content}" for idx, event in enumerate(events)
    )
    payload = f"--- EVENTS TO CHECK ---\n{events_lines}"
    if "{{EVENTS}}" in system_prompt:
        prompt = system_prompt.replace("{{EVENTS}}", events_lines)
    else:
        prompt = f"{system_prompt.rstrip()}\n\n{payload}"

    logger.info("[fact_check_client] model={} | events={}", model, len(events))
    batch_result = await generate_structured_output(
        model=model,
        prompt=prompt,
        schema=FactCheckBatchResult,
        temperature=0.1,
        timeout_seconds=45,
        max_retries=3,
        base_backoff=2,
    )

    logger.info(
        "[fact_check_client] Successfully fact-checked {} events.",
        len(batch_result.results),
    )
    return batch_result.results
