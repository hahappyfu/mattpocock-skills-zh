---
name: domain-modeling
description: 构建并锐化项目的 domain model。在讨论代码库词汇、编写或编辑 CONTEXT.md、或记录或编辑 ADR 时使用。
---

# Domain Modeling

在设计过程中主动构建并锐化项目的 domain model。这是*主动* discipline：挑战术语、发明边界情况场景、以及在术语和决策成型的瞬间立即记录词汇表和决策。（仅仅*阅读* `CONTEXT.md` 获取词汇不是这个 skill：那是任何 skill 都能做的一行习惯。这个 skill 是当你*改变* model 时使用的，而不仅仅是消费它。）

## 文件结构

大多数 repo 有一个 context：

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

如果根目录存在 `CONTEXT-MAP.md`，说明 repo 有多个 context。map 指向每个 context 的位置：

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

按需创建文件：只在你有内容要写时创建。如果不存在 `CONTEXT.md`，在第一个术语确定时创建。如果不存在 `docs/adr/`，在第一个 ADR 需要时创建。

## 会话过程中

### 对照词汇表挑战

当用户使用的术语与 `CONTEXT.md` 中的现有语言冲突时，立即指出。"你的词汇表将'cancellation'定义为 X，但你似乎指的是 Y。到底是哪个？"

### 锐化模糊语言

当用户使用模糊或重载的术语时，提出精确的规范术语。"你在说'account'：你是指 Customer 还是 User？那是不同的东西。"

### 讨论具体场景

当讨论 domain 关系时，用具体场景进行压力测试。发明探索边界情况的场景，迫使用户对概念之间的边界做出精确定义。

### 与代码交叉引用

当用户陈述某事如何工作时，检查代码是否一致。如果发现矛盾，提出："你的代码取消了整个 Order，但你刚刚说部分取消是可能的。哪个是对的？"

### 内联更新 CONTEXT.md

当术语确定时，立即更新 `CONTEXT.md`。不要批量处理：在它们发生时就捕获。使用 [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md) 中的格式。

`CONTEXT.md` 应完全不含实现细节。不要将 `CONTEXT.md` 视为 spec、scratch pad 或实现决策的存储库。它是一个词汇表，仅此而已。

### 谨慎提供 ADR

仅在以下三个条件都满足时才提供创建 ADR：

1. **Hard to reverse**：以后改变主意的成本是显著的
2. **Surprising without context**：未来的读者会疑惑"他们为什么这样做？"
3. **The result of a real trade-off**：存在真正的替代方案，你因特定原因选择了其中一个

如果三个条件中缺少任何一个，跳过 ADR。使用 [ADR-FORMAT.md](./ADR-FORMAT.md) 中的格式。
