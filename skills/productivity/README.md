# Productivity

日常通用工作流工具，不绑定代码。

## User-invoked

仅在你输入时才可达（Claude Code: `disable-model-invocation: true`；Codex: `policy.allow_implicit_invocation: false`，配置在 `agents/openai.yaml` 中）。

- **[grill-me](./grill-me/SKILL.md)**：对计划或设计持续追问，直到设计树的每条分支都落定。
- **[handoff](./handoff/SKILL.md)**：把当前对话压成一份 handoff 文档，让另一个智能体接手继续。
- **[teach](./teach/SKILL.md)**：多会话教用户新概念，当前目录就是有状态的教学工作区。
- **[to-questionnaire](./to-questionnaire/SKILL.md)**：独自定不了的决策变成 markdown 问卷，交到那个答得上的人手里（异步填，或开会一起过）。
- **[wait-what](./wait-what/SKILL.md)**：哪句话没听懂立刻用它。智能体补上你缺的语境重讲一遍，用大白话，用你 `CONTEXT.md` 的词汇。

## Model-invoked

智能体或用户均可调用（具备丰富的触发短语，以便智能体也能主动调用）。

- **[grilling](./grilling/SKILL.md)**：对计划、决策或想法持续追问，直到设计树的每条分支都落定。
- **[writing-for-agents](./writing-for-agents/SKILL.md)**：写智能体消费的文档：skill、`AGENTS.md` / `CLAUDE.md`、指针够到的任何文档。
