---
name: git-guardrails-claude-code
description: 设置 Claude Code 的 hook，在危险的 git 命令 (push、reset --hard、clean、branch -D 等) 执行前将其拦截。当用户想要阻止破坏性 git 操作、添加 git 安全 hook，或在 Claude Code 中拦截 git push / reset 时使用。
---

# 设置 Git 护栏

设置一个 PreToolUse hook，在 Claude 执行危险的 git 命令之前将其拦截。

## 拦截内容

- `git push` (所有变体，包括 `--force`)
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

被拦截后，Claude 会看到一条消息，告知它无权执行这些命令。

## 步骤

### 1. 询问 scope

询问用户：只为**当前项目**安装 (`.claude/settings.json`)，还是为**所有项目**安装 (`~/.claude/settings.json`)？

### 2. 复制 hook 脚本

随附脚本位于：[scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh)

按 scope 将它复制到目标位置：

- **项目**：`.claude/hooks/block-dangerous-git.sh`
- **全局**：`~/.claude/hooks/block-dangerous-git.sh`

用 `chmod +x` 将它设为可执行。

### 3. 在设置中添加 hook

添加到对应的设置文件：

**项目** (`.claude/settings.json`)：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

**全局** (`~/.claude/settings.json`)：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

如果设置文件已存在，将 hook 并入已有的 `hooks.PreToolUse` 数组，不要覆盖其他设置。

### 4. 询问是否需要自定义

询问用户是否要从拦截列表中添加或删除模式，按需求编辑复制好的脚本。

### 5. 验证

运行一次快速测试：

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <path-to-script>
```

应当以退出码 2 退出，并向 `stderr` 输出一条 BLOCKED 消息。
