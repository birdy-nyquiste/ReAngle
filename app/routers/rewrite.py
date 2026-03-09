"""
处理洗稿请求的API路由
"""

from typing import Annotated, List, Dict, Any
from uuid import uuid4
import time
import json
from urllib.parse import urlparse
from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import StreamingResponse
from loguru import logger
import httpx

from app.schemas.rewrite_schema import (
    RewriteRequest,
    RewriteResponse,
    TTSRequest,
    TTSResponse,
    AvatarRequest,
    AvatarResponse,
    VideoAgentRequest,
    VideoAgentResponse,
    VoiceoverRequest,
    VoiceoverResponse,
)
from app.services.extractors import (
    extract_text_from_url,
    extract_text_from_docx,
    extract_text_from_pdf,
    extract_text_from_image,
)
from app.services.llms import (
    rewriting_client,
    tts_client,
    avatar_client,
    video_agent_client,
    voiceover_client,
)
from app.core.exceptions import (
    ContentExtractionError,
    LLMProviderError,
    InvalidInputError,
)
from app.core.dependencies import get_current_user, check_usage_limit

# 设置路由前缀和标签
rewrite_router = APIRouter(prefix="/rewrite", tags=["rewrite"])


@rewrite_router.post("", response_model=RewriteResponse)
async def rewrite_article(
    request: Request,
    rewrite_request: Annotated[RewriteRequest, Form()],
    user: dict = Depends(check_usage_limit),
):
    """
    洗稿接口, 支持添加到队列的多重输入
    """
    # 储存清洗、聚合后的原始文本
    clean_text = ""

    # 贯穿整个请求的 request_id 与耗时统计
    request_id = request.headers.get("X-Request-Id") or str(uuid4())
    t0 = time.perf_counter()

    # 支持添加到队列的多重输入（inputs）
    form = await request.form()
    inputs_raw = rewrite_request.inputs
    if not inputs_raw:
        raise InvalidInputError(
            "inputs is required; please add items to the queue before submitting.",
            details={"request_id": request_id},
        )
    try:
        t_parse_start = time.perf_counter()
        items: List[Dict[str, Any]] = json.loads(inputs_raw)
        t_parse_end = time.perf_counter()
    except Exception as e:
        logger.error(
            "[rewrite] invalid inputs json | request_id={} | reason={}",
            request_id,
            e,
        )
        raise ContentExtractionError(
            "Invalid inputs format",
            details={"request_id": request_id, "reason": str(e)},
        )
    # 入参概要日志
    type_counts = {"text": 0, "url": 0, "file": 0, "youtube": 0}
    est_chars = 0
    for it in items:
        t = (it.get("type") or "").lower()
        if t in type_counts:
            type_counts[t] += 1
        if t in ("text", "url", "youtube"):
            est_chars += len((it.get("content") or ""))
    logger.info(
        "[rewrite] inputs summary | request_id={} | total={} | text={} | url={} | file={} | youtube={} | est_chars={}",
        request_id,
        len(items),
        type_counts["text"],
        type_counts["url"],
        type_counts["file"],
        type_counts["youtube"],
        est_chars,
    )
    parts: List[str] = []
    t_extract_start = time.perf_counter()
    for it in items:
        t = (it.get("type") or "").lower()
        if t == "text":
            content = (it.get("content") or "").strip()
            if content:
                parts.append(f"[文本]\n{content}")
        elif t == "url":
            url = (it.get("content") or "").strip()
            if not url:
                continue
            try:
                extracted = await extract_text_from_url(url)
                parts.append(f"[链接]\n源: {url}\n{extracted.strip()}")
            except Exception as e:
                logger.warning(
                    "[rewrite] url extraction failed | request_id={} | url={} | reason={}",
                    request_id,
                    url,
                    e,
                )
                parts.append(f"[链接]\n{url}")
        elif t == "youtube":
            yt = (it.get("content") or "").strip()
            if yt:
                parts.append(f"[YouTube]\n{yt}")
        elif t == "file":
            content_key = it.get("contentKey")
            if not content_key:
                continue
            upload = form.get(content_key)
            if not upload:
                logger.warning(
                    "[rewrite] file not found in form | request_id={} | content_key={}",
                    request_id,
                    content_key,
                )
                continue
            filename = (getattr(upload, "filename", "") or "").lower()
            try:
                if filename.endswith(".docx"):
                    extracted = await extract_text_from_docx(upload)
                elif filename.endswith(".pdf"):
                    extracted = await extract_text_from_pdf(upload)
                elif filename.endswith((".png", ".jpg", ".jpeg", ".webp")):
                    extracted = await extract_text_from_image(upload)
                else:
                    raw = await upload.read()
                    try:
                        extracted = raw.decode("utf-8")
                    except UnicodeDecodeError:
                        extracted = raw.decode("gbk", errors="ignore")
                parts.append(f"[文件] {filename}\n{(extracted or '').strip()}")
            except Exception as e:
                logger.error(
                    "[rewrite] file extraction failed | request_id={} | filename={} | reason={}",
                    request_id,
                    filename,
                    e,
                )
                raise ContentExtractionError(
                    f"Failed to extract content from file: {str(e)}",
                    details={
                        "request_id": request_id,
                        "filename": filename,
                        "reason": str(e),
                    },
                )
        else:
            logger.warning(f"Unknown input type: {t}")
    t_extract_end = time.perf_counter()
    t_merge_start = time.perf_counter()
    clean_text = "\n\n---\n\n".join([p for p in parts if p.strip()])
    t_merge_end = time.perf_counter()
    if not clean_text or not clean_text.strip():
        raise ContentExtractionError(
            "Extracted text is empty or invalid", details={"request_id": request_id}
        )

    # 调用rewriting_client
    try:
        prompt_len = len(rewrite_request.prompt or "")
        source_len = len(clean_text or "")
        logger.info(
            "[rewrite] llm call start | request_id={} | provider={} | prompt_len={} | source_len={}",
            request_id,
            rewrite_request.llm_type,
            prompt_len,
            source_len,
        )
        t_llm_start = time.perf_counter()
        result = await rewriting_client.get_rewriting_result(
            llm_type=rewrite_request.llm_type,
            instruction=rewrite_request.prompt,
            source=clean_text,
        )
        t_llm_end = time.perf_counter()
        logger.info(
            "[rewrite] done | request_id={} | parse_ms={:.1f} | extract_ms={:.1f} | merge_ms={:.1f} | llm_ms={:.1f} | total_ms={:.1f}",
            request_id,
            (t_parse_end - t_parse_start) * 1000,
            (t_extract_end - t_extract_start) * 1000,
            (t_merge_end - t_merge_start) * 1000,
            (t_llm_end - t_llm_start) * 1000,
            (time.perf_counter() - t0) * 1000,
        )
    except Exception as e:
        logger.exception("[rewrite] llm rewriting failed | request_id={}", request_id)
        raise LLMProviderError(
            f"Failed to generate rewrite: {str(e)}",
            details={
                "request_id": request_id,
                "provider": str(rewrite_request.llm_type),
                "prompt_len": len(rewrite_request.prompt or ""),
                "source_len": len(clean_text or ""),
            },
        )

    # 返回响应
    return RewriteResponse(
        # 原始文本
        original=clean_text,
        # 摘要
        summary=result.summary,
        # 洗稿后的文本
        rewritten=result.rewritten,
    )


