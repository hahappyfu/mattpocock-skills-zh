# Engineering bucket 汉化 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 把 `skills/engineering/` 全部 18 个 skill（SKILL.md、附属 md、agents/openai.yaml）及其 `docs/engineering/` 文档页和 bucket README 翻成简体中文，其余批次不动。

**架构：** 每个 skill 一个任务（SKILL.md + 附属文件 + docs 页 + openai.yaml 一起翻，保证同一 skill 术语一致）。翻译者子智能体按 design.md 翻译规范 + TRANSLATION-GLOSSARY.md 术语表执行；控制者本人做任务审查（用户指定），机械校验（代码块逐字节一致、em-dash、标题数）先跑脚本再人工读 diff。shell 模板（wizard/template.sh、diagnosing-bugs/scripts/hitl-loop.template.sh）不翻。

**技术栈：** Markdown + YAML + bash 校验命令 + git。

## 全局约束（每个任务的审查透镜，逐字执行）

1. 只翻说明文字：fenced code block 全部内容（含注释）、命令、文件路径、URL、prompt 模板、skill 名、frontmatter `name`、openai.yaml `display_name` 保持英文，一个字符不动。
2. frontmatter `description`、正文说明文字、标题、列表项翻成简体中文；openai.yaml 仅 `short_description` 翻。
3. 术语译法以 `TRANSLATION-GLOSSARY.md` 为准；表里没有的词先加表（追加到表尾，不留空行）再翻。
4. 结构不变量：frontmatter 键与顺序不变；标题数量、层级、顺序不变；列表项数量不变；链接目标 `(...)` 不变；正文内锚点链接 `[X](#anchor)` 的标题若被翻译，锚点同步改成中文标题的 GitHub slug。
5. 全文禁 em-dash（`—` 与 `——`），代码块内上游原有的除外。
6. 中文与英文单词、数字、行内代码之间加一个半角空格。
7. 只做语言转换，不改行为逻辑，不增删内容，不顺手重构。
8. 每个任务独立 commit，commit message 用中文，格式 `translate: <范围> 汉化`。

## 文件结构

- `skills/engineering/<skill>/SKILL.md`：各 skill 主文件，翻说明文字。
- `skills/engineering/<skill>/agents/openai.yaml`：仅 `short_description` 一行翻中文。
- `skills/engineering/<skill>/*.md`：skill 附属参考文档，同规则翻译。
- `docs/engineering/<skill>.md`：human-facing 文档页，同规则翻译；四个固定节标题译为 What it does → 它做什么、When to reach for it → 何时使用、Common questions → 常见问题、It's working if → 达标表现。
- `skills/engineering/README.md`：bucket 索引，最后翻译（对照已翻好的各 SKILL 一句话简介）。
- 不动：`wizard/template.sh`、`diagnosing-bugs/scripts/hitl-loop.template.sh`、`deprecated/`、顶层 `README.md`、`.claude-plugin/`。

## 每个任务通用的校验命令

对任务改动的每个 md 文件 `<F>`（BASE 为分派实现者前记录的提交）：

```bash
# 1. 代码块逐字节一致（输出两个 md5 必须相同）
git show BASE:skills/.../<F> | awk '/^```/{f=!f;next} f' | md5sum
awk '/^```/{f=!f;next} f' skills/.../<F> | md5sum
# 2. 无 em-dash（代码块外）
awk '/^```/{f=!f;next} !f' skills/.../<F> | grep -n '—' && echo FAIL || echo OK
# 3. 标题数不变
git show BASE:skills/.../<F> | grep -c '^#' ; grep -c '^#' skills/.../<F>
```

### 任务 1：tdd skill 汉化

**文件：**
- 修改：`skills/engineering/tdd/SKILL.md`
- 修改：`skills/engineering/tdd/tests.md`
- 修改：`skills/engineering/tdd/mocking.md`
- 修改：`docs/engineering/tdd.md`
- 修改：`skills/engineering/tdd/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。本 skill 是全仓翻译风格的锚点。

- [ ] **步骤 2：翻译四个 md 文件**

按全局约束翻译。注意：`tdd` 的 SKILL.md 中 `Ask: "What's the public interface, and which seams should we test?"` 是要原样发给用户的问句，prompt 性质，保留英文；`tests.md`、`mocking.md` 里的 TypeScript 代码块与代码注释全部保留；docs 页外链 `https://aihero.dev/...` 的链接目标不动。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description: "Test-driven red-green-refactor"` 翻为 `"测试驱动的 red-green-refactor"`；`display_name: "TDD"` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 4 个 md 文件逐一执行上方三条校验，全部通过。代码块 md5 前后不一致即规格失败。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/tdd docs/engineering/tdd.md
git commit -m "translate: tdd skill 汉化"
```

