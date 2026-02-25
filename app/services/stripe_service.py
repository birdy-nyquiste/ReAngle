from __future__ import annotations

"""
Stripe 服务层:
- 创建 / 获取 Stripe Customer
- 创建 Checkout Session
- 创建 Customer Portal Session
- 同步 Subscription 状态到数据库（State-Based Sync）
"""

import stripe
from loguru import logger
from supabase import create_client, Client

from app.configs.supabase_config import (
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
    STRIPE_SECRET_KEY,
    PRICE_ID_PRO,
    FRONTEND_URL,
    FREE_TIER_LIMIT,
    PRO_TIER_LIMIT,
)

stripe.api_key = STRIPE_SECRET_KEY


def _get_supabase_admin() -> Client:
    """返回使用 service_role key 的 Supabase 客户端"""
    return create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)


# ------------------------------------------------------------------
# Customer 管理
# ------------------------------------------------------------------


def get_or_create_stripe_customer(user_id: str, email: str) -> str:
    """
    惰性创建 Stripe Customer。
    先查 stripe_customers 表，没有则创建并存入。
    返回 stripe_customer_id。
    """
    supabase = _get_supabase_admin()

    # 查询已有映射（limit(1) 防止重复行时 PostgREST 返回 406）
    result = (
        supabase.table("stripe_customers")
        .select("stripe_customer_id")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    if result and result.data:
        return result.data[0]["stripe_customer_id"]

    # 创建 Stripe Customer
    customer = stripe.Customer.create(
        email=email,
        metadata={"supabase_user_id": user_id},
    )

    # 存入映射表
    supabase.table("stripe_customers").insert(
        {"user_id": user_id, "stripe_customer_id": customer.id}
    ).execute()

    logger.info(f"[stripe] Created customer {customer.id} for user {user_id}")
    return customer.id


# ------------------------------------------------------------------
# Checkout & Portal
# ------------------------------------------------------------------


def create_checkout_session(user_id: str, email: str) -> dict:
    """
    创建 Stripe Checkout Session 或重定向到 Customer Portal。
    如果用户已有 active/trialing 订阅，返回 Portal URL 以防止重复订阅。
    返回 {"url": str, "action": "checkout" | "portal"}。
    """
    customer_id = get_or_create_stripe_customer(user_id, email)

    # 检查是否已有 active 或 trialing 订阅
    active_subs = stripe.Subscription.list(
        customer=customer_id, status="active", limit=1
    )
    trialing_subs = stripe.Subscription.list(
        customer=customer_id, status="trialing", limit=1
    )

    if active_subs.data or trialing_subs.data:
        logger.info(
            f"[stripe] User {user_id} already has an active/trialing subscription, "
            f"redirecting to portal"
        )
        portal = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=f"{FRONTEND_URL}/profile",
        )
        return {"url": portal.url, "action": "portal"}

    session = stripe.checkout.Session.create(
        customer=customer_id,
        client_reference_id=user_id,
        mode="subscription",
        line_items=[{"price": PRICE_ID_PRO, "quantity": 1}],
        success_url=f"{FRONTEND_URL}/app?checkout=success",
        cancel_url=f"{FRONTEND_URL}/pricing?checkout=canceled",
    )

    return {"url": session.url, "action": "checkout"}


def create_portal_session(user_id: str, email: str) -> str:
    """
    创建 Stripe Customer Portal Session，返回 URL。
    """
    customer_id = get_or_create_stripe_customer(user_id, email)

    session = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url=f"{FRONTEND_URL}/profile",
    )

    return session.url


# ------------------------------------------------------------------
# Subscription Sync (State-Based)
# ------------------------------------------------------------------


