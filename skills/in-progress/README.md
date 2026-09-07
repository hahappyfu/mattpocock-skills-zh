# In Progress

试用版。这些 skill 故意公开：拿去试，坏了告诉我。在它们毕业进入稳定分组之前，不会进入插件和顶层 README，没有说明页，随时可能改动或消失，不另行通知。

插件不会给你这些，直接装单个：

```bash
npx skills@latest add mattpocock/skills --skill=<name>
```

- **[loop-me](./loop-me/SKILL.md)**：多会话中拷问自己，把想做的 workflow 写成可实现的 spec，以当前目录为有状态工作区。用户调用。
- **[writing-beats](./writing-beats/SKILL.md)**：把文章塑造成一段节拍之旅，自选冒险式。从起始节拍选起，一次只写那一个节拍，再转向下一个，直到文章自然收束。
- **[writing-fragments](./writing-fragments/SKILL.md)**：访谈式会话，从你身上挖片段（混杂的写作料块），追加到单个文档，作为未来文章的素材。
- **[writing-shape](./writing-shape/SKILL.md)**：拿一个写满素材的 markdown 文件，一段一段塑造成文章，每步都争论格式选择。
- **[claude-handoff](./claude-handoff/SKILL.md)**：把当前对话交接给一个新的后台 agent，它经由 `claude --bg` 传入 handoff 摘要后立即接手。用户调用。
- **[setup-ts-deep-modules](./setup-ts-deep-modules/SKILL.md)**：把 dependency-cruiser 接入 TypeScript 仓库，让每个包都成为 deep module：实现藏在子目录里，只能经由入口文件访问，测试经由入口文件测它。用户调用。
- **[implement-spec](./implement-spec/SKILL.md)**：在单个分支上实现整个 spec。不按清单按任务图推进 ticket，在就绪前线上跑实现者子智能体追求最大并发，最后落成单个 PR。用户调用。
- **[retro](./retro/SKILL.md)**：会话结束后给编码 agent 的环境（转向文件、编码规范、自动化检查、工具）提改进建议。STUB：只有设计笔记，功能尚未实现。用户调用。