### 任务 2：code-review skill 汉化

**文件：**
- 修改：`skills/engineering/code-review/SKILL.md`
- 修改：`docs/engineering/code-review.md`
- 修改：`skills/engineering/code-review/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。frontmatter `description` 很长且含触发语，全翻中文，YAML 结构与引号保持。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。注意：SKILL.md 中 Standards/Spec 两个子智能体的 prompt 简报（"The brief: ..." 引文）是逐字发给子智能体的 prompt 模板，保留英文原文，只翻其外的说明文字；Fowler smell 名单（Mysterious Name、Duplicated Code 等 12 个）是术语名，保留英文，其后的修复建议翻中文。`git diff <fixed-point>...HEAD` 等命令保留。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description: "Review a diff on standards and spec"` 翻为 `"按 Standards 与 Spec 两轴审查 diff"`；`display_name: "Code Review"` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/code-review docs/engineering/code-review.md
git commit -m "translate: code-review skill 汉化"
```

### 任务 3：ask-matt skill 汉化

**文件：**
- 修改：`skills/engineering/ask-matt/SKILL.md`
- 修改：`skills/engineering/ask-matt/PHASE-BOUNDARIES.md`
- 修改：`docs/engineering/ask-matt.md`
- 修改：`skills/engineering/ask-matt/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译三个 md 文件**

按全局约束翻译。注意：`ask-matt` 是路由 skill，SKILL.md 里指向其他 skill 的调用指令（`Call the Skill tool with "grilling"` 形态）中 skill 名保留英文，指令说明翻中文；用户可见的引导问句属说明文字，翻中文。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 3 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/ask-matt docs/engineering/ask-matt.md
git commit -m "translate: ask-matt skill 汉化"
```

### 任务 4：diagnosing-bugs skill 汉化

**文件：**
- 修改：`skills/engineering/diagnosing-bugs/SKILL.md`
- 修改：`docs/engineering/diagnosing-bugs.md`
- 修改：`skills/engineering/diagnosing-bugs/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。注意：SKILL.md 里引用的 `scripts/hitl-loop.template.sh` 路径与任何 shell 内容不翻；诊断循环各阶段名（feedback loop、instrument 等）按术语表处理。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/diagnosing-bugs docs/engineering/diagnosing-bugs.md
git commit -m "translate: diagnosing-bugs skill 汉化"
```

### 任务 5：domain-modeling skill 汉化

**文件：**
- 修改：`skills/engineering/domain-modeling/SKILL.md`
- 修改：`skills/engineering/domain-modeling/ADR-FORMAT.md`
- 修改：`skills/engineering/domain-modeling/CONTEXT-FORMAT.md`
- 修改：`docs/engineering/domain-modeling.md`
- 修改：`skills/engineering/domain-modeling/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译四个 md 文件**

按全局约束翻译。注意：ADR-FORMAT.md 与 CONTEXT-FORMAT.md 是模板文档，其中的 fenced 代码块（模板示例、字段结构）整体保留，行内示例路径保留。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 4 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/domain-modeling docs/engineering/domain-modeling.md
git commit -m "translate: domain-modeling skill 汉化"
```

### 任务 6：codebase-design skill 汉化

**文件：**
- 修改：`skills/engineering/codebase-design/SKILL.md`
- 修改：`skills/engineering/codebase-design/DEEPENING.md`
- 修改：`skills/engineering/codebase-design/DESIGN-IT-TWICE.md`
- 修改：`docs/engineering/codebase-design.md`
- 修改：`skills/engineering/codebase-design/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译四个 md 文件**

