"""
v2 Settings 路由。
"""

from fastapi import APIRouter, Depends

from app.core.supabase_dependencies import get_current_user
from app.schemas.settings_schema import SettingsResponse, SettingsUpdateRequest
from app.services.settings import get_settings, update_settings

settings_router = APIRouter(prefix="/settings", tags=["Settings"])


@settings_router.get("/", response_model=SettingsResponse)
async def get_user_settings(user: dict = Depends(get_current_user)):
    return get_settings(user["id"])


@settings_router.patch("/", response_model=SettingsResponse)
async def patch_user_settings(
    request: SettingsUpdateRequest,
    user: dict = Depends(get_current_user),
):
    return update_settings(user["id"], request)
