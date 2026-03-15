# 改写与摘要（ReAngle）

本文档说明 ReAngle 中的 **ReAngle** 步骤：用户在完成 Inputs、并可选完成 DeAngle 后，选择要采用的事件与视角、填写新叙事 prompt，后端根据 Session 与用户设置中的模型生成**摘要**与**改写正文**。对应接口为 **`POST /api/v2/reangle/`**。模型与系统 Prompt 的配置见《多模型调用配置》。

---

## 一、功能定位

ReAngle 是主流程的**生成步骤**：

- **前置条件**：Session 中已有 `clean_text`（来自 Inputs）；若做过 DeAngle，Session 中还有 `facts` 与 `angles`，用户在前端勾选部分事实与视角。
- **输入**：用户填写的 **prompt**（新叙事角度/风格/指令），以及前端提交的 **selected_facts**、**selected_angles**（勾选后带格式的状态）。
- **输出**：**summary**（摘要）与 **rewritten_content**（基于所选事实与角度、按 prompt 生成的新文章）。

---

## 二、用户使用流程

1. 用户已完成 Inputs；若使用 DeAngle，则已完成事件/视角拆分与勾选。
2. 在 ReAngle 步骤中，用户在前端填写或选择改写风格（prompt），点击生成。
3. 前端将 `prompt`、`selected_facts`、`selected_angles` 提交到 **`POST /api/v2/reangle/`**。
4. 后端从 Session 读取 `clean_text`、`facts`、`angles`，从用户设置读取 `reangle_model`、`reangle_system_prompt`，调用 ReAngle 服务生成结果。
5. 前端收到 **summary** 与 **rewritten_content**，在结果区 Summary / Rewritten / Compare / Avatar 等标签中展示与后续使用。

---

## 三、接口与数据

### 3.1 请求

- **方法与路径**：`POST /api/v2/reangle/`
- **鉴权**：需要登录（Bearer Token）。
- **请求体（ReAngleRequest）**：
  - **prompt**：用户定义的新叙事角度/提示词（可为空字符串）。
  - **selected_facts**：用户在前端勾选的事件列表（带格式状态），与 DeAngle 返回的 facts 对应。
  - **selected_angles**：用户在前端勾选的视角列表（带格式状态），与 DeAngle 返回的 angles 对应。

若 Session 中无 `clean_text` 或无 DeAngle 结果（`facts`/`angles`），后端返回 400，提示先完成 Inputs 或 DeAngle。

### 3.2 响应

- **summary**：生成内容的摘要。
- **rewritten_content**：基于所选事实与角度、按 prompt 重新生成的文章正文。

前端用这两项驱动结果区的 Summary 视图、Rewritten 视图、Compare 视图，以及 Avatar 口播稿与数字人视频（口播稿基于 `rewritten_content`）。

### 3.3 后端实现要点

- **路由**：`app/routers/v2/reangle.py`，`run_reangle`。
- **服务**：`app/services/re/reangle_service.run_reangle(clean_text, selected_facts, selected_angles, prompt, model, system_prompt)`；其中 `model` 与 `system_prompt` 来自用户设置（如 `get_settings(user_id)`）。
- **模型路由**：多模型支持与扩展方式见《多模型调用配置》。

---

## 四、与其它功能的关系

- **Inputs**：必须先生成 `clean_text` 并写入 Session。
- **DeAngle**：若使用 DeAngle，则需先完成 DeAngle 并将 `facts`、`angles` 写入 Session；ReAngle 请求中的 `selected_facts`、`selected_angles` 即来自前端对 DeAngle 结果的勾选。
- **结果展示**：Summary / Rewritten / Compare 直接使用本接口的 `summary` 与 `rewritten_content`；Avatar 口播稿以 `rewritten_content` 为输入。

主流程三步的独立说明：多源输入见《多源输入队列处理》、事件与视角拆解见《DeAngle功能说明》、改写与摘要见本文。
