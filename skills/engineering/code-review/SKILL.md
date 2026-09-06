---
name: code-review
description: "按两个轴审查从固定点（commit、branch、tag 或 merge-base）到 HEAD 的 diff：Standards（代码是否遵循本仓库成文的编码规范？）和 Spec（代码是否符合原始 issue/spec 的要求？）。两个轴在并行子智能体中运行，并列呈现审查结果。当用户想要审查分支、PR、进行中的变更，或要求"审查自 X 以来"时使用。"
---

按两个轴审查 `HEAD` 与用户指定的固定点之间的 diff：

- **Standards**：代码是否符合本仓库成文的编码规范？
- **Spec**：代码是否忠实实现了原始 issue / spec？

两个轴作为**并行子智能体**运行，互不污染上下文，然后本 skill 汇总发现。

Issue tracker 应该已经提供给你。如果 `docs/agents/issue-tracker.md` 缺失，提示用户运行 `/setup-matt-pocock-skills`。

## 流程

### 1. 固定固定点

用户指定什么就是什么（commit SHA、分支名、tag、`main`、`HEAD~5` 等）。如果没有指定，询问用户。

一次性捕获 diff 命令：`git diff <fixed-point>...HEAD`（三点点号，与 merge-base 比较）。同时通过 `git log <fixed-point>..HEAD --oneline` 记录 commit 列表。

继续之前，确认固定点可解析（`git rev-parse <fixed-point>`）且 diff 非空。无效引用或空 diff 应该在这里失败，而不是在两个并行子智能体内部。

### 2. 识别 spec 来源

按以下顺序查找原始 spec：

1. commit message 中的 issue 引用（`#123`、`Closes #45`、GitLab `!67` 等），通过 `docs/agents/issue-tracker.md` 中的工作流获取。
2. 用户作为参数传入的路径。
3. `docs/`、`specs/` 或 `.scratch/` 下与分支名或功能匹配的 spec 文件。
4. 如果没找到，询问用户 spec 在哪。如果没有 spec，**Spec** 子智能体会跳过并报告"无可用 spec"。

### 3. 识别编码规范来源

仓库中任何文档化的代码编写规范，如 `CODING_STANDARDS.md` 或 `CONTRIBUTING.md`。

在仓库文档之外，Standards 轴始终携带下面的 **smell 基线**：一组固定的 Fowler 代码异味（*《重构》*第 3 章），即使仓库没有文档化任何标准也适用。两条规则约束它：

- **仓库优先。**仓库文档化的标准始终优先；当仓库认可基线会标记的内容时，抑制该 smell。
- **始终是判断调用。**每个 smell 是一个标记化的启发式（"possibly Feature Envy"），绝不是硬性违规。与这里的任何标准一样，跳过工具已经强制执行的内容。

每个 smell 按 *是什么* → *如何修复* 阅读；对照 diff 匹配：

- **Mysterious Name**：函数、变量或类型的名字没有揭示它的作用或持有内容。→ 重命名；如果找不到诚实的名字，说明设计本身模糊。
- **Duplicated Code**：相同的逻辑形状出现在变更的多个 hunk 或文件中。→ 提取共享形状，从两处调用。
- **Feature Envy**：一个方法比访问自己的数据更多地访问另一个对象的数据。→ 将方法移到它嫉妒的数据上。
- **Data Clumps**：相同的几个字段或参数总是结伴出现（一个类型呼之欲出）。→ 将它们捆绑为一个类型，传递该类型。
- **Primitive Obsession**：一个基本类型或字符串代表了本应拥有自己类型的领域概念。→ 给这个概念一个专门的小类型。
- **Repeated Switches**：相同的 `switch`/`if` 级联在相同类型上反复出现。→ 用多态或两个位置共享的 map 替代。
- **Shotgun Surgery**：一个逻辑变更迫使 diff 中许多文件分散编辑。→ 将变更内容收集到一个模块中。
- **Divergent Change**：一个文件或模块因多个无关原因被编辑。→ 拆分，使每个模块只为一个原因变更。
- **Speculative Generality**：为 spec 没有的需求添加的抽象、参数或钩子。→ 删除它；内联回去直到真实需求出现。
- **Message Chains**：调用者不应依赖的长链式导航 `a.b().c().d()`。→ 将走完隐藏在第一个对象的一个方法后面。
- **Middle Man**：一个类或函数主要只是委派转发。→ 删除它，直接调用真正的目标。
- **Refused Bequest**：一个子类或实现者忽略或覆盖了大部分继承内容。→ 放弃继承，使用组合。

### 4. 并行生成两个子智能体

**Standards 子智能体 prompt** 应包含：

- 完整的 diff 命令和 commit 列表。
- 步骤 3 中找到的规范来源文件列表，**加上步骤 3 的 smell 基线**完整粘贴（子智能体无法以其他方式访问它）。
- 简报："Report, per file/hunk where relevant, (a) every place the diff violates a documented standard: cite the standard (file + the rule); and (b) any baseline smell you spot: name it and quote the hunk. Distinguish hard violations from judgement calls: documented-standard breaches can be hard, but baseline smells are always judgement calls, and a documented repo standard overrides the baseline. Skip anything tooling enforces. Under 400 words."

**Spec 子智能体 prompt** 应包含：

- diff 命令和 commit 列表。
- spec 的路径或已获取的内容。
- 简报："Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line for each finding. Under 400 words."

如果没有 spec，跳过 Spec 子智能体并在最终报告中注明。

### 5. 汇总

在 `## Standards` 和 `## Spec` 标题下呈现两份报告，逐字或轻度清理。**不要**合并或 rerank 发现，因为两个轴是刻意分开的（见*为什么两个轴*）。

以一行总结结尾：每个轴的总发现数，以及*每个轴内*最严重的问题（如果有）。不要跨轴选一个胜者：分开存在的意义就是防止这种 reranking。

## 为什么两个轴

一个变更可能通过一个轴而失败另一个：

- 遵循所有规范但实现了错误的东西 → **Standards 通过，Spec 失败。**
- 完全做了 issue 要求但破坏了项目约定 → **Spec 通过，Standards 失败。**

分开报告防止一个轴掩盖另一个轴。