def sync_subscription_from_stripe(subscription_id: str) -> None:
    """
    从 Stripe API 拉取 subscription 的最新状态，写入数据库。
    这是 State-Based Sync 模式的核心：
    Webhook 只是通知我们"有变化"，我们永远从 Stripe 拉取权威数据。
    """
    supabase = _get_supabase_admin()

    # 从 Stripe 拉取最新状态
    sub = stripe.Subscription.retrieve(subscription_id)

    # 查找对应的 user_id
    customer_id = sub.customer
    customer_result = (
        supabase.table("stripe_customers")
        .select("user_id")
        .eq("stripe_customer_id", customer_id)
        .limit(1)
        .execute()
    )

    if not customer_result or not customer_result.data:
        logger.warning(
            f"[stripe] No user found for customer {customer_id}, skipping sync"
        )
        return

    user_id = customer_result.data[0]["user_id"]

    # 兼容新旧 Stripe API：current_period_start/end 在新版本中移到了 item 级别
    items = sub["items"]["data"]
    first_item = items[0] if items else None
    price_id = first_item["price"]["id"] if first_item else None

    # 优先从 item 取，fallback 到 subscription 顶层（旧 API）
    period_start = (
        first_item.get("current_period_start") or sub.get("current_period_start")
        if first_item
        else sub.get("current_period_start")
    )
    period_end = (
        first_item.get("current_period_end") or sub.get("current_period_end")
        if first_item
        else sub.get("current_period_end")
    )

    # Upsert subscription 表
    sub_data = {
        "id": sub.id,
        "user_id": user_id,
        "status": sub.status,
        "price_id": price_id,
        "current_period_start": _ts_to_iso(period_start),
        "current_period_end": _ts_to_iso(period_end),
        "cancel_at_period_end": sub.cancel_at_period_end,
        "cancel_at": _ts_to_iso(sub.cancel_at),  # 新版 Stripe API 用此字段标记计划取消
        # 此处传入字符串，PostgreSQL会自动识别为NOW()函数，并返回当前时间戳
        "updated_at": "now()",
    }

    supabase.table("subscriptions").upsert(sub_data).execute()

    # 更新 profiles 的 usage_limit
    is_active = sub.status in ("active", "trialing")
    new_limit = PRO_TIER_LIMIT if is_active else FREE_TIER_LIMIT

    supabase.table("profiles").update({"usage_limit": new_limit}).eq(
        "id", user_id
    ).execute()

    logger.info(
        f"[stripe] Synced subscription {sub.id} for user {user_id} | "
        f"status={sub.status} | cancel_at={_ts_to_iso(sub.cancel_at)} | limit={new_limit}"
    )


def handle_checkout_completed(session: dict) -> None:
    """
    处理 checkout.session.completed 事件。
    Link User <-> Customer，然后同步 subscription。
    """
    supabase = _get_supabase_admin()
    user_id = session.get("client_reference_id")
    customer_id = session.get("customer")
    subscription_id = session.get("subscription")

    if not user_id or not subscription_id:
        logger.warning(
            "[stripe] checkout.session.completed missing user_id or subscription_id"
        )
        return

    # 确保 stripe_customers 映射存在
    supabase.table("stripe_customers").upsert(
        {"user_id": user_id, "stripe_customer_id": customer_id}
    ).execute()

    # 用 State-Based Sync 同步 subscription
    sync_subscription_from_stripe(subscription_id)


def handle_subscription_event(subscription_data: dict) -> None:
    """
    处理 customer.subscription.updated / deleted 事件。
    """
    subscription_id = subscription_data.get("id")
    if not subscription_id:
        logger.warning("[stripe] Subscription event missing id")
        return

    sync_subscription_from_stripe(subscription_id)


def handle_invoice_paid(invoice_data: dict) -> None:
    """
    处理 invoice.payment_succeeded 事件。
    重置用量计数器 (仅在 billing_reason == 'subscription_cycle' 时)。
    """
    billing_reason = invoice_data.get("billing_reason")
    subscription_id = invoice_data.get("subscription")
    customer_id = invoice_data.get("customer")

    if billing_reason != "subscription_cycle":
        logger.info(
            f"[stripe] invoice.payment_succeeded with billing_reason={billing_reason}, "
            f"not a renewal, skipping usage reset"
        )
        return

    supabase = _get_supabase_admin()

    # 查找 user_id
    customer_result = (
        supabase.table("stripe_customers")
        .select("user_id")
        .eq("stripe_customer_id", customer_id)
        .maybe_single()
        .execute()
    )

    if not customer_result.data:
        logger.warning(f"[stripe] No user found for customer {customer_id}")
        return

    user_id = customer_result.data["user_id"]

    # 重置用量
    supabase.table("profiles").update({"usage_count": 0}).eq("id", user_id).execute()

    logger.info(f"[stripe] Reset usage_count for user {user_id} on renewal")

    # 同步 subscription 状态
    if subscription_id:
        sync_subscription_from_stripe(subscription_id)


def handle_invoice_failed(invoice_data: dict) -> None:
    """
    处理 invoice.payment_failed 事件。
    同步 subscription 状态（状态在 Stripe 侧会变为 past_due）。
    """
    subscription_id = invoice_data.get("subscription")
    if subscription_id:
        sync_subscription_from_stripe(subscription_id)


def _ts_to_iso(ts: int | None) -> str | None:
    """将 Unix timestamp 转换为 ISO 8601 字符串"""
    if ts is None:
        return None
    from datetime import datetime, timezone

    return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
