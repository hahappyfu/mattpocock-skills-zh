# 取长补短补齐计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 把对方可取的三条规则落到本仓：硬校验加软扫描脚本、规范补齐、译文硬伤修复，不搬对方浅本地化做法。

**架构：** 共四个任务，每个任务产出独立可测交付物。任务一移植硬校验脚本并按本仓规则改写断言，任务二移植软扫描脚本并接入术语表白名单加脏词门禁，任务三补术语表与设计约束，任务四修抽样发现的三处译文硬伤。脚本只读检查，不改译文。

**技术栈：** `node` 脚本加 `bash` 校验命令加 `git`，复用仓内已有 `scripts/` 目录。

---

## 文件结构

- 创建：`scripts/check-translation.mjs`：硬门禁，围栏配平、`SKILL.md` 的 `frontmatter` 完整性、`name` 纯 `ASCII`、安装块一致性、说明页四节标题存在性
- 创建：`scripts/audit-english.mjs`：软复核，剥代码围栏后扫描英文残留，只告警不拦截，另加脏词门禁
- 修改：`TRANSLATION-GLOSSARY.md`：尾部追加 `frontmatter` 语义分类与失败关闭兜底两节，不留空行断裂
- 修改：`design.md`：翻译规范节追加标点与空格两条，不改已有条目顺序
- 修改：`skills/engineering/ask-matt/SKILL.md`：两处难译词统一
- 修改：`docs/engineering/ask-matt.md`：与主文件同词统一（如正文含该词）
- 修改：`skills/engineering/triage/SKILL.md`：一处脑补句回贴原文，一处术语统一
- 修改：`package.json`：`scripts` 追加 `check:translation` 与 `audit:english` 两个入口
- 不动：`skills/engineering/*/tests.md` 类代码块内容、`LICENSE`、`deprecated/`、顶层 `README.md` 安装措辞（只做一致性断言，不改写）

## 全局约束

1. 脚本只检查，不重写译文，退出码非零即失败，输出精确到文件加行号
2. 校验规则以本仓为准：安装块以 `.agents/install-block.md` 为正源，不引入对方路径断言
3. 全文禁长破折号，代码块内上游原有除外，脚本对正文区执行此检查
4. 每个任务独立提交，信息格式为 `chore: <范围> <动作>` 或 `fix: <范围> <动作>`

---

### 任务 1：硬校验脚本移植

**文件：**
- 创建：`scripts/check-translation.mjs`
- 修改：`package.json`

- [ ] **步骤 1：创建硬校验脚本**

写入 `scripts/check-translation.mjs`，内容如下：

```js
import fs from "node:fs";
import { execSync } from "node:child_process";

const files = execSync("git ls-files", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((file) => file && fs.existsSync(file));

let failed = false;
function fail(file, msg) {
  failed = true;
  console.error(`FAIL ${file}: ${msg}`);
}
function read(file) {
  return fs.readFileSync(file, "utf8");
}
function stripFences(text) {
  return text.split("```").filter((_, i) => i % 2 === 0).join("");
}

