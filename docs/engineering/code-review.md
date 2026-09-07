## 它做什么

`code-review` 按两个轴审查你指定的固定点（一个 commit、一个分支、一个 tag、`main`、`HEAD~5`）到 `HEAD` 的 diff。**Standards** 轴问代码是否遵循本仓库的编写方式。**Spec** 轴问代码是否做了原始 issue 或 [spec](https://www.aihero.dev/ai-coding-dictionary/spec) 要求的事。每个轴在自己的[子智能体](https://www.aihero.dev/ai-coding-dictionary/subagent)中运行，互相看不到对方的推理。

两个轴从不合并，也不 rerank。报告以*每个轴*的最严重问题结尾，拒绝选出跨轴的胜者，因为一个变更可能通过一个轴而失败另一个：遵循所有约定但实现错误的东西通过 Standards 而失败 Spec；完全做了 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) 要求但破坏仓库约定的东西则相反。混合裁决会让通过的轴隐藏失败的轴。

## 何时使用

输入 `/code-review`，或 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 在你要求审查分支、PR、进行中的工作或任何"自 X 以来"时自动调用它。

| 你的场景 | 去哪 |
| --- | --- |
| diff 存在，你想知道它构建得对不对*以及*是否是对的东西 | `code-review` |
| 你想在 diff 中猎杀 bug：空路径、竞争条件、off-by-one | Claude Code 自带的 review，不是这个（见下面的命名冲突） |
| 还没写任何东西，你想先写测试 | [tdd](https://aihero.dev/skills-tdd) |
| 整个 spec 需要构建，包含审查 | [implement](https://aihero.dev/skills-implement)，它本身会调用这个 skill |
| 整个代码库漂移了，不是一个 diff | [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) |
| 有东西坏了但你不知道为什么 | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) |

你必须提供固定点。如果不提供，skill 会询问而不是猜测；它会在生成任何子智能体之前检查引用可解析且 diff 非空，所以拼错的分支名会在你面前失败，而不是在两个子智能体内部。

## 前置条件

Standards 轴什么都不需要。它读取仓库文档化的内容（`CODING_STANDARDS.md`、`CONTRIBUTING.md` 等），当仓库什么都没文档化时回退到内置基线。

Spec 轴需要 spec 存在且可找到。它按以下顺序查找：

1. commit message 中的 issue 引用（`#123`、`Closes #45`、GitLab `!67`），通过 `docs/agents/issue-tracker.md` 获取。
2. 你作为参数传入的路径。
3. `docs/`、`specs/` 或 `.scratch/` 下与分支或功能名匹配的 spec 文件。
4. 询问你。

步骤 1 依赖 `docs/agents/issue-tracker.md`，由 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 写入。没有它时，如果你手动提供路径，轴仍然工作。完全没有 spec 时，Spec 子智能体会跳过，报告说"无可用 spec"而不是捏造需求。

## 两个轴

| | Standards | Spec |
| --- | --- | --- |
| 问的问题 | 构建得对不对？ | 是否是对的东西？ |
| 读取 | 仓库文档化的标准，加上 smell 基线 | 原始 issue 或 spec |
| 报告 | 文档化的违规（可能是硬性的），和 smell（始终是 judgement call） | 缺失或部分的需求、scope creep、实现有误的需求 |
| 每项发现引用 | 规范文件和规则，或命名的 smell 加上 hunk | spec 中的行 |

一个不知道你的标准的通用 review skill 正是这种设计试图避免的：它标记你代码库中刻意的东西，而遗漏代码库真正依赖的不变量。所以仓库自己的文档是 Standards 轴的[首要来源](https://www.aihero.dev/ai-coding-dictionary/primary-source)，**仓库始终优先**。

**smell 基线**是它的底线，来自*《重构》*第 3 章的 12 个 Fowler 代码异味：Mysterious Name、Duplicated Code、Feature Envy、Data Clumps、Primitive Obsession、Repeated Switches、Shotgun Surgery、Divergent Change、Speculative Generality、Message Chains、Middle Man、Refused Bequest。每个都是带标签的启发式判断（"possible Feature Envy"），绝不是硬性违规，每个都按*是什么* → *如何修复* 陈述，所以每项发现都附带一个修复动作而不是抱怨。你的 linter 已经强制执行的任何内容都被两个轴跳过。

## 常见问题

**它和 Claude Code 自带的 `/code-review` 冲突。我该怎么办？**

这是该 skill 被报告最多的问题，尚未修复。Claude Code 自带一个 `/code-review`，做的是不同的事：它在 diff 中猎杀 bug，而这个检查 spec 合规性和仓库标准。安装这个库意味着其中一个会胜出，哪个胜出取决于你的安装方式。通过插件市场安装时，所有内容都通过 `mattpocock-skills:` 前缀别名化，内置的在未限定名称下变得难以触及；通过普通 skills 安装时，本地文件胜出，这个 skill 覆盖内置的。一个干净的方案是完全移除 Claude Code 的内置 skills：大量节省[上下文](https://www.aihero.dev/ai-coding-dictionary/context)，命名冲突也不再重要。覆盖本身可以认为是 Claude Code [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 的 bug（skill 作者应该可以自由命名 skill），所以另一个方案是重命名本地副本。编辑 frontmatter 或重命名目录会被 `npx skills update` 覆盖；用户报告的持久变通方法是 fork skill 到新名称，从受管理的集合中移除 `code-review`，记住你 fork 的 commit 以便手动重新同步。

**它的子智能体不断再次调用 `/code-review` 并生成更多 agent。**

已知的未修复 bug，已有多人复现且不限于一个 harness。Standards 和 Spec 的 prompt 没有禁止委派，所以子智能体可能重新发现 skill 并再次扩散：一份报告达到了 50 多个 agent。用户在 fork 上应用的修复是在两个子智能体简报末尾各加一行："Do not invoke `/code-review` or spawn additional agents: perform this review directly." 有人更倾向于在 harness 级别处理，让每个 skill 继承该保护。两者都尚未进入发布版。如果你无人值守运行，注意 agent 数量。

**我应该在写代码的同一个 [session](https://www.aihero.dev/ai-coding-dictionary/session) 中运行吗？**

最好用新的。正如一位读者所说："同一个上下文审查自己不是审查，它是带有 slash command 的确认偏误。"编写 session 中的审查 agent 持有塑造代码的所有假设，这正是独立审查者不会有的上下文。这也是为什么人们要求 [implement](https://aihero.dev/skills-implement) 去掉内置审查步骤：它在刚写完 diff 的 session 中运行审查。从干净的 session 调用 `/code-review` 才是诚实的版本。

**每个 ticket 都审查，还是最后统一审查？**

两种都行，skill 不替你决定。每个 ticket 审查保持每个 diff 足够小，Spec 轴有一个清晰的 spec 可以对照，这也是 `implement` 使用的模式。批量到分支末尾能捕获 per-ticket 各自通过时遗漏的 ticket 间交互。如果不确定，按 ticket 审查，最后对分支点运行一次最终检查。

**我能信任这些发现吗？**

不检查就不行。子智能体输出是假设，不是证据：一个团队报告了一打被基于文本的审查放过的破坏性变更。skill 逐字或轻度汇总两份报告而不对文件重新验证每个声明，所以发现可能引用了错误的位置或夸大了影响。在采取行动之前阅读每项发现的引用。每项发现都必须携带一个引用（一个规范规则、一个 smell 加 hunk、或一行 spec），这是它可被检查的原因。

**为什么每次运行都会发现新问题？**

因为修复会产生新的表面，因为 Standards 轴中 judgement call 的部分在不同运行之间不是确定性的。一位读者直白地描述了这个循环："/code-review and /improve-code-architecture always find new stuff every time. I implement fixes, rerun these skills, and again and again." 没有收敛保证。把一次通过当作线索列表，对有引用规则支撑的那些采取行动，然后停止：不要循环运行直到它返回干净，因为它不会。

**它审查我未提交的工作吗？**

不。它用三点点号 diff `<fixed-point>...HEAD`，从 merge-base 测量，排除 staged 和 working tree 的变更。如果 `implement` 没有做临时提交，即将提交的工作对审查是不可见的。先提交，再审查，然后 amend 或添加 fixup。

## 达标表现

- 它在无效引用或空 diff 时拒绝开始，在任何子智能体生成之前。
- 报告作为两个独立的块呈现，在 `## Standards` 和 `## Spec` 下，不是一个合并的列表。
- 每项 Standards 发现要么命名仓库文件中的规则，要么命名十二个 smell 之一，附带 hunk 引用；每项 Spec 发现引用 spec 的一行。
- 结尾总结给出每个轴的最严重问题，并拒绝选出整体胜者。
- 无可用 spec 时，Spec 块如实说明，而不是列出从代码推断的需求。

## 它的位置

`code-review` 是构建链尾部的审查步骤：`grill-with-docs → to-spec → to-tickets → implement → code-review`。它也可以独立用于你指定的任何分支或 PR。

- [implement](https://aihero.dev/skills-implement) 是最近的邻居：它驱动构建，并在提交前调用这个 skill 作为自己的结项审查。
- [to-spec](https://aihero.dev/skills-to-spec) 和 [to-tickets](https://aihero.dev/skills-to-tickets) 产出 Spec 轴检查的文档；模糊的 spec 让那个轴模糊。
- [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) 是全代码库的对应物：这个 skill 只看一个 diff。

[ask-matt](https://aihero.dev/skills-ask-matt) 在你不确定哪种情况需要哪个 skill 时路由整个集合。
