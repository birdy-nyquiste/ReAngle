"""
手动同步脚本 - 从 Stripe 拉取最新订阅状态并写入数据库。
适用场景：本地开发时 Webhook 未被接收，订阅已在 Stripe 侧成功但 DB 未更新。

使用方法（在项目根目录执行）：
    python scripts/sync_stripe_subscription.py <user_email_or_stripe_customer_id>
或者不带参数，自动同步所有活跃订阅：
    python scripts/sync_stripe_subscription.py
"""

import sys
import os

# 让脚本能找到 app 模块
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv()

import stripe
from loguru import logger
from app.configs.supabase_config import (
    STRIPE_SECRET_KEY,
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
)
from app.services.stripe_service import (
    sync_subscription_from_stripe,
    _get_supabase_admin,
)

stripe.api_key = STRIPE_SECRET_KEY


def sync_all_active_subscriptions():
    """同步 Stripe 中所有 active/trialing 的订阅到数据库。"""
    supabase = _get_supabase_admin()

    # 获取 stripe_customers 表中所有客户
    result = (
        supabase.table("stripe_customers")
        .select("user_id, stripe_customer_id")
        .execute()
    )
    if not result.data:
        logger.info("stripe_customers 表为空，无需同步。")
        return

    logger.info(f"共找到 {len(result.data)} 个 Stripe 客户，开始同步...")

    synced = 0
    for row in result.data:
        customer_id = row["stripe_customer_id"]
        user_id = row["user_id"]

        # 查询该客户的活跃订阅
        subs = stripe.Subscription.list(customer=customer_id, limit=10)
        if not subs.data:
            logger.info(f"  user={user_id} | customer={customer_id} | 无订阅，跳过")
            continue

        for sub in subs.data:
            logger.info(
                f"  user={user_id} | sub={sub.id} | status={sub.status} → 同步中..."
            )
            sync_subscription_from_stripe(sub.id)
            synced += 1

    logger.info(f"✅ 同步完成，共处理 {synced} 条订阅。")


def sync_by_customer_id(customer_id: str):
    """按 Stripe customer ID 同步。"""
    subs = stripe.Subscription.list(customer=customer_id, limit=10)
    if not subs.data:
        logger.warning(f"客户 {customer_id} 无订阅记录。")
        return
    for sub in subs.data:
        logger.info(f"同步订阅 {sub.id} (status={sub.status})...")
        sync_subscription_from_stripe(sub.id)
    logger.info("✅ 同步完成。")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg.startswith("cus_"):
            sync_by_customer_id(arg)
        else:
            logger.error("参数应为 Stripe customer ID（cus_...）。不带参数则同步所有。")
            sys.exit(1)
    else:
        sync_all_active_subscriptions()
