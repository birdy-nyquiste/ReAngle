import os
import asyncio
import httpx
from loguru import logger
from app.core.exceptions import LLMProviderError


class AvatarClient:
    def __init__(self):
        self.api_key = os.getenv("HEYGEN_API_KEY")
        self.base_url = "https://api.heygen.com"
        # 这些配置通过环境变量可调，方便你在 HeyGen 中更换主播/声音/分辨率/风格
        self.avatar_id = os.getenv(
            "HEYGEN_AVATAR_ID", "Fernando_sitting_businessindoor_front"
        )
        self.avatar_style = os.getenv("HEYGEN_AVATAR_STYLE", "normal")
        self.talking_style = os.getenv("HEYGEN_TALKING_STYLE", "stable")
        self.voice_id = os.getenv(
            "HEYGEN_VOICE_ID", "bad86f2c05d843c3901e110fbddbe86a"
        )
        # 使用字符串以完全对齐 HeyGen 文档示例（"1" / "0" 等），避免未来类型校验问题
        self.voice_speed = os.getenv("HEYGEN_VOICE_SPEED", "1")
        self.voice_pitch = os.getenv("HEYGEN_VOICE_PITCH", "0")
        self.voice_duration = os.getenv("HEYGEN_VOICE_DURATION", "1")
        self.video_width = int(os.getenv("HEYGEN_VIDEO_WIDTH", "640"))
        self.video_height = int(os.getenv("HEYGEN_VIDEO_HEIGHT", "360"))
        self.background_color = os.getenv("HEYGEN_BACKGROUND_COLOR", "#FFFFFF")
        self.background_play_style = os.getenv("HEYGEN_BACKGROUND_PLAY_STYLE", "freeze")
        self.background_fit = os.getenv("HEYGEN_BACKGROUND_FIT", "cover")
        # caption 默认关闭，可通过环境变量开启
        self.caption = os.getenv("HEYGEN_CAPTION", "false").lower() == "true"
        self.headers = {
            # 与官方文档保持一致的小写形式
            "x-api-key": self.api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    async def get_avatar_result(self, text: str) -> str:
        """
        Generates an avatar video from text using HeyGen API V2.

        Args:
            text: The text for the avatar to speak.

        Returns:
            str: The URL of the generated video.

        Raises:
            LLMProviderError: If the generation fails or times out.
        """
        text = (text or "").strip()
        if not self.api_key:
            raise LLMProviderError("Missing HEYGEN_API_KEY environment variable")
        if not text:
            raise LLMProviderError("Empty text provided for avatar generation")

        video_id = await self._generate_video(text)
        return await self._poll_video_status(video_id)

    async def _generate_video(self, text: str) -> str:
        url = f"{self.base_url}/v2/video/generate"
        payload = {
            "caption": "true" if self.caption else "false",
            "dimension": {
                "width": self.video_width,
                "height": self.video_height,
            },
            "video_inputs": [
                {
                    "character": {
                        "type": "avatar",
                        "avatar_id": self.avatar_id,
                        "scale": 1.0,
                        "avatar_style": self.avatar_style,
                        "talking_style": self.talking_style,
                    },
                    "voice": {
                        "type": "text",
                        "input_text": text,
                        "voice_id": self.voice_id,
                        "speed": self.voice_speed,
                        "pitch": self.voice_pitch,
                        "duration": self.voice_duration,
                    },
                    "background": {
                        "type": "color",
                        "value": self.background_color,
                        "play_style": self.background_play_style,
                        "fit": self.background_fit,
                    },
                    # 保留一个空文本层，占位即可，便于后续如需叠加字幕/标题时扩展
                    "text": {
                        "type": "text",
                        "line_height": 1,
                        "text": " ",
                    },
                }
            ],
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url, headers=self.headers, json=payload, timeout=30.0
                )

            if response.status_code != 200:
                logger.error(f"HeyGen generation failed: {response.text}")
                raise LLMProviderError(f"HeyGen API generation error: {response.text}")

            data = response.json()
            if "data" not in data or "video_id" not in data["data"]:
                logger.error(f"HeyGen invalid response: {data}")
                raise LLMProviderError("Invalid response from HeyGen API")

            video_id = data["data"]["video_id"]
            logger.info(f"HeyGen video generation started. Video ID: {video_id}")
            return video_id

        except httpx.RequestError as e:
            logger.error(f"HeyGen network error: {e}")
            raise LLMProviderError(f"Network error interacting with HeyGen: {str(e)}")

    async def _poll_video_status(self, video_id: str) -> str:
        url = f"{self.base_url}/v1/video_status.get"
        params = {"video_id": video_id}

        # 借鉴 VideoAgentClient 的策略：更长的轮询时间，避免长视频频繁超时
        poll_interval = 20  # 每 20 秒查询一次
        max_retries = 60  # 60 * 20s = 1200s = 20min
        last_status = None
        for i in range(max_retries):
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        url, headers=self.headers, params=params, timeout=10.0
                    )

                if response.status_code != 200:
                    logger.warning(
                        f"HeyGen status check failed: status={response.status_code}, body={response.text}"
                    )
                    await asyncio.sleep(poll_interval)
                    continue

                data = response.json()
                status = data.get("data", {}).get("status")
                last_status = status

                if status == "completed":
                    video_url = data["data"].get("video_url")
                    if not video_url:
                        logger.error(
                            f"HeyGen video completed but video_url is missing: {data}"
                        )
                        raise LLMProviderError(
                            "Avatar video completed but video_url is missing"
                        )
                    logger.info(f"HeyGen video completed: {video_url}")
                    return video_url
                if status == "failed":
                    error = data.get("data", {}).get("error")
                    logger.error(f"HeyGen video processing failed: {error}")
                    raise LLMProviderError(f"Video processing failed: {error}")

                if i % 6 == 0 and i > 0:
                    logger.info(
                        f"HeyGen avatar video still generating, status={status}, poll #{i}"
                    )
                await asyncio.sleep(poll_interval)

            except httpx.RequestError as e:
                logger.warning(f"HeyGen polling network error: {e}")

        logger.warning(
            f"HeyGen avatar video generation timed out after {max_retries} polls, last_status={last_status}"
        )
        raise LLMProviderError(
            "Avatar video generation timed out. HeyGen may still be processing; try again later or use a shorter script."
        )


# Create a singleton instance
_client = AvatarClient()


async def get_avatar_result(text: str) -> str:
    """
    Module-level entry point for avatar generation, matching the pattern of tts_client.
    """
    return await _client.get_avatar_result(text)
