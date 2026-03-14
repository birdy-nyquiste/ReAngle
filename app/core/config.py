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
# Keep SYSTEM_PROMPTS_DIR for legacy rewrite clients.
SYSTEM_PROMPTS_DIR = os.path.join(BASE_DIR, "services", "re", "prompts")
DE_PROMPTS_DIR = os.path.join(BASE_DIR, "services", "de", "prompts")
RE_PROMPTS_DIR = os.path.join(BASE_DIR, "services", "re", "prompts")

# ── Settings / Prompt Defaults ───────────────────────
DEFAULT_DEANGLE_DETACH_PROMPT_PATH = os.path.join(
    DE_PROMPTS_DIR, "deangle_detach_system_prompt.yaml"
)
DEFAULT_DEANGLE_FACT_CHECK_PROMPT_PATH = os.path.join(
    DE_PROMPTS_DIR, "deangle_fact_check_system_prompt.yaml"
)
DEFAULT_REANGLE_PROMPT_PATH = os.path.join(RE_PROMPTS_DIR, "reangle_system_prompt.yaml")
SETTINGS_PROMPT_MAX_LENGTH = 12000

# ── Model Catalog (config-driven) ───────────────────
MODEL_CATALOG = [
    {"id": "gpt-5-mini", "label": "GPT-5 Mini", "provider": "openai"},
    {
        "id": "gemini-3-flash-preview",
        "label": "Gemini 3 Flash Preview",
        "provider": "gemini",
    },
    {"id": "qwen-flash", "label": "Qwen Flash", "provider": "qwen"},
]

# Placeholder sets for now. Can diverge later via config only.
DEANGLE_AVAILABLE_MODELS = [m.copy() for m in MODEL_CATALOG]
REANGLE_AVAILABLE_MODELS = [m.copy() for m in MODEL_CATALOG]

DEANGLE_DEFAULT_MODEL = "gemini-3-flash-preview"
REANGLE_DEFAULT_MODEL = "gemini-3-flash-preview"

MODEL_PROVIDER_MAP = {m["id"]: m["provider"] for m in MODEL_CATALOG}

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
AVATAR_FREE_TIER_LIMIT = 0
AVATAR_PRO_TIER_LIMIT = 5

# ── 准备弃用：旧版大模型调用 ─────────────────────────
OPENAI_BASE_URL = "https://api.openai.com/v1"
DEFAULT_MODEL = "gpt-4o-mini"
