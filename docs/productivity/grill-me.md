## 它做什么

`grill-me` 把一个**粗糙想法**吃进来，访谈你直到你能对它拍板。开始时不需要成形计划，产出一份成形计划正是[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)的任务。它按**轮次（round）**提问，每轮问遍整个**前线（frontier）**（所有前置条件已经确定的问题），所以你永远不会被问到依赖尚未听到的答案的问题。

它是**无状态的（stateless）**。它不写文件，不留工作区。它留下的唯一东西，是你自己脑子里更锋利的想法。

## 何时使用

输入 `/grill-me` 即可调用；[智能体（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)不会主动调用它。在**全新对话**中开始，不要把它叠加在一个已经让智能体写好计划的对话上。

只要有个值得认真对待的想法就用它（功能、产品方向、商业决策、一篇写作），远在你搞清它涉及什么之前。含糊不是等待的理由，含糊正是会话要吃掉的东西。如果你已经能精确描述那件事，你就不需要访谈它。

三个 grilling skill 用哪个，取决于你面前有什么：

- **任何事、任何地方**：`grill-me`。不需要仓库，不写文件，主题也不必是代码。
- **有个要对齐的代码库**：[grill-with-docs](https://aihero.dev/skills-grill-with-docs)。同样的访谈，但是[有状态的（stateful）](https://www.aihero.dev/ai-coding-dictionary/stateful)：它读你的代码，把学到的东西记在 `CONTEXT.md` 和 ADR 里。
- **一次会话装不下**：[wayfinder](https://aihero.dev/skills-wayfinder)。它把工作绘制成地图，在地图里跑 grilling 会话。

关掉[计划模式（plan mode）](https://www.aihero.dev/ai-coding-dictionary/agent-mode)。计划模式催促智能体直奔产出计划，与保持追问正好相反。

## 这是对话，不是审问

问题由 skill 来问，但**范围归你**。这是人们最容易错过的部分，也是把想法变成决策的会话与产出自信废话的会话之间的区别。

失败模式是**被动**：四十个问题一路回答"同意、同意、同意"，最后拿着一份智能体写、你点头的计划出来。感觉很高效，因为很长。其实什么都没决定，结果带着它没挣到的确定性。

主动意味着引导。对颗粒度不够的问题反驳。当范围漂移时说出来。回答"我不知道"，并且是真的不知道。这个 skill 是辅助工程师的，不是替代工程师的：产出质量取决于你的回答质量，不取决于问题数量。

反向错误真实存在但更少见：在访谈里待太久，永远到不了代码。

## 能访谈的与访谈不动的

有些问题靠谈能谈出来。有些不能，再怎么访谈也谈不出来。

"一个长表单还是三个页面？"和"这个交互应该是什么感觉？"都**访谈不动**：它们需要有个东西摆在面前让你反应。撞上这种问题就停下访谈。用 [prototype](https://aihero.dev/skills-prototype) 搭个一次性版本，看一眼，回来用一句话回答。

靠谈硬啃访谈不动的问题，会话就会膨胀。智能体不断换说法，你不断猜，范围膨胀到填满不确定性。

## 达标表现

- 你提出过反对。一个你全程没有反驳的会话，就是你不需要的会话。
- 问题分几轮到来，而不是一次一问地滴漏，后轮明显建立在你前面说的话上。
- 你走到了出发时没想到的地方，因为某个问题挖出了你一直在默认做的决策。
- 结束时，你能向一个不在场的人捍卫每个选择。

## 常见问题

**我该预期多少问题，怎么知道何时结束？**
数轮次，不数问题。四轮四十六个问题是普通会话。当作前线清空时结束：每个分支都走过，没有悄悄的假设剩下。

**它问了我两百个问题。哪里出错了？**
通常是范围太大。先让智能体把工作拆成小块，再逐块访谈。超长会话还会滑进**迟钝区（dumb zone）**，这时[上下文窗口（context window）](https://www.aihero.dev/ai-coding-dictionary/context-window)满到问题质量下降。

**能回到一次一问吗？**
能。在你的全局 `CLAUDE.md` 里加一行：

```
When grilling, ask one question at a time.
```

**如果我是真的不知道答案？**
直说。"我不知道"是真实回答，一道你答不上来的问题通常意味着该去搭原型，而不是靠猜。

**写规格说明前要开新会话吗？**
不要。这场会话的价值就是你刚建好的[上下文（context）](https://www.aihero.dev/ai-coding-dictionary/context)。把同一场对话直接交给 [to-spec](https://aihero.dev/skills-to-spec)。

**模型有讲究吗？**
比大多数 skill 都讲究。访谈依赖[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)自己对系统会怎么坏的判断，所以给它你最好的模型。实现主要跟着上下文走，用便宜模型也能容忍。

## 它的位置

`grill-me` 是**走到哪都能跑的独立流程**，可以对任何事用。无状态正是它便携的原因：没有仓库，没有工作区，没有前置设置，甚至不假设想法跟软件有关。人们拿它对准商业决策、写作、下一步做什么：任何在脑子里待不住的东西。

便携是它与 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 的全部区别，后者跑同样的访谈，但读代码库做对齐，把学到的记成 `CONTEXT.md` 和 ADR。两者都站在 [grilling](https://aihero.dev/skills-grilling) 原语上；`grill-me` 是两扇用户侧前门里两手空空的那扇。

如果访谈完发现这事确实是软件，把同一场对话交给 [to-spec](https://aihero.dev/skills-to-spec)，继续走构建流程（可选，不是这个 skill 的本职）。拿不准哪条流程合适时，[ask-matt](https://aihero.dev/skills-ask-matt) 负责指路。