按全局约束翻译。注意：module、interface、depth、seam、adapter、leverage、locality 这组词汇是 skill 的核心术语，按术语表保留英文，首次出现可加中文注。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 4 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/codebase-design docs/engineering/codebase-design.md
git commit -m "translate: codebase-design skill 汉化"
```

### 任务 7：grill-with-docs skill 汉化

**文件：**
- 修改：`skills/engineering/grill-with-docs/SKILL.md`
- 修改：`docs/engineering/grill-with-docs.md`
- 修改：`skills/engineering/grill-with-docs/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。SKILL.md 只有 7 行，重点是 docs 页。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/grill-with-docs docs/engineering/grill-with-docs.md
git commit -m "translate: grill-with-docs skill 汉化"
```

### 任务 8：research skill 汉化

**文件：**
- 修改：`skills/engineering/research/SKILL.md`
- 修改：`docs/engineering/research.md`
- 修改：`skills/engineering/research/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/research docs/engineering/research.md
git commit -m "translate: research skill 汉化"
```

### 任务 9：resolving-merge-conflicts skill 汉化

**文件：**
- 修改：`skills/engineering/resolving-merge-conflicts/SKILL.md`
- 修改：`docs/engineering/resolving-merge-conflicts.md`
- 修改：`skills/engineering/resolving-merge-conflicts/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。git 命令（`git merge --continue` 等）与冲突标记保留。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/resolving-merge-conflicts docs/engineering/resolving-merge-conflicts.md
git commit -m "translate: resolving-merge-conflicts skill 汉化"
```

### 任务 10：implement skill 汉化

**文件：**
- 修改：`skills/engineering/implement/SKILL.md`
- 修改：`docs/engineering/implement.md`
- 修改：`skills/engineering/implement/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。对其他 skill 的调用指令（如 driving `/tdd`、closing out with `/code-review`）中 skill 名保留。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/implement docs/engineering/implement.md
git commit -m "translate: implement skill 汉化"
```

### 任务 11：prototype skill 汉化

**文件：**
- 修改：`skills/engineering/prototype/SKILL.md`
- 修改：`skills/engineering/prototype/LOGIC.md`
- 修改：`skills/engineering/prototype/UI.md`
- 修改：`docs/engineering/prototype.md`
- 修改：`skills/engineering/prototype/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译四个 md 文件**

按全局约束翻译。LOGIC.md 与 UI.md 里的 HTML/JS 代码块整体保留；UI 变体的描述文字翻中文。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 4 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/prototype docs/engineering/prototype.md
git commit -m "translate: prototype skill 汉化"
```

### 任务 12：to-spec skill 汉化

**文件：**
- 修改：`skills/engineering/to-spec/SKILL.md`
- 修改：`docs/engineering/to-spec.md`
- 修改：`skills/engineering/to-spec/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。注意 spec 模板示例（模板字段、示例结构）的 fenced 代码块整体保留。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/to-spec docs/engineering/to-spec.md
git commit -m "translate: to-spec skill 汉化"
```

### 任务 13：to-tickets skill 汉化

**文件：**
- 修改：`skills/engineering/to-tickets/SKILL.md`
- 修改：`docs/engineering/to-tickets.md`
- 修改：`skills/engineering/to-tickets/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。ticket 模板示例的 fenced 代码块整体保留；blocking edges、tracer bullet 按术语表。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/to-tickets docs/engineering/to-tickets.md
git commit -m "translate: to-tickets skill 汉化"
```

### 任务 14：triage skill 主文件汉化

**文件：**
- 修改：`skills/engineering/triage/SKILL.md`
- 修改：`docs/engineering/triage.md`
- 修改：`skills/engineering/triage/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。附属文件 AGENT-BRIEF.md 与 OUT-OF-SCOPE.md 由任务 15 处理，本任务不动它们。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。triage 状态机的 label 名（`ready-for-agent` 等）与 `wayfinder:*` 类 label 名保留英文；状态流转说明翻中文。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/triage/SKILL.md skills/engineering/triage/agents docs/engineering/triage.md
git commit -m "translate: triage skill 汉化"
```

### 任务 15：triage 附属文档汉化

**文件：**
- 修改：`skills/engineering/triage/AGENT-BRIEF.md`
- 修改：`skills/engineering/triage/OUT-OF-SCOPE.md`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。AGENT-BRIEF.md 正文翻中文；其中的 Good/Bad 示例（如 "The `SkillConfig` type should accept..."）是 brief 内容示例，示例文本保留英文，Good/Bad 标签保留。OUT-OF-SCOPE.md 的目录树代码块与文件格式模板整体保留。

- [ ] **步骤 3：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 4：Commit**

```bash
git add skills/engineering/triage/AGENT-BRIEF.md skills/engineering/triage/OUT-OF-SCOPE.md
git commit -m "translate: triage 附属文档汉化"
```

### 任务 16：wayfinder skill 汉化

**文件：**
- 修改：`skills/engineering/wayfinder/SKILL.md`
- 修改：`docs/engineering/wayfinder.md`
- 修改：`skills/engineering/wayfinder/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。特别注意：SKILL.md 有正文内锚点链接 `[Ticket Types](#ticket-types)` 和 `[Work through the map](#work-through-the-map)`，对应标题翻译后，锚点按全局约束第 4 条同步改为中文标题的 GitHub slug（中文保留、空格换连字符、去掉标点）。`wayfinder:<type>` label 值（research、prototype、grilling、task）保留。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过，并确认锚点目标与翻译后的标题一致。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/wayfinder docs/engineering/wayfinder.md
git commit -m "translate: wayfinder skill 汉化"
```

### 任务 17：wizard skill 汉化

**文件：**
- 修改：`skills/engineering/wizard/SKILL.md`
- 修改：`docs/engineering/wizard.md`
- 修改：`skills/engineering/wizard/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。`wizard/template.sh` 不翻，本任务不得触碰。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。SKILL.md 中指给模板文件的引用路径保留。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/wizard/SKILL.md skills/engineering/wizard/agents docs/engineering/wizard.md
git commit -m "translate: wizard skill 汉化"
```

### 任务 18：setup-matt-pocock-skills 主文件汉化

**文件：**
- 修改：`skills/engineering/setup-matt-pocock-skills/SKILL.md`
- 修改：`docs/engineering/setup-matt-pocock-skills.md`
- 修改：`skills/engineering/setup-matt-pocock-skills/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。附属文件 domain.md、issue-tracker-*.md、triage-labels.md 由任务 19 处理，本任务不动它们。

