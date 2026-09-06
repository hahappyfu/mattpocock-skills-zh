---
name: to-tickets
description: "将计划、spec 或当前对话分解为一组 tracer-bullet ticket，每个声明其 blocking edges，发布到配置的 tracker（edges 作为文本每个 ticket 一个文件在本地，或真实 tracker 上的原生 blocking link）。"
disable-model-invocation: true
---

# To Tickets

将计划、spec 或对话分解为一组 **ticket**：tracer-bullet 纵向切分（vertical slice），每个声明**阻塞**它的其他 ticket。

issue tracker 和 triage label 词汇表应该已经提供给你。如果没有，告诉用户运行 `/setup-matt-pocock-skills`。

## Process

### 1. 收集上下文

从对话上下文中已有的任何内容开始。如果用户传递引用（spec 路径、issue 编号或 URL）作为参数，获取它并阅读其完整正文和评论。

### 2. 探索代码库（可选）

如果你尚未探索代码库，请这样做以了解代码的当前状态。ticket 标题和描述应使用项目的领域词汇表（domain glossary）词汇，并遵循你触及区域的 ADR。

寻找预重构（prefactoring）的机会以使实现更容易。"先让变更容易，再做容易的变更。"

### 3. 起草纵向切分

将工作分解为 **tracer-bullet** ticket。

<vertical-slice-rules>

- 每个 slice 穿过每一层（schema、API、UI、tests）的一条狭窄但完整的路径：纵向，而不是一层的横向切分（horizontal slice）
- 一个完成的 slice 可以独立演示或验证
- 每个 slice 的大小适合单个新的上下文窗口（context window）
- 任何预重构应首先完成

</vertical-slice-rules>

给每个 ticket 其 **blocking edges**：在它开始之前必须完成的其他 ticket。没有阻塞项的 ticket 可以立即开始。

**宽重构（wide refactor）是纵向切分的例外。**一个**宽重构**是一个单一的机械变更（重命名列、重新类型化共享符号），其**爆炸半径（blast radius）**横跨整个代码库，因此一次编辑会破坏数千个调用点，没有纵向切分可以绿色通过。不要强制它成为 tracer bullet；将其序列化为**扩展收缩模式（expand–contract）**。首先扩展：在旧形式旁边添加新形式，这样什么都不破坏。然后按爆炸半径分批迁移调用点（按包、按目录），每批一个 ticket 被扩展阻塞，保持 CI 批次间绿色，因为旧形式仍然存在。最后收缩：在没有调用者剩余后删除旧形式，在一个被每个迁移批次阻塞的 ticket 中。当即使是批次也无法单独保持绿色时，保持序列但让它们共享一个集成分支（integration branch），所有批次阻塞一个最终的集成验证 ticket；只有在那里才承诺绿色。

### 4. 测试用户

将提议的分解方案作为编号列表呈现。对于每个 ticket，显示：

- **标题**：简短的描述性名称
- **Blocked by**：哪些其他 ticket（如果有的话）必须先完成
- **它交付什么**：这个 ticket 使什么端到端行为工作

询问用户：

- 粒度感觉合适吗？（太粗/太细）
- blocking edges 正确吗：每个 ticket 只依赖真正约束它的 ticket？
- 是否应该合并或进一步拆分任何 ticket？

迭代直到用户批准分解方案。

### 5. 将 ticket 发布到配置的 tracker

发布已批准的 ticket。**方式**取决于 `/setup-matt-pocock-skills` 配置的 tracker；ticket 无论如何都相同，只有 blocking edges 的形态改变：

- **本地文件** → 在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md` 下每个 ticket 一个文件，按依赖顺序从 `01` 开始编号（阻塞项优先）。每个文件的"Blocked by"列出它依赖的编号/标题。使用下方的每 ticket 文件模板：一个 ticket 一个文件，绝不合并为单个文件。
- **真实 issue tracker（GitHub、Linear……）** → 按依赖顺序发布每个 ticket 一个 issue（阻塞项优先），这样每个 ticket 的 blocking edges 可以引用真实标识符。在平台有原生 blocking / sub-issue 关系时使用；否则将每个 ticket 的"Blocked by"设置为阻塞 issue。应用 `ready-for-agent` triage label，除非另有指示；ticket 构造上就适合 agent 抓取。

处理**前线（frontier）**：任何阻塞项都已完成的 ticket。对于纯线性链，这意味着从上到下。

不要关闭或修改任何父 issue。

<local-ticket-template>

# <NN>: <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's perspective, not a layer-by-layer implementation list.

**Blocked by:** the numbers/titles of the tickets that gate this one, or "None (can start immediately)".

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-ticket-template>

<issue-template>

## Parent

A reference to the parent issue on the tracker (if the source was an existing issue, otherwise omit this section).

## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective, not layer-by-layer implementation.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- A reference to each blocking ticket, or "None (can start immediately)".

</issue-template>

无论哪种形式，避免具体文件路径或代码片段：它们会很快过时。例外：如果原型产出的片段比散文更能精确编码决策（状态机、reducer、schema、类型形状），将其内联并简要注明它来自原型。修剪到决策丰富的部分，不是工作演示，只是重要的部分。
