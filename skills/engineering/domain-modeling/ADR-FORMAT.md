# ADR Format

ADRs 存放在 `docs/adr/` 中，使用顺序编号：`0001-slug.md`、`0002-slug.md` 等。

按需创建 `docs/adr/` 目录：只在第一个 ADR 需要时创建。

## 模板

```md
# {Short title of the decision}

{1-3 sentences: what's the context, what did we decide, and why.}
```

就这些。一个 ADR 可以是单个段落。价值在于记录*做出了*决策以及*为什么*做出，而不是填写各个部分。

## 可选部分

只在它们能增加真正价值时才包含。大多数 ADR 不需要它们。

- **Status** frontmatter (`proposed | accepted | deprecated | superseded by ADR-NNNN`)：在决策被重新审视时有用
- **Considered Options**：只在被拒绝的替代方案值得记住时
- **Consequences**：只在非显而易见的下游影响需要被指出时

## 编号

扫描 `docs/adr/` 中现有的最高编号，然后加一。

## 何时提供 ADR

以下三个条件必须全部满足：

1. **Hard to reverse**：以后改变主意的成本是显著的
2. **Surprising without context**：未来的读者会疑惑"他们为什么这样做？"
3. **The result of a real trade-off**：存在真正的替代方案，你因特定原因选择了其中一个

如果决策容易逆转，跳过它：你反正会逆转它。如果不令人惊讶，没人会疑惑为什么。如果没有真正的替代方案，除了"我们做了显而易见的事"之外没什么可记录的。

### 符合条件的情况

- **Architectural shape**。"我们使用 monorepo。" "写模型是 event-sourced，读模型投影到 Postgres。"
- **Integration patterns between contexts**。"Ordering 和 Billing 通过 domain events 通信，而非同步 HTTP。"
- **Technology choices that carry lock-in**。Database、message bus、auth provider、deployment target。不是每个库：只是那些需要一个季度才能替换的。
- **Boundary and scope decisions**。"Customer data 由 Customer context 拥有；其他 context 仅通过 ID 引用它。" 显式的拒绝与肯定同样有价值。
- **Deliberate deviations from the obvious path**。"我们使用手动 SQL 而非 ORM，因为 X。" 任何合理读者会假设相反情况的地方。这些能阻止下一个工程师"修复"原本是刻意的设计。
- **Constraints not visible in the code**。"由于合规要求我们不能使用 AWS。" "由于 partner API 合约，响应时间必须低于 200ms。"
- **Rejected alternatives when the rejection is non-obvious**。如果你考虑了 GraphQL 并因微妙原因选择了 REST，记录下来；否则六个月后会有人再次建议 GraphQL。
