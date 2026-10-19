---
name: improve-codebase-architecture
description: 扫描代码库寻找深化机会，生成可视化 HTML 报告，然后访谈你选择的方案。
---

# 改进代码库架构

发现架构摩擦并提出**深化机会**：将浅模块转变为深模块的重构。目标是可测试性和 AI 可导航性。

此命令基于项目的领域模型和共享设计词汇：

- 调用 `codebase-design` 技能获取架构词汇（**module**、**interface**、**depth**、**seam**、**adapter**、**leverage**、**locality**）及其原则（删除测试、"接口即测试表面"、"一个 adapter = 假设的 seam，两个 = 真实的 seam"）。在每个建议中精确使用这些术语，不要使用"component"、"service"、"API"或"boundary"。
- `CONTEXT.md` 中的领域语言为好的 seam 提供名称；`docs/adr/` 中的 ADR 记录了此命令不应重新争论的决策。

## 流程

### 1. 探索

**扫描前先确定范围：YAGNI。** 深化模块的价值在于使未来的变更更容易，因此要重点关注最近有变更的代码库部分。在查看之前决定*在哪里*查找：

- 如果用户指定了方向（一个模块、一个子系统、一个痛点），就采用它，跳过下面的推断。
- 否则，回溯一段提交历史（`git log --oneline`）找到代码库的热点，即那些反复出现的文件和区域，让这些路径首先吸引你的注意力。如果变更分散且没有明显的热点，则扩大范围。

阅读项目的领域术语表（`CONTEXT.md`）和你正在接触的区域中的任何 ADR。

然后生成一个子智能体来遍历代码库。不要遵循刚性的启发式规则；有机地探索并记录你感受到摩擦的地方：

- 理解一个概念需要在多个小模块之间来回跳转的地方在哪里？
- 模块**浅**的地方在哪里，其接口几乎与实现一样复杂？
- 纯粹为了可测试性而提取的真实错误隐藏在它们的调用方式中的地方在哪里（没有**locality**）？
- 紧密耦合的模块跨越其 seam 泄露的地方在哪里？
- 代码库的哪些部分未测试，或难以通过其当前接口测试？

对任何你怀疑是浅的模块应用**删除测试**：删除它会使复杂性集中，还是仅仅将其移动？"是，集中了"就是你想要的信号。

### 2. 以 HTML 报告形式呈现候选方案

将独立的 HTML 文件写入操作系统临时目录，这样就不会有任何内容进入仓库。从 `$TMPDIR` 解析临时目录，回退到 `/tmp`（或 Windows 上的 `%TEMP%`），并写入 `<tmpdir>/architecture-review-<timestamp>.html`，这样每次运行都会获得一个新文件。为用户打开它（Linux 上使用 `xdg-open <path>`，macOS 上使用 `open <path>`，Windows 上使用 `start <path>`），并告诉他们绝对路径。

报告使用 **Tailwind CDN** 进行布局和样式设计，使用 **Mermaid CDN** 绘制图形/流程/序列图。将 Mermaid 与手工制作的 CSS/SVG 视觉效果混合使用：当关系是图形形状时使用 Mermaid（调用图、依赖关系、序列），当你想要更具编辑性的内容时使用手工构建的 div/SVG（批量图、横截面、折叠动画）。每个候选方案都有一个**前后可视化**。要有视觉效果。

为每个候选方案渲染一张卡片，包含：

- **Files**：涉及哪些文件/模块
- **Problem**：为什么当前架构造成摩擦
- **Solution**：什么会发生变化的简明英文描述
- **Benefits**：用 locality 和 leverage 解释，以及测试会如何改善
- **Before / After diagram**：并排、手绘，展示浅层和深化
- **Recommendation strength**：`Strong`、`Worth exploring`、`Speculative` 之一，渲染为徽章

在报告末尾添加一个**Top recommendation**部分：你会先处理哪个候选方案以及为什么。

**使用 CONTEXT.md 词汇表达领域，使用 `/codebase-design` 词汇表达架构。** 如果 `CONTEXT.md` 定义了"Order"，就讨论"the Order intake module"，而不是"the FooBarHandler"，也不是"the Order service"。

**ADR 冲突**：如果候选方案与现有 ADR 矛盾，只有在摩擦足够真实、值得重新审视 ADR 时才呈现它。在卡片中明确标记它（例如警告提示：_contradicts ADR-0007, but worth reopening because…_）。不要列出 ADR 禁止的每个理论重构。

参见 [HTML-REPORT.md](HTML-REPORT.md) 获取完整的 HTML 脚手架、图表模式和样式指南。

不要提出接口。文件写好后，询问用户："你想探索其中的哪一个？"

### 3. 访谈循环

一旦用户选择了一个候选方案，调用 `grilling` 技能与他们一起走决策树：约束、依赖关系、深化模块的形状、seam 后面是什么、哪些测试会保留。

副效应在决策清晰时内联发生；调用 `domain-modeling` 技能以保持领域模型的最新状态：

- **以 `CONTEXT.md` 中没有的概念命名深化模块？** 将该术语添加到 `CONTEXT.md`。如果文件不存在则懒创建。
- **在对话过程中明确了一个模糊术语？** 立即更新 `CONTEXT.md`。
- **用户因一个重要原因拒绝了该候选方案？** 提供一个 ADR，框架为：_Want me to record this as an ADR so future architecture reviews don't re-suggest it?_ 只有当原因确实需要被未来的探索者用来避免重复建议时才提供；跳过短暂的原因（"not worth it right now"）和不言自明的原因。
- **想探索深化模块的替代接口？** 调用 `codebase-design` 技能并使用其设计两次并行子智能体模式。
