"""
v2 Settings 相关请求/响应模型。
"""

from pydantic import BaseModel, Field


class ModelOption(BaseModel):
    """模型选项。"""

    id: str = Field(..., description="模型ID")
    label: str = Field(..., description="展示名称")


class AvailableModels(BaseModel):
    """可选模型目录。"""

    deangle: list[ModelOption] = Field(default_factory=list)
    reangle: list[ModelOption] = Field(default_factory=list)


class SettingsResponse(BaseModel):
    """设置读取响应。"""

    deangle_model: str = Field(..., description="DeAngle 选中模型")
    reangle_model: str = Field(..., description="ReAngle 选中模型")

    deangle_detach_system_prompt: str = Field(..., description="DeAngle 拆分阶段 prompt")
    deangle_fact_check_system_prompt: str = Field(
        ..., description="DeAngle 事实核查阶段 prompt"
    )
    reangle_system_prompt: str = Field(..., description="ReAngle prompt")

    deangle_detach_uses_default: bool = Field(
        ..., description="DeAngle 拆分 prompt 是否使用默认值"
    )
    deangle_fact_check_uses_default: bool = Field(
        ..., description="DeAngle 事实核查 prompt 是否使用默认值"
    )
    reangle_uses_default: bool = Field(
        ..., description="ReAngle prompt 是否使用默认值"
    )

    available_models: AvailableModels = Field(..., description="当前可选模型目录")


class SettingsUpdateRequest(BaseModel):
    """设置更新请求（部分更新）。"""

    deangle_model: str | None = Field(default=None, description="DeAngle 模型")
    reangle_model: str | None = Field(default=None, description="ReAngle 模型")

    deangle_detach_system_prompt: str | None = Field(
        default=None, description="DeAngle 拆分阶段 prompt，传 null 表示恢复默认"
    )
    deangle_fact_check_system_prompt: str | None = Field(
        default=None, description="DeAngle 事实核查 prompt，传 null 表示恢复默认"
    )
    reangle_system_prompt: str | None = Field(
        default=None, description="ReAngle prompt，传 null 表示恢复默认"
    )
