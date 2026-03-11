"""
配置和常量：路径、环境变量、第三方密钥。
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ── 路径 ──────────────────────────────────────────────
# 项目根目录 - app文件夹地址
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 前端静态文件地址
STATIC_DIR = os.path.join(BASE_DIR, "static")

# 小程序任务结果存放地址
RESULTS_DIR = os.path.join(os.path.dirname(BASE_DIR), "results")
os.makedirs(RESULTS_DIR, exist_ok=True)

# system prompts存放地址
SYSTEM_PROMPTS_DIR = os.path.join(BASE_DIR, "services", "re", "prompts")

# ── Supabase ──────────────────────────────────────────
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_PUBLISHABLE_KEY = os.getenv(
    "SUPABASE_PUBLISHABLE_KEY", ""
)  # sb_publishable_... (前端也用)
SUPABASE_SECRET_KEY = os.getenv(
    "SUPABASE_SECRET_KEY", ""
)  # sb_secret_... (后端管理操作)

# ── Stripe ────────────────────────────────────────────
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
PRICE_ID_PRO = os.getenv("PRICE_ID_PRO", "")

# ── App ───────────────────────────────────────────────
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# ── Usage Limits ──────────────────────────────────────
FREE_TIER_LIMIT = 5
PRO_TIER_LIMIT = -1  # -1 = unlimited

# ── 准备弃用：旧版大模型调用 ─────────────────────────
OPENAI_BASE_URL = "https://api.openai.com/v1"
DEFAULT_MODEL = "gpt-4o-mini"
