"""
FastAPI 依赖项:
- get_current_user: 验证 Supabase JWT，返回用户信息
- check_usage_limit: 原子检查并递增用量
"""

from fastapi import Depends, HTTPException, Request, status
from loguru import logger
import jwt
from supabase import create_client, Client

from app.core.config import (
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY,
)


def _get_supabase_admin() -> Client:
    """返回使用 service_role key 的 Supabase 客户端（用于后端管理操作）"""
    return create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)


async def get_current_user(request: Request) -> dict:
    """
    从请求头中提取 Supabase access token 并验证。
    返回 JWT payload（包含 sub = user_id）。

    用法: 在需要鉴权的路由参数中添加 user=Depends(get_current_user)
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )

    token = auth_header.split(" ", 1)[1]

    try:
        # 使用 Supabase 的 JWT secret 验证 token
        # Supabase JWT secret = SUPABASE_KEY 对应的 jwt_secret
        # 更安全的方式是直接用 Supabase 的 auth.getUser() 验证
        supabase = _get_supabase_admin()
        user_response = supabase.auth.get_user(token)

        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        return {
            "id": str(user_response.user.id),
            "email": user_response.user.email,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[auth] Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed",
        )


async def check_usage_limit(user: dict = Depends(get_current_user)) -> dict:
    """
    原子检查并递增用量。
    调用数据库函数 increment_usage(row_id)。
    如果返回 false（超限），抛出 402。

    用法: 在消耗配额的路由参数中添加 user=Depends(check_usage_limit)
    """
    user_id = user["id"]
    supabase = _get_supabase_admin()

    try:
        result = supabase.rpc("increment_usage", {"row_id": user_id}).execute()

        if result.data is False:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Usage limit reached. Please upgrade your plan.",
            )

        return user

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[usage] Failed to check usage limit for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to check usage limit",
        )


def _get_avatar_usage_state(supabase: Client, user_id: str) -> tuple[int, int]:
    """
    获取 Avatar 用量状态：(usage_count, usage_limit)。
    当字段不存在或用户无记录时，默认返回 (0, 0)。
    """
    profile_result = (
        supabase.table("profiles")
        .select("avatar_usage_count, avatar_usage_limit")
        .eq("id", user_id)
        .maybe_single()
        .execute()
    )
    profile = profile_result.data or {}
    usage_count = int(profile.get("avatar_usage_count") or 0)
    usage_limit = int(profile.get("avatar_usage_limit") or 0)
    return usage_count, usage_limit


async def require_avatar_feature_access(user: dict = Depends(get_current_user)) -> dict:
    """
    仅检查 Avatar 功能是否可用（不扣减次数）。
    规则：avatar_usage_limit <= 0 视为不可用（例如未订阅）。
    """
    user_id = user["id"]
    supabase = _get_supabase_admin()

    try:
        _, usage_limit = _get_avatar_usage_state(supabase, user_id)
        if usage_limit <= 0:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Avatar is available for Pro users only.",
            )
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[avatar] Failed to check avatar access for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to check avatar access",
        )


async def check_avatar_usage_limit(user: dict = Depends(get_current_user)) -> dict:
    """
    原子检查并递增 Avatar 用量。
    调用数据库函数 increment_avatar_usage(row_id)。
    """
    user_id = user["id"]
    supabase = _get_supabase_admin()

    try:
        result = supabase.rpc("increment_avatar_usage", {"row_id": user_id}).execute()

        if result.data is False:
            usage_count, usage_limit = _get_avatar_usage_state(supabase, user_id)
            if usage_limit <= 0:
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="Avatar is available for Pro users only.",
                )
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Avatar usage limit reached ({usage_count}/{usage_limit}) for current billing cycle.",
            )

        return user

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[avatar] Failed to check avatar usage limit for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to check avatar usage limit",
        )
