## 它做什么

`triage` 处理你项目 tracker 上的 issue，将每个 issue 通过一个小型 **triage 角色**（一个 category 角色和一个 state 角色）状态机流转，并留下一个 agent-ready brief、一个给报告者的具体问题，或一个带有记录原因的已关闭 issue。

它仅用于**你没有创建的** issue。原始的 bug 报告、传入的功能请求、一个不请自来的外部 pull request：从外部落入 tracker 的工作，无论报告者以何种形式留下。[to-tickets](https://aihero.dev/skills-to-tickets) 产出的 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) 在构造上已经 agent-ready，对它们运行 `triage` 最多是浪费功夫。规则很明确：`/triage` 仅用于传入的 issue，不用于你自己创建的 issue。

它与手动打 label 的第二个区别是：它推荐并等待。它告诉你它的 category 和 state 判断及理由，加上在代码库中发现的内容，在你指示之前不应用任何东西。

## 何时使用

你通过输入 `/triage` 并用自然语言描述你想要什么来调用它。[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行调用它。"Show me anything that needs my attention"，"let's look at #42"，"move #42 to ready-for-agent"。

| 你的场景 | 去哪 |
| --- | --- |
| tracker 充满来自他人的原始报告 | `/triage` |
| 自己有个粗略想法，什么都没写 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 一段已定论的对话要转为[规格说明](https://www.aihero.dev/ai-coding-dictionary/spec) | [to-spec](https://aihero.dev/skills-to-spec) |
| 一份规格说明要拆分为 agent-ready tickets | [to-tickets](https://aihero.dev/skills-to-tickets) |
| 一个已确认的 bug 需要根因，而非 label | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |

## 前置条件

`triage` 读写你的 issue tracker，所以 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 必须先配置好那个 tracker 和它的 label 词汇表。下面的角色名称是**规范的**；你 tracker 中的 label 字符串可能不同，映射关系由 setup 提供。如果你的 tracker 已经完全使用规范名称，就没有什么需要映射和设置的。

tracker 配置还决定外部 pull request 是否算作请求面，以及谁算外部。该标志默认关闭，不再是一个 setup 问题，所以如果你希望 PR 在范围内，请在 `docs/agents/issue-tracker.md` 中翻转它。

## 状态机

每个经 triage 的条目最终恰好携带一个 category 角色和一个 state 角色。两个 category：`bug`（某样东西坏了）和 `enhancement`（新功能或改进）。五个 state：

| State | 含义 |
| --- | --- |
| `needs-triage` | 你需要评估它。未贴 label 的 issue 通常首先落到此处。 |
| `needs-info` | 等待报告者。报告者回复时返回到 `needs-triage`。 |
| `ready-for-agent` | 规格完整，附带了 agent brief。[AFK](https://www.aihero.dev/ai-coding-dictionary/afk) agent 可以接手。 |
| `ready-for-human` | 相同的 brief，加上为何不能委派：judgement call、外部访问、手动测试。 |
| `wontfix` | 已关闭，原因已记录。 |

这就是全部词汇，而"恰好一个 state 角色"的不变量让查询保持简单。这也是该 [skill](https://www.aihero.dev/ai-coding-dictionary/skill) 被请求最多的领域：用户要求为已规格化但被另一个 issue 阻塞的工作增加第六个 state，为门控于未来触发器的 `deferred` 工作增加一个 state，以及为一个终端 `implemented` state。这些都尚未发布。参见下方的常见问题。

`wontfix` 分三种情况，区别很重要，因为只有一种会写入知识库：

| 关闭原因 | 发生什么 |
| --- | --- |
| 已实现 | 一条指向其现有位置的评论。不写入 `.out-of-scope/`，因为这是一个已构建的功能，而非被拒绝的，将其归档在那里会污染去重检查。 |
| 被拒绝的 bug | 礼貌解释，然后关闭。 |
| 被拒绝的 enhancement | 在 `.out-of-scope/` 中创建一个文件，从关闭评论链接到它，然后关闭。 |

`.out-of-scope/` 是每个被拒绝的**概念**一个 markdown 文件，而非每个 issue 一个，以简短设计文档的形式撰写，而非数据库行：被拒绝了什么、为什么、以及每个曾请求它的 issue。`triage` 在评估任何内容之前阅读整个目录，并按概念而非关键词匹配，因此"night theme"匹配 `dark-mode.md`。当它命中一个匹配时，它会展示旧的决定并询问你是否仍然持相同观点，而不是从头重新审议该请求。

## 验证后再写 brief

在任何 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 之前，`triage` 检查声明是否确实成立。对于 bug，它从报告者的步骤复现。对于 PR，它 checkout 分支并运行相关测试。然后它报告三种情况之一：确认，附代码路径；复现失败；或细节不足以尝试，这本身就是 `needs-info` 的最强信号。

它在同一遍中对代码库运行另外两项检查：**冗余**（这是否已实现，按领域概念而非报告者的措辞搜索？）和**先前拒绝**（`.out-of-scope/` 是否已经说了不？）。两者都很廉价，两者命中时都产生 `wontfix`。

所有这一切都是为了让一个产物变好：**agent brief**，当 issue 流转到 `ready-for-agent` 时发布的结构化评论。一旦发布，brief 就是契约，原始报告只是上下文。Brief 被写成**持久的**而非精确的，因为一个 issue 可能在 `ready-for-agent` 上停留数周，而代码在它下方移动。所以它们命名类型、签名和行为契约，从不提文件路径或行号。确认的复现比猜测产生强得多的 brief。

## PR 就是附带了代码的 issue

在 tracker 将外部 pull request 视为请求面的地方，它们通过相同的机器，使用相同的 category、相同的 state、相同的流转。state 只是针对 diff 阅读：`ready-for-agent` 意味着附带了 brief，agent 应对代码采取下一步操作；`ready-for-human` 意味着可供人工合并。PR 上的 brief 描述对现有 diff 还需做什么，而非如何从零构建。

发现只展示*外部* PR，因为 collaborator 的进行中分支不是 triage 工作。该过滤器仅限发现，显式命名的 PR 无论作者是谁都会被 triage。一个粗糙边缘：GitHub 模板的外部 PR 列表命令对 `gh pr list` 请求 `authorAssociation` 字段，但 `gh` 未暴露该字段，因此该命令按原样完全失败（[#468](https://github.com/mattpocock/skills/issues/468)）。

## 常见问题

**我运行了 `/to-spec` 和 `/to-tickets`，现在那些 tickets 在那里未经 triage。我应该对它们运行 `/triage` 吗？**
不。它们已经是 agent-ready 的，因为 `to-tickets` 在发布时应用了 `ready-for-agent` label，精确地让 AFK runner 无需再次通过就能拾取它们。遇到此问题的用户运行了 spec 流程，在输出上看到 `needs-triage`，然后发现他们的 AFK runner 忽略了一切。`triage` 是从外部到达的工作的入口流程；spec 流程是你发起的工作的通道。它们在 `ready-for-agent` 汇合，而非更早。

**现在有了 `to-spec` → `to-tickets` → `implement` 流程，`triage` 还相关吗？**
只有在你有传入工作时。`triage` 先于那条主链存在，做的是不同的工作：它是为他人提交的报告准备的通道。如果你 tracker 中的一切都来自你自己的规划，你很少会打开它。如果你维护任何公开的东西，或你的团队向你提交 bug，它是前门。主要用途是开源仓库处理外部贡献者的 issue。

**agent 尝试应用 `ready-for-agent`，但 `gh` 说 label 不存在。**
已知的未修复 bug（[#616](https://github.com/mattpocock/skills/issues/616)）。`setup-matt-pocock-skills` 将 label 词汇表写入 `docs/agents/triage-labels.md`，但不会在你的 tracker 中创建 label。用 `gh label create` 或 tracker 的 UI 自己创建五个 state label 和两个 category label，一次即可，然后问题就消失了。有一个社区修复分支从该 issue 链接，但尚未合并。

**五个 state 不够：blocked、deferred 或 implemented 呢？**
这是该 skill 被提交最多的缺口，有三种形态。一个已完全规格化但等待另一个 issue 关闭的 issue（[#139](https://github.com/mattpocock/skills/issues/139)），报告者抱怨 `ready-for-agent` 在那里"技术上正确"但具有误导性，所以 agent 拾取它并碰壁。触发器门控的未来工作，有意图但尚未可操作（[#297](https://github.com/mattpocock/skills/issues/297)）。以及一个"已实现，等待验证"的终端 state，没有它 AFK runner 可能重新排队已完成的 tickets。Matt 已同意 blocked 的情况是真实的，但对名称（`blocked` 对 `paused`）尚未决定。这些都尚未发布。人们使用的变通方法是在 category 旁添加一个仓库本地的额外 label，保持规范 state 槽位被诚实的内容占据，代价是 skill 不知道它。一个社区衍生版本更进一步，添加了 `needs-slicing`、`tracking` 和工作量 label。这有效，但那是他们的，不是 skill 的。

**这和 `/diagnosing-bugs` 有什么区别？**
这里的验证步骤故意很浅（足以回答"这是真的吗，大概在哪里"），而非找到根因。当一个 bug 在几分钟内无法从报告者的步骤复现时，诚实的做法是 `needs-info`，或者如果你想现在追查就用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)。两个 skill 的文本目前都没有提到对方；一个用户发现了那个接缝，它仍然开着。

**我能指向整个 backlog 让它运行吗？**
你可以问，但注意它读什么。"展示需要关注的内容"遍是一个廉价的列表，用于*选择*，你挑选一个，然后它对选中的那个收集完整的[上下文](https://www.aihero.dev/ai-coding-dictionary/context)。一次运行二十个 issue，agent 可能悄悄回退到那个廉价列表作为其证据基础，它返回 issue 正文但不返回评论。一个用户恰好遇到了这个：三个 issue 已经有一条评论说"已修复，建议关闭"，但三个都获得了新的 agent brief。如果你想要批量通过，请显式说明必须阅读每个 issue 的评论。

**它支持 Linear 吗，或者除 GitHub Issues 之外的其他工具？**
支持，tracker 是配置，不是硬编码假设，人们用它处理 Linear（通过 `linear` CLI）、GitLab 和 `.scratch/` 下的纯 markdown 文件。一个常见拆分是 Linear 用于 issue 和规划，GitHub 用于代码和 PR：说"issue tracker"的 skill 映射到 Linear，说"PR"的 skill 映射到 GitHub。在本地 markdown tracker 上有一个已知的模板 bug，生成的文件可能携带两次验收标准，一次在顶层，一次在 agent brief 内部（[#200](https://github.com/mattpocock/skills/issues/200)）。

## 达标表现

- 它接触的每个条目最终恰好有一个 category 角色和一个 state 角色，不是零个，也不是两个冲突的 state。
- 它给你一个带理由的推荐然后停下，而非重新打 label 然后继续。
- 在任何内容到达 `ready-for-agent` 之前，bug 被复现，或 PR 被 checkout 并运行。
- 它写的 brief 命名类型和行为，不包含文件路径和行号。
- 一个六个月前被拒绝的请求回来了，它说明了这一点并引用了旧原因，而非重新 triage。
- 它发布的每条评论都以 `> *This was generated by AI during triage.*` 开头。

## 适合位置

`triage` 是一个**入口流程**，不是主链上的一步。主流程从你的想法运行（grill、spec、tickets、implement、review），`triage` 是为到达的工作准备的平行通道。它在同一处汇合：一个贴了 `ready-for-agent` label 并带有 brief 的 issue，[implement](https://aihero.dev/skills-implement) 像处理来自 [to-tickets](https://aihero.dev/skills-to-tickets) 的 ticket 一样拾取它。当一个请求在写 brief 之前需要提炼时，`triage` 同时运行 [grilling](https://aihero.dev/skills-grilling) 和 [domain-modeling](https://aihero.dev/skills-domain-modeling)，一轮问题一轮问题地，这样决策在做出时就落入 `CONTEXT.md` 和 ADR。当你不确定自己在哪个通道时，[ask-matt](https://aihero.dev/skills-ask-matt) 为你路由。
