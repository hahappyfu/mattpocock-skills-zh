# Skills 汉化总设计

本文档是本仓库汉化工作的总纲，后续翻译接力（包括新开会话）都遵循它。
完整决策过程见 [2026-09-06-skills-zh-design.md](docs/superpowers/specs/2026-09-06-skills-zh-design.md)。

## 范围

全部翻译：37 个 `SKILL.md`，顶层和各 bucket 的 `README.md`，`docs/` 文档页，插件描述等附带文本。

## 翻译规范

1. 说明文字、标题、步骤描述翻成简体中文。
2. 命令、代码块、prompt 模板、文件名、skill 名保持英文原样。
3. frontmatter 中 `description` 翻中文，`name` 保持英文。
4. 术语首次出现用"中文（英文）"格式，后续只用中文，译法以 `TRANSLATION-GLOSSARY.md` 为准。新词先加表再翻。
5. 仓库全文禁用 em-dash，中文用逗号、冒号、句号、括号或连词改写。
6. 每条 skill 条目保持原有链接结构（README 中的 skill 名链接到其 `SKILL.md`）。
7. 只做语言转换，不改 skill 的行为逻辑，不顺手重构无关代码。

## 同步上游流程

1. 本 fork 已有 `origin`（自己的仓库），上游用 `upstream` 指向 `https://github.com/mattpocock/skills.git`（如未添加，先加一次）。
2. 日常同步：`git fetch upstream`，`git merge upstream/main`。
3. 冲突文件按"先合英文，再补中文"处理：先接受上游英文改动，再把新增或变更的说明文字翻成中文。
4. 动过 manifest（`.claude-plugin/plugin.json`、顶层 `README.md`）后跑 `claude plugin validate . --strict`。

## 分批计划

1. 试点：`tdd`、`code-review` 两个 skill，加术语表初稿。用户确认风格。
2. 第二批：`engineering/` 其余 skill 和对应 `docs/`、`README.md`。
3. 第三批：`productivity/` 及对应文档。
4. 第四批：`in-progress/`、`misc/`、`deprecated/` 及顶层 `README.md`、插件描述。
5. 每批独立 commit，逐批推送。

## 成功标准

1. 命令和代码块零改动，链接结构不断。
2. 术语全表统一，无 em-dash 混入。
3. `claude plugin validate . --strict` 通过（动过 manifest 时）。
