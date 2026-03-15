# DeAngle 功能说明

本文档说明 ReAngle 中的 **DeAngle** 步骤：在完成多源输入（Inputs）后，对原文进行「事件（Event）与视角（Angle）」拆分，并对事件做事实核查，结果供后续 ReAngle（改写与摘要）使用。对应接口为 **`POST /api/v2/deangle/`**。

---

## 一、功能定位

DeAngle 是主流程中的**可选处理层**，介于 Inputs 与 ReAngle 之间：

- **Inputs**：多源内容入队并抽取为 `clean_text`，写入 Session。
- **DeAngle**：从 Session 读取 `clean_text`，拆解为「事件列表」与「视角列表」，并对事件做事实核查（如 SUPPORTED / MOSTLY_SUPPORTED / CONTRADICTED / UNVERIFIABLE 等），结果写回 Session。
- **ReAngle**：用户在前端勾选要采用的事件与视角，填写新叙事 prompt，后端根据 Session 中的原文与 DeAngle 结果、以及用户设置中的模型，生成 `summary` 与 `rewritten_content`。

产品定义与理念见 `docs/overview/New Value Proposition.md` 与 `docs/overview/DeAngle功能定义.pdf`。

---

## 二、用户使用流程

1. 用户在主应用完成 **Inputs**（多源入队并提交），得到已聚合的原文。
2. 在 DeAngle 步骤中，用户点击执行 DeAngle（无需传参，后端从 Session 取 `clean_text`）。
3. 后端调用 DeAngle 服务（LLM）：先做 Event/Angle 拆分，再对事件做事实核查，返回 **facts**（带 status）与 **angles**。
4. 前端展示事件列表（可勾选）与视角列表（可勾选）；用户勾选要保留的事件与视角，并在下一步 ReAngle 中填写 prompt，提交 **`POST /api/v2/reangle/`**。

---

## 三、接口与数据

### 3.1 请求

- **方法与路径**：`POST /api/v2/deangle/`
- **鉴权**：需要登录（Bearer Token）。
- **请求体**：无；依赖 Session 中的 `clean_text`（由 Inputs 步骤写入）。若 Session 中无 `clean_text`，返回 400，提示先完成 Inputs。

### 3.2 响应

响应体为 **DeAngleResponse**，与前端 DeAngle 视图所需结构对齐：

- **facts**：`list[Fact]`，每个元素包含 `id`、`content`、`status`（事实核查结果：如 SUPPORTED、MOSTLY_SUPPORTED、PARTIALLY_SUPPORTED、CONTRADICTED、UNVERIFIABLE）。
- **angles**：`list[Angle]`，每个元素包含 `id`、`title`、`description`、`color`（用于前端展示）。

同时，后端将本次返回的 `facts` 与 `angles` 写入当前 Session，供 **ReAngle** 使用（ReAngle 请求中携带用户勾选的 `selected_facts`、`selected_angles` 与 `prompt`）。

### 3.3 后端实现要点

- **路由**：`app/routers/v2/deangle.py`，`run_deangle`。
- **服务**：`app/services/de/deangle_service.run_deangle(clean_text, model, detach_system_prompt, fact_check_system_prompt)`；其中 `model` 与两个 system prompt 来自**用户设置**（如 `get_settings(user_id)` 的 `deangle_model`、`deangle_detach_system_prompt`、`deangle_fact_check_system_prompt`）。
- **Session**：成功后 `session_store.update(session_id, facts=..., angles=...)`。

---

## 四、与其它功能的关系

- **Inputs**：必须先完成 Inputs，Session 中有 `clean_text` 才能调用 DeAngle。
- **ReAngle**：ReAngle 依赖 Session 中的 `clean_text` 与 DeAngle 产出的 `facts`、`angles`；用户在前端选择部分 facts/angles 并填写 prompt，再提交 ReAngle。
- **设置**：DeAngle 使用的模型与系统 Prompt 在用户设置中配置（如设置页或 `GET/PUT /api/v2/settings/`），与 ReAngle 模型设置分开。

这样，Overview / Architecture / Features 中的「DeAngle」都有对应说明：产品理念在 overview，链路与路由在 技术设计，本功能说明在 features 中专门描述 DeAngle 步骤与接口。
