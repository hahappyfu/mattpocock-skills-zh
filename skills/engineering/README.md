# Engineering

日常代码工作使用的技能。

## User-invoked

仅在你输入时才可达（Claude Code: `disable-model-invocation: true`；Codex: `policy.allow_implicit_invocation: false`，配置在 `agents/openai.yaml` 中）。

- **[ask-matt](./ask-matt/SKILL.md)**：询问哪个 skill 或流程适合你的场景。本仓库 user-invoked skill 的路由。
- **[grill-with-docs](./grill-with-docs/SKILL.md)**：持续追问来打磨计划或设计，过程中构建项目 domain model，锐化术语，并同步更新 `CONTEXT.md` 和 ADR。
- **[triage](./triage/SKILL.md)**：将 issue 和外部 PR 通过 triage 角色的状态机流转。
- **[improve-codebase-architecture](./improve-codebase-architecture/SKILL.md)**：扫描代码库寻找深化机会，生成可视化 HTML 报告，然后带文档访谈你选择的方案。
- **[setup-matt-pocock-skills](./setup-matt-pocock-skills/SKILL.md)**：为工程技能配置此仓库：设置 issue tracker、triage label 词汇表和领域文档布局。每个仓库运行一次。
- **[to-spec](./to-spec/SKILL.md)**：将当前对话转为规格说明（spec），发布到 issue tracker。
- **[to-tickets](./to-tickets/SKILL.md)**：将计划、spec 或对话分解为一组 tracer-bullet ticket，每个声明其 blocking edges，可以是本地文件中的文本，也可以是真实 tracker 上的原生 blocking link。
- **[implement](./implement/SKILL.md)**：根据规格说明或工单描述的工作进行实现，在预先商定的 seam 处使用 `/tdd`，提交前以 `/code-review` 收尾。
- **[wayfinder](./wayfinder/SKILL.md)**：将大规模工作（超出单个智能体会话承载范围）规划为 issue tracker 上共享的决策工单地图，逐一解决直到通往目的地的道路清晰。

## Model-invoked

智能体或用户均可调用（具备丰富的触发短语，以便智能体也能主动调用）。

- **[prototype](./prototype/SKILL.md)**：构建一次性原型来回答设计问题：单个可共享的 HTML 文件用于状态/逻辑，或多个可切换的 UI 变体。
- **[diagnosing-bugs](./diagnosing-bugs/SKILL.md)**：诊断循环，用于处理困难 bug 和性能回归：建立从复现、最小化、假设、检测、修复到回归测试的反馈循环。
- **[research](./research/SKILL.md)**：针对高信任度的一级来源调研问题，将发现保存为仓库中带引用的 Markdown 文件，作为后台智能体运行。
- **[tdd](./tdd/SKILL.md)**：测试驱动开发，red-green-refactor 循环。一次一个 vertical slice 构建功能或修复 bug。
- **[domain-modeling](./domain-modeling/SKILL.md)**：主动构建并锐化项目的 domain model，通过挑战术语、场景压测，同步更新 `CONTEXT.md` 和 ADR。
- **[codebase-design](./codebase-design/SKILL.md)**：设计 deep module 的共享 discipline 和词汇：小型 interface、干净的 seam、可通过 interface 测试。
- **[code-review](./code-review/SKILL.md)**：从固定点到 HEAD 的双轴 diff 审查：**Standards**（是否遵循本仓库的编码规范和 Fowler smell 基线？）和 **Spec**（是否忠实实现了原始 issue/spec？），两个轴在并行子智能体中运行。
- **[resolving-merge-conflicts](./resolving-merge-conflicts/SKILL.md)**：逐 hunk 解决正在进行的 git merge 或 rebase conflict，追溯到双方一级来源按意图解决，完成后结束操作，永远不用 `--abort`。
- **[wizard](./wizard/SKILL.md)**：生成交互式 bash wizard，逐步引导人类完成只有他们才能执行的步骤：配置基础设施、设置凭据或 CI secret、导航陌生的第三方 dashboard，或运行一次性迁移或切换。
