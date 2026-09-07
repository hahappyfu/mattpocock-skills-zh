# Issue tracker: GitLab

此仓库的 issue 和规格说明以 GitLab issues 形式存放。使用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI 执行所有操作。

## 约定

- **创建 issue**：`glab issue create --title "..." --description "..."`。使用 heredoc 处理多行描述。传递 `--description -` 打开编辑器。
- **读取 issue**：`glab issue view <number> --comments`。使用 `-F json` 获取机器可读输出。
- **列出 issue**：`glab issue list -F json`，配合适当的 `--label` 过滤器。
- **评论 issue**：`glab issue note <number> --message "..."`。GitLab 将评论称为"notes"。
- **应用/移除标签**：`glab issue update <number> --label "..."` / `--unlabel "..."`。多个标签可以用逗号分隔或重复标志。
- **关闭**：`glab issue close <number>`。`glab issue close` 不接受关闭评论，因此先用 `glab issue note <number> --message "..."` 发布说明，然后关闭。
- **Merge requests**：GitLab 将 PR 称为"merge requests"。使用 `glab mr create`、`glab mr view`、`glab mr note` 等，与 `gh pr ...` 相同的形状，用 `mr` 代替 `pr`，用 `note`/`--message` 代替 `comment`/`--body`。

从 `git remote -v` 推断仓库；`glab` 在克隆目录中自动执行此操作。

## MR 作为 triage 表面

**MR 作为请求表面：否。** _(如果此仓库将外部 merge requests 视为功能请求，设置为 `yes`；`/triage` 读取此标志。)_

设置为 `yes` 时，MR 使用与 issue 相同的标签和状态，通过 `glab mr` 等效命令执行：

- **读取 MR**：`glab mr view <number> --comments` 和 `glab mr diff <number>` 获取 diff。
- **列出外部 MR 用于 triage**：`glab mr list -F json`，然后只保留作者不是项目成员/所有者的 MR（贡献者的 MR，不是维护者的进行中工作）。
- **评论/标签/关闭**：`glab mr note`、`glab mr update --label`/`--unlabel`、`glab mr close`。

与 GitHub 不同，GitLab 分别编号 issues 和 MRs，因此一旦你知道维护者指的是哪个表面，`#42` 就是明确的。

## 当技能说"发布到 issue tracker"

创建一个 GitLab issue。

## 当技能说"获取相关工单"

运行 `glab issue view <number> --comments`。

## 路径查找操作

供 `/wayfinder` 使用。**地图（map）** 是一个 issue，**子（child）** issues 作为工单。

- **地图**：一个标记为 `wayfinder:map` 的 issue，包含 Notes / Decisions-so-far / Fog 正文。`glab issue create --label wayfinder:map`。（在具有原生 epics 的 GitLab 层级上，epic 可能代替持有地图；标记的 issue 在任何地方都有效。）
- **子工单**：一个在描述顶部携带 `Part of #<map>` 并标记为 `wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）的 issue。认领后，工单分配给驱动开发者。
- **阻塞**：GitLab 的**原生阻塞链接**，规范的、UI 可见的表示。使用 `/blocked_by #<n>` 快捷操作添加，作为 note 发布（`glab issue note <child> --message "/blocked_by #<blocker>"`）。原生阻塞链接是 Premium/Ultimate 功能；在免费层级（或不可用的地方）回退到描述顶部的 `Blocked by: #<n>, #<n>` 行。当每个 blocker 关闭时，工单解除阻塞。
- **frontier 查询**：`glab issue list -F json` 限定到地图的子 issues，丢弃有任何开放 blocker 的：原生 `blocked_by` 链接到开放 issue（`glab api projects/:id/issues/:iid/links`），或 `Blocked by` 行中有开放 issue，或有 assignee；地图顺序中第一个优先。
- **认领**：`glab issue update <n> --assignee @me`，会话的首次写入。
- **解决**：`glab issue note <n> --message "<answer>"`，然后 `glab issue close <n>`，然后在地图的 Decisions-so-far 中追加上下文指针（gist + 链接）。
