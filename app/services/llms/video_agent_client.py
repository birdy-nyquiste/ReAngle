import os
import asyncio
import httpx
from loguru import logger

from app.core.exceptions import LLMProviderError


class VideoAgentClient:
    """
    封装 HeyGen Video Agent 调用流程：
    - /v1/video_agent/generate 提交生成任务，返回 video_id
    - /v1/video_status.get 轮询任务状态，直到拿到 video_url
    """

    def __init__(self) -> None:
        self.base_url = "https://api.heygen.com"
        # 每次请求前从环境变量读取，避免因导入顺序导致 .env 未加载时读不到
        self._avatar_id = os.getenv("HEYGEN_VIDEO_AGENT_AVATAR_ID", "").strip()
        self._orientation = os.getenv("HEYGEN_VIDEO_AGENT_ORIENTATION", "landscape")

    def _get_headers(self) -> dict:
        api_key = os.getenv("HEYGEN_API_KEY", "").strip()
        return {
            "X-Api-Key": api_key,
            "Content-Type": "application/json",
        }

    async def get_video_agent_result(self, text: str) -> str:
        """
        使用 Video Agent 根据文本生成播报视频，并返回 video_url。
        """
        api_key = os.getenv("HEYGEN_API_KEY", "").strip()
        if not api_key:
            raise LLMProviderError("Missing HEYGEN_API_KEY environment variable")

        if not text or not text.strip():
            raise LLMProviderError("Empty text provided for video agent generation")

        video_id = await self._generate_video(text)
        return await self._poll_video_status(video_id)

    async def _generate_video(self, text: str) -> str:
        url = f"{self.base_url}/v1/video_agent/generate"

        # 构造一个尽量让 Video Agent「逐字朗读稿件」的提示词
        prompt = (
            "请生成一个新闻播报风格的视频，画面为专业新闻主播正对镜头讲述。"
            "你必须严格按照下面提供的中文稿件逐字朗读，不要改写、不要总结、不要添加或省略任何内容。"
            "请使用自然流畅的普通话播报。\n\n"
            "【播报稿件开始】\n"
            f"{text.strip()}\n"
            "【播报稿件结束】"
        )

        config: dict = {}
        if self._avatar_id:
            config["avatar_id"] = self._avatar_id
        if self._orientation in ("portrait", "landscape"):
            config["orientation"] = self._orientation

        payload = {"prompt": prompt}
        if config:
            payload["config"] = config

        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    url, headers=self._get_headers(), json=payload, timeout=60.0
                )

            if resp.status_code != 200:
                logger.error(f"HeyGen Video Agent generate failed: {resp.text}")
                try:
                    err_body = resp.json()
                    msg = err_body.get("message") or err_body.get("error") or resp.text
                except Exception:
                    msg = resp.text or f"HTTP {resp.status_code}"
                raise LLMProviderError(f"HeyGen Video Agent: {msg}")

            data = resp.json()
            # 部分 API 用 code 表示成功(100) / 失败
            if data.get("code") is not None and data.get("code") != 100:
                err_msg = data.get("message") or data.get("error") or str(data)
                logger.error(f"HeyGen Video Agent API code error: {data}")
                raise LLMProviderError(f"HeyGen Video Agent: {err_msg}")

            error_msg = data.get("error")
            if error_msg:
                logger.error(f"HeyGen Video Agent error field: {error_msg}")
                raise LLMProviderError(f"HeyGen Video Agent error: {error_msg}")

            video_id = data.get("data", {}).get("video_id")
            if not video_id:
                logger.error(f"HeyGen Video Agent invalid response: {data}")
                raise LLMProviderError("Invalid response from HeyGen Video Agent API")

            logger.info(f"HeyGen Video Agent started. Video ID: {video_id}")
            return video_id

        except httpx.RequestError as e:
            logger.error(f"HeyGen Video Agent network error: {e}")
            raise LLMProviderError(f"Network error interacting with HeyGen: {str(e)}")

    async def _poll_video_status(self, video_id: str) -> str:
        url = f"{self.base_url}/v1/video_status.get"
        params = {"video_id": video_id}

        # 总等待约 40 分钟；每 20 秒问一次，用户最多多等 20 秒即可看到结果
        poll_interval = 20
        max_retries = 240  # 240 * 20s = 4800s = 80min
        last_status = None
        for i in range(max_retries):
            try:
                async with httpx.AsyncClient() as client:
                    resp = await client.get(
                        url, headers=self._get_headers(), params=params, timeout=15.0
                    )

                if resp.status_code != 200:
                    logger.warning(
                        f"HeyGen Video Agent status check failed: {resp.text}"
                    )
                    await asyncio.sleep(poll_interval)
                    continue

                data = resp.json()
                status = data.get("data", {}).get("status")
                last_status = status

                if status == "completed":
                    video_url = data.get("data", {}).get("video_url")
                    if not video_url:
                        logger.error(f"HeyGen Video Agent completed but no url: {data}")
                        raise LLMProviderError(
                            "Video Agent completed but video_url is missing"
                        )
                    logger.info(f"HeyGen Video Agent video completed: {video_url}")
                    return video_url
                if status == "failed":
                    error = data.get("data", {}).get("error")
                    logger.error(f"HeyGen Video Agent processing failed: {error}")
                    raise LLMProviderError(f"Video Agent processing failed: {error}")

                if i % 6 == 0 and i > 0:
                    logger.info(f"HeyGen Video Agent still generating, status={status}, poll #{i}")
                await asyncio.sleep(poll_interval)

            except httpx.RequestError as e:
                logger.warning(f"HeyGen Video Agent polling network error: {e}")

        logger.warning(f"HeyGen Video Agent timed out after {max_retries} polls, last status={last_status}")
        raise LLMProviderError(
            "Video Agent generation timed out. HeyGen may still be processing; try again later or use a shorter script."
        )


_client = VideoAgentClient()


async def get_video_agent_result(text: str) -> str:
    return await _client.get_video_agent_result(text)

