---
name: codebase-design
description: 设计 deep module 的共享词汇。当用户想要设计或改进 module 的 interface、寻找深化机会、决定 seam 放置位置、让代码更易测试或更易被 AI 理解，或其他 skill 需要 deep-module 词汇时使用。
---

# Codebase Design

设计 **deep module**：大量行为隐藏在小型 interface 之后，放置在干净的 seam 上，可通过该 interface 测试。在设计或重构代码时使用这套语言和原则。目标是为调用者提供 leverage，为维护者提供 locality，为所有人提供可测试性。

## 词汇表

严格使用以下术语：不要替换为「component」「service」「API」或「boundary」。统一的语言是核心所在。

**module（模块）**：任何有 interface 和实现的事物。刻意保持规模无关：一个函数、类、包或跨层的 slice。_避免使用_：unit、component、service。

**interface（接口）**：调用者正确使用模块必须知道的一切：类型签名，还包括不变量、排序约束、错误模式、必要配置和性能特征。_避免使用_：API、signature（太窄，只指类型层面的表面）。

**implementation**：模块内部的代码。与 **adapter** 不同：一个事物可以是拥有大型实现的小型 adapter（如 Postgres 仓库），也可以是拥有小型实现的大型 adapter（如内存模拟）。当讨论 seam 时用「adapter」，其他情况用「implementation」。

**depth（深度）**：interface 上的 leverage。调用者（或测试）每学习一个单位的 interface 能锻炼的行为量。当大量行为位于小型 interface 之后时，模块是 **deep** 的；当 interface 几乎和实现一样复杂时，模块是 **shallow** 的。

**seam（接缝）** _(Michael Feathers)_：可以改变行为而无需在此处编辑代码的地方；module 的 interface 所在的*位置*。seam 放在哪里是一个独立的设计决策，与背后放什么不同。_避免使用_：boundary（与 DDD 的 bounded context 过载）。

**adapter（适配器）**：在 seam 处满足 interface 的具体事物。描述*角色*（它填补什么槽位），而非实质（里面是什么）。

**leverage（杠杆）**：调用者从 depth 中获得的收益。每学习一个单位的 interface 获得更多能力。一个实现在 N 个调用点和 M 个测试中得到回报。

**locality（局部性）**：维护者从 depth 中获得的收益。变更、bug、知识和验证集中在一处，而非分散到各个调用点。修复一次，到处修复。

## Deep 与 Shallow

**deep module** = 小型 interface + 大量实现：

```
┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│                     │
│  Deep Implementation│  ← Complex logic hidden
│                     │
└─────────────────────┘
```

**shallow module** = 大型 interface + 少量实现（应避免）：

```
┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘
```

设计 interface 时，问自己：

- 能减少方法数量吗？
- 能简化参数吗？
- 能在内部隐藏更多复杂性吗？

## 原则

- **depth 是 interface 的属性，不是实现的属性。** deep module 内部可以由小型、可 mock 的、可替换的部分组成；只是它们不属于 interface。模块可以有**内部 seam**（实现私有，供自身测试使用），也可以在 interface 处有**外部 seam**。
- **删除测试。** 假设删除该模块。如果复杂性消失，它只是个透传。如果复杂性在 N 个调用点重新出现，它一直在发挥价值。
- **interface 就是测试表面。** 调用者和测试跨越同一个 seam。如果你想测试 *interface 之外* 的东西，模块形状可能不对。
- **一个 adapter 意味着假设的 seam。两个 adapter 意味着真实的 seam。** 不要引入 seam，除非有东西确实在其上变化。

## 面向测试的设计

良好的 interface 让测试变得自然：

1. **接受依赖，不要创建它们。**

   ```typescript
   // Testable
   function processOrder(order, paymentGateway) {}

   // Hard to test
   function processOrder(order) {
     const gateway = new StripeGateway();
   }
   ```

2. **返回结果，不要产生副作用。**

   ```typescript
   // Testable
   function calculateDiscount(cart): Discount {}

   // Hard to test
   function applyDiscount(cart): void {
     cart.total -= discount;
   }
   ```

3. **小表面面积。** 更少的方法 = 更少的测试需要。更少的参数 = 更简单的测试设置。

## 关系

- 一个 **module** 恰好有一个 **interface**（它向调用者和测试展示的表面）。
- **depth** 是 **module** 的属性，相对于其 **interface** 来衡量。
- **seam** 是 **module** 的 **interface** 所在的地方。
- **adapter** 位于 **seam** 处并满足 **interface**。
- **depth** 为调用者产生 **leverage**，为维护者产生 **locality**。

## 被拒绝的框架

- **depth 作为实现行数与 interface 行数的比率**（Ousterhout）：奖励填充实现。我们使用 depth-as-leverage 代替。
- **「interface」作为 TypeScript `interface` 关键字或类的公共方法**：太窄；这里的 interface 包括调用者必须知道的每个事实。
- **「boundary」**：与 DDD 的 bounded context 过载。请说 **seam** 或 **interface**。

## 深入了解

- **给定依赖如何深化一组模块**，参见 [DEEPENING.md](DEEPENING.md)：依赖分类、seam 纪律和 replace-don't-layer 测试。
- **探索替代 interface**，参见 [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md)：并行启动多个 sub-agent，以几种截然不同的方式设计 interface，然后按 depth、locality 和 seam 位置进行比较。