- [ ] **步骤 2：翻译两个 md 文件**

按全局约束翻译。setup 交互问句（问 issue tracker 选择、label 等）是说明文字，翻中文；指向附属 md 的路径保留。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 2 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/setup-matt-pocock-skills/SKILL.md skills/engineering/setup-matt-pocock-skills/agents docs/engineering/setup-matt-pocock-skills.md
git commit -m "translate: setup-matt-pocock-skills skill 汉化"
```

### 任务 19：setup-matt-pocock-skills 附属文档汉化

**文件：**
- 修改：`skills/engineering/setup-matt-pocock-skills/domain.md`
- 修改：`skills/engineering/setup-matt-pocock-skills/issue-tracker-github.md`
- 修改：`skills/engineering/setup-matt-pocock-skills/issue-tracker-gitlab.md`
- 修改：`skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md`
- 修改：`skills/engineering/setup-matt-pocock-skills/triage-labels.md`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译五个 md 文件**

按全局约束翻译。issue-tracker-*.md 里的 CLI 命令（`gh issue list` 等）、API 端点、配置示例代码块整体保留；triage-labels.md 的 label 名保留。

- [ ] **步骤 3：跑通用校验命令**

对 5 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 4：Commit**

```bash
git add skills/engineering/setup-matt-pocock-skills/*.md
git commit -m "translate: setup-matt-pocock-skills 附属文档汉化"
```

### 任务 20：improve-codebase-architecture skill 汉化

**文件：**
- 修改：`skills/engineering/improve-codebase-architecture/SKILL.md`
- 修改：`skills/engineering/improve-codebase-architecture/HTML-REPORT.md`
- 修改：`docs/engineering/improve-codebase-architecture.md`
- 修改：`skills/engineering/improve-codebase-architecture/agents/openai.yaml`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。

- [ ] **步骤 2：翻译三个 md 文件**

按全局约束翻译。HTML-REPORT.md 里的 HTML/CSS 模板代码块整体保留；对报告结构的描述文字翻中文。

- [ ] **步骤 3：翻译 openai.yaml**

`short_description` 翻中文；`display_name` 不动。

- [ ] **步骤 4：跑通用校验命令**

对 3 个 md 文件逐一执行三条校验，全部通过。

- [ ] **步骤 5：Commit**

```bash
git add skills/engineering/improve-codebase-architecture docs/engineering/improve-codebase-architecture.md
git commit -m "translate: improve-codebase-architecture skill 汉化"
```

### 任务 21：engineering bucket README 汉化

**文件：**
- 修改：`skills/engineering/README.md`

- [ ] **步骤 1：读规范**

读 `design.md` 的"翻译规范""验收规范"节和 `TRANSLATION-GLOSSARY.md` 全文。本任务在所有 skill 翻译完成后执行。

- [ ] **步骤 2：翻译 README**

按全局约束翻译。每条 skill 条目的一句话简介对照该 skill 已翻译的 SKILL.md frontmatter description 风格书写；skill 名与链接目标 `./<skill>/SKILL.md` 不动；两个分组标题（User-invoked / Model-invoked）保留英文，其下说明文字翻中文；`disable-model-invocation`、`policy.allow_implicit_invocation` 等键名保留。

- [ ] **步骤 3：跑通用校验命令**

对 README 执行三条校验，全部通过；另确认 18 个链接目标文件都存在。

- [ ] **步骤 4：Commit**

```bash
git add skills/engineering/README.md
git commit -m "translate: engineering bucket README 汉化"
```
