# ReAngle

**ReAngle** - Reframe the story from your own Angle。

在信息过载时代，事件是客观的，但叙事是被塑造的。ReAngle 的目标不是替你“给答案”，而是把“理解事件、选择立场、完成表达”的能力做成可复用的产品流程。

## 在线体验

[https://reangle.app/](https://reangle.app/)

## 工作流

### 1. Source

围绕**同一主题**收集多个输入源，并进行主题一致性验证。

### 2. Reveal

执行两步能力：

- `Detach`：拆分客观事实与主观观点
- `Fact Check`：对拆出的事实进行核查

### 3. Reframe

基于已核查事实、选定观点和用户指令，生成最终叙事内容（摘要 + 正文）。

## 订阅与用量

- 币种：`USD`
- Pro 定价：`$9.99 / month`

| 计划 | Reframe 生成 | TTS | Avatar |
| --- | --- | --- | --- |
| Free | 每月 5 次 | 每月 1 次 | 不可用 |
| Pro | 不限次 | 每月 20 次 | 每账期 5 次 |

以上额度已在后端完成校验与计数。

## 当前代码能力（实现状态）

- 认证与用户体系：Supabase Auth + 受保护路由
- 支付订阅：Stripe Checkout + Customer Portal + Webhook 同步
- 用量控制：
  - Reframe：按订阅状态控制 `usage_limit`（Free=5, Pro=-1）
  - TTS：按订阅状态控制 `tts_usage_limit`（Free=1, Pro=20）
  - Avatar：仅 Pro 可用，按账期限制次数
- 媒体能力：
  - TTS（DashScope）
  - 口播稿生成（OpenAI）
  - 数字人视频（HeyGen）
- 用户设置：支持按账号配置 Reveal/Reframe 模型与 system prompt

## 技术栈

### 前端

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- React Router
- Supabase JS

### 后端

- FastAPI
- Supabase（Auth + Postgres）
- Stripe（订阅）
- OpenAI / Gemini / DashScope（LLM 与语音）
- HeyGen（Avatar 视频）

## 本地开发

### 前置要求

- Python 3.13+
- Node.js 20+

### 1) 配置环境变量

后端 `.env`（项目根目录）：

```env
# Supabase
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
PRICE_ID_PRO=...
FRONTEND_URL=http://localhost:5173

# LLM / Media
OPENAI_API_KEY=...
GEMINI_API_KEY=...
DASHSCOPE_API_KEY=...
HEYGEN_API_KEY=...
```

前端 `frontend/.env`：

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

### 2) 启动后端

先执行 SQL（至少一次，每个环境一次）：

```bash
# 在 Supabase SQL Editor 执行：
# docs/sql/ensure_tts_usage_controls.sql
# docs/sql/ensure_avatar_usage_controls.sql
```

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

默认地址：`http://localhost:8000`

### 3) 启动前端

```bash
cd frontend
npm install
npm run dev
```

默认地址：`http://localhost:5173`

## 关键 API（v2）

- `POST /api/v2/inputs/`：Source 输入处理（含主题验证，计入用量）
- `POST /api/v2/deangle/`：Reveal 处理（Detach + Fact Check）
- `POST /api/v2/reangle/`：Reframe 生成
- `POST /api/v2/media/tts`：TTS
- `POST /api/v2/media/voiceover`：口播稿
- `POST /api/v2/media/avatar`：Avatar 视频（含 Pro/额度校验）
- `POST /api/v2/payment/create-checkout-session`：升级或跳转订阅管理
- `POST /api/v2/payment/create-portal-session`：打开 Stripe 客户门户
- `GET /api/v2/payment/usage`：读取当前用量与订阅状态
- `GET/PATCH /api/v2/settings/`：模型与 prompt 设置

## 项目结构（简版）

```text
ReAngle/
├── app/
│   ├── core/               # 配置、异常、鉴权依赖、中间件
│   ├── routers/v2/         # inputs/deangle/reangle/media/payment/settings
│   ├── schemas/            # Pydantic 请求响应模型
│   └── services/           # 输入处理、LLM 编排、Stripe、Settings、媒体输出
├── frontend/
│   └── src/
│       ├── pages/          # Landing / Pricing / MainApp / Profile / Settings 等
│       ├── components/     # UI 与业务组件
│       ├── context/        # Auth / Language
│       └── locales/        # en / zh / es 文案
├── docs/                   # 业务与架构文档、SQL 脚本
└── README.md
```
