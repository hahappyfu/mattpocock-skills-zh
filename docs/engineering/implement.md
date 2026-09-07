## 它做什么

`implement` 实现已经决定好的工作。你指向一个[工单](https://aihero.dev/ai-coding-dictionary/ticket)、一份[规格说明](https://aihero.dev/ai-coding-dictionary/spec)，或你刚才在对话中商定的计划，它就会编写代码，在接缝处驱动 [tdd](https://aihero.dev/skills-tdd)，运行类型检查，最后运行 [code-review](https://aihero.dev/skills-code-review)，然后提交到当前分支。

它永远不会重新打开计划。没有访谈、没有澄清轮次、没有提出不同方法。无论上游确定了什么，那就是输入，技能的全部工作就是将其变成一个提交。这就是它与在一个全新的[智能体](https://aihero.dev/ai-coding-dictionary/agent)中输入"构建这个"的区别，后者会在构建时愉快地重新设计工作。

## 何时使用

你通过自己输入 `/implement` 来调用它：智能体不会自行调用它。它设置了 `disable-model-invocation: true`，所以其他技能也无法调用它。无论 [ask-matt](https://aihero.dev/skills-ask-matt) 或 [to-tickets](https://aihero.dev/skills-to-tickets) 在哪里说"然后按工单执行 `/implement`"，这是对你的指令，而不是智能体会主动做的事情。

工作当前的位置决定了这是否是正确的技能：

| 工作的类型 | 使用方式 |
| --- | --- |
| 追踪器上的工单 | `/implement #42`，每个[会话](https://aihero.dev/ai-coding-dictionary/session)一个工单，工单之间[清空](https://aihero.dev/ai-coding-dictionary/clearing)上下文 |
| 规格说明，尚未拆分，构建跨越多个会话 | 先用 [to-tickets](https://aihero.dev/skills-to-tickets)，然后按工单 `/implement` |
| 规格说明，构建较小 | 直接针对规格说明 `/implement` |
| 只在你刚才的对话中，且仍然较小 | 直接在同一个窗口中 `/implement` |
| 尚未写在任何地方 | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，如果没有代码库则用 [grill-me](https://aihero.dev/skills-grill-me) |
| 一个你想要测试先行的具体行为，没有规格说明 | 直接用 [tdd](https://aihero.dev/skills-tdd) |
| 已经构建好，你想要检查 | 直接用 [code-review](https://aihero.dev/skills-code-review) |

同一会话的情况值得单独说明，因为技能自身的首行并没有涵盖它。`SKILL.md` 写的是"规格说明或工单"，这会引导[模型](https://aihero.dev/ai-coding-dictionary/model)去寻找一个不存在的文件。如果计划只存在于对话流中，在调用时说明这一点。

## 前置条件

`implement` 提交到你当前所在的分支。它不会创建分支，也不会询问。开始之前，请确保你位于想要进行工作的分支上。

如果工单来自 [to-tickets](https://aihero.dev/skills-to-tickets)，它们所在的追踪器是由 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 配置的。`code-review` 读取相同的配置，以便在完成时找到原始规格说明。

## 单次运行的流程

一次运行包含五个步骤，按顺序：

1. 阅读工单或规格说明，找出接缝。
2. 在预先商定的接缝处驱动 [tdd](https://aihero.dev/skills-tdd)，一次一个 red-green slice。
3. 频繁运行类型检查，边运行单个测试文件。
4. 最后运行一次完整测试套件。
5. 运行 [code-review](https://aihero.dev/skills-code-review)，然后提交到当前分支。

一次运行覆盖一个工单。[to-tickets](https://aihero.dev/skills-to-tickets) 产生的工单是 tracer-bullet 纵向切分（vertical slice），大小适合单个新的[上下文窗口](https://aihero.dev/ai-coding-dictionary/context-window)，所以预期的节奏是：清空上下文，实现一个工单，提交，再次清空。每个工单都是自包含的，这就是为什么前一个工单的上下文可以丢弃。

## 预先商定的接缝

技能运行的核心是 **seam**：你可以观察行为的公开边界（boundary），而无需触及内部。测试位于 seam 处。在编写任何代码之前就商定 seam，这就是让测试持久的原因，因为底层的实现可以重写，而测试无需移动。

"预先商定的"这个词确实在做实际工作，但它也是技能最薄弱的环节。`implement` 内部没有任何东西来商定 seam。`tdd` 是负责询问的技能，它拒绝在未经确认的 seam 处编写测试。所以实际上，商定发生在上游的规格说明中，或者在运行的第一次交流中。如果哪里都没有商定，前提条件永远不会触发，运行就会悄悄变成"只写代码"。在规格说明中命名 seam 才能阻止这种情况。

## 常见问题

**它完成了，但我的工单仍然开放，验收标准仍然未勾选。**

正确，这是预期的。`implement` 没有完成步骤。它在提交后结束，永远不会接触工作项，这一点在 GitHub Issues 和本地 markdown 追踪器上都已确认，所以这不是追踪器集成问题。它也不会对 `code-review` 产生的发现采取行动，也不会勾选原始 issue 上的 `- [ ]` 复选框。请自己关闭工单并核对标准。这对依赖链的影响最大，因为 `to-tickets` 将边界定义为所有阻塞项（blockers）都已关闭的工单。如果什么都没有关闭，就没有什么会明显解除阻塞。

**我能不能一次性指向所有工单，或者并行运行多个？**

不能。一次调用，一个工单。批量调度工单队列和[子智能体](https://aihero.dev/ai-coding-dictionary/subagent)扇出被反复请求，但两者都不存在。在一个检出中并行运行多个 `/implement` 会话比不支持更糟糕：一份现场报告描述了在一个会话中 `git commit --amend` 落在另一个会话的提交上，一个 stash 从 `refs/stash` 中消失，提交落在错误的分支上，所有这些都在一个下午、三个问题中发生。这些会话共享一个工作目录、一个索引和一个 HEAD。Git worktree 是社区的变通方案，但请注意 `refs/stash` 也跨 worktree 共享，所以仅靠 worktree 无法解决 stash 情况。如果你想要并行，你必须自己组装。

**它能不能打开一个拉取请求（pull request）而不是提交？**

没有内置功能。它直接提交到当前分支，有些人觉得这太急切了：代码在他们有机会验证它是否工作之前就落盘了。没有配置标志，也没有 PR 模式。人们在调用时覆盖它（"提交到一个分支并打开一个 PR"）或通过编辑技能的本地副本。

**`code-review` 说它看不到我的更改。**

`code-review` 审查 `git diff <fixed-point>...HEAD`，它排除了暂存（staged）和工作树（working-tree）的更改。`implement` 在提交前运行它，所以除非已经存在一个中间提交，否则该 diff 中没有什么可审查的。多个人报告过这个问题，双方都未修复。先提交，然后针对你分叉的点进行审查。

另外，有些人故意不想在运行中进行审查，因为审查自己刚写代码的智能体倾向于自己的解决方案。在一个新的会话中针对 fixed point 运行 [code-review](https://aihero.dev/skills-code-review) 是一个合理的替代方案，这也是该技能在两个轴（axis）中分别运行子智能体的原因。

**一个工单消耗了 150k tokens。我使用方式不对吗？**

可能是工单太大，而不是技能使用不当。一次运行包含代码库探索、每个 seam 一个 red-green 循环、完整套件和审查，所以一个超过 100k [tokens](https://aihero.dev/ai-coding-dictionary/token) 的非平凡工单是正常的，而不是出了问题的信号。杠杆在上游：在 [to-tickets](https://aihero.dev/skills-to-tickets) 中调整工单大小，使每个工单适合一个新的窗口。如果一个工单持续爆炸，拆分它，而不是提高[工作量](https://aihero.dev/ai-coding-dictionary/effort)级别。

**在新会话中 `/implement #2` 处理了完全不相关的内容。**

`#2` 是针对智能体能看到的任何编号列表解析的，在新会话中可能是待办文件、检查清单或其他工作列表，而不是配置的追踪器。解析是自信的（confident），而不是失败关闭的（fail-closed），所以错误在开始之前并不明显。传递完整引用，即 issue URL 或 `owner/repo#2`，并要求它在开始前确认标题。

## 达标表现

- 会话开始时通过阅读工单或规格说明并重述它将构建什么，而不是询问你要构建什么。
- 你可以在跟踪中看到实际的 `/tdd` 调用，而不仅仅是测试出现在 diff 中。
- 类型检查和单个测试文件在运行期间重复运行，完整套件在接近结束时运行一次。
- 运行在当前分支上达到一个提交，无需你提示它继续。
- diff 是一个工单的更改量：一个贯穿每一层的纵向切分（vertical slice），而不是多个工单混在一起。

## 它的位置

`implement` 是主链的构建步骤，倒数第二个：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

它的邻居是 [to-tickets](https://aihero.dev/skills-to-tickets)，它产生它消耗的工单并声明决定顺序的阻塞边（blocking edge）；[tdd](https://aihero.dev/skills-tdd)，它在每个接缝处内部驱动；[code-review](https://aihero.dev/skills-code-review)，它在提交前运行。它位于规划技能的下游并信任它们。它不会重新验证所交给内容的形状（shape），所以结构不良的地图或水平分层的工单会按原样构建。

这种信任就是为什么 [wayfinder](https://aihero.dev/skills-wayfinder) 在 [to-spec](https://aihero.dev/skills-to-spec) 处合并到链上，而不是将其地图直接循环到 `implement`。只有当工作量确实很小时，才从地图直接到 `implement`。

[ask-matt](https://aihero.dev/skills-ask-matt) 是当你不确定自己处于哪个流程时，覆盖整个集合的路由器。
