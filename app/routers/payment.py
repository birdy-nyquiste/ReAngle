"""
支付相关 API 路由:
- POST /create-checkout-session  创建 Stripe Checkout
- POST /create-portal-session    创建 Stripe 管理门户
- POST /webhook                  Stripe Webhook 接收端点
- GET  /usage                    获取当前用量信息
"""

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, status
from loguru import logger

from app.core.config import (
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET,
    SUPABASE_URL,
    SUPABASE_SECRET_KEY as SUPABASE_SECRET,
)
from app.core.supabase_dependencies import get_current_user
from app.services.stripe.stripe_service import (
    create_checkout_session,
    create_portal_session,
    handle_checkout_completed,
    handle_subscription_event,
    handle_invoice_paid,
    handle_invoice_failed,
)
from supabase import create_client

stripe.api_key = STRIPE_SECRET_KEY

payment_router = APIRouter(prefix="/payment", tags=["payment"])


@payment_router.post("/create-checkout-session")
async def api_create_checkout_session(user: dict = Depends(get_current_user)):
    """创建 Stripe Checkout Session 或重定向到 Portal（如已有订阅）"""
    try:
        result = create_checkout_session(user["id"], user["email"])
        return result  # {"url": "...", "action": "checkout" | "portal"}
    except Exception as e:
        logger.error(f"[payment] Failed to create checkout session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create checkout session",
        )


@payment_router.post("/create-portal-session")
async def api_create_portal_session(user: dict = Depends(get_current_user)):
    """创建 Stripe Customer Portal Session，返回重定向 URL"""
    try:
        url = create_portal_session(user["id"], user["email"])
        return {"url": url}
    except Exception as e:
        logger.error(f"[payment] Failed to create portal session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create portal session",
        )


@payment_router.post("/webhook")
async def stripe_webhook(request: Request):
    """
    Stripe Webhook 端点。
    验证签名后，根据事件类型分发处理。
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        logger.error("[webhook] Invalid payload")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        logger.error("[webhook] Invalid signature")
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = event["type"]
    data = event["data"]["object"]

    logger.info(f"[webhook] Received event: {event_type}")

    try:
        if event_type == "checkout.session.completed":
            handle_checkout_completed(data)

        elif event_type in (
            "customer.subscription.created",
            "customer.subscription.updated",
            "customer.subscription.deleted",
        ):
            handle_subscription_event(data)

        elif event_type == "invoice.payment_succeeded":
            handle_invoice_paid(data)

        elif event_type == "invoice.payment_failed":
            handle_invoice_failed(data)

        else:
            logger.info(f"[webhook] Unhandled event type: {event_type}")

    except Exception as e:
        logger.exception(f"[webhook] Error handling {event_type}: {e}")
        # 返回 500 以便 Stripe 重试（最多 3 天，指数退避）
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing {event_type}",
        )

    return {"status": "ok"}


@payment_router.get("/usage")
async def get_usage(user: dict = Depends(get_current_user)):
    """获取当前用户的用量和订阅信息"""
    supabase = create_client(SUPABASE_URL, SUPABASE_SECRET)

    # 获取 profile（用量）
    profile_result = (
        supabase.table("profiles")
        .select("usage_count, usage_limit")
        .eq("id", user["id"])
        .maybe_single()
        .execute()
    )

    # 获取 subscription（订阅状态）
    sub_result = (
        supabase.table("subscriptions")
        .select("status, price_id, current_period_end, cancel_at_period_end, cancel_at")
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    profile = profile_result.data or {"usage_count": 0, "usage_limit": 5}
    subscription = sub_result.data[0] if sub_result.data else None

    return {
        "usage_count": profile["usage_count"],
        "usage_limit": profile["usage_limit"],
        "subscription": subscription,
    }
