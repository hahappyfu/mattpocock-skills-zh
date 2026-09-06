## 它做什么

`ask-matt` 是本仓库 skill 的路由器。你描述你所处的场景（一个无法开始的想法、一堆传入的 bug 报告、一个运行时间过长的[会话](https://www.aihero.dev/ai-coding-dictionary/session)），它会命名适合的 skill 或 skill 序列，以及该序列中人类决策的位置。

它推荐然后停止。它不进行访谈、不写[规格说明](https://www.aihero.dev/ai-coding-dictionary/spec)、不打开文件或不启动它刚命名的 skill；你得到的是下一步要输入的内容，然后你输入它。它也是本仓库 skill 的手绘地图，而不是对你已安装内容的扫描，所以它不会路由到你自己的 skill 或其他作者的 skill。

## 何时使用

你通过输入 `/ask-matt` 调用它；智能体不会自动调用它。

| 你的场景 | 路由器返回什么 |
| --- | --- |
| 一个想法，但不知道从哪里开始 | 主流程的头部，以及构建是否足够小以跳过规格说明 |
| 来自其他人的 bug 和请求 | [triage](https://aihero.dev/skills-triage) 入口流程，以及为什么你自己生成的[工单](https://www.aihero.dev/ai-coding-dictionary/ticket)不属于它 |
| 两个看起来可互换的 skill | 它们之间的界限，通常是一个具体的测试而不是品味问题。[grill-me](https://aihero.dev/skills-grill-me) 或 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 取决于你是否在工作目录中；[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 或 [wayfinder](https://aihero.dev/skills-wayfinder) 取决于工作是否适合一个会话 |
| 一个长会话和关于[上下文](https://www.aihero.dev/ai-coding-dictionary/context)的决策 | 在阶段边界处五个选项的有序决策树 |
| 你已经选择了一个 skill | 没有用处。直接调用该 skill。 |

## 前置条件

路由器命名 skill；它不安装它们。它指向的所有内容都必须已安装，建议才能可操作，并且它只知道本仓库中推广的 skill。

依赖跟踪器的路由（triage、`to-spec`、`to-tickets`、`implement`）假设 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 已经在仓库中配置了 issue 跟踪器。路由器会在那之前愉快地推荐它们。

## 流程，而不是 skill

这个 skill 给你思考的词是**流程（flow）**：一个*贯穿* skill 的路径，而不是单个 skill。命名你的场景将你置于流程的某个步骤，这与“这是匹配你关键词的 skill”是不同的答案。存在四种路由，skill 本身完整地携带它们：

- **主流程**，从想法到交付。访谈、规格说明、工单、实现、审查，内部有两个分支：当问题需要可运行的代码来解决时的原型绕道，以及规格说明和工单拆分，只有当构建跨越多个会话时才值得付出成本。
- **入口流程**，适用于产生工作然后汇入主流程的场景：传入的 bug 报告、某些东西坏了，或太大、太模糊无法在一个会话中持有的工作。
- **独立流程**，脱离所有流程，根据自身情况使用：原型、问卷、你已经陷入的合并冲突。
- **底层词汇层**，其他 skill 拉入的两个参考，当词汇（而不是流程）是问题时使用。

## 阶段边界

它交给你的另一个概念是**阶段边界（phase boundary）**。阶段是会话内的一块工作（[访谈](https://www.aihero.dev/ai-coding-dictionary/grilling)、实现、QA），两个阶段之间的边界是问题“我该如何处理这个上下文？”的唯一归属地。阶段中途没有决定要做：继续，或将其余的拆分为[子智能体](https://www.aihero.dev/ai-coding-dictionary/subagent)。

| 选项 | 何时选择 |
| --- | --- |
| **继续（Continue）** | 下一阶段想要本阶段逐字重复，或者你有[智能区](https://www.aihero.dev/ai-coding-dictionary/smart-zone)剩余。这是唯一保持会话为[一级来源](https://www.aihero.dev/ai-coding-dictionary/primary-source)的动作，所以首先排除它 |
| **`/clear`** | 你身后的一切都是可丢弃的。棋盘上最便宜的动作，如果你错了，代价是单向的 |
| **[handoff](https://aihero.dev/skills-handoff)** | 有东西必须移动：一个新的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness)、一个新目录、一个同事、一个阶段中途分叉的副任务 |
| **子智能体（Subagent）** | 任务的范围足够紧密，可以在你[离开键盘](https://www.aihero.dev/ai-coding-dictionary/afk)时运行 |
| **`/compact`** | 以上都不是。默认选项，而且经常落地于此 |

其中两个经常被弄错，这就是为什么路由器携带顺序而不是列表。`/handoff` 读起来像窗口之间的通用桥梁，但事实并非如此：可移植性是它带来的全部。`/compact` 位于树的底部而不是首先选择，因为它上面的四个问题都更便宜或更精确。

## 常见问题

**难道没有一个按正确顺序排列的 skill 列表吗？**

人们一直在 README 中要求一个。这个 skill 就是那个列表：这是它存在的原因。静态表格会说 `wayfinder → to-spec → to-tickets → implement → code-review`，对大多数场景都是错误的，因为有趣的部分是分支：是否有代码库、构建是否跨越会话、这个问题是否可以通过对话解决。诚实的成本是路由器是手工维护的，并且落后于仓库。`/grilling` 和 `/resolving-merge-conflicts` 都在路由器命名它们之前很久就发布了。

**它告诉我一半的 skill 没有安装。**

一个已知的 bug，尚未修复。路由器路由你经过的大多数 skill 设置了 `disable-model-invocation: true`，这意味着 harness 将它们排除在注入到智能体上下文中的 skill 列表之外。智能体将该列表视为详尽的，并报告它们缺失。一个报告的会话中，它宣布整个规格说明和工单流程缺失，并重新路由到裸 `/grilling` 和 `/tdd`。插件的 22 个 skill 中有 13 个携带该标志，所以这是常见情况，而不是边缘情况。它们已安装。无论如何输入斜杠命令，或者检查 `.claude-plugin/plugin.json`，它是存在什么的权威。

**它描述了某个 skill 的行为，但该 skill 并不这样做。**

同样真实，同样未修复。路由器从它自己对每个 skill 的单行摘要回答，而不是从 skill 本身。一个详细的报告跟踪了一次会话中的三个实例，包括根据“将线程转化为规格说明”的简短描述而跳过 [to-spec](https://aihero.dev/skills-to-spec) 的建议：`to-spec/SKILL.md` 从未被打开。在每种情况下，它只在用户反对后才验证，从不主动进行。在那里跳过 `to-spec` 代价是一个真实的接缝检查，产生的工单低估了工作量。当路由器断言关于另一个 skill 的关键内容时，要求它先打开该 `SKILL.md`。同样适用于地图根本不涵盖的问题，例如是否使用[计划模式](https://www.aihero.dev/ai-coding-dictionary/agent-mode)：那个答案是[模型](https://www.aihero.dev/ai-coding-dictionary/model)的推断，而不是这里写的东西。

**为什么它是散文而不是编号清单？**

一个合理的投诉，作为一个开放的 issue 提出，认为大多数路由是确定性的，叙述使其难以扫描。没有什么能阻止你要求压缩形式：“只给我序列”会得到序列。散文承载的是条件部分：分支、需要人类决策的地方、以及在步骤之间清空或压缩的地方。扁平清单恰恰丢掉了这些。

**它能路由到我自己的 skill 或其他作者的 skill 吗？**

不能。三个独立的提案要求一个路由器读取你本地的 `skills/` 目录，并从已安装的内容中推荐。`ask-matt` 不是那个。它是一组地图，手工维护，它对你编写或从其他地方安装的 skill 一无所知。

**它让我编辑 SKILL.md。**

这个建议通常是正确的，但很少持久。有人问它如何让 [implement](https://aihero.dev/skills-implement) 关闭工单，被告知向 skill 添加一行，然后立即发现问题：`npx skills update` 会覆盖该文件，并且插件安装是只读的。将固定行为放在你自己的 `CLAUDE.md` 或 `AGENTS.md` 中，或者在调用中说出来。提示级别的适应可以存活更新：将流程指向 Linear 而不是 GitHub，或者询问哪些开放的工单可以并行运行，都是人们这样做的事情。

**它命名了一个我没有的 skill，或者遗漏了我有的一个。**

在假设它已消失之前，检查 changelog 是否有重命名。`writing-great-skills` 成为 [writing-for-agents](https://aihero.dev/skills-writing-for-agents)，没有别名，`to-prd` 成为 [to-spec](https://aihero.dev/skills-to-spec)，`pathfinder` 成为 [wayfinder](https://aihero.dev/skills-wayfinder)。四个 skill 被完全退役到吸收它们的 skill 中：`ubiquitous-language`、`design-an-interface`、`qa` 和 `request-refactor-plan`。相反的情况是路由器自己的滞后，如上所述。

## 达标表现

- 它以命名要输入的内容结束并停止，而不是自己开始工作。
- 它返回的路由提到在哪里清空或压缩上下文以及你期望在哪里审查，而不仅仅是一个 skill 名称列表。
- 当两个 skill 接近时，它说明是哪一个以及为什么另一个不适合你。
- 它关于另一个 skill 行为的任何主张都显示在它读取该 skill 的 `SKILL.md` 的跟踪中。
- 你在它返回的内容中认出你自己的场景，而不是最近的通用场景。

## 它的位置

`ask-matt` 是一个**独立路由器**，位于整个集合之上。它永远不是链中的一个步骤；它指向每个链，它是其他文档页面链接回来的节点，这样它们都不必重绘图表。从这里你最常落在 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，主流程的头部，或 [triage](https://aihero.dev/skills-triage)，传入工作的入口流程。

它是它所描述的 skill 的[二级来源](https://www.aihero.dev/ai-coding-dictionary/secondary-source)。当路由器和 `SKILL.md` 不一致时，`SKILL.md` 是正确的。
