# Out-of-Scope 知识库

仓库中的 `.out-of-scope/` 目录存储被拒绝的功能请求的持久记录。它有两个用途：

1. **机构记忆**：记录功能被拒绝的原因，这样当 issue 被关闭时，理由不会丢失
2. **去重**：当新的 issue 与先前的拒绝匹配时，技能可以展示之前的决定，而不是重新审议

## 目录结构

```
.out-of-scope/
├── dark-mode.md
├── plugin-system.md
└── graphql-api.md
```

每个**概念**一个文件，而非每个 issue 一个。多个请求相同功能的 issue 归为一个文件。

## 文件格式

文件应以轻松、可读的风格撰写，更像一份简短的设计文档，而非数据库记录。使用段落、代码示例和案例来让理由清晰，对首次遇到的人也有用。

```markdown
# Dark Mode

This project does not support dark mode or user-facing theming.

## Why this is out of scope

The rendering pipeline assumes a single color palette defined in
`ThemeConfig`. Supporting multiple themes would require:

- A theme context provider wrapping the entire component tree
- Per-component theme-aware style resolution
- A persistence layer for user theme preferences

This is a significant architectural change that doesn't align with the
project's focus on content authoring. Theming is a concern for downstream
consumers who embed or redistribute the output.

```ts
// The current ThemeConfig interface is not designed for runtime switching:
interface ThemeConfig {
  colors: ColorPalette; // single palette, resolved at build time
  fonts: FontStack;
}
```

## Prior requests

- #42: "Add dark mode support"
- #87: "Night theme for accessibility"
- #134: "Dark theme option"
```

### 命名文件

使用简短、描述性的 kebab-case 名称命名概念：`dark-mode.md`、`plugin-system.md`、`graphql-api.md`。名称应足够醒目，让浏览目录的人无需打开文件就能理解被拒绝的内容。

### 撰写理由

理由应有实质内容：不是"我们不想要这个"，而是为什么。好的理由引用：

- 项目范围或理念（"本项目专注于 X；主题化是下游的关注点"）
- 技术约束（"支持这一点需要 Y，与我们的 Z 架构冲突"）
- 战略决策（"我们选择使用 A 而非 B，因为……"）

理由应具有持久性。避免引用临时情况（"我们目前太忙了"）；这些不是真正的拒绝，而是延期。

## 何时检查 `.out-of-scope/`

在 triage 期间（步骤 1：收集上下文），读取 `.out-of-scope/` 中的所有文件。评估新 issue 时：

- 检查请求是否匹配现有的 out-of-scope 概念
- 匹配按概念相似性，而非关键词："night theme" 匹配 `dark-mode.md`
- 如果匹配，向维护者展示："这与 `.out-of-scope/dark-mode.md` 类似。我们之前拒绝它是因为 [理由]。你仍然持相同观点吗？"

维护者可以：

- **确认**：新 issue 被添加到现有文件的"Prior requests"列表，然后关闭
- **重新考虑**：out-of-scope 文件被删除或更新，issue 进入正常 triage 流程
- **不同意**：issue 相关但不同，继续正常 triage 流程

## 何时写入 `.out-of-scope/`

仅当 **enhancement**（非 bug）被*拒绝*为 `wontfix` 时。这同样适用于 enhancement PR：被拒绝的 PR 会被记录在这里，这样相同的请求不会以新代码的形式返回。

当某项因为**已实现**而被关闭为 `wontfix` 时，**不要**写入这里。那是已构建的功能，而非被拒绝的；记录它会用虚假的拒绝污染去重检查。相反，关闭评论应指向功能已存在的位置。

流程：

1. 维护者决定功能请求 out of scope
2. 检查是否已存在匹配的 `.out-of-scope/` 文件
3. 如果存在：将新 issue 添加到"Prior requests"列表
4. 如果不存在：创建新文件，包含概念名称、决定、理由和第一条先前请求
5. 在 issue 上发布评论，解释决定并提及 `.out-of-scope/` 文件
6. 使用 `wontfix` label 关闭 issue

## 更新或删除 out-of-scope 文件

如果维护者改变了对先前被拒绝概念的看法：

- 删除 `.out-of-scope/` 文件
- 技能无需重新打开旧 issue；它们是历史记录
- 触发重新考虑的新 issue 进入正常 triage 流程
