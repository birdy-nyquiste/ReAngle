"""
DeAngle 业务编排服务。
协调 Event/Angle 拆分 和 事实核查 两个步骤。
"""

import uuid
from loguru import logger

from app.schemas.deangle_schema import DeAngleResponse, Fact
from app.services.de.detach_client import detach_events_and_angles
from app.services.de.fact_check_client import check_facts


async def run_deangle(
    clean_text: str,
    model: str,
    detach_system_prompt: str,
    fact_check_system_prompt: str,
) -> DeAngleResponse:
    """
    执行 DeAngle 处理流程：
    1. 调用 detach_client 拆分 Event / Angle
    2. 调用 fact_check_client 对 Event 进行事实核查
    3. 组装返回 DeAngleResponse

    Args:
        clean_text: Inputs 阶段处理后的纯文本
        model: 当前用户选中的 DeAngle 模型
        detach_system_prompt: Event/Angle 拆分阶段的 system prompt
        fact_check_system_prompt: 事实核查阶段的 system prompt

    Returns:
        DeAngleResponse 包含 facts 和 angles
    """
    logger.info(
        "[deangle_service] Starting run_deangle | model={} | text_len={}",
        model,
        len(clean_text),
    )

    # Step 1: Detach Events and Angles
    detach_res = await detach_events_and_angles(
        text=clean_text,
        model=model,
        system_prompt=detach_system_prompt,
    )

    # Step 2: Fact Check the detached events
    fact_check_results = await check_facts(
        events=detach_res.raw_events,
        model=model,
        system_prompt=fact_check_system_prompt,
    )

    # Step 3: Build Final Response
    facts = []
    for fc_result in fact_check_results:
        # Create a unique ID for each fact
        fact_id = "fact-" + str(uuid.uuid4())[:8]
        
        facts.append(
            Fact(
                id=fact_id,
                content=f"{fc_result.content}\n\n[Analysis]: {fc_result.reason}"
                if fc_result.reason
                else fc_result.content,
                status=fc_result.status,
            )
        )

    logger.info(
        "[deangle_service] Compiled {} facts and {} angles",
        len(facts),
        len(detach_res.original_angles),
    )

    return DeAngleResponse(facts=facts, angles=detach_res.original_angles)
