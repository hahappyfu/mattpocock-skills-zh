# CONTEXT.md Format

## 结构

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{A one or two sentence description of the term}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## 规则

- **要有主见。** 当同一概念存在多个词语时，选择最佳的一个，将其他列在 `_Avoid_` 下。
- **保持定义简洁。** 最多一两句话。定义它*是*什么，而不是它做什么。
- **只包含特定于此项目 context 的术语。** 通用编程概念（超时、错误类型、工具模式）即使项目广泛使用也不属于此。在添加术语前问：这是此 context 独有的概念，还是通用编程概念？只有前者属于。
- **当自然集群出现时将术语分组到子标题下。** 如果所有术语都属于一个内聚的领域，平铺列表也可以。

## 单 context 与多 context repo

**单 context（大多数 repo）：** 根目录一个 `CONTEXT.md`。

**多 context：** 根目录一个 `CONTEXT-MAP.md` 列出各 context、它们的位置以及相互关系：

```md
# Context Map

## Contexts

- [Ordering](./src/ordering/CONTEXT.md): receives and tracks customer orders
- [Billing](./src/billing/CONTEXT.md): generates invoices and processes payments
- [Fulfillment](./src/fulfillment/CONTEXT.md): manages warehouse picking and shipping

## Relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced` events; Fulfillment consumes them to start picking
- **Fulfillment → Billing**: Fulfillment emits `ShipmentDispatched` events; Billing consumes them to generate invoices
- **Ordering ↔ Billing**: Shared types for `CustomerId` and `Money`
```

skill 推断适用哪种结构：

- 如果存在 `CONTEXT-MAP.md`，读取它以查找各 context
- 如果只有根目录 `CONTEXT.md`，单 context
- 如果两者都不存在，按需创建根目录 `CONTEXT.md`（在解析第一个术语时）

当存在多个 context 时，推断当前主题与哪个相关。如果不确定，询问。
