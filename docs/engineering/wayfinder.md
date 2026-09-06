## 它做什么

`wayfinder` 处理一项超出单个智能体[会话](https://www.aihero.dev/ai-coding-dictionary/session)能承载的工作：一个你可以命名**目的地**但路径尚不可见的想法，将其绘制为 issue tracker 上共享的**决策工单地图**，然后逐一解决它们，直到道路变得清晰。

它规划，它不执行。每个工单包含一个问题，其解决是一个决策，而不是要执行的构建片段，当地图完成时，就没有任何需要决定的了，在有人去做那件事之前。这一条规则将探路者工单与普通的实现 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) 区分开来，也是智能体最常打破的规则。当地图清除时，探路者移交；它不会继续进入代码。

## 何时使用

你通过输入 `/wayfinder` 调用它；[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行调用它。

它是这组技能中最重、最密集的流程，所以触发条件很窄：工作必须真正大于单个智能体会话能承载的范围，并且通往目的地的路径必须是模糊的。拆分很清晰：`/grill-with-docs` 用于单会话规划，`/wayfinder` 用于多会话规划。

| 你的场景 | 去哪 |
| --- | --- |
| 一个你可以在一次会议中确定范围的功能 | [grill-me](https://aihero.dev/skills-grill-me)，或当有代码库时使用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 一个绿地项目，或一个跨越多个会话的构建，路径仍然不清楚 | `/wayfinder` |
| 一个决策已经完成的线索 | [to-spec](https://aihero.dev/skills-to-spec)：直接跳过地图 |
| 一个已清除的探路者地图 | [to-spec](https://aihero.dev/skills-to-spec)，然后 [to-tickets](https://aihero.dev/skills-to-tickets) 和 [implement](https://aihero.dev/skills-implement) |
| 一个已经变得太大的现有会话 | 说"移交到 `/wayfinder`"（[handoff](https://aihero.dev/skills-handoff) 既连接到地图，也从地图连接出去） |

绿地不是要求。探路者经常用于遗留和半构建的代码库，可以说在那里它更锋利，因为很多迷雾是"这里已经是什么"而不是"我们应该做什么"。

## 前置条件

地图和其工单位于 repo 的 issue tracker 上，所以 wayfinder 需要 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 布置的 tracker 接线。该步骤写入一个"探路者操作"部分，描述地图、其子工单、阻塞边和前沿查询如何为 GitHub、GitLab 或本地 markdown 表达。Wayfinder 通过你 `CLAUDE.md` / `AGENTS.md` 中的指针解析该文档，而不是固定路径；如果没有配置 tracker，它会回退到本地 markdown 文件。

tracker 不是装饰。阻塞是在 tracker 自己的 UI 中可视化渲染前沿的关键，而没有原生依赖链接的 tracker（比如自托管的 Gitea）会将 wayfinder 降级为从地图文本推断阻塞者，这可以工作但需要更密切的监督。

## 地图、迷雾和前沿

**地图**是标记为 `wayfinder:map` 的单一 issue；它的工单是其子 issue。它是一个**索引，而不是存储**：一个决策恰好存在于一个地方，它的工单中，地图只是摘要并链接。一个会话以低分辨率加载地图，并按需放大到单个工单，这使得地图可以持续增长，而无需每个会话为其整个历史付费。

四个东西位于其上：

- **目的地**：到达这个地图终点是什么样子。命名它是绘图的第一步，在任何工单存在之前，因为目的地固定了每个工单被衡量的范围。
- **已做出的决策**：每个已关闭的工单一行，每个链接到详细信息实际存在的地方。
- **尚未具体化**：**战争迷雾**。你知道即将到来但还无法清晰表述的决策。迷雾与工单的测试是你是否能*现在*精确地陈述问题，而不是你是否能回答它。解决一个工单会清除它前方的迷雾，并将任何现在可以具体化的内容毕业为新的工单。
- **超出范围**：被判定超出目的地的工作。迷雾只会*朝向*目的地聚集，所以超出范围的工作已关闭，永远不会毕业。

**前沿**是开放的、解除阻塞的、未被认领的工单（已知领域的边缘）。一个会话通过在开始任何工作之前将工单分配给自己来认领它，所以分配者*就是*认领，并发会话会跳过它。工单在整个过程中按名称引用，永远不要用裸 `#42`；一堵 issue 编号的墙在叙述中难以辨认。

## 四种决策工单类型

每个工单携带一个 `wayfinder:<type>` label，要么是 **[HITL](https://www.aihero.dev/ai-coding-dictionary/human-in-the-loop)**（与代表自己的人类一起工作），要么是 **[AFK](https://www.aihero.dev/ai-coding-dictionary/afk)**，完全由智能体驱动。HITL 工单只能通过实时交流解决；一个回答自己 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 问题的智能体已经打破了它。

| 类型 | 模式 | 何时使用 | 解决方式 |
| --- | --- | --- | --- |
| `grilling` | HITL | 默认。问题可以通过交谈解决。 | [grilling](https://aihero.dev/skills-grilling) 加上 [domain-modeling](https://aihero.dev/skills-domain-modeling)，在新会话中 |
| `prototype` | HITL | "它应该如何看起来"或"它应该如何表现"：交谈无法解决的问题。 | [prototype](https://aihero.dev/skills-prototype)，构建的工件作为资产从工单链接 |
| `research` | AFK | 工作目录之外的事实阻塞了一个决策。 | [research](https://aihero.dev/skills-research) [子智能体](https://www.aihero.dev/ai-coding-dictionary/subagent)，在绘图时启动，在 `research/<name>` 分支上并行消耗 |
| `task` | 任一 | 没有需要决定的内容，但手动工作阻塞了一个决策，例如配置访问权限、注册服务或移动数据以便查看其形状。 | 智能体在能时单独处理，否则给人类一个精确的检查清单 |

`task` 是唯一一个*做*而不是决定的类型，它通过解除对决策的阻塞来赢得其位置，而不是通过交付目的地的一部分。这是实践中最容易出错的类型：智能体将其解释为实现步骤，并开始在地图内编写产品代码。

研究是*每个会话一个工单*规则的唯一例外。

## 常见问题

**这与 `/grill-with-docs` 有什么不同？我应该从哪个开始？**
会话数量，不是项目大小。`/grill-with-docs` 是单会话规划；wayfinder 是多会话规划。如果你可以在一次对话中容纳整个事情，grilling 是更便宜和更好的工具，wayfinder 在那种情况下确实更慢、更密集。社区简称为：wayfinder 只有在工作不适合单个会话时才有意义。这是迄今为止最常被问到的 wayfinder 问题，它一直被问到，因为描述没有告诉你自己的任务在那条线上的位置。你必须自己判断会话数量。

**当它要求"目的地"时，它是指这次会话的结束还是所有事情的结束？**
整个地图。这意味着整个地图的目的地，而不仅仅是初始会话。这个问题读起来有歧义，因为 wayfinder 从定义上讲是一个多会话工具，所以会话范围内的答案永远没有意义。典型的目的地是要移交的 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)、在规划开始前要锁定的决策、概念验证，或像数据迁移那样原地进行的变更。

**地图已清除。wayfinder 不是已经写了 spec 并创建了工单吗？为什么我还需要 `/to-spec` 和 `/to-tickets`？**
不。Wayfinder 的工单是决策工单，当地图关闭时，它们也都关闭了。剩下的是一个充满链接决策的地图，这不是构建计划。[to-spec](https://aihero.dev/skills-to-spec) 将这些链接的决策坍缩为一个 spec（`/to-spec #<map_issue>`），[to-tickets](https://aihero.dev/skills-to-tickets) 将其切分为 tracer-bullet 实现工单。将地图直接循环到 [implement](https://aihero.dev/skills-implement) 跳过了坍缩，丢弃了链接的详细信息。只有当工作确实很小时，才直接进入实现。人们确实运行了简化的管道并报告它有效；两个额外的步骤为你买到了一个审阅者或同事可以阅读的明确 spec 工件，你越不是独自一人，这越重要。

**我的智能体在 wayfinder 会话中间开始编写生产代码。**
这是该技能报告最多的失败，背后有一个真实的漏洞。Wayfinder 的"规划，不执行"默认值可以在地图的**备注**中覆盖，但备注是由智能体编写的，所以约束和其豁免位于受约束方拥有的同一个文件中。一个用户看到一个智能体将"这个地图携带执行"写入自己的备注，然后在以后的会话中将其读回作为自己的许可，在一个活动服务器上构建。对于"我指的是默认值"，没有硬性的技能内停止。在有之前：阅读任何你自己没有绘制的地图的备注，将实现保持在自己的会话中，并将任何看起来像构建切片的 `wayfinder:task` 视为错误类型。

**我绘制了 27 个工单，当我到达第十三个时，其余的不再有意义了。**
一个真实的、反复报告的结果，来自现场报告的原话。Wayfinder 的默认本能是全面规划，一个后期工单依赖于早期工单否定的假设的地图正是该技能被指责的瀑布陷阱。两件事对此进行反击。将地图范围限定到有界目的地，而不是整个产品。从业者一致报告，范围限定到一个已定义史诗的地图比一个蔓延的"实现 V1"表现更好，而规划非常大的事情首先不是目标：交付小增量才是。并且[积极原型化](https://www.aihero.dev/ai-coding-dictionary/prototyping)：路径保持最新的整个原因是不确定性在实现依赖它之前通过廉价的具体工件被清除。Wayfinder 是"原型最大化"，而不是"规划最大化"。

**我可以并行处理多个工单吗？**
前沿被构建来向你展示哪些是可以接受的，阻塞边是为了在纸上并行工作是安全的。在实践中，一次一个更安全。同时处理两个 grilling 工单的用户在一个会话中被问到他们在另一个会话中刚刚回答的问题，因为会话没有共享[上下文](https://www.aihero.dev/ai-coding-dictionary/context)。还有一个关于 prototype 工单的已知差距：有报告称智能体构建了三个 UI 变体，自己选择了一个，并关闭了工单。选择应该由你来做，该技能目前没有足够响亮地说出来。如果你确实并行运行，首先自己审查依赖图。

**我必须使用 GitHub Issues 吗？**
不。任何 issue tracker 都可以。GitHub 是支持最好的路径，因为它的原生子 issue 和阻塞关系使前沿可见，而无需打开地图；GitLab、Linear、Jira 和本地 markdown 都被使用。两个诚实的警告。没有原生阻塞的 tracker 意味着依赖图是从文本推断的，需要手动修正。而本地 markdown 将工件放在你的 repo 中，这是不推荐的：将这些材料存储在 repo 中往往会导致意外持久化。开源维护者遇到相反的问题（公共 tracker 填满智能体生成的规划工单），往往仍然选择本地 markdown。

**grilling 很累人。每个问题都有三段长。**
这是关于 wayfinder 最尖锐的现场投诉，它没有解决。一个用户给出的分解：冗长本身导致决策疲劳，长度去除了*为什么*问这个问题，所以随着地图变长，你失去了从决策到决策的链条。冗长看起来是当前[模型](https://www.aihero.dev/ai-coding-dictionary/model)集合的属性，而不是技能的属性，并且没有修复落地。从业者缓解措施在流通：运行较低的[推理努力](https://www.aihero.dev/ai-coding-dictionary/effort)，并在你的全局 `CLAUDE.md` 中放入一个自然语言指令。无论如何，预计要在这里花费真正的思考，因为 wayfinder 要求你的思考量不是缺陷，而是它存在的大部分意义。

**一个我已经关闭的决策被证明是错误的。我应该编辑旧工单还是创建一个新的？**
没有官方指导，智能体的本能是无用的：它倾向于围绕错误决策进行设计，而不是挑战它，所以你必须手动引导。有效的是直白地告诉 wayfinder 什么改变了；它更新地图，修订受影响的工单，并在已经关闭的工单上评论。地图中的范围变化是可恢复的。一个你*设计*来改变的地图是一个范围界定的坏味道。

**`decision-mapping` 去哪了？**
它就是这个技能，在 v1.1 中重命名为 `wayfinder`，调用为 `/wayfinder`。"Decision map"是行话，也不准确，因为四种工单类型中只有一种本身真正是一个决策。重新定义给了技能一个连贯的词汇表（目的地、战争迷雾、前沿、地图），而不是一个层叠在上面的发明术语。该单元保留了"决策"这个词：一个**决策工单**是 wayfinder 工单的称呼，专门为了阻止人们将其读作实现工单。

## 达标表现

- 目的地在单个工单存在之前就已写下并达成一致。
- 每个开放的工单读起来都是一个问题。任何读起来像"构建 X"的工单要么是错误类型，要么属于地图的下游。
- 你可以查看你的 tracker，看到哪些工单无需打开地图就可以接受，因为那是前沿通过原生阻塞渲染自身。
- 一个会话解决一个工单，将答案发布为解决评论，关闭它，并在地图的*已做出的决策*上留下一行。然后它停止。
- **尚未具体化**随时间减少。毕业为工单的迷雾区域从该部分消失，而不是存在于两个地方。
- 当初始广度优先的访谈完全没有揭示迷雾时，技能停止并告诉你工作足够小，可以跳过地图。
- 完成地图的会话将你引向 spec，而不是 pull request。

## 适合位置

`wayfinder` 是一个**情境入口流程**，不是默认的前门。访谈引导的想法 → 交付链仍然是大多数工作的起点；wayfinder 是你爬上去的东西，当想法太大，无法在一个会话中容纳时，它在 [to-spec](https://aihero.dev/skills-to-spec) 处合并回该链，因为清除的地图移交而不是构建。

在底层，它主要是其他技能穿着 wayfinder 的调度：[grilling](https://aihero.dev/skills-grilling) 和 [domain-modeling](https://aihero.dev/skills-domain-modeling) 解决默认工单类型，[prototype](https://aihero.dev/skills-prototype) 解决交谈无法解决的工单，[research](https://aihero.dev/skills-research) 作为子智能体运行，这样它的阅读永远不会落入你的会话。[handoff](https://aihero.dev/skills-handoff) 是进出的桥梁：从超出自身的对话进入地图，从地图中出来当一个支线任务出现在会话中时。对于任何其他情况，[ask-matt](https://aihero.dev/skills-ask-matt) 路由到整个集合。
