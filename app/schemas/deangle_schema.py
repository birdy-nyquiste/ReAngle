"""
v2 DeAngle 相关的请求/响应模型。
与前端 DeAngleView.tsx 的 Fact / Angle 接口对齐。
"""

from enum import Enum
from pydantic import BaseModel, Field


# ── 枚举 ──────────────────────────────────────────────
class FactStatus(str, Enum):
    """事实核查状态 (5-tier accuracy assessment)。"""

    SUPPORTED = "SUPPORTED"
    MOSTLY_SUPPORTED = "MOSTLY_SUPPORTED"
    PARTIALLY_SUPPORTED = "PARTIALLY_SUPPORTED"
    CONTRADICTED = "CONTRADICTED"
    UNVERIFIABLE = "UNVERIFIABLE"


# ── 前端展示模型（对齐 DeAngleView.tsx）────────────────
class Fact(BaseModel):
    """经过事实核查的事件。"""

    id: str = Field(..., description="唯一标识")
    content: str = Field(..., description="事件描述")
    status: FactStatus = Field(..., description="核查结果")


class Angle(BaseModel):
    """原始观点/叙事角度。"""

    id: str = Field(..., description="唯一标识")
    title: str = Field(..., description="观点标题")
    description: str = Field(..., description="观点描述")
    color: str = Field(default="blue", description="前端显示颜色标识")


# ── API 响应模型 ──────────────────────────────────────
class DeAngleResponse(BaseModel):
    """DeAngle 处理结果。"""

    facts: list[Fact] = Field(..., description="经过事实核查的事件列表")
    angles: list[Angle] = Field(..., description="原始观点列表")


# ── LLM 结构化输出模型 ────────────────────────────────
class RawEvent(BaseModel):
    """从文本中提取的候选事件（未核查）。"""

    content: str = Field(..., description="事件描述")


class DetachResult(BaseModel):
    """LLM Event-Angle 拆分的结构化输出。"""

    raw_events: list[RawEvent] = Field(..., description="提取的候选事件列表")
    original_angles: list[Angle] = Field(..., description="原始观点列表")


class FactCheckResult(BaseModel):
    """LLM 事实核查的结构化输出。"""

    content: str = Field(..., description="事件描述")
    status: FactStatus = Field(..., description="核查结果")
    reason: str = Field(default="", description="核查理由")
