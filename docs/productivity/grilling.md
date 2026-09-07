## 它做什么

`grilling` 是访谈循环，在行动之前给计划、决策或想法上压力测试。它把对象画成一棵**设计树（design tree）**：每个决策分叉出挂在它下面的决策，逐个分支访谈你，直到没有悄悄的假设剩下。

它既不一次问一题，也不一次全问完。每**轮次（round）**问遍整个**前线（frontier）**：所有前置条件已经确定的决策，别的不问。如果两道题里一道依赖另一道，它们绝不同轮；依赖尚未揭晓的答案的问题属于后面的轮次。你的回答确定决策，前线向外推，下一轮问被解开的问题。十三个问题通常分三轮问完，而不是分十三次。

## 何时使用

输入 `/grilling`，或任务合适时[智能体（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)主动调用。它是访谈家族里唯一的模型侧 skill，所以你很少亲手输入它：通常是你输入过的某个 skill 在替你运行它。

亲手输入 `/grilling` 得到的是纯访谈，别的不带。想要更多东西时：

| 你手头的情况 | 用这个 |
| --- | --- |
| 不在工作目录里工作 | [grill-me](https://aihero.dev/skills-grill-me)：同一场[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session），挂在一个智能体永远不会主动触发的名字下 |
| 在工作目录里 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)：同一场会话，边访谈边写 `CONTEXT.md` 和 ADR |
| 一次会话装不下的大工程 | [wayfinder](https://aihero.dev/skills-wayfinder)：它绘制地图，在决策工单里跑访谈 |
| 谈解决不了的问题：东西应该长什么样、摸起来什么感觉 | [prototype](https://aihero.dev/skills-prototype)：先搭一次性版本，再回来 |
| 你自己的 skill 需要一段访谈 | 从里面调用 `/grilling`，别另写一段访谈 |

## 一轮、前线与谁拍板

三个概念撑起整个 skill。

**设计树**是对象的模型：决策挂着决策。**前线**是所有前置条件已确定的决策集合，也就是眼下唯一能诚实问出口的问题。**轮次**是一个前线，问全答全。

一轮里每道题都是固定形状：`❓` 后面是编号和标题，接着正文，然后智能体的推荐答案独占一个 `➡️` 行。这就是一轮能按编号回答（"1 同意，2 选第二个，3 不同意，原因是"）而不必把问题复述一遍的原因。这个格式有一个已知毛边：推荐答案有时*反对*问题本身的提法，这时同意推荐就等于对问题回答"不"。撞上时就答推荐答案，并说明。

另一半设计是事实与决策的分工。事实是 skill 自己的活：当前线问题需要[环境（environment）](https://www.aihero.dev/ai-coding-dictionary/environment)能确定的东西，它派[子智能体（subagent）](https://www.aihero.dev/ai-coding-dictionary/subagent)去查，而不是问你。它不等探索跑完，只有运行中探索下游的问题才等。决策归你，它必须等。跑 `grilling` 的智能体替你做了决策，不是理解灵活，是 skill 跑坏了。会话在前线清空时结束，在你确认达成共识之前它不会行动。

诚实的局限：前线是智能体的判断，不是算出来的图。它可能把两道题放进同一轮，事后才发现一道答案该改变另一道。对此除了告诉它（下一轮重开受影响的分支），没有别的兜底。

## 机制在此，封装在外

本页讲机制。人们最常想要的东西记在上一层。

| 问题 | 在哪回答 |
| --- | --- |
| 树、前线、轮次、问题格式、事实与决策 | 本页 |
| 会话该跑多长、谈解决不了的问题怎么办、怎么避免一路点头 | [grill-me](https://aihero.dev/skills-grill-me) |
| `CONTEXT.md` 写什么、什么变成 ADR | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |

## 常见问题

**能回到一次一问吗？**
能，相当一部分受众就是这么用的。在你的全局 `CLAUDE.md` 里加一行：

```
When grilling, ask one question at a time.
```

按轮提问的默认做法确实有争议。读得慢的、在用第二语言工作的、拿顺序格式当专注脚手架的人都报告一次一问的节奏更适合他们，这个退出选项是被支持的，不是被容忍的。

**`/batch-grill-me` 去哪了？**
合进这个 skill 了。按轮提问曾短暂作为独立 skill 发布，后来搬进 `grilling` 本体，建在它上面的东西（`grill-me`、`grill-with-docs`、`triage`、`wayfinder`）一次全拿到。没有 `batch-grill-me` 可装，也没有独立的顺序 skill，上面那行 `CLAUDE.md` 就是回到一次一问的路。

**整轮一起问，不会漏掉那些靠我前面的回答才能冒出来的问题吗？**
这是对按轮设计最常见的质疑，答案就是前线：一轮里的问题互不依赖，所以本轮任何答案都不可能推翻本轮另一道题。答案仍然重塑下游的一切：下一轮是重新算的，不是预写好的。你失去的东西比"一次全问"听起来小，比零大：见上文前线的局限。

**它问完就开干了。**
确认门控正是为这个设的：前线清空不等于 skill 结束，你说达成共识才结束。偏弱偏快的[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)还是会闯这个门，低投入或非前线模型报得最多，它们把"访谈到达成共识"塌缩成几个问题加一份提纲。如果你的模型这样，在你自己的 `AGENTS.md` 或 `CLAUDE.md` 里写一行告诉智能体未经允许不得实现，可靠管用。

**它替我答了，而不是问我。**
这是某次运行的 bug，不是预期行为，skill 正文里事实与决策分离就是为它写的。另一个 skill 在"解决这张工单"框架里跑 `grilling` 时最常见，周围任务读起来像继续往前走的许可证。同样约束也是没有异步模式（async mode）的原因：有人想要一个读 GitHub issue 发一份合并决策备忘的变体，那是另一个 skill，因为没人回答的访谈产出的是智能体的意见，不是你的。

**能限制问题数量吗？**
不能，上限是刻意不做的。有的计划要三个问题，有的要五十个，固定天花板要么砍掉难例，要么在简单例上显得武断。预期控制方式就是直接用人话指挥：让它收尾，或停下按现状接受计划。会话超长通常是范围太大，把工作拆开逐块访谈。

**我只装了 `grill-me`，什么都没发生。**
`grill-me` 是一行 skill，全文就是"跑一场 `/grilling` 会话"，所以这个 skill 也要装。`grill-with-docs` 同理，它还要 [domain-modeling](https://aihero.dev/skills-domain-modeling)。 全量安装就没这个问题，按需安装就要把原语一起装上。

**`grill-with-docs` 跑了，但没加载 `grilling`。**
真实存在的未修复毛边，跨 [harness](https://www.aihero.dev/ai-coding-dictionary/harness)和模型都有报告：一个 skill 点另一个 skill 的名，不保证那个 skill 真加载，`grill-with-docs` 点了两个名。特征是会话一次全问还不带推荐答案：那是模型在即兴演访谈，不是跑这个。直接问智能体加载了 `grilling` 和 `domain-modeling` 没有，通常能救回来。

## 达标表现

- 一轮以编号列表到来，每道题的推荐答案独占一个 `➡️` 行，整轮能按编号回答。
- 一轮里没有哪道题要先等同轮另一道题答完。
- 后轮问的是首轮问不出来的东西。
- 它去查事实（读文件、派子智能体），而不是问你它自己能查到的东西。
- 后台调研不挡整轮，只有依赖它的题才等。
- 结束时它停下来请你确认达成共识，而不是开干。
- 问题数高企，轮数保持很低。

## 它的位置

`grilling` 是**原语**，不是排进计划的步骤：访谈手法的单一事实来源，放在一处，需要访谈的 skill 都来调用，而不是各发明各的。[grill-me](https://aihero.dev/skills-grill-me) 和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 是它的两扇用户侧前门，`grill-with-docs` 是主构建链的起点，排在 [to-spec](https://aihero.dev/skills-to-spec) 前面。[wayfinder](https://aihero.dev/skills-wayfinder) 用它解决决策工单，[triage](https://aihero.dev/skills-triage) 用它把含糊报告访谈成可干的报告，[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 在你挑出候选 deepening 方向后用它走一遍树。拿不准入口时，[ask-matt](https://aihero.dev/skills-ask-matt) 负责指路。
