## Avatar 数字人播报功能说明

本功能在原有「文章改写」流程之上，新增了将改写结果一键转换为数字人播报视频的能力。用户在完成改写后，可以在结果区域切换到 `Avatar` 标签，先生成并编辑一份口播稿，再用这份口播稿驱动 HeyGen 的数字人视频生成，最后在页面中直接预览与下载视频。

---

## 一、用户使用流程

用户完成内容改写后，切换到结果页中的 **Avatar** 标签。页面右上角有两个按钮：「生成口播稿」用于从改写结果自动生成一份适合朗读的口播稿，内容会显示在可编辑文本框中，并展示字数/词数统计与「复制」按钮；用户可以在这里对口播稿进行删减与润色。确认口播稿满意后，点击「生成数字人播报」，系统会以当前文本框中的口播稿为唯一脚本调用 HeyGen 生成数字人视频；若用户直接点击「生成数字人播报」但尚未生成口播稿，系统会先自动生成口播稿再继续。生成完成后，视频会显示在口播稿下方的预览区域中，并提供「下载视频」按钮。为了控制时长与费用，当口播稿长度超过约 800 字时，前端会直接拦截请求并提示用户先缩减字数。

---

## 二、系统架构与数据流

整体流程可以概括为「改写结果 → 口播稿 → 数字人视频」三段链路：

1. 用户在主应用中提交多种输入（文本、文件、URL、YouTube），后端统一抽取并清洗为 `clean_text`，通过 `rewriting_client` 生成 `original / summary / rewritten` 三段结果。
2. 在 Avatar 标签中，前端将 `result.rewritten` 发送到 `/api/v1/rewrite/voiceover`，由 `voiceover_client` 调用 OpenAI 模型，根据专门的系统 Prompt 生成一份口播稿，并返回给前端展示与编辑。
3. 用户确认口播稿后，前端将当前口播稿文本发送到 `/api/v1/rewrite/avatar`，由 `avatar_client` 调用 HeyGen `/v2/video/generate` 接口生成数字人视频。生成完成后，接口返回 `video_url`，前端在页面中嵌入 `<video>` 播放器用于预览，并通过 `/api/v1/rewrite/video-download?url=...` 代理下载原始视频文件。

---

## 三、后端实现概览

### 3.1 路由与接口

- `POST /api/v1/rewrite/voiceover`：接收 `text` 字段（改写后的文章），通过 `voiceover_client` 调用 OpenAI，将文章转换为口播稿，并返回 `{ voiceover }`。系统 Prompt 中建议口播稿控制在约 300–600 字，以获得 1–2.5 分钟的视频长度和较好的节奏。
- `POST /api/v1/rewrite/avatar`：接收 `text` 字段（最终口播稿），通过 `avatar_client` 调用 HeyGen `/v2/video/generate` 生成数字人视频，并返回 `{ video_url }`。
- `GET /api/v1/rewrite/video-download`：对 HeyGen 返回的 `video_url` 进行安全代理下载，只允许特定域名，设置 `Content-Disposition: attachment`，解决浏览器直接打开远程视频无法触发下载的问题。

### 3.2 AvatarClient（显式配置模式）

`app/services/llms/avatar_client.py` 封装了基于 HeyGen V2 `/v2/video/generate` 的数字人生成逻辑：

- 通过环境变量配置 avatar 形象、说话风格、声音、分辨率和背景等参数，例如：
  - `HEYGEN_AVATAR_ID`（主播形象，如 `Fernando_sitting_businessindoor_front`）
  - `HEYGEN_VOICE_ID`、`HEYGEN_VOICE_SPEED`、`HEYGEN_VOICE_PITCH`、`HEYGEN_VOICE_DURATION`
  - `HEYGEN_VIDEO_WIDTH` / `HEYGEN_VIDEO_HEIGHT`
  - `HEYGEN_BACKGROUND_COLOR`、`HEYGEN_BACKGROUND_PLAY_STYLE`、`HEYGEN_BACKGROUND_FIT`
- 请求体中将前端传入的口播稿文本直接放入 `video_inputs[0].voice.input_text`，确保数字人严格按照当前口播稿朗读，不再由 HeyGen 自行生成文案。
- 使用 `/v1/video_status.get` 轮询任务状态，直到拿到 `video_url` 或判断任务失败/超时，轮询间隔和最大次数参考了原有 `VideoAgentClient` 的实现。

### 3.3 VideoAgentClient（Video Agent 模式）

`app/services/llms/video_agent_client.py` 保留了基于 HeyGen Video Agent 的另一种生成模式：

- 调用 `/v1/video_agent/generate`，传入一个较长的 prompt，由 HeyGen 根据提示自动选择 avatar、场景和声音。
- 该模式画面和场景更丰富，但因为 HeyGen 端需要做更多决策和渲染，生成时间更长且按秒计费成本更高。
- 目前该模式未直接暴露在 Avatar UI 的主链路中，但代码仍然可用，后续可以通过配置或新接口进行切换和 AB 测试。

---

## 四、前端实现概览

`frontend/src/pages/MainApp.tsx` 中，在结果区域增加了一个 `Avatar` 标签页，并实现以下交互：

- **状态管理**：
  - `voiceover` / `voiceoverLoading`：口播稿内容与生成加载状态。
  - `avatarVideoUrl` / `avatarLoading`：数字人视频地址与生成加载状态。
  - `voiceoverStats`：根据是否 ASCII 判断使用「字数」或「单词数」统计，用于 UI 提示。
- **按钮逻辑**：
  - 「生成口播稿」：在有 `result.rewritten` 的前提下，调用 `/rewrite/voiceover` 获取口播稿，填充到 `Textarea` 并允许用户编辑与复制。
  - 「生成数字人播报」：
    - 若已有 `voiceover`，直接使用当前文本框内容；
    - 若暂无 `voiceover`，先自动调用一次口播稿生成，再用生成结果；
    - 在最终脚本长度超过 800 字时，前端会在控制台输出警告并弹窗提示「口播稿超过 800 字，暂不支持生成数字人播报，请先缩短后再试」，并中止调用。
- **视频展示与下载**：
  - 成功拿到 `video_url` 后，在页面中渲染 `<video>` 播放器，供用户预览；
  - 「下载视频」按钮拼接 `/rewrite/video-download?url=...`，通过新窗口打开触发浏览器下载。

---

## 五、费用与性能策略

从成本和性能角度，项目中同时保留了两套 HeyGen 调用模式：

1. **Video Agent 模式（VideoAgentClient）**：由 HeyGen 根据 prompt 自动选择 avatar、场景和声音，适合需要丰富画面和更强“创意感”的场景，但单价更高、生成时间也更长。
2. **显式配置模式（AvatarClient）**：由我们在配置中固定 avatar、声音、分辨率与背景，只把口播稿作为 `input_text` 传入，画面更可控，生成时间和成本更低，适合大多数标准播报场景。

当前 Avatar 标签默认走 `AvatarClient`，并通过前端的 800 字限制和后台的稳健轮询策略，在成本、时长和用户体验之间做出平衡。后续若有需要，可以在路由层或配置层增加开关，根据业务场景或用户等级在两种模式之间自动切换。

---

## 六、后续优化方向

- 增加多种 Avatar/场景预设，让用户在 UI 中选择不同风格（讲解、采访、课程等），在后台映射到不同的 HeyGen 配置。
- 支持显示更细粒度的进度反馈（例如「排队中」「渲染中」「即将完成」），提升长视频等待时的体验。
- 在后台记录每次生成的时长和费用估算，为后续的成本监控与套餐设计提供数据支持。

