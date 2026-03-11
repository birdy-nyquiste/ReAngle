"""
v2 DeAngle 路由。
POST /api/v2/deangle/ → 对 Inputs 结果执行 Event/Angle 拆分 + 事实核查。
"""

from fastapi import APIRouter, Depends
from loguru import logger

from app.schemas.deangle_schema import DeAngleResponse
from app.services.de import deangle_service
from app.core.session import get_session, SessionData, session_store
from app.core.supabase_dependencies import get_current_user
from app.core.exceptions import InvalidInputError

deangle_router = APIRouter(prefix="/deangle", tags=["DeAngle"])


@deangle_router.post("/", response_model=DeAngleResponse)
async def run_deangle(
    user: dict = Depends(get_current_user),
    session_tuple: tuple[str, SessionData] = Depends(get_session),
):
    """
    执行 DeAngle 处理：从 Session 读取 clean_text，拆分 Event/Angle 并核查事实。
    结果存入 Session 供后续 ReAngle 使用。
    """
    session_id, session = session_tuple

    # 校验前置条件
    if not session.clean_text:
        raise InvalidInputError(
            "No input data found. Please complete the Inputs step first.",
            details={"session_id": session_id},
        )

    # 调用 service
    result = await deangle_service.run_deangle(clean_text=session.clean_text)

    # 存入 session
    session_store.update(
        session_id,
        facts=[f.model_dump() for f in result.facts],
        angles=[a.model_dump() for a in result.angles],
    )

    logger.info(
        "[deangle] completed | session_id={} | facts={} | angles={}",
        session_id,
        len(result.facts),
        len(result.angles),
    )

    return result
