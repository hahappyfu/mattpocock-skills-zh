---
name: implement-spec
description: "在代码中实现一份 spec。"
disable-model-invocation: true
---

你拿到了一份 spec，这份 spec 附带了描述如何实现它的 ticket。

目标是在单个分支上用一个 PR 实现整个 spec。

这些 ticket 不是步骤清单，而是一张带阻塞关系的**任务图（task graph）**，这意味着始终存在一批可领取的**前线（frontier）** ticket。

与子智能体之间的通信应尽量精简，主要通过**上下文指针（context pointers）**沟通：指向 spec、ticket、调研笔记和之前的 commit，不要重复指针已能取到的信息。

**实现者子智能体（implementer subagent）**应尽量在后台运行，以获得**最大并发度**。

## 步骤

1. 阅读 spec 和 ticket，读到能理解任务图为止。

2. （可选）用一个**探索子智能体（exploration subagent）**完成 ticket 要求的探索，包括相关代码库文件或外部文档。确保探索子智能体能存文件，它的 markdown 笔记应保存在仓库之外的目录，让所有后续子智能体都能取到，这样**实现者子智能体**就能专注于实现而非探索。

3. 创建分支和草稿 PR，PR 应标记为 closing 该 spec issue 和相关 ticket。

4. 用**实现者子智能体**实现每个 ticket，每个实现者子智能体在自己的 worktree 和自己的分支上工作。

5. 一个**实现者子智能体**完成后，用一个**合并子智能体（merger subagent）**把它的工作合入 PR 分支。

6. 如果这改变了可用 ticket 的**前线（frontier）**，就为新增 ticket 启动更多**实现者子智能体**，以保持最大并发度。

7. 所有 ticket 完成后，在 PR 分支上运行 /code-review，把代码审查提出的问题放在单个**实现者子智能体**中全部修完。

8. 把 PR 标记为可评审。

9. 清理所有**实现者子智能体**的 worktree。
