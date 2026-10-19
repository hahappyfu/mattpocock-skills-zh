---
name: handoff
description: 把当前对话压成一份 handoff 文档，交给另一个智能体接手。
argument-hint: "下一次会话用来做什么？"
---

写一份 handoff 文档总结当前对话，让新的智能体能接手。存到用户操作系统的临时目录，不要存进当前工作区。

文档里加一个 "suggested skills" 节，点名下一个智能体该对哪些 skill 调用 Skill 工具。

别的东西（spec、计划、ADR、issue、commit、diff）里已经记下的内容不要重复写。用路径或 URL 引用它们。

敏感信息一律打码，如 API 密钥、密码或个人身份信息。

如果用户传了参数，把它当作下一次会话重点的描述，按此裁剪文档。
