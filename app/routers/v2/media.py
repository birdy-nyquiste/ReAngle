"""
v2 媒体输出路由。
POST /api/v2/media/tts → 文字转语音
POST /api/v2/media/voiceover → 口播稿生成（改写文 → 口播稿）
POST /api/v2/media/avatar → 数字人视频生成（口播稿 → 视频）
GET  /api/v2/media/avatar/download → 代理下载 HeyGen 视频（避免跨域导致浏览器只打开不下载）
"""

import httpx
from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response
from loguru import logger
from urllib.parse import urlparse

from app.schemas.media_schema import (
    TTSRequest,
    TTSResponse,
    VoiceoverRequest,
    VoiceoverResponse,
    AvatarRequest,
    AvatarResponse,
)
from app.services.media_outputs import tts_client, voiceover_client, avatar_client
from app.core.exceptions import LLMProviderError
from app.core.supabase_dependencies import (
    require_avatar_feature_access,
    check_tts_usage_limit,
    check_avatar_usage_limit,
)

media_router = APIRouter(prefix="/media", tags=["Media"])


@media_router.post("/tts", response_model=TTSResponse)
async def get_tts_result(
    request: TTSRequest,
    _user: dict = Depends(check_tts_usage_limit),
):
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


@media_router.post("/voiceover", response_model=VoiceoverResponse)
async def get_voiceover_script(
    request: VoiceoverRequest,
    _user: dict = Depends(require_avatar_feature_access),
):
    """口播稿接口：将改写后的文章转换为适合数字人朗读的口播稿。"""
    logger.info(f"[media] Voiceover request | text_len={len(request.text)}")

    try:
        script = await voiceover_client.get_voiceover_script(text=request.text)
        return VoiceoverResponse(script=script)
    except Exception as e:
        logger.error(f"[media] Voiceover failed: {e}")
        raise LLMProviderError(f"Voiceover generation failed: {str(e)}")


# HeyGen 视频下载允许的 host，避免 SSRF
HEYGEN_DOWNLOAD_ALLOWED_HOSTS = ("files2.heygen.ai", "api.heygen.com", "heygen.ai")


@media_router.get("/avatar/download")
async def download_avatar_video(url: str = Query(..., description="HeyGen 视频 URL")):
    """
    代理下载 HeyGen 视频。因跨域时浏览器会忽略 download 属性而直接打开/播放，
    通过后端拉取视频并返回 Content-Disposition: attachment 以触发真实下载。
    """
    try:
        parsed = urlparse(url)
        if not parsed.hostname or parsed.hostname.lower() not in HEYGEN_DOWNLOAD_ALLOWED_HOSTS:
            logger.warning(f"[media] Avatar download rejected, host not allowed: {parsed.hostname}")
            return Response(status_code=400, content="URL host not allowed for download")
    except Exception as e:
        logger.warning(f"[media] Avatar download invalid url: {e}")
        return Response(status_code=400, content="Invalid URL")

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=60.0)
        resp.raise_for_status()
        body = resp.content
        content_type = resp.headers.get("content-type", "video/mp4")
    except httpx.HTTPError as e:
        logger.error(f"[media] Avatar download fetch failed: {e}")
        return Response(status_code=502, content="Failed to fetch video")
    except Exception as e:
        logger.exception(f"[media] Avatar download error: {e}")
        return Response(status_code=500, content="Download failed")

    return Response(
        content=body,
        media_type=content_type,
        headers={
            "Content-Disposition": 'attachment; filename="avatar_broadcast.mp4"',
        },
    )


@media_router.post("/avatar", response_model=AvatarResponse)
async def get_avatar_result(
    request: AvatarRequest,
    _user: dict = Depends(check_avatar_usage_limit),
):
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
