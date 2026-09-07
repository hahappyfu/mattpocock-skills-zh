<p>
  <a href="https://www.aihero.dev/s/skills-newsletter">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://res.cloudinary.com/total-typescript/image/upload/v1777382277/skills-repo-dark_2x.png">
      <source media="(prefers-color-scheme: light)" srcset="https://res.cloudinary.com/total-typescript/image/upload/v1777382277/skill-repo-light_2x.png">
      <img alt="Skills" src="https://res.cloudinary.com/total-typescript/image/upload/v1777382277/skill-repo-light_2x.png" width="369">
    </picture>
  </a>
</p>

# 面向真正工程师的 Skills

[![skills.sh](https://skills.sh/b/mattpocock/skills)](https://skills.sh/mattpocock/skills)

我每天用这些 agent skill 做真正的工程，而不是 vibe coding。

开发真正的应用很难。GSD、BMAD、Spec-Kit 这类方法试图通过接管流程来帮忙，但这样做的同时，它们拿走了你的控制权，还让流程里的 bug 难以解决。

这些 skill 设计得小巧、易调整、可组合，适用于任何 model，背后是几十年的工程经验。随便折腾，把它们变成你自己的。祝使用愉快。

如果你想跟进这些 skill 的更新，以及我将来创建的新 skill，可以和约 60,000 名开发者一起订阅我的 newsletter：

[订阅 Newsletter](https://www.aihero.dev/s/skills-newsletter)

## 安装（30 秒搞定）

两种入口，两种理念。**[Claude Code plugin](https://code.claude.com/docs/en/plugins)** 把整套 skill 装成受管理的只读 bundle，我发布它就更新，所以你是订阅而不是 fork。**[skills.sh](https://skills.sh/mattpocock/skills)** 把可编辑的 skill 文件复制进你的项目，你可以随便改，把它们变成你自己的。只选一个：两个都装会让你每套 skill 各有两份。

### 1. 获取 skills

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugins install mattpocock-skills
```

或者，在会话内部运行：

```
/plugin install mattpocock-skills
```

它已经在 Claude Code 的官方 marketplace 里，所以不需要先添加任何 marketplace，更新会自动送达。

</details>

<details>
<summary><strong>Codex 和其他 agent</strong></summary>

```bash
npx skills@latest add mattpocock/skills
```

挑选你想要的 skill，以及要装到哪些 coding agent 上。**安装程序会让你选择要带走哪些 skill，记得把 `setup-matt-pocock-skills` 选上。**

原生 Codex plugin 已在路线图上（见 [`.agents/adr/0002-ship-as-a-claude-code-plugin.md`](./.agents/adr/0002-ship-as-a-claude-code-plugin.md)）。

</details>

<details>
<summary><strong>给爱折腾的人</strong></summary>

在任何 agent 上用同一个安装程序，包括 Claude Code：

```bash
npx skills@latest add mattpocock/skills
```

它把 skill 以普通文件的形式写进你的 repo，所有权归你，随便改。不会在你背后悄悄更新；想跟进我的最新改动时，用 `npx skills update` 拉取。

</details>

### 2. 运行 `/setup-matt-pocock-skills`

在你的 agent 里，每个 repo 运行一次。它会：

- 问你想用哪个 issue tracker（GitHub、Linear 或本地文件）
- 问你给工单（ticket）做 triage 时打哪些 label（`/triage` 会用到 label）
- 问我们创建的文档存哪里

### 3. 搞定，你可以出发了。

## 为什么需要这些 Skills

我做这些 skill，是想修复我在 Claude Code、Codex 和其他 coding agent 上看到的常见失败模式。

### #1：agent 没按我想要的做

> "没有人确切知道自己想要什么"
>
> David Thomas & Andrew Hunt，[The Pragmatic Programmer](https://www.amazon.co.uk/Pragmatic-Programmer-Anniversary-Journey-Mastery/dp/B0833F1T3V)

**问题**。软件开发中最常见的失败模式是双方没对齐。你以为开发者懂你要什么，等看到做出来的东西，才发现对方完全没理解。

在 AI 时代也一样。你和 agent 之间存在沟通鸿沟。解法就是一轮 **grilling session**：让 agent 围绕你要构建的东西，把你问个底朝天。

**解法**是使用：

- [`/grill-me`](./skills/productivity/grill-me/SKILL.md)：非代码场景用它
- [`/grill-with-docs`](./skills/engineering/grill-with-docs/SKILL.md)：和 [`/grill-me`](./skills/productivity/grill-me/SKILL.md) 一样，但附带更多好东西（见下文）

这是我最受欢迎的 skill。它们帮你在动手前和 agent 对齐，把你要做的改动想透。每次改动前都用它们。

### #2：agent 话太多太啰嗦

> 有了通用语言（ubiquitous language），开发者之间的对话和代码表达都源自同一个 domain model。
>
> Eric Evans，[Domain-Driven-Design](https://www.amazon.co.uk/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215)

**问题**：项目之初，开发者和软件的服务对象（领域专家）往往说着两种语言。

我在用 agent 时感受到同样的张力。agent 通常被直接丢进项目，边做边猜行话，结果 1 个词能说清的事，它要用 20 个词。

对此的**解法**是共享语言。它是一份文档，帮 agent 解码项目里的行话。

<details>
<summary>
示例
</summary>

这是我的 `course-video-manager` repo 里的一份 [`CONTEXT.md`](https://github.com/mattpocock/course-video-manager/blob/076a5a7a182db0fe1e62971dd7a68bcadf010f1c/CONTEXT.md) 示例。哪一句更好读？

- **改前**："当课程某个章节里的一课被标为 real（也就是在文件系统（file system）里占了个位置）时出了问题"
- **改后**："物化级联出了问题"

这种简洁会在一场又一场的会话里持续带来回报。

</details>

这个能力内建在 [`/grill-with-docs`](./skills/engineering/grill-with-docs/SKILL.md) 里。它也是一场 grilling，帮你和 AI 建立共享语言，并把难解释的决策记到 ADR 里。

它的威力很难讲清楚，可能是本仓库最酷的一招。试试就知道了。

> [!TIP]
> 共享语言除了减少啰嗦，还有很多好处：
>
> - **变量、函数和文件的命名保持一致**，用的是共享语言
> - 这样 **agent 在代码库里找路更容易**
> - agent **思考时花的 token 也更少**，因为它手里有更简洁的语言

### #3：代码跑不起来

> "永远走小而审慎的步子。反馈速度就是你的速度上限。永远不要接超出负荷的任务。"
>
> David Thomas & Andrew Hunt，[The Pragmatic Programmer](https://www.amazon.co.uk/Pragmatic-Programmer-Anniversary-Journey-Mastery/dp/B0833F1T3V)

**问题**：假设你和 agent 已经对要构建什么达成了对齐，可 agent 交出来的还是垃圾，怎么办？

该看看你的 feedback loop 了。agent 写出的代码跑起来到底怎么样，如果没有这方面的反馈，它就是在盲飞。

**解法**：你需要常规的一整套 feedback loop：静态类型、浏览器访问和自动化测试。

自动化测试方面，red-green-refactor 循环是关键：agent 先写一个会失败的测试，再把它修好。这样 agent 能持续拿到稳定的反馈，写出的代码好得多。

我做了一个 **[`/tdd`](./skills/engineering/tdd/SKILL.md) skill**，可以装进任何项目。它鼓励 red-green-refactor，并给 agent 讲清楚好测试和坏测试长什么样。

调试方面，我还做了一个 **[`/diagnosing-bugs`](./skills/engineering/diagnosing-bugs/SKILL.md) skill**，把最佳调试实践包进一个守纪律的循环，一步一闸。

### #4：我们造出了一团泥球

> "每天都为系统的设计投入。"
>
> Kent Beck，[Extreme Programming Explained](https://www.amazon.co.uk/Extreme-Programming-Explained-Embrace-Change/dp/0321278658)

> "最好的 module 都是 deep 的。它们让大量功能可以通过一个简单的 interface 访问。"
>
> John Ousterhout，[A Philosophy Of Software Design](https://www.amazon.co.uk/Philosophy-Software-Design-2nd/dp/173210221X)

**问题**：用 agent 造出来的应用大多复杂难改。agent 大幅加速写代码的同时，也加速了软件熵增，代码库以前所未有的速度变复杂。

对此的**解法**是一种全新的 AI 驱动开发思路：关心代码的设计。

这一点内建在这些 skill 的每一层：

- [`/to-spec`](./skills/engineering/to-spec/SKILL.md) 会在生成 spec 之前先问清你要动哪些 module

更关键的是，[`/improve-codebase-architecture`](./skills/engineering/improve-codebase-architecture/SKILL.md) 会扫描代码库找 deepening opportunity 并交给你候选。我建议每隔几天就在代码库上跑一次。它是普查，不是抢救：在年久的代码库上它能找到真候选，但不会替你把泥球解开。

### 小结

软件工程的基本功比以往任何时候都重要。这些 skill 是我把基本功浓缩成可重复实践的一次尽力尝试，愿它们帮你交付职业生涯最好的应用。祝使用愉快。

## 速查

下面按一条轴线划分：谁可以调用它们。**user-invoked** skill 只有你亲手输入时才能触达（比如 `/grill-me`），职责是编排。**model-invoked** skill 你可以调，agent 在任务合适时也会自动取用，它们承载可复用的 discipline。user-invoked skill 可以调用 model-invoked skill，但绝不能调用另一个 user-invoked skill。

### 工程

我每天写代码时用的 skill。

**User-invoked**

- **[ask-matt](./skills/engineering/ask-matt/SKILL.md)**：问当前情况适合哪个 skill 或流程（flow）。本仓库 user-invoked skill 的路由器。
- **[grill-with-docs](./skills/engineering/grill-with-docs/SKILL.md)**：一场 grilling，顺手构建项目的 domain model，打磨术语，并随手更新 `CONTEXT.md` 和 ADR。
- **[triage](./skills/engineering/triage/SKILL.md)**：让 issue 穿过一组 triage 角色组成的状态机（state machine）流转。
- **[improve-codebase-architecture](./skills/engineering/improve-codebase-architecture/SKILL.md)**：扫描代码库找 deepening opportunity，以可视化 HTML report 呈现，再对你选中的那一项访谈到底。
- **[setup-matt-pocock-skills](./skills/engineering/setup-matt-pocock-skills/SKILL.md)**：为 engineering skill 配置本 repo（issue tracker、triage label、领域文档（domain docs）布局）。用其他 engineering skill 之前，每个 repo 跑一次。
- **[to-spec](./skills/engineering/to-spec/SKILL.md)**：把当前对话转成 spec 并发布到 issue tracker。不访谈，只合成你们已经聊过的内容。
- **[to-tickets](./skills/engineering/to-tickets/SKILL.md)**：把任何计划、spec 或对话拆成一组 tracer bullet 工单，每个工单声明自己的阻塞边界（blocking edges），写成本地文件的文本，或真实 tracker 上的原生 blocking link。
- **[implement](./skills/engineering/implement/SKILL.md)**：按 spec 或一组工单构建，在预先商定的（pre-agreed）seam 上驱动 `/tdd`，commit 之前用 `/code-review` 收尾。
- **[wayfinder](./skills/engineering/wayfinder/SKILL.md)**：把单个 agent 会话装不下的大块工作，在 issue tracker 上规划成一张共享的决策工单地图（map），一次解决一张，直到通往目标的路完全清晰。

**Model-invoked**

- **[prototype](./skills/engineering/prototype/SKILL.md)**：用一次性（throwaway）原型（prototype）回答设计问题：状态或逻辑问题给单个可分享的 HTML 文件，UI 问题给几个从同一路由切换的、风格迥异的版本。
- **[diagnosing-bugs](./skills/engineering/diagnosing-bugs/SKILL.md)**：面向难啃的 bug 和性能 regression 的守纪律诊断循环：先建一个对这个 bug 变 red 的 feedback loop，再最小化（minimise）、提假设、instrument、修复、加 regression test。
- **[research](./skills/engineering/research/SKILL.md)**：对照高可信的一级来源（primary source）调查一个问题，把发现（findings）写成带引用的 Markdown 文件存进 repo，以后台 agent 运行。
- **[tdd](./skills/engineering/tdd/SKILL.md)**：带 red-green-refactor 循环的测试驱动开发。一次一个 vertical slice 地构建功能（feature）或修 bug。
- **[domain-modeling](./skills/engineering/domain-modeling/SKILL.md)**：主动构建并打磨项目的 domain model：拿术语表较真每个词，用边界情况（edge case）场景做压力测试，随手更新 `CONTEXT.md` 和 ADR。
- **[codebase-design](./skills/engineering/codebase-design/SKILL.md)**：设计 deep module 的共享 discipline 和词汇表（vocabulary）：小 interface 背后放大量行为（behavior），摆在干净的 seam 上，能穿透那个 interface 测试。
- **[code-review](./skills/engineering/code-review/SKILL.md)**：对自固定点（fixed point）以来 diff 的双轴 review：**Standards 轴（Standards axis）**（是否遵守本 repo 的编码规范（coding standard），外加 Fowler smell 基线（smell baseline）？）和 **Spec 轴（Spec axis）**（是否忠实实现了源头 issue/spec？），由并行的子智能体（sub-agent）执行，互不污染。
- **[resolving-merge-conflicts](./skills/engineering/resolving-merge-conflicts/SKILL.md)**：一个 hunk 一个 hunk 地解决进行中的 git 合并冲突（merge conflict）或变基冲突（rebase conflict），按追溯到双方一级来源的意图解决，然后完成整个操作（绝不 `--abort`）。
- **[wizard](./skills/engineering/wizard/SKILL.md)**：生成一个交互式（interactive）bash wizard，带人走完（walk through）只有人能做的步骤：provisioning 基础设施、配 credential 或 CI secret、走查不熟悉的第三方（third-party）dashboard，或跑一次性的（one-off）migration 或 cutover。

### 效率

通用 workflow 工具，不专属于代码。

**User-invoked**

- **[grill-me](./skills/productivity/grill-me/SKILL.md)**：被穷追不舍地访谈一个计划或设计，直到设计树的每个分支都落定。
- **[handoff](./skills/productivity/handoff/SKILL.md)**：把当前对话压缩成一份 handoff 文档，让另一个 agent 能接手继续。
- **[teach](./skills/productivity/teach/SKILL.md)**：用当前目录做有状态的（stateful）教学工作区，分多次会话教用户一项新 skill 或新概念。
- **[to-questionnaire](./skills/productivity/to-questionnaire/SKILL.md)**：把独自回答不了的决策变成一份 Markdown 问卷，发给唯一能回答的人，对方异步填或会上一起过。它追问的是这次发送（send）本身（发给谁、要回什么），而不是决策主题。
- **[wait-what](./skills/productivity/wait-what/SKILL.md)**：某句话你没听进去，立刻触发它。agent 会补上你缺的上下文（context），用大白话、你的 `CONTEXT.md` 词汇重新讲一遍。

**Model-invoked**

- **[grilling](./skills/productivity/grilling/SKILL.md)**：围绕计划、决策或想法把用户访谈到底，直到设计树的每个分支都落定。是 `grill-me`、`grill-with-docs`、`triage`、`wayfinder` 和 `improve-codebase-architecture` 背后可复用的访谈原语。
- **[writing-for-agents](./skills/productivity/writing-for-agents/SKILL.md)**：给 agent 写文档：skill、AGENTS.md/CLAUDE.md，以及 agent 顺着指针找到的任何文档。
