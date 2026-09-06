# Deepening

如何在给定依赖的情况下安全地深化一组浅模块。假定你已掌握 [SKILL.md](SKILL.md) 中的词汇：**module**、**interface**、**seam**、**adapter**。

## 依赖分类

在评估深化候选时，对其依赖进行分类。类别决定了深化后的模块如何在其 seam 上进行测试。

### 1. 进程内

纯计算，内存状态，无 I/O。始终可深化：合并模块并直接通过新 interface 测试。无需 adapter。

### 2. 本地可替代

拥有本地测试替代品的依赖（PGLite 替代 Postgres，内存文件系统）。如果替代品存在，可以深化。深化后的模块在测试套件中使用替代品运行测试。seam 是内部的；在模块外部 interface 处没有端口。

### 3. 远程但自有（端口与适配器模式）

跨越网络边界的自有服务（微服务、内部 API）。在 seam 处定义一个**端口**（interface）。deep module 拥有逻辑；传输层作为 **adapter** 注入。测试使用内存 adapter。生产使用 HTTP/gRPC/队列 adapter。

建议模式：*「在 seam 处定义端口，为生产实现 HTTP adapter，为测试实现内存 adapter，这样逻辑集中在一个 deep module 中，即使它部署在跨网络的位置。」*

### 4. 真正的外部（Mock）

你无法控制的第三方服务（Stripe、Twilio 等）。深化后的模块将外部依赖作为注入的端口；测试提供 mock adapter。

## Seam 纪律

- **一个 adapter 意味着假设的 seam。两个 adapter 意味着真实的 seam。** 不要引入端口，除非至少两个 adapter 有理由存在（通常是生产 + 测试）。单 adapter 的 seam 只是间接层。
- **内部 seam 与外部 seam。** deep module 可以有内部 seam（实现私有，供自身测试使用）以及 interface 处的外部 seam。不要仅因为测试使用内部 seam 就通过 interface 暴露它们。

## 测试策略：替换而非叠加

- 一旦在深化模块的 interface 处存在测试，对浅模块的旧单元测试就变成浪费；删除它们。
- 在深化模块的 interface 处编写新测试。**interface 就是测试表面。**
- 测试通过 interface 断言可观察的结果，而非内部状态。
- 测试应在内部重构后依然成立，因为它们描述的是行为而非实现。如果测试必须随实现改变而改变，它测试的是 interface 之外的东西。
