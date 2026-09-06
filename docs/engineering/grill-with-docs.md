## 它做什么

`grill-with-docs` 通过访谈来打磨计划或设计，让[智能体（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)与你达成共识，同时将词汇表和重要决策写入仓库。它运行与 [grill-me](https://aihero.dev/skills-grill-me) 相同的访谈流程（一轮提问、等待、下一轮），但指向代码库。

它是**有状态的（stateful）**。其他 grilling skill 将[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)留在你的记忆里；这个 skill 将文件留在磁盘上。术语一旦确定就立刻写入 `CONTEXT.md`，而不是批量处理。决策通过三道门控后才作为 ADR 落地。这就是全部区别，也是人们使用该 skill 遇到的主要麻烦来源：产出物是真实仓库中的真实文件，所以它们可能在你预期时缺席，也可能在多人编辑时发生漂移。

## 何时使用

输入 `/grill-with-docs` 即可调用；智能体不会主动调用它。

在变更开始时使用，当计划尚不清晰、术语尚未确定时。这是单会话工具。选择哪个 grilling skill 取决于你面临的场景：

| 你的场景 | 使用 |
| --- | --- |
| 你根本没有在工作目录中工作 | [grill-me](https://aihero.dev/skills-grill-me) |
| 一个仓库，一个能在单会话内确定的变更 | `grill-with-docs` |
| 太大无法在一个会话中完成的项目（绿地构建、大型功能） | [wayfinder](https://aihero.dev/skills-wayfinder) |
| 一个没有任何领域文档的仓库，且没有特定功能目标 | `grill-with-docs`，针对仓库而非变更 |
| 一个依赖他人知识才能做出的决策 | [to-questionnaire](https://aihero.dev/skills-to-questionnaire) |

wayfinder 的区别在于会话数：`/grill-with-docs` 用于单会话规划，`/wayfinder` 用于多会话规划。

## 前置条件

该 skill 会写入你的仓库，所以需要在安全的位置运行。确定的术语写入根目录的 `CONTEXT.md` 词汇表，或在根目录存在 `CONTEXT-MAP.md`（标记仓库为多上下文）时写入相关上下文的 `CONTEXT.md`。决策写入 `docs/adr/`。两者都是按需创建的：在第一个术语或决策确定之前什么都不会存在，所以无需预先搭建。

该 skill 还需要另外两个 skill 已安装，因为它的 `SKILL.md` 只有一行并委托给它们：[grilling](https://aihero.dev/skills-grilling) 提供访谈，[domain-modeling](https://aihero.dev/skills-domain-modeling) 提供写入。只安装 `grill-with-docs` 会得到一个无法工作的 skill。

## 纸质记录（paper trail）

会话产出三样东西，但它们的份量不同。

| 确定的内容 | 落地位置 |
| --- | --- |
| 术语：项目对某事物的专属用词 | `CONTEXT.md`，即时内联更新 |
| 难以逆转、没有上下文会感到意外、涉及真正权衡的决策 | `docs/adr/` 下的 ADR |
| 你做出的所有其他决定 | 只在对话中，无其他记录 |

第三行是人们容易忽视的。`CONTEXT.md` 是词汇表，刻意保持纯净：不含实现细节、不含[规格说明（spec）](https://www.aihero.dev/ai-coding-dictionary/spec)、不含临时笔记。ADR 需要同时满足三道门控，所以大多数决策不合格，大多数会话不会产出 ADR。一次会话产出更精炼的词汇表但零 ADR，这是设计预期，但这意味着你达成的大部分共识只存在于达成时的[上下文窗口（context window）](https://www.aihero.dev/ai-coding-dictionary/context-window)中。把对话交给 [to-spec](https://aihero.dev/skills-to-spec) 比直接[清空](https://www.aihero.dev/ai-coding-dictionary/clearing)它更有价值。

词汇表才是重点。通用语言（domain language）才是这个 skill 真正在构建的东西：项目自己的用词，一旦商定，你、智能体和同事就不再反复推导。值得指出的是，不是所有人都认为这能提升智能体表现：最直接的反对意见是，术语与其英文展开在[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)那里得到相同结果，词汇表真正压缩的是人类之间的沟通。这种看法仍然认可词汇表的价值，只是重新定位了价值所在。

## 常见问题

**我该用这个还是 `/wayfinder`？**
范围决定一切。如果能在单个会话内确定，用这个；如果项目太大无法在一个会话中完成，用 [wayfinder](https://aihero.dev/skills-wayfinder)，它先将工作绘制成决策[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)地图。wayfinder 更慢更密集，对范围明确的功能使用它是常见错误。它不替代这个 skill：它可以降级到 grilling 会话中处理地图中适合单会话的部分。

**它运行了，但没有出现 `CONTEXT.md` 和 ADR。**
有两个已知原因。常见原因：没有内容合格。ADR 需要三道门控全部通过，一个关于无新词汇变更的会话确实没什么可写的。真正的 bug：当该 skill 在其他编排层内运行时（spec-driven-development 封装、多智能体框架、作为他人流水线步骤调用的规则），文件写入部分据报会静默失败，而访谈仍然运行。这个问题已记录但未修复。如果你处于这种设置，在信任会话输出前先检查工作目录。

**它一次性问完所有问题，没有建议，也没提到 `CONTEXT.md`。**
这是该 skill 加载其两个依赖失败。因为 `SKILL.md` 是一行委托，智能体如果没有加载 [grilling](https://aihero.dev/skills-grilling) 和 [domain-modeling](https://aihero.dev/skills-domain-modeling)，就会猜测 grilling 是什么含义，你会得到一堆无差别的问题。部分加载是更令人困惑的情况：`grilling` 加载了，`domain-modeling` 没有，你得到一次没有纸质记录的好访谈。这与模型和[工作量（effort）](https://www.aihero.dev/ai-coding-dictionary/effort)级别相关，是该 skill 被报告最多的问题。如果你怀疑是这种情况，直接问智能体加载了哪些 skill。

**我的其他决策去哪了？**
只留在对话中。这是该 skill 最实质的未解决问题：词汇表不是 spec，大多数回答不值得产出 ADR，也没有账本将每个确定的回答关联到 spec、工单和测试。精确的回答（顺序保证、否定需求、数值默认值）在下游被弱化为模糊措辞，结果可能看起来完整但遗漏了你实际决定的东西。目前可用的缓解方法是保留会话并直接将其交给 [to-spec](https://aihero.dev/skills-to-spec)，以及对照你自己的回答重新阅读 spec 而不是假设它已捕获。

**我可以把它指向一个完全没有文档的现有仓库吗？**
可以。对于没有 ADR、没有通用语言、没有设计原则的代码库，这是正确的 skill：调用它并说"帮我记录我的仓库"。社区模式将其与 [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 配对以构建或修复 `CONTEXT.md`。预期需要引导它：它会读取代码并询问你它发现的内容，由你判断代码库中已有的哪些词是正确的。

**会话结束时我该做什么？**
该 skill 的结束语往往较为开放，这是已知的粗糙边缘。在主流程中答案是 [to-spec](https://aihero.dev/skills-to-spec)，在同一会话中进行。如果变更足够小可以直接构建，直接进入 [implement](https://aihero.dev/skills-implement)。

**为什么叫这个名字？**
没人满意这个名字。有一个未解决的建议将其重命名为 `grill-domain-model`，这更诚实地描述了行为。目前没有任何进展。如果重命名最终落地，文档页会随之移动，URL 也会改变。

## 达标表现

- `CONTEXT.md` 在会话过程中*逐步*变化，逐术语更新，而不是在结束时一次性出现。
- 词汇表读起来是纯净词汇（项目自己的用词加精确定义），不含实现细节或类 spec 的措辞。
- 代码库能回答的问题通过读取代码库来回答，而不是问你。
- 你得到很少或零 ADR，得到的那些是你不得不重新争论会恼火的决策。
- 它质疑你使用的一个词，因为你现有的词汇表对其有不同定义。

## 它的位置

`grill-with-docs` 是主构建链的起点：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

它在任何内容被写入 spec 之前：它产出共享理解和确定的词汇表，然后 [to-spec](https://aihero.dev/skills-to-spec) 无需再次访谈你即可综合。它的近邻是 [grill-me](https://aihero.dev/skills-grill-me)（相同访谈但无仓库和文件）和 [domain-modeling](https://aihero.dev/skills-domain-modeling)（它驱动的词汇表和 ADR 纪律）；两者都基于 [grilling](https://aihero.dev/skills-grilling) 原语。在它上游，[wayfinder](https://aihero.dev/skills-wayfinder) 规划太大型的单会话项目，可以将地图的一部分交还给它。当你不确定哪个 skill 或流程适合时，[ask-matt](https://aihero.dev/skills-ask-matt) 帮你路由。
