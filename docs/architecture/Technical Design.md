## Technical Design (ReAngle)

本文档是 ReAngle 的整体技术设计说明，目标是让读者在一份文档里理解系统的 **System Architecture**、核心模块如何交互、关键链路如何工作，以及主要功能在代码中的落位。文档粒度以“模块与链路”为主，具体实现细节请跳转到对应功能文档。

---

## 1. System Architecture（系统架构总览）

ReAngle 采用典型的“Web 前端 + 后端 API + BaaS + 第三方 AI/支付”的架构：

- **Frontend（React + Vite + TypeScript）**
  - 负责 UI、输入队列、结果视图（Summary / Rewritten / Compare / Avatar）与交互编排。
  - 通过 Supabase SDK 维护登录会话，并在调用后端时携带 `Bearer token`。
- **Backend（FastAPI）**
  - 提供改写、TTS、口播稿、数字人视频、支付与小程序对接等 REST API。
  - 统一做鉴权、用量控制、错误处理与日志记录，再将任务分发到各服务模块。
- **Supabase（Auth + Postgres）**
  - 负责账号认证（JWT）、用户资料与用量表、订阅状态存储、原子用量递增 RPC。
- **Stripe（Checkout + Webhook + Portal）**
  - 负责订阅计费生命周期，后端通过 Webhook 同步订阅状态与权益。
- **External Providers**
  - **LLM Providers**：OpenAI / Gemini / Qwen（文章改写与摘要）
  - **DashScope**：TTS（朗读摘要）
  - **HeyGen**：Avatar 视频（数字人播报）

可视化参考：
- `docs/diagrams/context.md`
- `docs/diagrams/container.md`

---

## 2. Backend 模块分层与职责

后端 FastAPI 按“路由层 + 核心基础设施 + 应用服务 + Provider Clients”的方式组织：

1. **Router Layer（routers/）**
   - `rewrite`：改写主链路 + TTS/Voiceover/Avatar/下载代理
   - `payment`：订阅计费（Checkout/Portal/Webhook/Usage）
   - `miniprogram`：小程序对接 API

2. **Core Infrastructure（core/）**
   - **dependencies**：鉴权（JWT 校验）、用量检查与递增（quota/usage）
   - **exceptions / handlers**：统一异常类型与统一 API 错误响应
   - **middleware**：请求 request_id、请求/响应日志

3. **Rewrite Application Service（改写编排）**
   - 将多源输入统一抽取为 `clean_text`，调用 LLM 完成改写与摘要，返回统一结构结果。

4. **Content Extractors（内容抽取器）**
   - URL / PDF / DOCX / 图片 OCR / 其它文本兼容处理（多源队列输入的关键支撑）。

5. **Provider Clients（第三方能力封装）**
   - LLM（OpenAI/Gemini/Qwen）
   - TTS（DashScope）
   - Avatar（HeyGen：AvatarClient / VideoAgentClient 两种模式）

可视化参考：
- `docs/diagrams/component.md`

---

## 3. Frontend 关键模块与交互编排

前端的核心交互集中在 `MainApp` 页面，采用“左侧输入/配置 + 右侧结果面板”的布局：

- **输入队列（Multi-source Input Queue）**
  - 支持 Text / File / URL / YouTube 多源输入，逐条入队，提交时统一打包为 `FormData(inputs + prompt + llm_type)`。
- **模型选择（Multi-Model）**
  - 在 UI 下拉框选择 ChatGPT / Gemini / Qwen，对应提交给后端的 `llm_type`。
- **结果视图（Tabs）**
  - Summary：摘要展示 + TTS 播放
  - Rewritten：改写正文 + 下载
  - Compare：原文 vs 改写 diff
  - Avatar：口播稿生成 + 编辑 + 数字人视频生成 + 下载

对应说明文档：
- `docs/features/多源输入队列处理.md`
- `docs/features/多模型调用配置.md`
- `docs/features/结果展示与交互视图.md`
- `docs/features/Avatar数字人播报功能.md`

---

## 4. 关键链路（End-to-End Flows）

### 4.1 Rewrite 主链路（输入队列 → 抽取 → 改写/摘要 → 结果）

这条链路是产品的“主路径”：用户把多源材料入队、选择模型与风格，后端统一抽取为 `clean_text` 后调用 LLM，最终返回 `original + summary + rewritten`。

后端关键点：
- 鉴权（Supabase 校验 JWT）
- 用量控制（RPC 原子递增，超限返回 402）
- 多源抽取（URL/PDF/DOCX/图片等）
- 多模型路由（按 `llm_type` 调不同 provider）

可视化参考：
- `docs/diagrams/sequence_core.md`

### 4.2 Subscription/Billing 链路（升级 → Checkout → Webhook 同步 → 权益生效）

订阅计费以 Stripe 为权威数据源，后端采用 **State-Based Sync**：Webhook 只作为“变更通知”，收到后主动查询 Stripe 的订阅权威状态并落库到 Supabase，更新用户权益与额度。

可视化参考：
- `docs/diagrams/sequence_subscription.md`
- 详细技术说明：`docs/architecture/用户系统技术文档.md`
- 功能说明：`docs/features/账号登录与订阅计费.md`

### 4.3 Avatar（口播稿 → 数字人视频 → 预览/下载）

Avatar 链路建立在 rewrite 结果之上：先从改写结果生成可编辑口播稿，再调用 HeyGen 生成数字人视频。实现上保留两种模式：

- **AvatarClient（显式配置模式）**：固定 avatar/voice/分辨率/背景，成本更可控、生成更稳定。
- **VideoAgentClient（Video Agent 模式）**：只给 prompt，让 HeyGen 自动选 avatar/场景/声音，画面更丰富但成本更高、生成更慢。

当前 UI 默认走 AvatarClient，并在前端对口播稿长度做上限限制以控制成本与时长。

详细说明：
- `docs/features/Avatar数字人播报功能.md`

### 4.4 Miniprogram（小程序对接）

小程序 API 是独立的对接面，提供健康检查、生成故事、获取结果等端点，并提供 JS/Python/cURL 示例与最佳实践。

对接文档：
- `docs/features/小程序对接.md`

---

## 5. Cross-Cutting Concerns（横切能力）

### 5.1 Error Handling & Logging

系统使用 `loguru` 做统一日志，配合 request_id 贯穿请求生命周期；所有 API 错误通过统一异常类型和全局 handler 输出标准 JSON 结构，便于前端展示与后端排查。

详细说明：
- `docs/architecture/错误处理与日志系统.md`

### 5.2 Security & Keys

- 前端只持有 Supabase `anon key` 与 Stripe publishable key（如配置）。
- 后端持有 Supabase `service_role key` 与 Stripe secret key，并负责所有敏感操作（JWT 校验、Webhook 验签、权益同步）。
- 对外下载（如 HeyGen 视频下载）通过后端代理并做域名白名单校验，避免 SSRF。

---

## 6. Feature List（技术视角）

从技术能力维度，当前系统的主要特性包括：

- 多源输入队列抽取与聚合（Text/File/URL/YouTube）
- 多模型路由（ChatGPT / Gemini / Qwen）
- 结果视图（Summary/Rewritten/Compare/Avatar）
- 语音朗读（TTS）
- 数字人播报（口播稿生成 + HeyGen 视频生成 + 下载代理）
- 登录与订阅计费（Supabase Auth + Stripe Subscription + 用量控制）
- 小程序对接 API（外部消费端）
- 统一错误处理与日志体系（可观测性）

对应文档在 `docs/features/` 与 `docs/architecture/` 中均已按模块归档。

