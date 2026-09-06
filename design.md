# Skills 汉化总设计

本文档是本仓库汉化工作的总纲，后续翻译接力（包括新开会话）都遵循它。
完整决策过程见 [2026-09-06-skills-zh-design.md](docs/superpowers/specs/2026-09-06-skills-zh-design.md)。

## 范围

全部翻译：37 个 `SKILL.md`，顶层和各 bucket 的 `README.md`，`docs/` 文档页，插件描述等附带文本。
执行方式：按 bucket 分批（第一批 `engineering/`），子智能体翻译、控制者审核。

## 翻译规范

### 翻译项（翻成简体中文）

1. 说明文字、标题、步骤描述、列表项、引用块。
2. frontmatter 的 `description`（保持 YAML 结构不变，`name` 不翻）。
3. `agents/openai.yaml` 中仅 `interface.short_description` 翻译，`display_name` 保持。
4. `docs/` 文档页的四个固定节标题译为：What it does → 它做什么，When to reach for it → 何时使用，Common questions → 常见问题，It's working if → 达标表现。
5. 术语译法以 `TRANSLATION-GLOSSARY.md` 为准；术语首次出现用"中文（英文）"格式，之后只用中文。遇到表里没有的词，先加表再翻。

### 保留项（保持英文原样，一个字符都不动）

1. 代码块内的一切（fenced code block 全部内容，包括注释）。
2. 命令、文件路径、URL、锚点目标、图片路径。
3. prompt 模板（SKILL.md 里引号包起来的、要原样发给子智能体或用户的提示词）。
4. skill 名（如 `tdd`、`grilling`）、skill 之间的调用指令中的名字。
5. frontmatter 的 `name`、`agents/openai.yaml` 的 `display_name`。
6. `.sh` 模板文件（`wizard/template.sh`、`diagnosing-bugs/scripts/hitl-loop.template.sh`）整体不翻。
7. Markdown 链接的 `(...)` 目标部分；链接文字 `[...]` 里的文件名不翻，链接文字若是描述性短语则翻。

### 标点与排版

1. 全文禁用 em-dash，包括中文破折号（——）。需要时用逗号、冒号、句号、括号或连词改写。
2. 中文与英文单词、数字、行内代码之间加一个半角空格（如"使用 `tdd` 技能"）。
3. 全半角标点：中文句子用全角标点，行内代码、命令内部保持半角。

### 结构不变量

1. frontmatter 的键、顺序、YAML 语法不变。
2. 标题的数量、层级、顺序不变（文字可译）。
3. 正文若存在指向本文档内标题的锚点链接（如 `[Ticket Types](#ticket-types)`），标题翻译后锚点同步改为中文标题的 GitHub slug（中文保留、空格换连字符）。
4. 列表项数量、表格行列数、代码块数量不变。
5. 只做语言转换，不改行为逻辑，不顺手重构无关内容。

## 验收规范

每个翻译任务完成后，按以下清单逐项核验，全部通过才算完成。

1. 保留项零改动：对比翻译前后提取的 fenced code block 内容，逐字节一致。
   校验：`git show <BASE>:<file> | awk '/^```/{f=!f;next} f' | md5sum` 与工作区同命令输出一致。
2. 结构不变量：frontmatter `name` 行在 diff 中无改动；`grep -c '^#'` 标题数前后一致；链接目标文件存在。
3. 标点：`grep -n '—' <changed files>` 无输出（代码块内上游原有的除外，需逐一指出）。
4. 排版：中英文之间有空格；无漏翻的英文段落（人工通读 diff）。
5. 术语一致：与 `TRANSLATION-GLOSSARY.md` 一致；新术语已补进表里。
6. 人工审读：控制者逐 diff 审核规格合规性与翻译质量（准确性、流畅度、无机翻腔），发现 Critical/Important 问题进入修复循环。
7. 最终验收：整分支宽范围复审通过，`claude plugin validate . --strict` 通过（动过 manifest 时）。

## 同步上游流程

1. 本 fork 已有 `origin`（自己的仓库），上游用 `upstream` 指向 `https://github.com/mattpocock/skills.git`（如未添加，先加一次）。
2. 日常同步：`git fetch upstream`，`git merge upstream/main`。
3. 冲突文件按"先合英文，再补中文"处理：先接受上游英文改动，再把新增或变更的说明文字翻成中文。
4. 动过 manifest（`.claude-plugin/plugin.json`、顶层 `README.md`）后跑 `claude plugin validate . --strict`。

## 分批计划

1. 第一批：`engineering/` 全部（18 个 SKILL.md + 附属 md + agents yaml + docs 页 + bucket README），本批期间建立 `TRANSLATION-GLOSSARY.md`。
2. 第二批：`productivity/` 及对应文档。
3. 第三批：`in-progress/`、`misc/`、`deprecated/` 及顶层 `README.md`、插件描述。
4. 每批独立分支、独立 commit、审后推送。

## 成功标准

1. 命令和代码块零改动，链接结构不断。
2. 术语全表统一，无 em-dash 混入。
3. `claude plugin validate . --strict` 通过（动过 manifest 时）。
