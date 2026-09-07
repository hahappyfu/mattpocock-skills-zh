## 它做什么

`tdd` 先写测试再构建功能或修复 bug：一个失败的测试，然后刚好通过它的代码，再下一个行为。它携带的规范让这个循环产出值得保留的测试：什么是好的测试、测试放哪、mock 用来做什么、以及那三个悄悄毁掉测试套件的反模式。

它不会在你没有事先商定的接缝处写测试。在任何测试存在之前，它会列出打算测试的公开边界并停下来等你确认，因为测试工作量有限，你要把精力花在关键路径上而不是每个边界情况。另一点要知道的是，`tdd` 是**参考**，不是驱动者。它持有循环规则，而由别的东西（你或 [implement](https://aihero.dev/skills-implement)）运行应用这些规则的 [session](https://www.aihero.dev/ai-coding-dictionary/session)。

## 何时使用

输入 `/tdd`，或 [agent](https://www.aihero.dev/ai-coding-dictionary/agent) 在任务匹配时自动调用它：先写测试再构建功能或修复 bug，或当你说 "red-green-refactor" 时。

当有具体的行为要构建，有输入和可观察的输出，并且你想要在重构后依然成立的测试时，使用它。

| 你的场景 | 去哪 |
| --- | --- |
| 有明确定义输入和输出的行为（业务逻辑、请求/响应契约、转换、验证） | `tdd` |
| 行为还没有确定下来 | [to-spec](https://aihero.dev/skills-to-spec)，它也会在写代码之前商定测试接缝 |
| 问题其实是接口的形状，而不是测试 | [codebase-design](https://aihero.dev/skills-codebase-design) |
| 你有 [spec](https://www.aihero.dev/ai-coding-dictionary/spec) 或 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket)，想让整个构建过程自动运行 | [implement](https://aihero.dev/skills-implement)，它按 ticket 驱动 `tdd` |
| 配置、接线、胶水代码、类型注解、纯 CRUD 委托 | 这里没有合适的；见下方的缺口 |

最后一行是一个真实的缺口，不是风格偏好。这个 skill 决定接缝*放在哪*；它不决定一个变更*是否值得*跑循环。在一个没有独立事实来源可断言的变更上运行它，你会得到一个复述实现的测试：skill 本身警告的同义反复反模式，从另一个方向得出同样的反模式。这是 [issue #746](https://github.com/mattpocock/skills/issues/746)，仍处于 open 状态。在它关闭之前，这个判断归你或你的 `CLAUDE.md`。

## 前置条件

需要安装 [codebase-design](https://aihero.dev/skills-codebase-design)。`tdd` 曾自带深度模块和接口设计说明；在 v1.0 中这些被删除，改用共享 skill，`tdd` 现在依赖它获取接口设计词汇。没有别的了；这个 skill 是[无状态的](https://www.aihero.dev/ai-coding-dictionary/stateless)，不写自己的文件。

## 循环，以及它运行的接缝

三个词承载这个 skill。

**Red-green。**写失败的测试，然后只写刚好通过的代码。不预想下一个测试。没有重构阶段：它在 2026 年 6 月被移除，因为 agent 基本上从不执行它，而且审查和实现作为单独的 session 效果更好。重构属于 [code-review](https://aihero.dev/skills-code-review)。

**纵向切分（Vertical slice）。**一个接缝、一个测试、一个最小实现，然后重复，第一个周期是一发 **tracer bullet**，端到端证明单条路径。反面是横向切分（horizontal slicing）：先写所有测试，再写所有代码。批量测试验证的是*想象中的*行为，它们检查事物的形状而不是用户做什么，并且在你理解实现之前就锁定了测试结构。

**预先商定的接缝（Pre-agreed seam）。**接缝是你观察行为但不深入内部的公开边界。规则是绝对的：不在未确认的接缝处写测试。在完整链路中，接缝是更早商定的，在 [to-spec](https://aihero.dev/skills-to-spec) 阶段："`/tdd` 被告知只在预先商定的测试接缝处工作，`/code-review` 检查只使用了商定的接缝。"单独调用时，`tdd` 直接问你。

它被写来防止的三个反模式：

| 反模式 | 特征 |
| --- | --- |
| 实现耦合（Implementation-coupled） | 你重命名一个内部函数时测试失败，但行为没有改变。mock 了内部协作者、断言调用次数、用数据库查询而非接口来验证。 |
| 同义反复（Tautological） | 期望值用代码相同的方式计算，所以测试构造上必然通过。期望值必须来自别处：已知正确的字面值、具体示例、规格说明。 |
| 横向切分（Horizontal slicing） | 一批测试在任何实现之前就落地了。 |

Mock 只用于系统边界：外部 API、时间、随机性、有时是文件系统或数据库。不是你自己的模块。

## 常见问题

**为什么它不重构？描述里写了 "red-green-refactor"。**

因为重构步骤被移除了但描述没有。移除是有意的：agent 基本上从不执行它，把实现和审查放在不同 session 中效果更好。结果是否还算教科书式的 TDD 不如循环是否产出更好的代码重要。触发短语和正文之间的不匹配作为 [issue #589](https://github.com/mattpocock/skills/issues/589) 提出，仍处于 open 状态，所以 "red-green-refactor" 继续作为触发 skill 的短语生效。你得到的是 red → green，重构在 [code-review](https://aihero.dev/skills-code-review) 中。

**它让我选一个测试接缝，我不知道选哪个。**

这是这个 skill 被报告最多的摩擦（[issue #607](https://github.com/mattpocock/skills/issues/607)）。提示只按名称列出候选接缝，没有说明每个接缝能捕获什么或漏掉什么，所以你在标签之间选。目前没有修复。实用的变通方法是在回答之前问 agent 利弊：组件级接缝漏掉了什么而集成接缝捕获了，慢多少。这也是为什么链路在 `to-spec` 中预先商定接缝，在那里你能看到整个功能而不是一个提示。

**它先写了实现再写测试，尽管 skill 说 red 在先。**

这会发生。一个用户追着 [model](https://www.aihero.dev/ai-coding-dictionary/model) 问，得到了一个异常诚实的回答："我知道 skill 说 '一次一个测试，让它因为正确的理由失败'。我读了。我只是默认了我平常的习惯。"skill 是写来容忍这件事的。没有指令能让 agent 100% 遵从，强行要求更严会限制 agent 的创造力而收益甚微；即使没有严格遵循，循环也值得运行，因为总体结果仍然更好。如果严格遵循对某个 slice 很重要，盯着运行而不是信任 skill 去执行。

**它应该先写浏览器测试或端到端测试吗？**

通常不应该，skill 也不会阻止。一个用户报告 agent 先写了 Playwright 测试，然后花很长时间循环重跑它，得出*测试*对一个尚不存在的功能有 bug 的结论。在你的 `CLAUDE.md` 中配置这个。浏览器测试太慢，red-green 反馈循环入不敷出；在你仓库的 `CLAUDE.md` 中声明浏览器与端到端测试在行为能跑通之后再写。

**`/tdd` 替代 `/implement` 吗，还是课程的 `/do-work`？**

不。`/tdd` 记录方法论；`/implement` 是一个非常简单的 work → feedback → commit 循环，是 `/do-work` 的直接替代。课程的单个 `/do-work` 步骤现在被拆分到 `/implement`、`/tdd` 和 `/code-review`。如果你问该对一个 ticket 运行哪个，答案几乎总是 `/implement`。

**深度模块和接口设计指导去哪了？**

进了 v1.0 的 [codebase-design](https://aihero.dev/skills-codebase-design)，被泛化以便多个 skill 共享一套词汇。`refactoring.md` 同时离开；重构现在是 [code-review](https://aihero.dev/skills-code-review) 的工作，那个 skill 携带 Fowler smell 基线。

**它知道我的其他 ticket 吗？**

不。对一个 ticket 运行，它会乐意提议属于另一个 ticket 的工作，因为它看不到其余的 issue 图（[issue #129](https://github.com/mattpocock/skills/issues/129)）。Matt 的立场是这不是 `tdd` 的工作。随 ticket 传递 spec 有帮助；一开始就合理划分 ticket 帮助更大。

## 达标表现

- 它在任何测试文件存在之前就停下来，列出打算测试的接缝，并等待。
- 一个测试出现，变 red，得到刚好通过的代码，然后下一个测试才出现，不是一批测试加一批代码。
- 测试名称读起来像能力（"用户可以用合法购物车结账"），而不是内部实现（"checkout 调用 paymentService.process"）。
- 断言中的期望值是可追溯到规格说明的字面值，而不是用代码相同方式重新计算的值。
- 重命名一个内部函数不会破坏测试套件中的任何东西。
- mock 只出现在外部边界（支付 API、时钟），从不围绕你自己的模块。

## 它的位置

`tdd` 是主链路构建步骤内部的引擎，而不是一个单独的步骤：

```txt
grill-with-docs → to-spec → to-tickets → implement → code-review
```

[to-spec](https://aihero.dev/skills-to-spec) 预先商定测试接缝，[implement](https://aihero.dev/skills-implement) 按 ticket 驱动 `tdd`，[code-review](https://aihero.dev/skills-code-review) 在之后检查只使用了商定的接缝，并接管 `tdd` 不再做的重构。它的另一个邻居是 [codebase-design](https://aihero.dev/skills-codebase-design)，`tdd` 所说的接缝和深度模块词汇的共享来源。你也可以单独使用它，只要有具体的行为要构建且没有完整 spec。当你不确定哪个 skill 适合你的场景时，[ask-matt](https://aihero.dev/skills-ask-matt) 帮你路由。
