"""
Supabase 和 Stripe 配置
从环境变量中读取所有密钥和配置项
"""

import os
from dotenv import load_dotenv

load_dotenv()

# Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_PUBLISHABLE_KEY = os.getenv(
    "SUPABASE_PUBLISHABLE_KEY", ""
)  # sb_publishable_... (前端也用)
SUPABASE_SECRET_KEY = os.getenv(
    "SUPABASE_SECRET_KEY", ""
)  # sb_secret_... (后端管理操作)

# Stripe
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
PRICE_ID_PRO = os.getenv("PRICE_ID_PRO", "")

# App
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Usage Limits
FREE_TIER_LIMIT = 5
PRO_TIER_LIMIT = -1  # -1 = unlimited
