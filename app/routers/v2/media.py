"""
v2 媒体输出路由。
POST /api/v2/media/tts → 文字转语音
POST /api/v2/media/avatar → 数字人视频生成
"""

from fastapi import APIRouter
from loguru import logger

from app.schemas.media_schema import (
    TTSRequest,
    TTSResponse,
    AvatarRequest,
    AvatarResponse,
)
from app.services.media_outputs import tts_client, avatar_client
from app.core.exceptions import LLMProviderError

media_router = APIRouter(prefix="/media", tags=["Media"])


@media_router.post("/tts", response_model=TTSResponse)
async def get_tts_result(request: TTSRequest):
    """TTS 接口：将文本转换为语音。"""
    logger.info(f"[media] TTS request | text_len={len(request.text)}")

    try:
        audio_url = await tts_client.get_tts_result(
            text=request.text,
            voice=request.voice,
            model=request.model,
        )
        return TTSResponse(audio_url=audio_url)
    except Exception as e:
        logger.error(f"[media] TTS failed: {e}")
        raise LLMProviderError(f"TTS generation failed: {str(e)}")


@media_router.post("/avatar", response_model=AvatarResponse)
async def get_avatar_result(request: AvatarRequest):
    """数字人接口：生成数字人视频。"""
    logger.info(f"[media] Avatar request | text_len={len(request.text)}")

    try:
        video_url = await avatar_client.get_avatar_result(
            text=request.text,
        )
        return AvatarResponse(video_url=video_url)
    except Exception as e:
        logger.error(f"[media] Avatar failed: {e}")
        raise LLMProviderError(f"Avatar generation failed: {str(e)}")