for (const file of files) {
  if (!file.endsWith(".md")) continue;
  const text = read(file);
  const fences = text.match(/```/g) || [];
  if (fences.length % 2 !== 0) {
    fail(file, "unbalanced fenced code blocks");
  }
  const prose = stripFences(text);
  if (/—|——/.test(prose)) {
    fail(file, "long dash found outside code fences");
  }
  if (file.endsWith("SKILL.md")) {
    const fm = text.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!fm) {
      fail(file, "missing or malformed YAML frontmatter");
      continue;
    }
    const frontmatter = fm[1];
    const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (!name) fail(file, "missing frontmatter name");
    if (!description) fail(file, "missing frontmatter description");
    if (name && /[㐀-鿿]/.test(name)) {
      fail(file, "frontmatter name should remain an ASCII slug");
    }
  }
  if (file.startsWith("docs/engineering/") || file.startsWith("docs/productivity/")) {
    for (const h of ["它做什么", "何时使用", "常见问题", "达标表现"]) {
      if (!text.includes(h)) {
        fail(file, `missing docs section title ${h}`);
      }
    }
  }
}

const installBlock = read(".agents/install-block.md");
const readme = fs.existsSync("README.md") ? read("README.md") : "";
if (readme && !readme.includes("claude plugins install mattpocock-skills")) {
  fail("README.md", "missing canonical claude plugin install command");
}
if (readme && !readme.includes("npx skills@latest add mattpocock/skills")) {
  fail("README.md", "missing canonical skills.sh install command");
}
if (!installBlock.includes("claude plugins install mattpocock-skills")) {
  fail(".agents/install-block.md", "canonical block lost its source of truth");
}

process.exit(failed ? 1 : 0);
```

- [ ] **步骤 2：本地运行验证通过**

运行：

```bash
node scripts/check-translation.mjs
```

预期：退出码为零，无 `FAIL` 输出。若有失败，记录文件名，不改译文，直接进入步骤三修复脚本逻辑。

- [ ] **步骤 3：接入 `package.json` 脚本入口**

在 `package.json` 的 `scripts` 节追加两行（保持已有键顺序，逗号正确）：

```json
"check:translation": "node scripts/check-translation.mjs",
"audit:english": "node scripts/audit-english.mjs"
```

- [ ] **步骤 4：运行入口验证**

运行：

```bash
npm run check:translation
```

预期：通过。若 `audit:english` 文件尚不存在，此步允许该子命令失败，任务二补齐后复验。

- [ ] **步骤 5：提交**

```bash
git add scripts/check-translation.mjs package.json
git commit -m "chore: 翻译硬校验脚本移植"
```

### 任务 2：软扫描加脏词门禁

**文件：**
- 创建：`scripts/audit-english.mjs`

- [ ] **步骤 1：创建软扫描脚本**

写入 `scripts/audit-english.mjs`，内容如下：

```js
import fs from "node:fs";
import { execSync } from "node:child_process";

const ALLOW = new Set([
  "TDD", "PRD", "ADR", "DDD", "API", "CLI", "CI", "CD",
  "GitHub", "Claude", "Codex", "Obsidian", "Husky", "Prettier",
  "red-green-refactor", "mock", "refactor", "README", "LICENSE",
  "SKILL", "MIT", "YAML", "JSON", "TOML",
]);

const DIRTY = ["有人境", "纸质记录", "调用 Skill 工具两次"];

const files = execSync("git ls-files", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((f) => f && f.endsWith(".md") && fs.existsSync(f));

let failed = false;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const word of DIRTY) {
    if (text.includes(word)) {
      failed = true;
      console.error(`DIRTY ${file}: found ${word}`);
    }
  }
  const prose = text.split("```").filter((_, i) => i % 2 === 0).join("\n");
  for (const line of prose.split("\n")) {
    if (line.startsWith("---")) continue;
    if (/^name:/.test(line)) continue;
    if (/https?:\/\//.test(line)) continue;
    const words = line.match(/[A-Za-z]{4,}/g) || [];
    const unknown = words.filter((w) => !ALLOW.has(w));
    if (unknown.length >= 8) {
      console.error(`REVIEW ${file}: ${unknown.slice(0, 8).join(", ")}`);
    }
  }
}

process.exit(failed ? 1 : 0);
```

说明：`DIRTY` 命中即失败退出，`REVIEW` 只打印不拦截，供人工复核。

- [ ] **步骤 2：运行验证**

运行：

```bash
node scripts/audit-english.mjs
npm run audit:english
```

预期：`REVIEW` 行允许出现，`DIRTY` 行必须为零。若 `DIRTY` 命中，记录文件名，不在此任务改译文，移交任务四处理。

- [ ] **步骤 3：提交**

```bash
git add scripts/audit-english.mjs
git commit -m "chore: 英文残留软扫描加脏词门禁"
```

### 任务 3：规范补齐两节

**文件：**
- 修改：`TRANSLATION-GLOSSARY.md`
- 修改：`design.md`

- [ ] **步骤 1：术语表尾追加两节**

在 `TRANSLATION-GLOSSARY.md` 文件尾追加以下文本，与上文之间不留空行断裂（保持一空行分隔即可）：

```markdown
## frontmatter 语义分类

`name` 不动，保持 `ASCII` 短横线风格。`description` 与 `argument-hint` 类自然语言译为简体中文。标识符、命令、路径、包名、链接、工具名、布尔值与数字不动。可译值内部的行内代码、占位符、路径与链接原样保留。拿不准是否行为关键的值不猜，保留英文并在提交信息中注明。

## 失败关闭兜底

拿不准是否行为关键就保留英文原文，不默改安装、发现、执行、引用、接口、工具相关文本。先保留，再查表，再提问，不脑补动词。
```

- [ ] **步骤 2：设计约束追加标点空格规则**

在 `design.md` 翻译规范节末尾追加以下两条，不改已有条目顺序：

```markdown
- 标点用全角中文标点，冒号用全角冒号，引号用中文引号，长破折号禁用。
- 中文与英文单词、数字、行内代码之间加一个半角空格，双方抽查均未稳定执行，本仓按此条收敛。
```

- [ ] **步骤 3：复核无长破折号**

运行：

```bash
awk '/^```/{f=!f;next} !f' TRANSLATION-GLOSSARY.md | grep -n '—' && echo FAIL || echo OK
awk '/^```/{f=!f;next} !f' design.md | grep -n '—' && echo FAIL || echo OK
```

预期：两行都输出 `OK`。

- [ ] **步骤 4：提交**

```bash
git add TRANSLATION-GLOSSARY.md design.md
git commit -m "chore: 术语表加 frontmatter 分类与失败关闭兜底"
```

### 任务 4：译文三处硬伤修复

**文件：**
- 修改：`skills/engineering/ask-matt/SKILL.md`
- 修改：`docs/engineering/ask-matt.md`
- 修改：`skills/engineering/triage/SKILL.md`

- [ ] **步骤 1：统一难译词为落盘记录**

在 `skills/engineering/ask-matt/SKILL.md` 中把两处纸质记录类措辞改为落盘记录并注明写入何处，例如：

```markdown
留下纸质记录
```

改为：

```markdown
留下发落盘记录（写入 `CONTEXT.md` 与 `ADR`）
```

检查 `docs/engineering/ask-matt.md` 正文如含同一词，按同一译法同步改。若正文用的是文档痕迹，同样统一为落盘记录。

- [ ] **步骤 2：回贴关键动词不脑补**

在 `skills/engineering/triage/SKILL.md` 中把脑补句：

```markdown
调用 Skill 工具两次
```

改为：

```markdown
调用 `grilling` 与 `domain-modeling` 两个 `skill` 进行访谈
```

同期检查该文件内 `grilling` 译法，全文件统一为访谈或保留原文其中一种，并在提交信息注明选择。

- [ ] **步骤 3：跑全量门禁**

运行：

```bash
node scripts/check-translation.mjs
node scripts/audit-english.mjs
npm run check:translation
```

预期：三条全部退出码为零。若 `audit` 报 `REVIEW` 行，人工读一遍确认无错字后放行，不改代码。

- [ ] **步骤 4：提交**

```bash
git add skills/engineering/ask-matt/SKILL.md docs/engineering/ask-matt.md skills/engineering/triage/SKILL.md
git commit -m "fix: 难译词统一与关键动词回贴原文"
```

---

## 自检记录

- 规格覆盖：对方三条可取全部有任务，硬校验对应任务一，软扫描对应任务二，`frontmatter` 分类与失败关闭对应任务三，安装路径本地化不搬因本仓正源不同故只做一致性断言。译文三处硬伤对应任务四。生产力分组参照重译不在本计划，列为后续。
- 占位符扫描：本计划无待定类措辞，所有脚本与追加文本均给出全文。
- 类型一致：脚本间共用 `FAIL` 前缀，`DIRTY` 失败，`REVIEW` 放行，退出码约定一致。

## 后续（不在本计划）

- 用对方生产力七个技能做参照，按本仓术语表重译，不直搬。
- 抽查说明页断言是否仍成立，例如 `triage` 说明页称另两个技能文本没提对方，需打开原文确认。
