"""
Session 管理：跨端点状态共享。
前端进入 MainApp 时生成 session_id，后续所有 v2 API 调用通过 X-Session-Id 头携带。
当前使用内存字典存储，后续可替换为 Redis。
"""

from datetime import datetime, timezone
from typing import Optional

from fastapi import Request, Depends
from loguru import logger
from pydantic import BaseModel, Field

from app.core.exceptions import SessionNotFoundError
from app.core.supabase_dependencies import get_current_user


# ── 常量 ──────────────────────────────────────────────
SESSION_TTL_SECONDS = 2 * 60 * 60  # 2 小时


# ── Session 数据模型 ──────────────────────────────────
class SessionData(BaseModel):
    """存储单次工作流的中间状态。"""

    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_active: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Phase 1: Inputs
    clean_text: Optional[str] = None

    # Phase 2: DeAngle
    facts: Optional[list] = None
    angles: Optional[list] = None

    # Phase 3: ReAngle
    summary: Optional[str] = None
    rewritten: Optional[str] = None


# ── Session 存储 ──────────────────────────────────────
class SessionStore:
    """内存字典实现的 Session 存储。"""

    def __init__(self):
        self._store: dict[str, SessionData] = {}

    def create(self, session_id: str, user_id: str) -> SessionData:
        """
        创建新 session。
        不再自动清理该用户所有的活动 session，以免多标签页互相干扰。
        过期清理和总数控制交由其他定时任务或 LRU 策略处理。
        """
        # 可以选择依然清理过期数据，而不是只针对单个 user
        self.cleanup_expired()
        
        session = SessionData(user_id=user_id)
        self._store[session_id] = session
        logger.info(
            "[session] created | session_id={} | user_id={}",
            session_id,
            user_id,
        )
        return session

    def get(self, session_id: str) -> Optional[SessionData]:
        """获取 session，更新 last_active 时间戳。"""
        session = self._store.get(session_id)
        if session:
            session.last_active = datetime.now(timezone.utc)
        return session

    def update(self, session_id: str, **kwargs) -> SessionData:
        """
        更新 session 中的字段。
        Raises SessionNotFoundError if session doesn't exist.
        """
        session = self._store.get(session_id)
        if not session:
            raise SessionNotFoundError(f"Session {session_id} not found")
        for key, value in kwargs.items():
            if hasattr(session, key):
                setattr(session, key, value)
        session.last_active = datetime.now(timezone.utc)
        return session

    def cleanup_user(self, user_id: str) -> int:
        """清理指定用户的已过期session（按需使用，通常全量清理expired即可）。"""
        now = datetime.now(timezone.utc)
        to_remove = [
            sid for sid, s in self._store.items() 
            if s.user_id == user_id and (now - s.last_active).total_seconds() > SESSION_TTL_SECONDS
        ]
        for sid in to_remove:
            del self._store[sid]
        if to_remove:
            logger.info(
                "[session] cleaned up {} expired sessions for user_id={}",
                len(to_remove),
                user_id,
            )
        return len(to_remove)

    def cleanup_expired(self) -> int:
        """清理所有超过 TTL 的 session，返回清理数量。"""
        now = datetime.now(timezone.utc)
        to_remove = [
            sid
            for sid, s in self._store.items()
            if (now - s.last_active).total_seconds() > SESSION_TTL_SECONDS
        ]
        for sid in to_remove:
            del self._store[sid]
        if to_remove:
            logger.info(
                "[session] expired cleanup: removed {} sessions", len(to_remove)
            )
        return len(to_remove)


# ── 全局单例 ──────────────────────────────────────────
session_store = SessionStore()


# ── FastAPI 依赖项 ────────────────────────────────────
async def get_session(
    request: Request,
    user: dict = Depends(get_current_user),
) -> tuple[str, SessionData]:
    """
    从请求头 X-Session-Id 获取或创建 Session。
    返回 (session_id, session_data) 元组。
    """
    session_id = request.headers.get("X-Session-Id")
    if not session_id:
        raise SessionNotFoundError(
            "Missing X-Session-Id header",
            details={"hint": "Frontend should generate a session_id on MainApp mount"},
        )

    session = session_store.get(session_id)
    if not session:
        # 首次调用该 session_id，自动创建
        session = session_store.create(session_id, user["id"])

    # 校验 session 归属
    if session.user_id != user["id"]:
        raise SessionNotFoundError(
            "Session does not belong to current user",
            details={"session_id": session_id},
        )

    return session_id, session
