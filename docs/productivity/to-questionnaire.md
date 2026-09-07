## 它做什么

`to-questionnaire` 把你独自定不了的决策变成一份**问卷**：markdown 文档，交到那个有你缺的东西的人手里，他异步填或你们开会一起过。

它只访谈你**发送内容**，主题从不问。问你主题没意义：找别人写信正因为主题你不懂。所以它问你永远答得上的两件事（发给谁，要带回什么），文档里每道题瞄准两者之间的**缺口**。

## 何时使用

输入 `/to-questionnaire` 即可调用；[智能体（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)不会主动调用它。

决策卡在另一个人脑子里的知识上时用它：客户、领域专家、拿业务规则的老板、不坐一起的团队同事。答案在哪决定用哪个 skill：

| 答案在 | 用这个 |
| --- | --- |
| 你自己没打磨的脑子 | [grill-me](https://aihero.dev/skills-grill-me) |
| 代码库 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 别人的脑子 | `to-questionnaire` |
| 还没在谁脑子里，要个东西摆面前反应 | [prototype](https://aihero.dev/skills-prototype) |

常见是 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 会话卡住：冒出来的东西有些不归你答。同一场对话里跑 `/to-questionnaire` 把那些问题拿离线，带回答案继续。

## 只问发送内容，不问主题

访谈两次交换，到此为止。

- **发给谁？**他的角色、专长、跟你的关系。定语气和文档要带多少语境：外部客户要铺垫，队友不用。
- **要带回什么？**你独自定不了的具体决策或事实。成品文档的验收单：你点名的每项都要有题对着它。

之后全是起草。文件落在当前目录 `to-questionnaire-<slug>.md`。没 setup，没工作区，没配置。

## 文档

定成**发现型问卷**（你缺语境，对方有语境），形状跟着定：

- 开头 `Purpose` 行点名靠它做的决策，加一节短语境，给没进过你脑子的收件人。
- 问题**最重要的先**，主题分组，因为异步可能只有一轮。
- 一题一事，绝不复合，题下留答题桩，可能被误读的题加一行*为什么问这个*。
- 明说可以答"我不知道"：标出的不确定有用，读着像事实的瞎猜没用。
- 结尾兜底：没问到但该我们知道的？

两件刻意不做。它不**分支**：问题是平铺分组列表，不是答 A 跳过 D 的树。它不**多收件人**：一次跑一份文档给一个人。

## 常见问题

**它读我的访谈记录抽问题吗？**
不归它。skill 没摄入阶段：问发送内容，起草。在访谈后好用是因为同一场对话开它，[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)已经在[上下文（context）](https://www.aihero.dev/ai-coding-dictionary/context)里，起草吃得到。新会话开它对访谈一无所知，"要带回什么"等于你重讲主题。

**答案不在一个人脑子里，能按人拆吗？**
不能。第一步要的是*那个*收件人，单数，整篇语气语境按他调。三个人各有一块跑三遍，一人一次。单篇内按专业或角色分流有人要过，发出来的没这个。

**题之间有依赖吗，按前面答案跳节吗？**
没有。依赖题设计过，没发。产出静态文档：主题分组，最重要的先，每题都活。反对意见公允：[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)在没见到真实答案前规划两三题之后的东西规划不好，分支文档要求全题先行全规划。

**收件人也不知道？**
文档让他直说。"我不知道"和半截答案是明要的，标出的不确定胜过瞎猜，因为含糊答案和自信错答案回到你的上下文里长一个样。

**它发出去吗（Slack、issue tracker、邮件）？**
不发。当前目录写 markdown 文件，报路径。投递你：粘进[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)、扔进 Slack 对话串、当邮件附件、共享屏幕现场过。四种都有人手搭过。

**这不就是批量版 `/grill-me`？**
不是，区别值得捏住。`grill-me` 已经按**轮次**问：整个前线一次，下轮按你答案重算，"一次全问"的需求那边满足了。`to-questionnaire` 是另一个轴：不问怎么交卷，问答案在谁脑子里。自己答快点是 `grill-me`，从别人脑子里掏是这个。

**不用 skill 直接让智能体写不行吗？**
行，这个 skill 出来前很多人这么干：`OPEN_QUESTIONS.md` 文件、发客户的表格、一题一"缺信息"工单。skill 卖两件事：访谈不飘到主题上，文档形状非技术收件人真能填。你家有能用的格式，实话是不需要这个。

## 达标表现

- 问收件人、问要带回什么，问完停。问主题的题出现就是 skill 出轨。
- "要带回什么"里每项都能在文件里找到对应的题。
- 题读着是问*对方*会的，不是把你自己的开放问题抄下来。
- 没进过对话的人拿到文件，知道为什么给他、何时回。
- 带回的答案是新一轮访谈的输入，不是新的一堆问题。

## 它的位置

`to-questionnaire` 是随时可用的独立流程。站在你知识的边界，下一步是找人不是找 skill，多数在流程中，规划卡在不归你定的东西上。

邻居是 [grill-me](https://aihero.dev/skills-grill-me)，两者按答案住哪分：访谈挖你，问卷挖别人。带回的是原始材料：喂进新一轮访谈，或工作奔构建就喂 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 或 [to-spec](https://aihero.dev/skills-to-spec)。拿不准当下哪个 skill 合适，[ask-matt](https://aihero.dev/skills-ask-matt) 指路。
