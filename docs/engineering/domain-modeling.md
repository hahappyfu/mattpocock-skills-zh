## 它做什么

`domain-modeling` 在你设计时构建和锐化项目的**通用语言**：挑战与词汇表冲突的术语、将模糊用词替换为精确用词、以及用具体场景压力测试关系直到边界精确。

这是**主动** discipline，而非被动的。阅读 `CONTEXT.md` 借用其词汇是任何 skill 都能做的一行习惯；这个 skill 用于你*改变* model 时。这才是它值得中断的原因。它在术语确定的瞬间就将解析后的术语写入 `CONTEXT.md`，在会话中间，而非在最后产出一个整齐的词汇表，因为批量版本只是[会话](https://www.aihero.dev/ai-coding-dictionary/session)的摘要，而内联版本才是会话的实际输出。

## 何时使用

输入 `/domain-modeling`，或者当任务匹配时 agent 自动调用它。在实践中，自动调用是这个 skill 最薄弱的部分：当 `grill-with-docs` 或 `wayfinder` 要求加载它时，[models](https://www.aihero.dev/ai-coding-dictionary/model) 经常加载 `grilling` 而跳过这个。如果一个 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 会话运行结束时 `CONTEXT.md` 没有被修改，那就是发生了这种情况；请与其他 skill 一起按名称调用它。

当*用词*是问题时使用它：

| 情况 | 操作 |
| --- | --- |
| 两个人对"cancellation"有不同理解 | `domain-modeling`：选择规范术语，将其他列在 `_Avoid_` 下 |
| "Account"在三个文件中承担三个职责 | `domain-modeling`：将其拆分为 Customer 和 User |
| 你刚做了一个难以逆转的架构选择 | `domain-modeling`：它提供 ADR，如果选择满足标准 |
| 模块的*形状*是问题：接缝在哪、接口多深 | [codebase-design](https://aihero.dev/skills-codebase-design) |
| 你想在构建前审视整个计划 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，它在底层驱动这个 skill |
| 你想查找一个术语，而非改变它 | 不需要做什么。读 `CONTEXT.md`。它是一个文件。 |

## 前置条件

一开始不需要任何东西。skill 写入两个位置，按需创建：

- **`CONTEXT.md`** 在 repo 根目录，由第一个解析的术语创建。在根目录有 `CONTEXT-MAP.md` 的 repo 中，术语写入 map 指向的各 context 的 `CONTEXT.md`。
- **`docs/adr/`**，由第一个满足标准的 ADR 创建。

开始前不需要任何东西存在，也不会有投机性创建。

## 两个产物，两个标准

词汇表和 ADR 遵循不同的标准，混淆它们是这个 skill 大多数问题的根源。

| | `CONTEXT.md` | `docs/adr/NNNN-slug.md` |
| --- | --- | --- |
| 包含 | 术语。一个东西**是**什么，用一两句话，在 `_Avoid_` 下列出被拒绝的同义词 | 一个决策，用一到三句话：context、选择、原因 |
| 写入标准 | 模糊术语变成了规范术语 | **全部三个条件**：hard to reverse、surprising without context、the result of a real trade-off |
| 写入时机 | 内联，在术语确定时 | 提供，而非假定 |
| 永不包含 | 实现细节、[spec](https://www.aihero.dev/ai-coding-dictionary/spec)、scratch pad、通用编程概念 | 本会话做出的每个决策的日记 |

错过 ADR 的任何一个测试就没有 ADR。一个容易逆转的决策会被逆转；一个不令人惊讶的没人会问；一个没有真正替代方案的只记录了你做了显而易见的事。

`CONTEXT.md` 的规则才是真正要坚守的，因为它是实际使用中会出问题的那个。**它是一个词汇表，仅此而已。** 不加检查的话，模型会将"写入 `CONTEXT.md`"视为持久化你给出的每个答案的许可，文件会变成一个 running spec。这是跨多个模型最常被报告的该 skill 的问题。

## 交叉引用，以及其极限

让 skill 发挥作用的关键：当你陈述某事如何工作时，它检查代码并指出矛盾。*"你的代码取消了整个 Order，但你刚刚说部分取消是可能的，哪个对？"* 语言和代码在任一方被改变之前就达成一致，公开地。

极限值得了解。它交叉引用**代码**和已提交的 `CONTEXT.md`/ADRs，仅此而已。它不搜索你的 issue tracker，所以一个在几个月前关闭的 issue 中被讨论并刻意确定的命名冲突会被当作新问题提出。有一个[开放请求](https://github.com/mattpocock/skills/issues/717)修复这个问题；在此之前，变通方法是将指令放在你自己的 `docs/agents/domain.md` 中，skills 已经会读取它。

## 常见问题

**我的 `CONTEXT.md` 有 500 行。1000 行。3000 行。怎么办？**
大小是症状，而非疾病：文件吸收了本不属于词汇表的实现细节和决策。修复方法是直接指令：`/grill-with-docs make my CONTEXT.md more concise and remove any implementation details from it`。针对臃肿的文件运行它，大部分会消失。只在文件真正精简后仍然覆盖两个读者不想同时理解的 domain 时，才使用 `CONTEXT-MAP.md` 拆分；拆分一个臃肿的文件只会给你几个臃肿的文件。这个 skill 在此方面的指导还不够强以防止增长，相关 issue 仍然开放。

**为什么是 `CONTEXT.md` 而非 `GLOSSARY.md`？**
这是整个 skill set 中争议最大的命名问题，没有定论。反对当前名称的理由充分：如果它是"一个词汇表，仅此而已"，`GLOSSARY.md` 直接说明，正如一位读者所说，"有了 AI agents 一切都是[上下文](https://www.aihero.dev/ai-coding-dictionary/context)"。支持的理由是 map：`CONTEXT-MAP.md` 指向几个 `CONTEXT.md` 文件读起来自然，而 `GLOSSARY-MAP.md` 不自然，且 `context` 是 DDD 中 bounded area 的既定术语。至少有一人维护本地 fork 纯粹为了重命名文件。你也可以这样做，但 skill set 中的其他 skill 都查找 `CONTEXT.md`，所以重命名意味着修补所有这些。

**`/ubiquitous-language` 去哪了？**
它被移除了，但不是被弃用。它的职责移入了 `domain-modeling`，持续维护整个 model 而非从一个会话中导出一个词汇表。词汇表执行变得更有负担，而非更少：它现在在 grilling、triage 和 mapping 底下运行，而非作为你记得要做的单独流程。

**如何为没有词汇表的代码库获取一个？**
显式请求它，而非等待它累积。`/grill-with-docs help me scaffold my existing repo with a CONTEXT.md` 是文档化的方式；预期会有一场漫长访谈：一位用户报告了 50+ 个问题才让文件就位。附带使用在 brownfield repo 上构建词汇表太慢了。

**我能保留 domain model 并使用自己的 ADR 格式吗？**
目前不能干净地做到。词汇表部分和 ADR 部分在一个 skill 中，所以有既定 ADR 约定的团队（不同模板、不同位置、不同命名）会收到与其内部风格冲突的指令。当前选项是将 skill 复制到本地并编辑，或在 repo 自己的 agent docs 中覆盖 ADR 约定。将两者拆分是一个[开放请求](https://github.com/mattpocock/skills/issues/557)。

**词汇表真的物有所值吗？它只是另一个需要审查的产物，而且可能会过时。**
有时确实不值得，值得坦诚面对。DDD 越接近实现就越没用：收益在上游，在命名和概念对齐，而非在 aggregates 和 layer 仪式。同义词控制在命名边界重要：模块名、表名、状态枚举、issue 标题、CLI 命令。在普通散文中重要性小得多。还有一个实际异议：domain terms 压缩了已经共享它们的*人类*之间的通信，而 agent 对纯英文描述的反应相同。从这个角度看，词汇表的价值是让你和审查者与 agent 所做的一致，而非让 agent 更好。对于一天的构建，跳过它。而一个未经审查、agent 创建的词汇表比没有更糟：它变成听起来自信的 lore，后续会话将其视为事实。

**它能帮我把模糊的 prompt 转换成 domain language 吗？**
不能，也没有计划创建这样的 skill。你不理解的 domain language 一旦写下来就变成无意义的废话。这个 skill 在你理解后执行精确；它不制造你没有的词汇。相关陷阱是在不做建模的情况下使用 domain words：正确的名词在错误的概念结构上产出读起来正确但实际不是的输出。

## 达标表现

- 它在你说话中途停下来问你指的是两件事中的哪个，而非选择一个继续。
- `CONTEXT.md` 在会话**过程中**改变，而非在最后爆发式改变。
- 它拒绝为你明天就能撤销的东西写 ADR，并说明三个测试中哪个失败。
- 新条目用一两句话定义一个东西*是*什么，并在 `_Avoid_` 下命名你要放弃的词。
- 当你的代码和句子不一致时，它引用你的代码。
- `CONTEXT.md` 缩短的频率与增长一样多。

## 适用场景

`domain-modeling` 是一个**model-invoked reference**，更常在其他 skill 底下运行而非单独运行。[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 在 grilling 会话中驱动它，[wayfinder](https://aihero.dev/skills-wayfinder) 在绘制地图时加载它，[triage](https://aihero.dev/skills-triage) 用它保持 [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 使用项目自己的术语，[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 在决策具体化时调用它。它最近的兄弟是 [codebase-design](https://aihero.dev/skills-codebase-design)：两者都是其他一切的 vocabulary layer，这个针对*domain*，那个针对模块的*形状*。它也可以直接调用，当你想要这个 discipline 而不承诺参与通常会引入它的 skill 的步骤时。当你不确定哪个 skill 适合时，[ask-matt](https://aihero.dev/skills-ask-matt) 路由你。
