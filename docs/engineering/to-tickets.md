## 它做什么

`to-tickets` 接收一个计划、一份 [spec](https://www.aihero.dev/ai-coding-dictionary/spec) 或你当前的对话，将其分解为一组 **[ticket](https://www.aihero.dev/ai-coding-dictionary/ticket)** 发布到你的 issue tracker。每个 ticket 声明其 **blocking edges**：必须在其开始之前完成的其他 ticket。

每个 ticket 都是一个 **tracer bullet**：一条狭窄但完整的路径，贯穿变更的每一层（schema、API、UI、tests），一旦落地就可以独立演示。这个约束让它表现得不同于显而易见的拆分方式，即一次切一层并在最后集成。它还将每个 ticket 的大小调整为适合单个新的 [context window](https://www.aihero.dev/ai-coding-dictionary/context-window)，因为拿起 ticket 的是一个从未见过你的 spec 的 [session](https://www.aihero.dev/ai-coding-dictionary/session)。

## 何时使用

你通过输入 `/to-tickets` 来调用它；[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行调用它。

| 你的场景 | 去哪 |
| --- | --- |
| 你有一份 spec issue 且构建跨越多个会话 | `/to-tickets`，或 `/to-tickets #<spec_issue>` |
| 计划只在对话中，从未写成文档 | `/to-tickets` 直接读取线程，无需 spec |
| 整个变更适合一个上下文窗口 | [implement](https://aihero.dev/skills-implement)，跳过 tickets |
| 尚未做任何决定 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，然后 [to-spec](https://aihero.dev/skills-to-spec) |
| [wayfinder](https://aihero.dev/skills-wayfinder) 地图已通过 | 先 [to-spec](https://aihero.dev/skills-to-spec) 坍缩地图，然后 `/to-tickets` |

`to-tickets` 产出的 ticket 构造上就适合 agent 使用。不要在它们上面运行 [triage](https://aihero.dev/skills-triage)。triage 用于来自其他人的工作。

## 前置条件

`to-tickets` 发布到 tracker，所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须已经为这个仓库配置了 tracker 和 triage-label 词汇表。两种都支持：真实的 tracker 如 GitHub 或 Linear，或本地 markdown 文件在 `.scratch/` 下，后者开箱即用。

## Tracer bullet，不是层

**横向**切分（horizontal slice）只交付变更的一层。在每一层落地之前什么都不工作，每个 ticket 的验收标准必须触及另一个 ticket 拥有的工作。**纵向**切分（vertical slice）即 tracer bullet 一次交付所有层的一条细路径，因此它可以独立验证，并且拥有它评估的所有内容。

这是人们最常打破的规则，后果有据可查。一个团队运行了 26 个按层切分（语料库、生产者、聚合器、选择器）的 ticket 堆栈，每个关闭的 ticket 大约需要二十次 agent 运行，其中约四分之三是返工。他们自己的事后分析将每一类失败追溯到横向切分，而非实现本身。

在发布任何内容之前会发生两件事。`to-tickets` 寻找预重构（prefactoring）（"先让变更容易，再做容易的变更"这一原则），并将该工作排在前面。然后它将分解方案呈现为编号列表，并对你进行测试：粒度是否合适、blocking edges 是否真实、是否应该合并或拆分。在你批准之前不会有任何内容到达 tracker，而那个测试就是你提出异议的地方。

## Blocking edges

edges 是这个产物的关键。它们根据 tracker 有两种阅读方式：

| Tracker | edges 所在位置 | 如何工作 |
| --- | --- | --- |
| 本地 markdown | 每个 ticket 一个文件，文本在 `.scratch/<feature>/issues/<NN>-<slug>.md` 中，按阻塞优先编号 | 从上到下，手动 |
| 真实 tracker（GitHub、Linear） | 原生 blocking link，或 tracker 支持时的 sub-issue | 任何阻塞项已完成的 ticket 都在**前线（frontier）**上，可以被抓取 |

edges 在两种情况下都存在于 ticket 中。介质只决定是否可以并行处理它们。`to-tickets` 产出产物；运行它（一次一个 session，或一组）是你的工作，不是技能的工作。

## 宽重构例外

一种形态打破了 tracer bullet 规则。**宽重构（wide refactor）**是一个单一的机械变更（重命名列、重新类型化共享符号），其**爆炸半径（blast radius）**横跨整个代码库，因此一次编辑会破坏数千个调用点，没有纵向切分可以绿色通过。

`to-tickets` 将其序列化为**扩展收缩模式（expand–contract）**：

- **扩展（Expand）**：在旧形式旁边添加新形式，这样什么都不破坏。
- **迁移（Migrate）**：按爆炸半径分批移动调用点（按包、按目录），每批一个 ticket，每个被扩展阻塞。CI 保持绿色，因为旧形式仍然存在。
- **收缩（Contract）**：在没有调用者剩余后删除旧形式，在一个被每个迁移批次阻塞的 ticket 中。

当即使是批次也无法单独保持绿色时，它们共享一个集成分支（integration branch），所有批次阻塞一个最终的集成验证 ticket。只有在那里才承诺绿色。

## 常见问题

**它为一个三行变更产出了十二个 ticket。**
过度分解是这个技能被报告最多的摩擦，且在从业者中是一致的：[模型](https://www.aihero.dev/ai-coding-dictionary/model) 默认为原子单元，丢失了使其有意义的分组。测试步骤正是为此存在：要求它合并，它就会合并。更深层的答案是 ticket 有一个下限：如果整个变更适合一个上下文窗口，你根本不需要这个技能。直接使用 [implement](https://aihero.dev/skills-implement)。

**ticket 按层产出：所有 schema 在一个，所有 API 在另一个。**
这就是纵向切分规则所针对的失败，技能有时仍然会产生它。在测试步骤通过每个 ticket 问一个问题来捕获：完成后我可以演示什么？没有答案的 ticket 就是横向切分。有些人因此在每个 ticket 中添加一行"演示路径"，并报告说它推动了模型向纵向分解。

**在 GitHub 上，ticket 没有作为 spec issue 的 sub-issue 创建。**
已知且未修复。它已被报告跨十几次运行和多个模型，[最完整的在 issue #554](https://github.com/mattpocock/skills/issues/554)，且在 Codex 上比在 Claude 上更糟。`gh` 自 v2.94 起原生支持此功能：`gh issue create --parent <n>`，以及事后 `gh issue edit <parent> --add-sub-issue <n>`。在追踪器模板优先使用这些之前，在运行后自行接线父链接是可靠的做法。

**"Blocked by" 被写入了 issue 正文而不是真实的 blocking link。**
同一类问题，[报告在 issue #513](https://github.com/mattpocock/skills/issues/513) 中，agent 甚至声称 GitHub 根本没有原生阻塞关系。它有：`gh issue create --blocked-by 12,15`。因为阻塞项先发布，它们的编号在创建时总是可用的。正文文本本意是为没有原生 edge 的 tracker 做后备，而不是默认。

**本地 ticket 去哪了？v1.1 说明说有一个根级别的 `tickets.md`。**
确实有，但那是一个 bug：一个共享文件在并行 agent 写入时也会竞争。本地模式现在在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md` 下每个 ticket 一个文件，按依赖顺序，匹配本地追踪器模板已经描述的布局。`NN` 前缀是真实的 ticket ID，所以 `/implement 03` 可以工作，无需重新输入长标题。

**它读取我的 spec 时一直截断。**
非常大的 spec 可能超出 tracker issue 能干净返回的范围，也没有本地副本可以回退，所以 agent 然后浪费 [tool call](https://www.aihero.dev/ai-coding-dictionary/tool-call) 重新获取块，永远到达不了终点。不要在 `/to-spec` 和 `/to-tickets` 之间[清空](https://www.aihero.dev/ai-coding-dictionary/clearing)或[压缩](https://www.aihero.dev/ai-coding-dictionary/compaction)。在同一个上下文窗口中运行它们，spec 就永远不需要被重新获取。

**验收标准没有评估任何东西：有些在任何工作完成之前就通过了。**
模板要求标准但没有说它们是否可以失败，所以这会发生。三种形态反复出现：一个在基准提交时已经为真的标准，一个只能由另一个 ticket 拥有的工作满足的标准，以及一个重述请求而非从产物推导的标准。纵向切分防止了大部分（一个交付之前不存在的行为的 slice 构造上在基准提交时为红色），但检查值得手动进行。对于每个标准，命名一个可以证明它为假的观察，并确认它在实现者开始的提交时失败。

**ticket 已发布。我实际如何运行它们？**
技能停在产物，没有自动分发模式。分发是手动的：看板，数没有开放阻塞项的 ticket，打开相同数量的 agent session。每个新鲜上下文一个 ticket，之间清空。注意 [implement](https://aihero.dev/skills-implement) 在完成时不会可靠地关闭或勾选 ticket，无论是在 GitHub 还是本地 markdown，所以 ticket 的状态需要你更新。

## 达标表现

- 每个 ticket 都有"完成后我可以演示什么？"的答案，且答案是行为，不是层。
- 列表以编号形式返回给你，每个都有"Blocked by"行，在任何内容发布之前。
- 顶部的 ticket 没有阻塞项，可以立即开始。
- ticket 正文中没有文件路径或行号，除非是原型产出的片段。
- 每个 ticket 读起来像一个新 session 可以在你不在场时完成的东西。
- 预重构（如果找到任何）在顺序的前面，而不是混入功能 ticket。

## 适合位置

`to-tickets` 是主构建链的一个步骤：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

上游是 [to-spec](https://aihero.dev/skills-to-spec)，它交给你一份已确定的 spec 来切分；两者保持在同一个不间断的上下文窗口中。下游是 [implement](https://aihero.dev/skills-implement)，它在每个新 session 中构建一个 ticket，驱动 [tdd](https://aihero.dev/skills-tdd) 编写测试，并以 [code-review](https://aihero.dev/skills-code-review) 结束。当你不确定哪个技能或流程适合时，[ask-matt](https://aihero.dev/skills-ask-matt) 为你路由。
