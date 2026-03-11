"""
v2 路由聚合。
所有 v2 端点注册在 /api/v2 前缀下。
"""

from fastapi import APIRouter
from .inputs import inputs_router
from .deangle import deangle_router
from .reangle import reangle_router
from .media import media_router
from .payment import payment_router

v2_routers = APIRouter(prefix="/api/v2", tags=["v2"])

v2_routers.include_router(inputs_router)
v2_routers.include_router(deangle_router)
v2_routers.include_router(reangle_router)
v2_routers.include_router(media_router)
v2_routers.include_router(payment_router)
