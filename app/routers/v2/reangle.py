"""
v2 ReAngle 路由。
POST /api/v2/reangle/ → 基于 DeAngle 结果和用户 Prompt 生成新叙事。
"""

from fastapi import APIRouter, Depends
from loguru import logger

from app.schemas.reangle_schema import ReAngleRequest, ReAngleResponse
from app.services.re import reangle_service
from app.core.session import get_session, SessionData
from app.core.supabase_dependencies import get_current_user
from app.core.exceptions import InvalidInputError

reangle_router = APIRouter(prefix="/reangle", tags=["ReAngle"])


@reangle_router.post("/", response_model=ReAngleResponse)
async def run_reangle(
    request: ReAngleRequest,
    user: dict = Depends(get_current_user),
    session_tuple: tuple[str, SessionData] = Depends(get_session),
):
    """
    执行 ReAngle 内容生成：结合原文、用户选择的 facts/angles、和用户 prompt 生成新文章。
    """
    session_id, session = session_tuple

    # 校验前置条件
    if not session.clean_text:
        raise InvalidInputError(
            "No input text found. Please complete the Inputs step first.",
            details={"session_id": session_id},
        )

    if not session.facts or not session.angles:
        raise InvalidInputError(
            "No DeAngle results found. Please complete the DeAngle step first.",
            details={"session_id": session_id},
        )

    # 调用 service — 传入原文 + 用户选中的内容 + 用户指令
    result = await reangle_service.run_reangle(
        clean_text=session.clean_text,
        selected_facts=request.selected_facts,
        selected_angles=request.selected_angles,
        prompt=request.prompt,
    )

    logger.info(
        "[reangle] completed | session_id={} | summary_len={} | content_len={}",
        session_id,
        len(result.summary),
        len(result.rewritten_content),
    )

    return result
