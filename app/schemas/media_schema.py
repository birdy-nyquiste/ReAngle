"""
v2 媒体输出（TTS / 数字人）相关的请求/响应模型。
从 rewrite_schema.py 迁移而来。
"""

from pydantic import BaseModel, Field


class TTSRequest(BaseModel):
    """TTS 请求模型。"""

    text: str = Field(..., description="需要朗读的文本内容")
    model: str = Field(default="qwen3-tts-flash", description="TTS 模型")
    voice: str = Field(default="Cherry", description="语音音色")


class TTSResponse(BaseModel):
    """TTS 响应模型。"""

    audio_url: str = Field(..., description="音频文件的 URL")


class VoiceoverRequest(BaseModel):
    """口播稿请求模型。"""

    text: str = Field(..., description="改写后的文章全文（ReAngled content）")


class VoiceoverResponse(BaseModel):
    """口播稿响应模型。"""

    script: str = Field(..., description="口播稿正文")


class AvatarRequest(BaseModel):
    """数字人请求模型。"""

    text: str = Field(..., description="数字人播报文本（口播稿）")


class AvatarResponse(BaseModel):
    """数字人响应模型。"""

    video_url: str = Field(..., description="数字人视频 URL")
