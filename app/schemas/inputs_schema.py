"""
v2 输入处理相关的请求/响应模型。
"""

from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class InputItem(BaseModel):
    """单个输入项模型。"""

    id: str = Field(..., description="前端生成的唯一标识")
    type: str = Field(..., description="输入类型: text / url / file / youtube")
    content: Optional[str] = Field(
        None, description="文本内容或 URL（file 类型时为空）"
    )
    contentKey: Optional[str] = Field(
        None, description="文件在 FormData 中的 key（仅 file 类型）"
    )
    meta: Optional[Dict[str, Any]] = Field(None, description="前端显示用元数据")


class InputsResponse(BaseModel):
    """输入处理响应模型。"""

    clean_text: str = Field(..., description="提取并合并后的纯文本")
