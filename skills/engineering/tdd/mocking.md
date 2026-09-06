# 何时 Mock

只在**系统边界（System Boundary）**处 mock：

- 外部 API（支付、邮件等）
- 数据库（有时，优先用测试数据库）
- 时间/随机性
- 文件系统（有时）

不要 mock：

- 你自己的模块
- 内部协作者
- 你能控制的任何东西

## 设计可 mock 的接口（Designing for Mockability）

在系统边界处，设计易于 mock 的接口：

**1. 使用依赖注入（Dependency Injection）**

把外部依赖传进来，而不是在内部创建：

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. 优先用 SDK 风格的接口，而非通用 fetcher**

为每个外部操作创建专门的函数，而不是用一个通用函数加条件逻辑：

```typescript
// GOOD: Each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: Mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

SDK 方式的好处：

- 每个 mock 返回一个特定的形状
- 测试设置中没有条件逻辑
- 更容易看清测试用到哪些 endpoint
- 每个 endpoint 有类型安全
