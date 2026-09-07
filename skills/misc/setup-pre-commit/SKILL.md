---
name: setup-pre-commit
description: 在当前仓库中设置 Husky pre-commit hook，含 lint-staged (Prettier)、类型检查和测试。当用户想要添加 pre-commit hook、设置 Husky、配置 lint-staged，或在提交时做格式化、类型检查、测试时使用。
---

# 设置 Pre-Commit Hooks

## 设置内容

- **Husky** pre-commit hook
- **lint-staged**，在所有 staged 文件上运行 Prettier
- **Prettier** 配置 (如果缺失)
- pre-commit hook 中的 **typecheck** 和 **test** 脚本

## 步骤

### 1. 检测包管理器

检查 `package-lock.json` (npm)、`pnpm-lock.yaml` (pnpm)、`yarn.lock` (yarn)、`bun.lockb` (bun)，用仓库中实际存在的那个。如果不明确，默认用 npm。

### 2. 安装依赖

安装为 devDependencies：

```
husky lint-staged prettier
```

### 3. 初始化 Husky

```bash
npx husky init
```

这会创建 `.husky/` 目录，并在 package.json 中添加 `prepare: "husky"`。

### 4. 创建 `.husky/pre-commit`

写入该文件 (Husky v9+ 不需要 shebang)：

```
npx lint-staged
npm run typecheck
npm run test
```

**调整**：把 `npm` 换成检测到的包管理器。如果仓库的 package.json 中没有 `typecheck` 或 `test` 脚本，去掉对应行并告知用户。

### 5. 创建 `.lintstagedrc`

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. 创建 `.prettierrc` (如果缺失)

只有不存在 Prettier 配置时才创建，使用以下默认值：

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. 验证

- [ ] `.husky/pre-commit` 存在且可执行
- [ ] `.lintstagedrc` 存在
- [ ] package.json 中的 `prepare` 脚本是 `"husky"`
- [ ] `prettier` 配置存在
- [ ] 运行 `npx lint-staged` 验证可用

### 8. Commit

暂存所有变更和新建的文件，用以下消息 commit：`Add pre-commit hooks (husky + lint-staged + prettier)`

这会完整跑一遍新的 pre-commit hook，相当于一次有效的 smoke 测试。

## 说明

- Husky v9+ 的 hook 文件不需要 shebang
- `prettier --ignore-unknown` 会跳过 Prettier 无法解析的文件 (图片等)
- pre-commit 先运行 lint-staged (速度快，只处理 staged 文件)，再运行完整的 typecheck 和测试
