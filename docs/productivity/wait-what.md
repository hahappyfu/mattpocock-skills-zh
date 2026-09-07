## 它做什么

`wait-what` 是你没听懂时输入的东西。[智能体（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)把刚说的重讲一遍，补上你缺的语境，用大白话写，用项目 `CONTEXT.md` 的词汇。

skill 全文三行。这是设计，不是没写完。跟啰嗦死磕的 skill 败在膨胀：四百行的简洁 skill 照样挡不住[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)啰嗦，因为模型读的是体量，不是恳求。这个只带一枚精确引导词，别的没有。

## 何时使用

输入 `/wait-what` 即可调用。智能体不会主动调用，也不该。只有你知道自己什么时候跟丢了。

发现自己在扫读那一秒就用。智能体开始讲自创黑话、叠五个缩写、讲个你没见过前提的决策。它修你所在的对话。想让黑话根本不出现，用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，它提前建共享语言。

## 名字就是机制

引导词是 **wait**。"Be concise" 是对智能体输出的指令，模型听完砍字，丢你丢得更远。**Wait** 讲的是*你*的状态。这话是说理解在这里断了。听见"be brief"的智能体写电报，听见"等等，你把我说丢了"的智能体退回去讲。

这就是 skill 全部。治啰嗦的流行招数全点*输出*的名：`/tldr`、`/no-fluff`、`/talk-normal`。模型矫枉过正，掉进洞穴人语域，又短又没更清楚。点*听众*的名两半都要：字少些，缺的语境也补上。

skill 说重讲 **that**，不说"上一条消息"。丢你的东西通常比一段大，退多远智能体定。

## 它接进你已有的语言

正文复用你的全局 `CLAUDE.md` 和项目 `CONTEXT.md` 里已有的引导词。ASD-STE100 简化技术英语定语域。通用语言给名词。skill、`CLAUDE.md`、`CONTEXT.md` 摸的是同一批[词元（token）](https://www.aihero.dev/ai-coding-dictionary/token)，调用它不是新指令，是提醒智能体一条答应过的。

没 `CONTEXT.md`（也没有 `CONTEXT-MAP.md` 指到当下语境的那份）照样能用，丢的只是领域词汇那半。

## 达标表现

- 重讲**又短又清楚**，不是又短又愣。
- 补上你缺的前提，不止删字。
- 项目名词替掉自创词。`CONTEXT.md` 的词回来。
- 连用两次不退化成惜字。

## 它的位置

`wait-what` 随时随地任何对话任何 skill 里用。它修一条消息的事后。治本是提前约好的共享语言，那是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)：一场跑 [domain-modeling](https://aihero.dev/skills-domain-modeling) 的 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 会话，你们共用的词落进 `CONTEXT.md`。拿不准当下哪个 skill 合适，[ask-matt](https://aihero.dev/skills-ask-matt) 指路。
