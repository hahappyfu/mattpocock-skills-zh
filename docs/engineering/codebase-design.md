## 它做什么

`codebase-design` 确定你设计 module 时使用的词汇：**module**、**interface**、**depth**、**seam**、**adapter**、**leverage**、**locality**。它精确定义每个术语，禁止使用松散的替代词（「component」「service」「API」「boundary」），并陈述从这些术语推导出的核心原则。

它是一个参考，不是一个流程。没有循环要运行，没有产出物，没有向你提问的检查点。每个涉及设计的其他 skill 都借用它的词汇；它本身只给你语言然后停下。这是你在调用它之前需要知道的事情，因为一个没有流程和停止规则的 skill，如果你对一个 [session](https://www.aihero.dev/ai-coding-dictionary/session) 说「开始」，它会即兴创造一个。参见下面的问题了解实践中会是什么样。

## 何时使用

输入 `/codebase-design`，或当设计任务匹配时，agent 会自动调用它。

当你已经知道要重新设计哪段代码，需要思考它的形状时使用：seam 放在哪、interface 能缩到多小、一个提取是否值得。它也是你用来解决词汇争论的工具。

有几个 skill 和它相近。你需要哪一个取决于实际问题是什么：

| 问题 | skill |
|---|---|
| 一个 module 的形状：它的 interface、seam、depth | `codebase-design` |
| *领域的词汇*：「account」有三种含义，两个人对「cancellation」的理解不同 | [domain-modeling](https://aihero.dev/skills-domain-modeling) |
| 你还不知道*要重新设计哪个* module | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture)（发现候选的调研） |
| 你想要设计被辩论，而不仅仅是命名 | [grilling](https://aihero.dev/skills-grilling) |
| 有具体的行为要构建，你想要在重构后依然成立的测试 | [tdd](https://aihero.dev/skills-tdd) |

## 词汇

词汇表就是这个 skill。每个术语都相对于其他术语定义，并且每个都带有它所替代的词。

| 术语 | 含义 | 不要说 |
|---|---|---|
| **Module** | 任何有 interface 和实现的事物。刻意保持规模无关：函数、类、包、跨层的 slice。 | unit, component, service |
| **Interface** | 调用者正确使用模块必须知道的一切：类型签名，加上不变量、排序约束、错误模式、必要配置和性能特征。 | API, signature |
| **Depth** | interface 上的 leverage：调用者或测试每学习一个单位的 interface 能锻炼的行为量。**Deep**：大量行为位于小型 interface 之后。**Shallow**：interface 几乎和实现一样复杂。 | 无 |
| **Seam** | Michael Feathers 的术语：可以改变行为而无需在此处编辑代码的地方。它是 interface 的*位置*，放在哪里是独立的决策，与背后放什么分开。 | boundary |
| **Adapter** | 在 seam 处满足 interface 的具体事物。描述*角色*（填补什么槽位），而非实质（里面是什么）。 | 无 |
| **Leverage** | 调用者从 depth 获得的：每学习一个单位的 interface 获得更多能力。 | 无 |
| **Locality** | 维护者从 depth 获得的：变更、bug 和验证集中在一处。修复一次，到处修复。 | 无 |

depth 刻意*不*定义为实现行数与 interface 行数的比率，那是 Ousterhout 自己的定义。那个指标奖励填充实现。我们使用 depth-as-leverage。

## 四个原则

- **depth 是 interface 的属性，不是实现的属性。** deep module 内部可以由小型、可替换的部分组成。只是它们不暴露给调用者。模块可以有**内部 seam**（实现私有，供自身测试使用），也可以在 interface 处有**外部 seam**。
- **删除测试。** 假设删除该模块。如果复杂性消失，它只是透传。如果复杂性在 N 个调用点重新出现，它一直在发挥价值。
- **interface 就是测试表面。** 调用者和测试跨越同一个 seam。如果你想测试 *interface 之外* 的东西，模块形状可能不对。
- **一个 adapter 意味着假设的 seam。两个 adapter 意味着真实的 seam。** 不要切割 seam，除非有东西确实在其上变化。单 adapter 的 seam 只是间接层。

两个支持文件有更多内容，skill 按需读取它们而非预先加载。[DEEPENING.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DEEPENING.md) 将候选的依赖分为四类（进程内、本地可替代、远程但自有、真正外部），因为类别决定了深化后的模块如何在其 seam 上测试。[DESIGN-IT-TWICE.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/codebase-design/DESIGN-IT-TWICE.md) 启动并行 [sub-agent](https://www.aihero.dev/ai-coding-dictionary/subagent)，为同一个 module 生成三种或更多截然不同的 interface，然后按 depth、locality 和 seam 位置进行比较。

## 常见问题

**我如何在 TypeScript 中实际构建一个 deep module？**

这是关于这个 skill 被问得最多的问题，而 skill 并不回答它。它定义了 deep module *是什么*；它没有说如何阻止一个游离的 import 越过 interface。[Issue #458](https://github.com/mattpocock/skills/issues/458) 直言不讳：「假设我们对 interface 满意，它隐藏了细节等等。但我们如何强制执行？我认为没有 lint 或明确的护栏，人类和 LLM 都会随时间让它变乱。」Matt 在那个讨论中的回答是三个选项：用类或 IIFE 包装它并接受类会变得巨大；让它成为 monorepo 中的包并接受 monorepo 工具链；或使用 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) 之类的 linter 禁止绕过 interface 的 import。他另外表示 Effect 是最好的机制，dependency-cruiser 是第二好的。仓库的 `in-progress/` 目录中有一个 `setup-ts-deep-modules` skill，它制定了 `src/packages/<name>/index.ts` 约定，但它是 beta 通道的 skill，没有文档页面，也没有附带 lint 规则。

**我让一个 session 用它，它烧掉了 100k [token](https://www.aihero.dev/ai-coding-dictionary/token) 去重新设计我没要求的东西。**

已知问题，记录为 [issue #449](https://github.com/mattpocock/skills/issues/449)。这个 skill 是 model-invoked 的，描述自己是词汇，但其中没有任何东西能硬性阻止 agent 将其当作可运行的流程。被告知「在 /codebase-design 中继续并驱动未决的决策」时，agent 找到了最具行动导向的内容：`DESIGN-IT-TWICE.md` 中的并行 sub-agent。它重新探索了之前 session 已经映射的代码，问任何问题之前跑了很远。驱动型 skill 所有的护栏（检查点、一次一个问题、不自动推进）这里都没有，因为参考型 skill 不需要。变通方法是命名一个驱动 skill，让这个 skill 处于其下方：`/grill-with-docs`、`/improve-codebase-architecture` 或 `/tdd`，将 `codebase-design` 作为词汇来源。该 issue 仍然 open。

**`design-an-interface` 去哪了？有 `/interface-design` skill 吗？**

`design-an-interface` 被移除并吸收到这个 skill 中。什么都没有丢失：它的「design it twice」技术（并行 sub-agent 生成截然不同的设计，源自 Ousterhout）在这里作为 `DESIGN-IT-TWICE.md` 发布。另外，有多人要求一个专门的 `/interface-design` skill 用于 deep-module/thin-interface 哲学；这个哲学已经在这里了，不计划单独的 skill。如果你是为这两个名字来的，这就是那个页面。

**这不是一个文件结构约定吗，比如文件夹、barrel 文件、feature slice？**

不是，这个 skill 在反复的质疑中坚持了这条线。[Issue #95](https://github.com/mattpocock/skills/issues/95) 提议一个正式化的分形树文件结构作为 deep module 的具体实现；回复是这两者是正交的：「deep module 是关于 interface 的设计和通过严格 interface 访问，无论文件系统长什么样。看起来完全有可能用这种方法拥有 shallow module。」同样的讨论出现在 #458：「我认为你可能把 module 的概念与文件系统联系得太紧密了。文件系统当然可以作为 module 形状的有用提示，但没有必要用文件系统来构建 deep module。」词汇表刻意将 **module** 定义为规模无关的。

**`tdd` 实际使用这个词汇吗？**

现在是了。很长时间以来不是。以前内联在 `tdd` 中的 deep-module 笔记在 v1.0 中被移除，改为使用这个共享 skill，但替换它们的指针从未添加，所以 `tdd` 自己定义了「seam」，不引用任何东西。差距已关闭：指针现在在 skill 中，当 interface 形状是开放问题而非测试时会被触发。`tdd` 仍然拥有「seam」作为你*测试*的边界；这个 skill 拥有它背后的 module 形状。

**design-it-twice 模式在 Claude Code 之外有效吗？**

不是完全有效。`DESIGN-IT-TWICE.md` 说「使用 Agent tool 并行启动 3+ 个 sub-agent」，这是 Claude Code 的 [tool](https://www.aihero.dev/ai-coding-dictionary/tool)，用 Claude Code 的命名。仓库为其他 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 发布元数据，包括 Codex，那些可能没有同名功能，所以并行设计阶段不如 skill 元数据显示的那样可移植。在 [issue #564](https://github.com/mattpocock/skills/issues/564) 中跟踪，仍然 open。

**我能往词汇表里加自己的概念吗，比如 connascence、module secrets、[progressive disclosure](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure)？**

有人正好提议过这些。[Issue #180](https://github.com/mattpocock/skills/issues/180) 增加了 Parnas 的 module secrets 和 Page-Jones 的 connascence 作为命名层，用于描述*什么*在 seam 上泄漏，附有可运行的 diff；[issue #303](https://github.com/mattpocock/skills/issues/303) 提议在实现内部使用 progressive disclosure，使一个在公共 interface 处是 deep 的 module 在下面不是一个无差别的整体。两者都是 open 且未合并。发布时的词汇表刻意保持精简，保持精简的原因在 skill 本身中说明：统一的语言是全部目的，一个没人一致使用的术语比没有术语更糟。

## 达标表现

- 设计对话停止产生「component」「service」和「boundary」，开始产生「module」「interface」和「seam」。
- 有人能指着一个提议的提取说它是否通过删除测试，不需要含糊。
- 一个提议的 seam 伴随第二个 adapter 被命名，而不仅仅是第一个。
- interface 的讨论覆盖不变量、排序和错误模式，而不仅仅是类型签名。
- 调用它不会启动一个 session。如果 agent 仅凭 `/codebase-design` 就开始读取文件并提议重构，它把参考误解为驱动者。

## 它的位置

`codebase-design` 是一个**随处可取的独立 skill**，是工程 skill 下面的词汇层，而不是任何链路中的一步。它最近的邻居是 [domain-modeling](https://aihero.dev/skills-domain-modeling)，是*问题领域* 词汇的平行参考，而非 module 的形状。两者通常都需要，因为命名一个好的 deep module 需要两者。[improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 是另一个：它调研代码库寻找深化候选，并用这个词汇表写下每一个，所以它发现 module，而这个 skill 是你设计它的平台。当你不确定哪个 skill 或流程适合时，[ask-matt](https://aihero.dev/skills-ask-matt) 帮你路由。