@rewrite_router.post("/tts", response_model=TTSResponse)
async def get_tts_result(request: TTSRequest):
    """
    TTS接口
    """
    logger.info(f"Received TTS request for text length: {len(request.text)}")

    try:
        audio_url = await tts_client.get_tts_result(
            text=request.text,
            voice=request.voice,
            model=request.model,
        )
        return TTSResponse(audio_url=audio_url)
    except Exception as e:
        logger.error(f"TTS request failed: {e}")
        raise LLMProviderError(f"TTS generation failed: {str(e)}")


@rewrite_router.post("/avatar", response_model=AvatarResponse)
async def get_avatar_result(request: AvatarRequest):
    """
    数字人接口
    """
    logger.info(f"Received avatar request for text length: {len(request.text)}")

    try:
        video_url = await avatar_client.get_avatar_result(
            text=request.text,
        )
        return AvatarResponse(video_url=video_url)
    except Exception as e:
        logger.error(f"Avatar request failed: {e}")
        raise LLMProviderError(f"Avatar generation failed: {str(e)}")


@rewrite_router.post("/video-agent", response_model=VideoAgentResponse)
async def get_video_agent_result(request: VideoAgentRequest):
    """
    使用 HeyGen Video Agent 生成数字人播报视频。
    """
    text = (request.text or "").strip()
    logger.info(f"Received Video Agent request for text length: {len(text)}")

    # 基本长度与内容校验，避免传入空文本或过长文本
    if not text:
        raise InvalidInputError("Text is empty, cannot generate avatar video.")

    max_len = 4000
    if len(text) > max_len:
        raise InvalidInputError(
            f"Text is too long for avatar video. Max supported length is {max_len} characters."
        )

    try:
        video_url = await video_agent_client.get_video_agent_result(text=text)
        return VideoAgentResponse(video_url=video_url)
    except Exception as e:
        logger.error(f"Video Agent request failed: {e}")
        raise LLMProviderError(f"Video Agent generation failed: {str(e)}")


