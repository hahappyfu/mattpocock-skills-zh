---
name: to-spec
description: "将当前对话转为规格说明（spec），发布到项目 issue tracker：不访谈，只综合已讨论内容。"
disable-model-invocation: true
---

本技能接收当前对话上下文和代码库理解，生成一份规格说明（spec）。不要访谈用户，只综合你已知的内容。

issue tracker 和 triage label 词汇表应该已经提供给你。如果没有，提示用户运行 `/setup-matt-pocock-skills`。

## Process

1. 探索仓库，了解代码库的当前状态（如果尚未完成）。在整个规格说明中使用项目的领域语言词汇表，并遵循你触及区域的任何 ADR。

2. 勾勒你将测试功能的接缝（seam）。应优先使用已有接缝而非新建。使用尽可能高的接缝。如果需要新接缝，提议尽可能高的位置。代码库中的接缝越少越好，理想数量是一个。

与用户确认这些接缝符合他们的预期。

3. 使用下方模板编写规格说明，然后发布到项目 issue tracker。应用 `ready-for-agent` triage label，无需额外 triage。

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>
