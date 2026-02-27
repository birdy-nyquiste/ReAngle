# ReAngle

**ReAngle** - 把叙事能力还给每一个人

横看成岭侧成峰，远近高低各不同。在信息爆炸的时代，新闻巨头、观点领袖、自媒体都在用自己的视角解读世界。由于立场不同、角度不同、观点不同，对同一个客观事件的不同主观叙事被强加给大众。ReAngle 致力于将「叙事能力」产品化，让每个人都能从被动的信息消费者，转变为掌握叙事主动权的创造者。

通过封装复杂的大语言模型处理流程，ReAngle 能在一键之间，把纷繁复杂的多源素材（网页、PDF、Youtube视频等）根据您的需求视角提炼重组，生成逻辑严密、立场清晰的深度长文。

## 访问ReAngle.app，免费体验

<https://reangle.app/>

## 核心优势及工作流 (Workflow)

ReAngle 将复杂的文字生产和研究流程重塑为三个核心阶段：

### 1. 汇聚与过滤 (Gather)

将互联网上的信息投入引擎：

- **文本粘贴**：直接输入或粘贴文本
- **URL 抓取**：自动提取网页正文
- **文件上传**：支持 PDF, Word, TXT 格式
- **YouTube 视频**：提取视频字幕内容

### 2. 设定视角 (Set the Angle)

决定您观察这座「山」的角度——由您来重新定调：

- **多模型集成了当今世界最强的智慧大脑**：支持 OpenAI GPT-5, Google Gemini 3, Qwen 3
- **深度定制的风格化**：不管您是科技乐观派还是悲观批判者，皆可通过预设风格（幽默、学术、新闻等）叠加自定义提示词掌握话语权

### 3. 一键重塑 (ReAngle It)

点击生成，AI 将瞬间读懂多源事实，产出结构化的洞察内容和不同媒介的「利器」：

- **多维内容形态**：同时生成深度重写长文和精确的精简摘要
- **摘要朗读 (TTS)**：语音合成，输出可听化素材
- **数字人视频**：数字人新闻播报，分发流量
- **原文对比工具**：高效的 Diff 视图高亮呈现文本改写脉络
- **导出流**：随时导出 TXT 归档

### 账号体系与体验闭环

- **用户认证**：基于 Supabase 的安全登录与注册
- **私有隔离**：路由级别的应用访问控制保护用户隐私数据
- **个人中心**：可保存您的生成记录并管理系统偏好
- **订阅赋能**：提供专业版 (Pro) 订阅，解放完整功能

## 技术栈

### 前端

| 技术 | 用途 |
| ------ | ------ |
| React 18 + TypeScript | 核心框架 |
| Vite | 构建工具 |
| shadcn/ui + Radix UI | UI 组件库 |
| Tailwind CSS | 样式系统 |
| React Router v6 | 路由管理 |
| i18next & react-i18next | 多语言环境 (i18n) 与国际化支持 |
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

- Python 3.13.4
- Node.js 20.19.0
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

# LLM APIs
OPENAI_API_KEY=your-key
GEMINI_API_KEY=your-key
DASHSCOPE_API_KEY=your-key
HEYGEN_API_KEY=your-key
```

#### 前端 (frontend/.env)

```env
# Supabase 配置
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key

# Stripe 配置
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
│   ├── middleware/               # HTTP 中间件拦截
│   │   └── request_logging.py    # 请求日志记录层
│   ├── routers/                  # API 路由
│   │   ├── rewrite.py            # 重写、TTS、Avatar
│   │   ├── payment.py            # Stripe 订阅支付
│   │   └── miniprogram.py        # 小程序接口
│   ├── services/                 # 核心业务逻辑
│   │   ├── llms/                 # LLM 客户端层
│   │   │   ├── llm.py            # LLM 通用基类
│   │   │   ├── rewriting_client.py  # 统一重写入口
│   │   │   ├── openai_client.py
│   │   │   ├── gemini_client.py
│   │   │   ├── qwen_client.py
│   │   │   ├── tts_client.py     # 语音合成
│   │   │   └── avatar_client.py  # 数字人视频
│   │   ├── extractors.py         # 内容采集与提取器
│   │   ├── stripe_service.py     # Stripe 商业逻辑
│   │   └── utils.py              # 全局通用服务函数
│   ├── schemas/                  # Pydantic 类型验证模型
│   │   ├── error_response_schema.py
│   │   ├── miniprogram_schema.py
│   │   └── rewrite_schema.py
│   └── tests/                    # 单元/集成测试
│       └── test_integration.py
├── frontend/                     # 前端 (React + Vite)
│   ├── src/
│   │   ├── pages/                # 各类视图页面
│   │   │   ├── LandingPage.tsx   # 首页
│   │   │   ├── LoginPage.tsx     # 登录页
│   │   │   ├── RegisterPage.tsx  # 注册页
│   │   │   ├── ProfilePage.tsx   # 个人中心
│   │   │   ├── PricingPage.tsx   # 订阅定价页
│   │   │   └── MainApp.tsx       # 主应用界面 (需登录)
│   │   ├── components/           # UI 及功能组件
│   │   │   ├── AppHeader.tsx     # 导航顶栏
│   │   │   ├── DiffView.tsx      # 原文对比组件
│   │   │   ├── ProtectedRoute.tsx # 路由保护组件
│   │   │   └── ui/               # shadcn/ui 组件
│   │   ├── context/              # Context Providers
│   │   │   ├── AuthContext.tsx   # 用户登录流支持
│   │   │   └── LanguageContext.tsx # i18n 多语言环境
│   │   ├── lib/                  # 工具类库
│   │   │   ├── supabase.ts       # Supabase 通信
│   │   │   ├── diff-utils.ts     # Diff 运算函数
│   │   │   └── utils.ts
│   │   ├── locales/              # i18n 资源文件
│   │   │   ├── index.ts
│   │   │   ├── en.ts
│   │   │   ├── es.ts
│   │   │   └── zh.ts
│   │   ├── test/                 # 前端自动化测试用例
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   └── pages/
│   │   ├── App.tsx               # 路由配置与 Providers 根目录
│   │   ├── main.tsx              # 应用挂载入口
│   │   └── index.css             # Tailwind 核心与系统变量
│   └── public/                   # 静态资产
│       └── favicon.png           # Logo
├── docs/                         # 项目知识、价值主张 (Value Proposition) 等文档
├── scripts/                      # 基础运维辅助脚本
├── results/                      # 任务结果输出目录 (运行时构建)
├── logs/                         # 持久化日志空间 (运行时构建)
└── requirements.txt              # 后端 Python 环境约束
```
