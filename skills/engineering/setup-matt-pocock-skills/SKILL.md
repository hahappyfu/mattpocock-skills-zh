---
name: setup-matt-pocock-skills
description: "为工程技能配置此仓库：设置 issue tracker、triage label 词汇表和领域文档布局。在使用其他工程技能之前运行一次。"
disable-model-invocation: true
---

# 安装 Matt Pocock 的 Skills

搭建工程技能所依赖的仓库级配置：

- **Issue tracker**：issue 存放位置（默认 GitHub；也支持本地 markdown）
- **Triage labels**：五个规范 triage 角色使用的字符串
- **领域文档（Domain docs）**：`CONTEXT.md` 和 ADR 存放位置，以及读取它们的消费规则

这是一个由提示驱动的技能，而非确定性脚本。先探索，呈现发现，与用户确认，然后写入。

## 流程

### 1. 探索

查看当前仓库的起始状态。读取已有内容；不要假设：

- `git remote -v` 和 `.git/config`：这是 GitHub 仓库吗？是哪一个？
- 仓库根目录的 `AGENTS.md` 和 `CLAUDE.md`：是否存在？是否已有 `## Agent skills` 节？
- 仓库根目录的 `CONTEXT.md` 和 `CONTEXT-MAP.md`
- `docs/adr/` 和任何 `src/*/docs/adr/` 目录
- `docs/agents/`：此技能的先前输出是否已存在？
- `.scratch/`：本地 markdown issue tracker 约定已在使用的标志
- `triage` 技能是否已安装？（同级目录下有 `triage` 文件夹，或在你的可用技能中有 `triage`）。这决定 B 节是否运行。
- Monorepo 信号：`pnpm-workspace.yaml`、`package.json` 中的 `workspaces` 字段，或填充了 `src/` 的 `packages/*`。这些只出现在真正的大型多包仓库中；缺失意味着单上下文，这几乎适用于所有仓库。

### 2. 呈现发现并提问

总结现有内容和缺失内容。然后按顺序处理各节。一节一个答案，然后下一节。

每节以推荐答案开头，让用户可以用一个词接受。仅在选择确实有分支时给出一行说明；当探索已解决问题时完全跳过该节（B 节在 `triage` 未安装时跳过，C 节在没有 monorepo 时跳过）。

**A 节：Issue tracker。**

> 说明："issue tracker" 是此仓库 issue 的存放位置。`to-tickets`、`triage` 和 `to-spec` 等技能从中读取和写入。它们需要知道是调用 `gh issue create`、在 `.scratch/` 下写 markdown 文件，还是遵循你描述的其他工作流。选择你实际为此仓库追踪工作的地方。

默认姿态：这些技能为 GitHub 设计。如果 `git remote` 指向 GitHub，就提议 GitHub。如果 `git remote` 指向 GitLab（`gitlab.com` 或自托管主机），就提议 GitLab。否则（或用户更偏好时），提供：

- **GitHub**：issue 在仓库的 GitHub Issues 中（使用 `gh` CLI）
- **GitLab**：issue 在仓库的 GitLab Issues 中（使用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI）
- **本地 markdown（Local markdown）**：issue 在此仓库 `.scratch/<feature>/` 下的文件中（适用于无远程仓库的单人项目）
- **其他（Other）**（Jira、Linear 等）：让用户用一段话描述工作流；技能将记录为自由文本

将选择记录在 `docs/agents/issue-tracker.md` 中。GitHub 和 GitLab 模板带有"PR 作为请求面"标志，默认**关闭**。保持关闭，不要提起：想要外部 PR 进入 triage 队列的用户可以稍后在文件中翻转该标志。

**B 节：Triage label 词汇表。** 如果 `triage` 技能未安装（探索已告诉你），完全跳过此节，因为未安装的技能不需要 label。

如果已安装，只问一个问题：

> Do you want to keep the default triage labels? (recommended: **yes**)

默认是五个规范角色，每个 label 字符串等于其名称：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。选择 **yes** 时，按原样写入。仅当用户说不时（通常因为其 tracker 已使用其他名称，例如用 `bug:triage` 代替 `needs-triage`），收集覆盖项，让 `triage` 应用现有 label 而非创建重复项。

**C 节：领域文档（Domain docs）。** 默认**单上下文（single-context）**（一个 `CONTEXT.md` + 仓库根目录的 `docs/adr/`）。这适用于几乎所有仓库；无需询问直接写入。

仅在探索发现 monorepo 信号时提供**多上下文（multi-context）**（一个根 `CONTEXT-MAP.md` 指向每个上下文的 `CONTEXT.md` 文件）。然后确认他们想要哪种布局。

### 3. 确认并编辑

向用户展示草稿：

- 要添加到 `CLAUDE.md` / `AGENTS.md`（选择规则见步骤 4）的 `## Agent skills` 块
- `docs/agents/issue-tracker.md`、`docs/agents/domain.md` 和 `docs/agents/triage-labels.md` 的内容（最后一个仅在 `triage` 已安装时）

让他们在写入前编辑。

### 4. 写入

**选择要编辑的文件：**

- 如果 `CLAUDE.md` 存在，编辑它。
- 否则如果 `AGENTS.md` 存在，编辑它。
- 如果都不存在，询问用户创建哪一个；不要替他们选择。

当 `CLAUDE.md` 已存在时，永远不要创建 `AGENTS.md`（反之亦然）；始终编辑已有的那个。

如果所选文件中已有 `## Agent skills` 块，就地更新其内容而非追加副本。不要覆盖周围节的用户编辑。

块：

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout: "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```

仅当 `triage` 已安装且 B 节运行时，才包含 `### Triage labels` 子块并写入 `docs/agents/triage-labels.md`。未安装时，两者都省略。

然后以本技能文件夹中的种子模板为起点写入文档文件：

- [issue-tracker-github.md](./issue-tracker-github.md)：GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md)：GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md)：本地 markdown issue tracker
- [triage-labels.md](./triage-labels.md)：label 映射（仅在 `triage` 已安装时）
- [domain.md](./domain.md)：领域文档消费规则 + 布局

对于"其他" issue tracker，从零开始使用用户描述编写 `docs/agents/issue-tracker.md`。

### 5. 完成

告诉用户安装已完成，哪些工程技能现在将从这些文件读取。提及他们可以稍后直接编辑 `docs/agents/*.md`；仅在需要切换 issue tracker 或从头开始时才需要重新运行此技能。