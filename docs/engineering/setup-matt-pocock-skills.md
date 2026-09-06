## 它做什么

`setup-matt-pocock-skills` 回答一个仓库的三个问题：issue 存放位置、triage label 名称、领域文档位置。它将答案记录为 `docs/agents/` 下的 markdown 文件。

这些文件是仓库间唯一变化的部分。技能本身在各处完全相同；它们在运行时读取 `docs/agents/issue-tracker.md` 并按其说明执行。这就是为什么该技能集不绑定 GitHub，以及为什么任何技能文件都不需要编辑来指向其他位置。用"将技能链接到自定义 issue tracker"调用它适用于任何你能以编程方式连接的东西，技能无需任何改动。

它是一个由提示驱动的技能，而非确定性脚本。它读取你的 `git remote`、现有的 `CLAUDE.md`、现有的 `CONTEXT.md`，提出发现，等待确认后再写入。

## 何时使用

你通过输入 `/setup-matt-pocock-skills` 调用它；[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行调用它。它被特意标记为不可调用，所以没有其他技能能为你触发它。

每个仓库使用一次，在使用任何其他工程技能之前。如果 [triage](https://aihero.dev/skills-triage)、[to-spec](https://aihero.dev/skills-to-spec)、[to-tickets](https://aihero.dev/skills-to-tickets) 或 [wayfinder](https://aihero.dev/skills-wayfinder) 开始猜测你的 issue 去向，或应用你 tracker 中不存在的 label，说明它们还未在此设置。一个项目进行到一半的仓库也是运行它的好地方；技能读取已有内容，早期工作不会浪费。

## 前置条件

它写入你运行它的仓库：

| 它写入 | 位置 |
| --- | --- |
| `issue-tracker.md` | `docs/agents/` |
| `domain.md` | `docs/agents/` |
| `triage-labels.md` | `docs/agents/`，仅当 `triage` 技能已安装时 |
| `## Agent skills` 块 | `CLAUDE.md` / `AGENTS.md` 中已存在的那个 |

全部是已提交的 markdown。没有用户级或全局模式：配置存在仓库中，所以每个仓库有自己的副本。

## 三个决策

它以推荐答案开头引导每节，并跳过探索已解决的部分。大多数运行只需两次确认即可完成。

| 决策 | 它提议什么 | 何时实际询问 |
| --- | --- | --- |
| **Issue tracker** | 匹配你 `git remote` 的那个 | 始终：这是唯一真正的选择 |
| **Triage labels** | 保留五个规范名称（`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`） | 仅当 `triage` 技能已安装时 |
| **领域文档（Domain docs）** | 单上下文（single-context）：仓库根目录一个 `CONTEXT.md` + `docs/adr/` | 仅当发现 monorepo 信号时，然后提供多上下文 `CONTEXT-MAP.md` |

tracker 选项：

| 选项 | Issue 存放位置 | 需要 |
| --- | --- | --- |
| **GitHub** | 仓库的 GitHub Issues | `gh` CLI |
| **GitLab** | 仓库的 GitLab Issues | `glab` CLI |
| **本地 markdown** | 此仓库 `.scratch/<feature>/` 下的文件 | 无：根本不需要远程仓库 |
| **其他** | 你指定的位置 | 你描述工作流的一段话 |

前三个作为技能中的模板提供，开箱即用。本地 markdown 是一等选项，不是后备：没有远程仓库的单人项目完全支持。有一点值得重复：如果使用 GitHub，不要使用本地 markdown。它们是替代方案，不是层级。

"其他"也不是占位符。这就是 Jira、Linear、Azure DevOps 和 Beads 都能工作的原因：你描述工作流，技能将你的文字记录在 `docs/agents/issue-tracker.md` 中，下游技能遵循这些文字。社区已经做过这些：基于 [MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) 的 Jira 变体、像 `gh` 一样工作的 Gitea CLI、手工构建的本地 dashboard。

## 常见问题

**必须使用 GitHub 吗？**

不。GitHub、GitLab 和 `.scratch/` 下的本地 markdown 都作为现成模板提供，其他任何东西通过"其他"路径工作。这是记录中重复最多的问题，大致是这些话：*"hard locked to github"*、*"can I use GitLab / Jira"*、*"what about Azure DevOps"*。每次的答案都是 tracker 是安装答案，不是技能属性。

**更新技能后需要重新运行吗？**

v1.1 后直接问过 Matt，他说需要。技能自己的结束消息更温和：它告诉你只有在切换 tracker 或重新开始时才需要重新运行。两者都合理，差距的真实原因是种子模板在版本间变化，所以旧版本写的 `docs/agents/issue-tracker.md` 可能与现在读取它的技能过时。如果下游技能开始做与文档描述不同的事情，重新运行是便宜的修复。

**它写入了 `CLAUDE.md`，但我在 Codex 上。**

已知差距，仍未解决。文件选择规则是"编辑存在的 `CLAUDE.md`，否则 `AGENTS.md`"：它检查哪个文件存在，而非哪个[环境](https://www.aihero.dev/ai-coding-dictionary/harness)在运行。有 `CLAUDE.md` 残留的 Claude Code 仓库会把 `## Agent skills` 块放在 Codex 从不读取的地方。两个变通方法在流传：手动将块移到 `AGENTS.md`，或保持 `AGENTS.md` 规范并让 `CLAUDE.md` 成为指向它的一行指针。如果两个文件都不存在，技能会询问创建哪一个而非自行选择，这让期望它直接决定的人困惑。

**它没有创建我的 triage label。**

确实没有。`docs/agents/triage-labels.md` 是一个**映射**：它告诉 `/triage` 你 tracker 中哪些字符串对应五个规范角色。它不运行 `gh label create`。在全新的 GitHub 仓库上 label 确实不存在，这已被报告为 bug 多次。两个后续：

- 如果你的 tracker 已使用规范名称，映射是恒等表，无需配置。这是预期的常见情况，不是缺失步骤。
- [wayfinder](https://aihero.dev/skills-wayfinder) 的 `wayfinder:map` 和 `wayfinder:<type>` label 也不在此创建，`gh issue create --label <missing>` 会直接失败而非创建 label。在 GitHub 仓库上首次运行 wayfinder 前手动创建它们。

**能在这里配置其他技能的行为吗（[grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) 频率、问题格式、语气）？**

不能。它配置三件事：tracker、label、文档布局。曾有直接请求让它成为用户偏好存放处，一贯回答是技能保持有主见：*"Config is death."* 偏好应作为简单指令放在你的 `CLAUDE.md` 中，每个技能已经读取它。

**能把配置放在 `~/.claude` 而非提交到每个仓库吗？**

目前不行。有人在多个仓库运行技能时提出了这个请求，目前没有用户级模式。每个仓库都有自己的 `docs/agents/`。

**有技能来配置其他技能不奇怪吗？**

一个长期存在的抱怨说是的，这些话：*"having a skill to set up the other skill does not feel right to me: that means the LLM is configuring its own skills."* 权衡是真实且承认的：安装步骤的替代方案是将 tracker 说明复制到每个涉及 issue 的技能中。输出是可检查、可编辑的 markdown，这是缓解措施：你可以读取它写的每个文件并手动更改，日常调整就是这样，而非另一次运行。

## 达标表现

- `docs/agents/issue-tracker.md` 和 `docs/agents/domain.md` 存在，如果 `triage` 已安装则还有 `triage-labels.md`。
- 指令文件（你的环境实际读取的那个）中出现 `## Agent skills` 节，带有一行摘要指向每个这些文件。
- 它提议的 tracker 匹配你实际使用的远程仓库，label 字符串匹配你 tracker 中实际存在的 label。
- 之后，`/to-tickets` 发布时不会询问 issue 去向，`/triage` 应用 label 而非发明它们。
- 技能文件本身没有任何变化。如果安装编辑了 `SKILL.md`，说明出错了。

## 适合位置

`setup-matt-pocock-skills` 是工程流程的**一次性安装**，是其他所有技能的前提而非链中步骤。它的邻居是它的读者：[triage](https://aihero.dev/skills-triage)，应用此处写入的 label 词汇表；[to-spec](https://aihero.dev/skills-to-spec) 和 [to-tickets](https://aihero.dev/skills-to-tickets)，发布到此处命名的 tracker；[wayfinder](https://aihero.dev/skills-wayfinder)，读取同一 tracker 文件的"路径查找操作（Wayfinding operations）"节以了解地图和子 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) 的存储方式。它记录的领域文档布局是 [domain-modeling](https://aihero.dev/skills-domain-modeling) 稍后填充的：它在术语或决策实际解决时才懒创建 `CONTEXT.md` 和 ADR，所以安装后的空仓库是预期状态。关于下一步使用哪个技能，[ask-matt](https://aihero.dev/skills-ask-matt) 路由整套技能。