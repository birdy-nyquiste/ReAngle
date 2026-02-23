# ReAngle

基于大语言模型的智能文本重写应用，保留文章核心信息，根据用户指定的风格或立场重新组织和表达文章。采用现代化前后端分离架构，前端 React + Vite，后端 FastAPI。

## 快速体验

<https://reangle.app/>

## 核心功能

### 多源输入

- **文本粘贴**：直接输入或粘贴文本
- **URL 抓取**：自动提取网页正文
- **文件上传**：支持 PDF, Word, TXT 格式
- **YouTube 视频**：提取视频字幕内容

### 智能重写

- **多模型支持**：OpenAI GPT, Google Gemini, Qwen Flash
- **风格定制**：预设风格（幽默、学术、新闻等）+ 自定义提示词
- **结构化输出**：同时生成重写文章和精简摘要

### 多维展示

- **摘要朗读 (TTS)**：阿里云 DashScope 语音合成
- **数字人视频**：HeyGen API 生成 Avatar 视频
- **原文对比**：Diff 视图高亮显示改动
- **文件下载**：导出 TXT 格式

### 账号体系与订阅

- **用户认证**：基于 Supabase 的安全登录与注册
- **路由保护**：安全的私有页面与应用访问控制
- **个人中心**：管理用户偏好和状态
- **订阅付费**：Stripe 集成，支持 Pro 会员订阅

## 技术栈

### 前端

| 技术 | 用途 |
| ------ | ------ |
| React 18 + TypeScript | 核心框架 |
| Vite | 构建工具 |
| shadcn/ui + Radix UI | UI 组件库 |
| Tailwind CSS | 样式系统 |
| React Router v6 | 路由管理 |
| Supabase | 身份认证与 BaaS |

### 后端

| 技术 | 用途 |
| ------ | ------ |
| FastAPI | API 框架 |
| Supabase | 用户认证与数据库 |
| Stripe | 订阅支付 |
| OpenAI / Gemini / DashScope API | LLM 服务 |
| HeyGen API | 数字人视频 |
| BeautifulSoup4 + Lxml | 网页解析 |
| PyPDF + Python-docx | 文档解析 |

## 本地部署

### 前置要求

- Python 3.9+
- Node.js 20+
- 环境变量和API Keys

### 1. 环境变量

#### 后端 (.env)

```env
# Supabase 配置
SUPABASE_URL=your-supabase-url
SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
SUPABASE_SECRET_KEY=your-supabase-service-role-key

# Stripe 配置
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
PRICE_ID_PRO=your-stripe-price-id

# 应用 URL
API_URL=https://api.reangle.app
FRONTEND_URL=https://reangle.app

# LLM APIs (至少配置一个)
OPENAI_API_KEY=your-key
GEMINI_API_KEY=your-key
DASHSCOPE_API_KEY=your-key

# Avatar 视频 (可选)
HEYGEN_API_KEY=your-key
```

#### 前端 (frontend/.env)

```env
# Supabase 配置
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key

# Stripe 配置 (可选，用于前端直接跳转)
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### 2. 后端启动

```bash
# 安装依赖
pip install -r requirements.txt

# 启动服务
uvicorn app.main:app --reload
# 运行在 http://localhost:8000
```

### 3. 前端启动

```bash
cd frontend

npm install
npm run dev
# 运行在 http://localhost:5173
```

## 项目结构

```text
ReAngle/
├── app/                          # 后端 (FastAPI)
│   ├── main.py                   # 入口
│   ├── configs/                  # 配置
│   │   ├── settings.py           # 路径与常量
│   │   ├── logger.py             # 日志配置
│   │   └── supabase_config.py    # Supabase 客户端
│   ├── core/                     # 核心基础设施
│   │   ├── dependencies.py       # 依赖注入 (Auth)
│   │   ├── exceptions.py         # 自定义异常
│   │   └── handlers.py           # 全局错误处理
│   ├── middleware/               # 中间件
│   ├── routers/                  # API 路由
│   │   ├── rewrite.py            # 重写、TTS、Avatar
│   │   ├── payment.py            # Stripe 订阅支付
│   │   └── miniprogram.py        # 小程序接口
│   ├── services/
│   │   ├── llms/                 # LLM 客户端
│   │   │   ├── rewriting_client.py  # 统一重写入口
│   │   │   ├── openai_client.py
│   │   │   ├── gemini_client.py
│   │   │   ├── qwen_client.py
│   │   │   ├── tts_client.py     # 语音合成
│   │   │   └── avatar_client.py  # 数字人视频
│   │   ├── extractors.py         # 内容提取器
│   │   └── stripe_service.py     # Stripe 业务逻辑
│   └── schemas/                  # Pydantic 模型
├── frontend/                     # 前端 (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx   # 首页
│   │   │   ├── LoginPage.tsx     # 登录页
│   │   │   ├── RegisterPage.tsx  # 注册页
│   │   │   ├── ProfilePage.tsx   # 个人中心
│   │   │   ├── PricingPage.tsx   # 订阅定价页
│   │   │   └── MainApp.tsx       # 主应用界面 (需登录)
│   │   ├── components/
│   │   │   ├── DiffView.tsx      # 原文对比组件
│   │   │   ├── ProtectedRoute.tsx # 路由保护
│   │   │   └── ui/               # shadcn/ui 组件
│   │   ├── context/              # React Context (Auth)
│   │   ├── lib/
│   │   │   ├── supabase.ts       # Supabase 客户端
│   │   │   ├── diff-utils.ts     # Diff 工具函数
│   │   │   └── utils.ts
│   │   ├── App.tsx               # 路由配置与 Auth Provider
│   │   └── index.css             # 设计系统
│   └── public/
│       └── favicon.png           # Logo
├── docs/                         # 文档
├── results/                      # 任务结果 (运行时生成)
├── logs/                         # 运行日志 (运行时生成)
└── requirements.txt              # Python 依赖
```
