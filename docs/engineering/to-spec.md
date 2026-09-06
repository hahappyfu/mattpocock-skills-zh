## 它做什么

`to-spec` 将你刚才的对话转为一份**[规格说明](https://www.aihero.dev/ai-coding-dictionary/spec)**，并将其作为单个 issue 发布到你的 issue tracker。

它不访谈你。到你调用它时，决定已经做出，所以它综合已知内容（来自对话、代码库、你的 `CONTEXT.md` 和 ADR），而不是发起新一轮提问。规格说明是已有决定的记录，不是做新决定的地方。

## 何时使用

你通过输入 `/to-spec` 来调用它；[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行调用它。

当构建对于一个 agent [会话](https://www.aihero.dev/ai-coding-dictionary/session)来说太大、必须跨多个会话拆分时使用它。这就是全部触发条件：

| 你的场景 | 去哪 |
| --- | --- |
| 你还没有做任何决定 | 先用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 已决定，且工作适合一个[上下文窗口](https://www.aihero.dev/ai-coding-dictionary/context-window) | [implement](https://aihero.dev/skills-implement)：跳过规格说明 |
| 已决定，且工作跨多个会话 | `/to-spec`，然后 [to-tickets](https://aihero.dev/skills-to-tickets) |
| [wayfinder](https://aihero.dev/skills-wayfinder) 地图已通过 | `/to-spec #<map_issue>` |

## 前置条件

`to-spec` 将规格说明发布为 issue，所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须先为这个仓库配置好 tracker 和 triage-label 词汇表。两种都支持：真实的 tracker 如 GitHub，或本地 markdown 文件在 `.scratch/` 下，后者开箱即用。

## 规格说明是一份决定记录

规格说明存在是因为上下文窗口会结束。你在 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 过程中确定的所有内容（解决方案的形状、你争论通过的选择、你故意拒绝的）都在一个即将被清空的对话中。规格说明就是那个对话留存下来的东西。

所以它不验证任何东西，也不决定任何东西。它用你项目自己的语言捕捉已有决定，让新会话可以接手工作而无需你重新解释。规格说明断言了你从未真正说过的内容，那就是一个缺陷。

## 接缝先于正文

在写一个字之前，`to-spec` 勾勒功能将被测试的**接缝（seam）**，并与你确认。它偏好已有接缝而非新建，并尽可能取最高的接缝：跨一个变更的理想数量是一个。

那些商定的接缝随后传播。[tdd](https://aihero.dev/skills-tdd) 只在预先商定的接缝处工作，[code-review](https://aihero.dev/skills-code-review) 对照规格说明审查 diff，所以未经商定的接缝会作为 review finding 出现。绑定是间接的：它通过本文档传播，这就是为什么接缝对话值得在这里认真对待，而不是推迟到实现阶段。

## 常见问题

**`/to-prd` 去哪了？**
就是这个技能，在 v1.1 中改了名。现在"Spec"是唯一的贯穿术语，旧的 `to-prd` slug 已废弃；用新名字重新安装。替代旧词汇表的那一对是 *spec* 和 *tickets*：spec 是目的地和锁定它的决定，[tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) 是到达那里的执行步骤。如果你改方向，删除未完成的 tickets 并保留 spec。

**为什么 spec 要打 `ready-for-agent` label？我不想让 agent 按它实现。**
这个 label 意味着"无需进一步 triage"：文档完整到 agent 可以据此工作。这是一个输入标识，不是工作单。但如果你运行的 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) agent 轮询 `ready-for-agent`，这个区别对它们不可见，它们会很乐意尝试一次构建整个 spec 而不是按 ticket 片段推进。这是该技能被报告最多的粗糙边缘。在它改变之前，在你的 AFK agent prompt 中显式排除父 spec，或在 `/to-tickets` 运行后剥离该 label。

**为什么不直接从 grilling 到 `/to-tickets`，跳过 spec？**
通常应该这样做；spec 只在多会话工作中有价值。它值得的地方在于 tickets 是一次性的而 spec 不是：每个 ticket 为一个新的上下文窗口设计大小并在完成后删除或关闭，而 spec 作为推理过程唯一存在的地方留存。在单次会话的变更中这不给你带来任何收益，你还付出了额外的综合步骤，[模型](https://www.aihero.dev/ai-coding-dictionary/model) 可能在此漂移。直接 grilling → `/implement`。

**我刚完成了一个 wayfinder 地图。我给它喂什么？**
主地图 issue：`/to-spec #<map_issue>`，不是单独的决策 tickets。[wayfinder](https://aihero.dev/skills-wayfinder) 产出的是决策而非可交付物，散布在地图中；`to-spec` 是将它们坍缩为一份可构建文档的步骤。直接把地图循环到 `/implement` 会丢掉那个坍缩。

**spec 是给我审阅的，还是只给 agent 看的？**
主要是给 agent 看的，读起来也是那样：完整、密集、参考密集。值得你花眼的部分是接缝和 out-of-scope 节，因为那是两个错误决定最容易捕获、最昂贵发现的地方。从头到尾通读整份是人们真实抱怨的，没有摘要模式：诚实的回答是如果 spec 让你惊讶，grilling 太浅，不是 spec 太长。

**在 tickets 开始后，我应该保持 spec 冻结还是让 agent 重写它？**
没有任何机制保持它同步，所以实际上它是你在那个时刻所知的快照，在实现第一次教你新东西时就过时了。在工作交付后将其视为一次性。旨在超越它的产物是你的 `CONTEXT.md` 和 ADR；如果在实现期间学到的东西值得留存，它属于那里，而不是在一份被编辑的 spec 中。

**我的工作是一个重构或模块边界，不是功能。模板适用吗？**
不太适用，这是一个已知的局限。模板严重依赖用户故事，这对架构工作来说形状不对：你最终在编写没人要求的故事，围绕的决策实际上是关于接口和不变量的。依靠 implementation-decisions 和 testing-decisions 节，让持久的架构决策作为 ADR 通过 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 落地，而不是试图让 spec 承载它们。

**它会检查 tracker 中的相关工作吗，或者引用它遵循的 ADR 吗？**
都不。它阅读并遵循覆盖所涉区域的 ADR，但不链接它们，也不在起草前搜索 tracker 中重叠的 issues，所以 spec 可能悄悄重复已有人归档的工作。如果区域繁忙，自己先搜索 tracker。

**`/to-tickets` 无法读取我的 spec：它一直截断。**
非常大的 spec 可能超出 tracker issue 能干净返回的范围，也没有本地副本可以回退。修复是上下文卫生：不要在 `/to-spec` 和 `/to-tickets` 之间[清空](https://www.aihero.dev/ai-coding-dictionary/clearing)或[压缩](https://www.aihero.dev/ai-coding-dictionary/compaction)。在同一个窗口中运行它们，spec 就永远不需要重新获取。

## 达标表现

- 它开始写作而不是向你发起新一轮提问。
- 它在写作前把接缝给你确认，并提出尽可能少的接缝。
- 它用你项目的名词回应，而不是泛泛的产品管理套话。
- 其中的每个决定都是你能记得做过的。没有为了填充某个节而编造的内容。
- out-of-scope 节有真实内容：你拒绝的东西通常是页面上最有用的行。

## 适合位置

`to-spec` 是主构建链的一个步骤，且仅在多会话分支上：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

它的上游邻居是 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)（该技能做决定，而本技能只记录）和 [wayfinder](https://aihero.dev/skills-wayfinder)（其完成的地图在此合并到链上）。下游，[to-tickets](https://aihero.dev/skills-to-tickets) 将 spec 切分为 [implement](https://aihero.dev/skills-implement) 构建的 tracer-bullet tickets。当你不确定哪个技能或流程适合时，[ask-matt](https://aihero.dev/skills-ask-matt) 为你路由。
