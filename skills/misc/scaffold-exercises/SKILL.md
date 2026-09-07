---
name: scaffold-exercises
description: 创建带章节、题目、参考实现和讲解材料的练习目录结构，且能通过 lint。当用户想要 scaffold 练习、创建练习存根或搭建新课程章节时使用。
---

# Scaffold 练习

创建能通过 `pnpm ai-hero-cli internal lint` 的练习目录结构，然后用 `git commit` 提交。

## 目录命名

- **章节**：`exercises/` 下的 `XX-section-name/` (例如，`01-retrieval-skill-building`)
- **练习**：章节下的 `XX.YY-exercise-name/` (例如，`01.03-retrieval-with-bm25`)
- 章节编号 = `XX`，练习编号 = `XX.YY`
- 名称使用 dash-case (小写，连字符)

## 练习变体

每个练习至少需要以下子文件夹之一：

- `problem/`：带 TODO 的学生工作区
- `solution/`：参考实现
- `explainer/`：概念讲解材料，无 TODO

搭建存根时默认使用 `explainer/`，除非计划另有说明。

## 必需文件

每个子文件夹 (`problem/`、`solution/`、`explainer/`) 都需要一个 `readme.md`，要求如下：

- 内容**非空** (必须有实质内容，哪怕只有一行标题也可以)
- 没有损坏的链接

搭建存根时，创建一个只有标题和描述的最小 readme：

```md
# Exercise Title

Description here
```

如果子文件夹中有代码，还需要一个 `main.ts` (多于 1 行)。但对于存根，只有 readme 的练习也可以。

## 流程

1. **解析计划**：提取章节名、练习名和变体类型
2. **创建目录**：为每个路径运行 `mkdir -p`
3. **创建存根 readme**：每个变体文件夹一个带标题的 `readme.md`
4. **运行 lint**：用 `pnpm ai-hero-cli internal lint` 验证
5. **修复所有错误**：反复修改直到 lint 通过

## lint 规则小结

linter (`pnpm ai-hero-cli internal lint`) 检查以下内容：

- 每个练习都有子文件夹 (`problem/`、`solution/`、`explainer/`)
- `problem/`、`explainer/`、`explainer.1/` 至少存在一个
- 主要子文件夹中有 `readme.md` 且非空
- 没有 `.gitkeep` 文件
- 没有 `speaker-notes.md` 文件
- readme 中没有损坏的链接
- readme 中没有 `pnpm run exercise` 命令
- 除只有 readme 的情况外，每个子文件夹都需要 `main.ts`

## 移动和重命名练习

重新编号或移动练习时：

1. 用 `git mv` (而不是 `mv`) 重命名目录，保留 git 历史
2. 更新数字前缀以保持顺序
3. 移动后重新运行 lint

示例：

```bash
git mv exercises/01-retrieval/01.03-embeddings exercises/01-retrieval/01.04-embeddings
```

## 示例：按计划搭建存根

计划如下：

```
Section 05: Memory Skill Building
- 05.01 Introduction to Memory
- 05.02 Short-term Memory (explainer + problem + solution)
- 05.03 Long-term Memory
```

创建以下目录：

```bash
mkdir -p exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer
mkdir -p exercises/05-memory-skill-building/05.02-short-term-memory/{explainer,problem,solution}
mkdir -p exercises/05-memory-skill-building/05.03-long-term-memory/explainer
```

然后创建 readme 存根：

```
exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer/readme.md -> "# Introduction to Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/explainer/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/problem/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/solution/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.03-long-term-memory/explainer/readme.md -> "# Long-term Memory"
```
