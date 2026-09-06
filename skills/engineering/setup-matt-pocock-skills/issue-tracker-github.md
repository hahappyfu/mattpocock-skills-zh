# Issue tracker: GitHub

此仓库的 issue 和规格说明以 GitHub issues 形式存放。使用 `gh` CLI 执行所有操作。

## 约定

- **创建 issue**：`gh issue create --title "..." --body "..."`。使用 heredoc 处理多行正文。
- **读取 issue**：`gh issue view <number> --comments`，使用 `jq` 过滤评论并获取标签。
- **列出 issue**：`gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`，配合适当的 `--label` 和 `--state` 过滤器。
- **评论 issue**：`gh issue comment <number> --body "..."`
- **应用/移除标签**：`gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **关闭**：`gh issue close <number> --comment "..."`

从 `git remote -v` 推断仓库；`gh` 在克隆目录中自动执行此操作。

## PR 作为 triage 表面

**PR 作为请求表面：否。** _(如果此仓库将外部 PR 视为功能请求，设置为 `yes`；`/triage` 读取此标志。)_

设置为 `yes` 时，PR 使用与 issue 相同的标签和状态，通过 `gh pr` 等效命令执行：

- **读取 PR**：`gh pr view <number> --comments` 和 `gh pr diff <number>` 获取 diff。
- **列出外部 PR 用于 triage**：`gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`，然后只保留 `authorAssociation` 为 `CONTRIBUTOR`、`FIRST_TIME_CONTRIBUTOR` 或 `NONE` 的（丢弃 `OWNER`/`MEMBER`/`COLLABORATOR`）。
- **评论/标签/关闭**：`gh pr comment`、`gh pr edit --add-label`/`--remove-label`、`gh pr close`。

GitHub 在 issues 和 PR 之间共享一个编号空间，因此裸 `#42` 可能是任意一个：用 `gh pr view 42` 解析，然后回退到 `gh issue view 42`。

## 当技能说"发布到 issue tracker"

创建一个 GitHub issue。

## 当技能说"获取相关工单"

运行 `gh issue view <number> --comments`。

## 路径查找操作

供 `/wayfinder` 使用。**地图（map）** 是一个 issue，**子（child）** issues 作为工单。

- **地图**：一个标记为 `wayfinder:map` 的 issue，包含 Notes / Decisions-so-far / Fog 正文。`gh issue create --label wayfinder:map`。
- **子工单**：链接到地图的 issue 作为 GitHub 子 issue（`gh api` 在子 issues 端点上）。在未启用子 issues 的地方，将子工单添加到地图正文的任务列表中，并在子工单正文顶部放置 `Part of #<map>`。标签：`wayfinder:<type>`（`research`/`prototype`/`grilling`/`task`）。认领后，工单分配给驱动开发者。
- **阻塞**：GitHub 的**原生 issue 依赖**，规范的、UI 可见的表示。使用 `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>` 添加阻塞边，其中 `<blocker-db-id>` 是 blocker 的数字**数据库 id**（`gh api repos/<owner>/<repo>/issues/<n> --jq .id`，_不是_ `#number` 或 `node_id`）。GitHub 报告 `issue_dependencies_summary.blocked_by`（仅开放 blocker，实时门控）。在依赖不可用的地方，回退到子工单正文顶部的 `Blocked by: #<n>, #<n>` 行。当每个 blocker 关闭时，工单解除阻塞。
- **frontier 查询**：列出地图的开放子 issues（`gh issue list --state open`，限定到地图的子 issues / 任务列表），丢弃有任何开放 blocker 的（`issue_dependencies_summary.blocked_by > 0`，或 `Blocked by` 行中有开放 issue）或有 assignee 的；地图顺序中第一个优先。
- **认领**：`gh issue edit <n> --add-assignee @me`，会话的首次写入。
- **解决**：`gh issue comment <n> --body "<answer>"`，然后 `gh issue close <n>`，然后在地图的 Decisions-so-far 中追加上下文指针（gist + 链接）。
