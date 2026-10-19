---
name: setup-ts-deep-modules
description: 把 dependency-cruiser 接入 TypeScript 仓库，让每个包都成为 deep module，实现藏在子目录里，只能经由入口文件访问。用户调用。
---

# 配置 TS Deep Modules

让仓库中的每个包都成为 **deep module**：小 interface 背后藏大量行为。一个包的公开面是它的**入口文件（entry point）**（包根目录下的文件），子目录里的一切都对外隐藏。本 skill 负责安装 [dependency-cruiser](https://github.com/sverweij/dependency-cruiser)并配好规则，让入口文件成为唯一的进入通道，然后证明规则真的会咬人。

涉及的词汇（deep module、interface、seam、depth）先调用 Skill 工具获取 "codebase-design"，全程用它的语言。

## 约束的形态

```
src/packages/
  <name>/
    index.ts        ← an entry point (public). Import this from outside.
    client.ts       ← another entry point. Packages may expose SEVERAL.
    lib/            ← implementation: hidden from outside, free to import each other.
    tests/          ← co-located tests + fixtures (a subfolder, so private).
```

公开面是包的**根文件**，而不是某个指定的 `index.ts`。按约定实现放在 `lib/`，测试放在 `tests/`，每个包都是同样的两目录形态。但规则本身是通用的：*任何*子目录里的*任何*东西都是私有的，所以加目录永远不需要改配置。

四条规则，全是 `error`：

1. **入口文件边界**：包外的代码（应用代码或其他包）只能 import 该包的入口文件（它的根文件），绝不能碰它子目录里的东西。
2. **包内自由**：包自己的文件之间随便互相 import。
3. **测试走入口文件**：`<pkg>/tests/` 下的文件可以 import 任何包的入口文件和自己 `tests/` 下的 fixture，但绝不能 import 任何包的子目录内部（连自己的也不行）。跨包集成测试可以，深 import 不行。
4. **无环**：不允许依赖环。

**要的是入口文件，不是桶文件（barrel）。**因为公开面是*每个*根文件，一个包可以暴露多个小入口文件（`index.ts`、`client.ts`、`server.ts`），而不必把一切都汇入一个巨型 `index.ts`。不鼓励把整个子树 re-export 的桶文件，入口文件要小，实现要藏进子目录。

分层（layering，哪些包可以依赖哪些包）是*另一*回事，在配置里留作注释桩子，由本仓库自行填写。

## 步骤

### 1. 探测环境

- **包管理器**：`pnpm-lock.yaml` 对应 pnpm，`yarn.lock` 对应 yarn，`bun.lockb` 对应 bun，都没有则用 npm。下面所有命令都用它（`pnpm`/`yarn`/`npm run`/`bunx`）。
- **包根目录**：有 `src/` 就用 `src/packages`，否则用 `packages`。如果仓库已有明显不同的约定，跟用户确认。
- **既有配置**：检查 `.dependency-cruiser.*` 文件。如果已存在，**不要**覆盖，把四条规则和选项合并进去，并告诉用户加了什么。

**完成标准：**包管理器、包根目录、既有配置状态三者都已明确。

### 2. 安装 dependency-cruiser

用探测到的包管理器把 `dependency-cruiser` 装成 devDependency。

**完成标准：**`dependency-cruiser` 已在 `devDependencies` 中。

### 3. 写配置

把 [`dependency-cruiser.config.cjs`](./dependency-cruiser.config.cjs) 复制到仓库根目录，命名为 `.dependency-cruiser.cjs`，把 `PACKAGES_ROOT` 设为步骤 1 探测到的根目录。规则基于路径深度、与扩展名无关，其他都不用改。

**完成标准：**`.dependency-cruiser.cjs` 存在，`PACKAGES_ROOT` 正确，四条禁用规则齐备。

### 4. 接入检查

- 加一条 `lint:boundaries` 脚本：`depcruise <packages-root>`（或 `depcruise src`）。
- 把它并入仓库已有的总检查命令，也就是已经跑类型检查的那个（例如 `check` / `ci` / `validate` 脚本）。**不要**碰 `tsconfig`，不要加路径别名。
- 如果没有总检查脚本，就只加 `lint:boundaries`，并告诉用户把它纳入 CI。

**完成标准：**`lint:boundaries` 存在，且和类型检查跑在同一条命令里。

### 5. 搭示例包

在 `<packages-root>/example/` 下建一个已提交的示例包，作为可复制的模板：

- `index.ts` 是入口文件，导出一个函数，函数内部委派给一个内部文件（让包看得出是*深*的，而不是透传）。
- `lib/impl.ts`：**子目录**里的内部文件，被 `index.ts` import，外部到不了。
- `tests/example.test.ts` 只 import `../index`（入口文件），针对公开函数断言。

告诉用户这是起步模板，照抄或删掉都行。

**完成标准：**示例包存在，行为经由根入口文件暴露，`impl` 藏在子目录里。

### 6. 证明规则会咬人

这是整个 skill 的完成标准：对违规不报错的配置一文不值。

1. 跑 `lint:boundaries`，在干净示例上必须**通过**。
2. 给 `tests/example.test.ts` 临时加一个深 import（例如 `import { thing } from "../lib/impl"`），再跑 `lint:boundaries`，必须以 `tests-through-entrypoints` **失败**。
3. 撤销深 import，再跑一次，必须**通过**。

**完成标准：**依次观察到通过、对深 import 失败、再通过。如果第 2 步没失败，说明规则没接对，先修好再收工。

### 7. 把约定写下来

在包目录里写 `README.md`（`<packages-root>/README.md`，和它管辖的包放在一起），内容覆盖：`src/packages/<name>/` 布局（入口文件在根目录，实现在 `lib/`，测试在 `tests/`）、"只能经由包的入口文件（它的根文件）import"，以及如何跑 `lint:boundaries`。**明确不鼓励桶文件**：用多个小入口文件，而不要经由一个 index re-export 整棵子树。篇幅控制在可复制片段加四条规则各一段。

然后从仓库的 agent 指令文件（有 `CLAUDE.md` 就用它，否则 `AGENTS.md`，两者都没有就新建 `AGENTS.md`）加一条**上下文指针（context pointer）**指过去，一行就够，例如 `Packages are deep modules: see [src/packages/README.md](./src/packages/README.md) before adding or importing one.`。agent 靠它发现边界规则，而不是撞上了才知道。

**完成标准：**`<packages-root>/README.md` 存在且不鼓励桶文件，仓库的 `CLAUDE.md`/`AGENTS.md` 链向它。

## 说明

- 配置里的 `$1` 反向引用（dependency-cruiser 的分组匹配）让包能访问自家内部而外人不行，不要把它拍平成逐包规则。
- 公开还是私有由**depth**决定：包根文件是入口文件，子目录里的任何东西都是私有的。约定子目录是 `lib/`（实现）和 `tests/`，但规则不写死它们：任何子目录都是私有的，所以新目录永远不需要改配置。加入口文件就是加根文件（不用桶文件）。
- 包是**扁平**的：根目录下只有一层直接子包。包内部可以随便嵌套，包里不能再套包。
- 用 `.cjs`（不用 `.js`），这样即使在 `"type": "module"` 仓库里配置的 `module.exports` 也能工作。
