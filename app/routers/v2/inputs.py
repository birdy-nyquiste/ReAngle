"""
v2 输入处理路由。
POST /api/v2/inputs/ → 接收多源输入并提取合并文本。
"""

import json
from typing import Annotated

from fastapi import APIRouter, Depends, Form, Request, UploadFile, File
from loguru import logger

from pydantic import Json, TypeAdapter

from app.schemas.inputs_schema import InputItem, InputsResponse
from app.services.inputs import inputs_service
from app.core.session import get_session, SessionData, session_store
from app.core.supabase_dependencies import check_usage_limit
from app.core.exceptions import InvalidInputError

inputs_router = APIRouter(prefix="/inputs", tags=["Inputs"])

_inputs_adapter = TypeAdapter(list[InputItem])

@inputs_router.post("/", response_model=InputsResponse)
async def process_inputs(
    request: Request,
    inputs: str = Form(..., description="JSON string of list[InputItem]"),
    files: list[UploadFile] = File(default=[]),
    user: dict = Depends(check_usage_limit),
    session_tuple: tuple[str, SessionData] = Depends(get_session),
):
    """
    处理多源输入队列，提取并合并文本。
    结果存入 Session 供后续 DeAngle / ReAngle 使用。
    """
    session_id, session = session_tuple

    try:
        parsed_inputs = _inputs_adapter.validate_json(inputs)
    except Exception as e:
        raise InvalidInputError(f"Invalid inputs format: {str(e)}")

    if not parsed_inputs:
        raise InvalidInputError("inputs is required; please add items to the queue.")

    if len(parsed_inputs) > 3:
        raise InvalidInputError("Maximum 3 inputs are allowed.", details={"count": len(parsed_inputs)})

    # 调用 service 处理输入，直接传递 files 列表
    clean_text = await inputs_service.process_inputs(items=parsed_inputs, files=files)

    # 存入 session
    session_store.update(session_id, clean_text=clean_text)

    logger.info(
        "[inputs] processed | session_id={} | items={} | clean_text_len={}",
        session_id,
        len(parsed_inputs),
        len(clean_text),
    )

    return InputsResponse(clean_text=clean_text)
