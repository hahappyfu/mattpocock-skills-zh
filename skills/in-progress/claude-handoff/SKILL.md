---
name: claude-handoff
description: 将当前对话交接给一个新的后台 agent，由它立即接手工作。
argument-hint: "下个会话用来做什么？"
disable-model-invocation: true
---

为当前对话写一份 handoff（交接）摘要，让新的 agent 能继续工作。不要存盘，而是启动一个以后台方式运行的 agent，把摘要作为它的 prompt 传入：`claude --bg --name "<descriptive name>" "<handoff summary>"`。它在当前工作目录启动并立即返回，用户用 `claude agents` 管理它。

始终传递 `-n`/`--name` 并配一个描述性名称（例如 `--name "Fix login bug"`），它会作为任务列表、会话选择器和终端标题中显示的显示名。

在摘要中包含一节"推荐 skill"，写明下一个 agent 应该调用 Skill 工具获取哪些 skill。

不要重复其他产物（spec、计划、ADR、issue、commit、diff）中已有的内容，用路径或 URL 引用它们即可。

脱敏所有敏感信息，例如 API 密钥、密码或个人身份信息，因为摘要会成为该 agent 的 prompt。

如果用户传入了参数，把它当作下个会话聚焦内容的描述，并据此调整摘要。
