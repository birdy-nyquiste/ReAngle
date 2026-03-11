"""
v2 ReAngle 相关的请求/响应模型。
"""

from pydantic import BaseModel, Field


class ReAngleRequest(BaseModel):
    """ReAngle 请求模型。"""

    prompt: str = Field(default="", description="用户定义的新叙事角度/提示词")
    selected_facts: list[dict] = Field(default_factory=list, description="用户在前端勾选的事件列表，带格式状态")
    selected_angles: list[dict] = Field(default_factory=list, description="用户在前端勾选的视角列表")


class ReAngleResponse(BaseModel):
    """ReAngle 响应模型。"""

    summary: str = Field(..., description="生成内容的摘要")
    rewritten_content: str = Field(..., description="基于新角度重新生成的文章")
