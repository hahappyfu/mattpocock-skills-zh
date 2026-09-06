# mattpocock-skills 汉化设计

日期：2026-09-06
状态：已批准，进入试点

## 背景

本仓库是 mattpocock/skills 的 fork，共 37 个 skill。目标是汉化成中文版自用，并能持续同步上游更新。

## 范围

全部翻译：37 个 `SKILL.md`，顶层和各 bucket 的 `README.md`，`docs/` 文档页，插件描述等附带文本。

## 翻译规范

1. 说明文字、标题、步骤描述翻成简体中文。
2. 命令、代码块、prompt 模板、文件名、skill 名保持英文原样。
3. frontmatter 中 `description` 翻中文，`name` 保持英文。
4. 术语首次出现用"中文（英文）"格式，后续只用中文。
5. 仓库全文禁用 em-dash，中文用逗号、冒号、句号、括号或连词改写。
6. 每条 skill 条目保持原有链接结构（README 中的 skill 名链接到其 `SKILL.md`）。

## 术语表

`TRANSLATION-GLOSSARY.md`（仓库根目录），试点后定稿，批量阶段严格查表。新词先加表再翻。

种子条目（试点时确认）：skill， workflow， handoff， grilling， triage， spec， ticket。

## 同步流程（`SYNC.md`）

1. 给 fork 添加 upstream：`git remote add upstream https://github.com/mattpocock/skills.git`（一次性）。
2. 日常同步：`git fetch upstream`，`git merge upstream/main`。
3. 冲突文件按"先合英文，再补中文"处理：先接受上游英文改动，再把新增或变更的说明文字翻成中文。
4. 动过 manifest（`.claude-plugin/plugin.json`、顶层 `README.md`）后跑 `claude plugin validate . --strict`。

## 分批计划

1. 试点：`tdd`、`code-review` 两个 skill，加术语表初稿和 `SYNC.md`。用户确认风格。
2. 第二批：`engineering/` 其余 skill 和对应 `docs/`、`README.md`。
3. 第三批：`productivity/` 及对应文档。
4. 第四批：`in-progress/`、`misc/`、`deprecated/` 及顶层 `README.md`、插件描述。
5. 每批独立 commit，ATOM 化推送。

## 成功标准

1. 试点验收：两个 `SKILL.md` 按规范翻译，命令和代码块零改动，术语表建立。
2. 批量验收：范围内的文件全翻完，链接结构不断，`claude plugin validate . --strict` 通过，无 em-dash 混入。

## 非目标

1. 不改 skill 的行为逻辑，只做语言转换。
2. 不做上游没有的新 skill，只跟随同步。
3. 不顺手重构无关代码。
