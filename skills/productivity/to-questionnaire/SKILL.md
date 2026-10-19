---
name: to-questionnaire
description: 把你独自答不全的决策变成问卷，交给别人填。
---

把用户独自搞不定的事变成一份**问卷（questionnaire）**：markdown 文档，交到一个人手里异步填，或开会一起填。对方手里有用户缺的知识，问卷负责掏出来。

**只访谈发送内容，不访谈主题。**只问用户_发送内容（send）_，这个他永远答得上：发给谁，要带回什么。文档里的问题瞄准**缺口**：对方知道的与用户要的之间差的那块。


1. **发给谁？**一次问清对方的角色、专长和跟用户的关系。定下问卷的语气和要带多少语境。知道对方是谁、他会什么用户不会，算完。

2. **要带回什么？**一次问清用户独自定不了、要这个人给的具体决策或事实。拿到用户走开时能干能定的具体清单，算完。

3. **写问卷。**按下面文档结构，起草瞄准第 1 到 2 步那个缺口的问题。写到当前目录的 `to-questionnaire-<slug>.md`（slug 取自主题），汇报路径。文件存在、第 2 步点名的每项都有题覆盖，算完。

## 文档结构

把文档定成**发现型问卷（discovery questionnaire）**：用户缺语境，对方有语境。问题按重要性排序，异步可能只有一轮，题目一多就按主题挂 `##` 标题下分组。按下面模板写。

<questionnaire-template>

# <Questionnaire title>

**Purpose:** why this questionnaire exists and the decision riding on it.

**From:** <the user>, **To:** <the recipient>, **How your answers will be used:** <where they go>

## Context

One paragraph orienting a recipient who wasn't in the user's head. Enough to answer well, not a page.

## How to answer

Deadline and rough effort. Partial answers and "I don't know" are useful: flag anything you're unsure of rather than skipping it.

## <Theme heading>

One `##` section per theme. Under each, its questions, most-important-first. Every question is one idea, never compound, with an answer stub directly beneath, and a one-line _why this matters_ only where the question could be misread or invite a throwaway answer.

<question-example>
### What load is the system expected to handle at launch?

_Why this matters: it decides whether we provision for burst traffic now or defer it._

>
</question-example>

## Anything else?

A closing catch-all: anything we didn't ask that we should know?

</questionnaire-template>