@rewrite_router.post("/voiceover", response_model=VoiceoverResponse)
async def get_voiceover_script(request: VoiceoverRequest):
    """
    使用 OpenAI 将改写后的文章转换为口播稿。
    """
    text = (request.text or "").strip()
    logger.info(f"Received voiceover request for text length: {len(text)}")

    if not text:
        raise InvalidInputError("Text is empty, cannot generate voiceover script.")

    # 这里不做太严的长度限制，交给系统 prompt 控制与模型自身截断

    try:
        script = await voiceover_client.get_voiceover_script(text=text)
        if not script:
            raise LLMProviderError("Voiceover script is empty.")
        return VoiceoverResponse(voiceover=script)
    except Exception as e:
        logger.error(f"Voiceover request failed: {e}")
        raise LLMProviderError(f"Voiceover generation failed: {str(e)}")


@rewrite_router.get("/video-download")
async def download_video(url: str):
    """
    代理下载视频（解决跨域/Content-Disposition 导致的“打开播放但不下载”问题）。
    仅允许下载 HeyGen 返回的视频链接，防止 SSRF。
    """
    if not url or not url.strip():
        raise InvalidInputError("Missing url")

    u = url.strip()
    parsed = urlparse(u)
    if parsed.scheme != "https":
        raise InvalidInputError("Only https url is allowed")

    # 只允许 HeyGen 常见的文件域名，避免任意 URL 被服务端请求
    allowed_hosts = {
        "files2.heygen.ai",
        "resource2.heygen.ai",
        "files.heygen.ai",
        "resource.heygen.ai",
    }
    if (parsed.hostname or "").lower() not in allowed_hosts:
        raise InvalidInputError("Unsupported download host")

    filename = "reangle-avatar.mp4"
    max_size = 300 * 1024 * 1024  # 300MB，防止过大导致内存问题
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=120.0) as client:
            r = await client.get(u)
            if r.status_code != 200:
                raise LLMProviderError(
                    f"Download failed: HTTP {r.status_code}"
                )
            content = r.content
            if len(content) > max_size:
                raise LLMProviderError("Video file too large to proxy.")
            content_type = r.headers.get("content-type") or "video/mp4"
            headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
            return StreamingResponse(
                iter([content]), media_type=content_type, headers=headers
            )
    except httpx.TimeoutException:
        raise LLMProviderError("Video download timed out (source slow or unreachable).")
    except httpx.RequestError as e:
        logger.warning(f"Video download request error: {e}")
        raise LLMProviderError(f"Download network error: {str(e)}")
