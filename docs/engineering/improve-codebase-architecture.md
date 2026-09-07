## 它做什么

`improve-codebase-architecture` 调查代码库寻找**深化机会**：浅模块（一个接口几乎与隐藏的东西一样复杂）可以变成深模块的地方。它将它们写成独立的 HTML 报告，然后[访谈](https://www.aihero.dev/ai-coding-dictionary/grilling)你选择的方案。

它永远不会改变代码。整个运行在操作系统临时目录中生成一个 HTML 文件和一个对话；重构本身发生在以后，在单独的[会话](https://www.aihero.dev/ai-coding-dictionary/session)中，通过正常的构建流程。这就是它成为调查而不是重构工具的原因，也是为什么这个技能值得在你还没准备好接触的代码库上运行的原因。

两个过滤器防止报告变成通用的清理建议。每个候选方案都必须通过**删除测试**：移除这个模块是否会在更小的接口后面集中复杂性，或者只是将其分散到调用者之间？只有"集中"的情况才能获得卡片。除非你指向特定区域，否则它会先阅读最近的提交历史，并偏向于正在积极变更的路径，因为深化无人触及的代码是你永远不会兑现的重构。

## 何时使用

你通过输入 `/improve-codebase-architecture` 调用它；[agent](https://www.aihero.dev/ai-coding-dictionary/agent) 不会自行调用它。

它位于构建循环之外：不是主循环中的一个步骤，而是你定期运行以排队更多工作来改进代码库的东西。使用它的四种情况：

| 场景 | 使用方式 |
| --- | --- |
| 日常维护 | 每几天运行一次，或在有空闲时运行，以阻止功能之间的结构腐烂。 |
| 大型构建之前 | 指向 [spec](https://www.aihero.dev/ai-coding-dictionary/spec)：我们如何让这个变更变得容易？这是最有效的提示。 |
| 遗留代码库审计 | 在大型、无结构或[氛围编码](https://www.aihero.dev/ai-coding-dictionary/vibe-coding)的代码库上运行，以了解其实际状况。 |
| 遗留测试工作 | 在编写无法测试的代码的测试之前，用它来找到缺失的 seam。 |

它可能与同级技能混淆的地方：

- 要设计你已经选择的一个模块，使用 [codebase-design](https://aihero.dev/skills-codebase-design)：那是工作台，这是调查，找到要放在上面的东西。
- 要处理一个太大、无法在一个会话中完成的整个工作，使用 [wayfinder](https://aihero.dev/skills-wayfinder)。
- 要处理"这个特定东西坏了"，使用 [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)。当真正的发现是没有好的 seam 来锁定 bug 时，它会返回到这里。

## 前置条件

没有运行它的前置条件。它读取 `CONTEXT.md` 和 `docs/adr/` 中的任何 ADR（如果存在），并在它们存在时使用你领域自己的名词：候选方案读起来像"deepen the Order intake module"，而不是"refactor the FooBarHandler"。

它写入两个地方。报告去到 `<tmpdir>/architecture-review-<timestamp>.html`，在仓库外部。在访谈循环期间，它会在 `CONTEXT.md` 中添加或明确术语，如果该文件不存在则创建它，并提供将拒绝的候选方案记录为 ADR 的选项，这样未来的运行就不会重新建议它。

## 深度，以及寻找它的报告

技能基于一个概念：**depth**。深模块在一个小而稳定的接口后面放了很多行为。浅模块通过一个几乎与下面代码一样宽的接口泄露其实现。报告以三种形式寻找浅层：纯粹为了可测试性而提取的纯函数，而真实错误隐藏在它们的调用方式中（没有**locality**），跨越其 **seam** 泄露的模块，以及一个不打开五个文件就无法理解的概念。最后提出修复它的深化建议。

每个候选方案是一个卡片：涉及的文件、摩擦、简明英文的解决方案、用 **locality** 和 **leverage** 表述的收益、前后图表和强度徽章。

| 徽章 | 对你意味着什么 |
| --- | --- |
| `Strong` | 删除测试清晰通过，摩擦是真实的。认真对待这些。 |
| `Worth exploring` | 可能的深化，但收益取决于代码接下来的走向。 |
| `Speculative` | 为完整性而呈现。大多数可以安全忽略。 |

报告以一个**Top recommendation**（它会先处理的那个）结束，然后技能停止并询问你想探索哪个候选方案。在那一刻什么都没有决定，代码也没有移动。

## 选择一个之后会发生什么

选择一个候选方案开始一个关于它的 [grilling](https://aihero.dev/skills-grilling) 会话：约束、seam 后面是什么、哪些测试会保留、深化后的接口应该是什么样子。该会话的输出是一个决策，而不是一个 diff。从那里适用正常流程：将决策带入 [to-spec](https://aihero.dev/skills-to-spec)，然后 [to-tickets](https://aihero.dev/skills-to-tickets)，然后 [implement](https://aihero.dev/skills-implement)。

## 常见问题

**它针对一个想法访谈了我一个小时，而不是展示选项。我能关闭吗？**

可以：调用时这样说（"don't grill me, just show the report"）。这是技能最响亮的投诉。一个用户直白地说：他们喜欢它作为"获得改进的全面分析的便捷方式"，在访谈循环添加后发现它"borderline unusable"，报告会话中它提出一个单一解决方案然后询问"10's or 100's of questions"。设计意图是报告在前，访谈只在你选择的候选方案上开始，但较弱的[模型](https://www.aihero.dev/ai-coding-dictionary/model)直接跳到访谈你关于它们第一个想法的问题。该线程中的报告因模型而异，这是一个开放问题：技能还没有记录的无访谈模式。

**报告以无样式的原始 HTML 打开，没有图表。发生了什么？**

报告从 CDN 加载 Tailwind 和 Mermaid，所以打开时需要网络访问，当某些东西阻止这些脚本时它会静默失败。已归档的案例是一个要求 SRI 哈希的安全钩子：agent 添加了它们，CDN 向浏览器提供的字节与用于计算哈希的 `curl` 不同，浏览器阻止了脚本。离线和锁定环境也会遇到同样的障碍。agent 无法看到这一点，因为它从不渲染页面。变通方法是要求内联 CSS 和手工构建的 SVG 图表，而不是 CDN 脚手架。这是一个开放问题和真正的痛点。

**它给了我十二个候选方案。我在同一个会话中处理它们还是开始一个新会话？**

每个会话一个候选方案。在一个对话中处理几个会用报告、访谈、领域模型编辑和代码更改填充[上下文窗口](https://www.aihero.dev/ai-coding-dictionary/context-window)。报告只存在于临时文件中，所以携带候选方案本身而不是文件：选择一个，访谈它，将决策带入 `/to-spec`，将其余的转换为你以后可以独立获取的[工单](https://www.aihero.dev/ai-coding-dictionary/ticket)。将选定的改进放入 spec，而不是直接进入实现。这是一个反复出现的问题，技能本身没有记录的工作流。

**我应该如何提示它？**

考虑你接下来要构建的东西。当大型构建即将到来时，指向 spec 并询问"我们如何让这个变更变得容易？"未提示的运行会自己扫描热点，这对日常维护来说没问题，但命名方向是使报告可操作的。

**它适用于大型遗留代码库吗？**

部分适用。它对缺乏一致结构的大型现有代码库很强，并且是任何一次性结构设置后的推荐维护机制。诚实的反驳：真正失控的项目的用户报告它"helped a little but still doesn't seem to cut it"，一个有八年遗留代码库的开发者报告模型在同一个技能在整洁代码库上生成干净图的地方原地打转。目前还没有专门的 `/refactor` 技能用于这种情况。如果代码库根本没有共享词汇，[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 先建立一个往往会使这个技能的输出好得多。

**这与 `/codebase-design` 有什么不同？**

`/codebase-design` 是参考，而不是会话驱动器。它提供词汇（module、interface、depth、seam、adapter、leverage、locality），这个技能借用它。将一个新鲜的 agent 指向 `/codebase-design` 作为要"做"的东西是一个已知的失败：没有自己的流程可以遵循，agent 会发明一个，重新探索代码并运行很长时间，然后才问你任何问题。用这个技能驱动；消费那个技能。

**它会告诉我代码库没问题吗？**

很少，你应该知道这一点。技能被构建为输出发现，所以框架推动它产生候选方案，而不是得出没有问题的结论。强度徽章是防御：一切都是 `Speculative` 的报告是技能告诉你它没有发现任何东西，以它唯一知道的方式。

**它在 Codex 或另一个 harness 中工作吗？**

部分工作。探索步骤直接命名 Claude Code 的 `Agent` 工具，具有 `subagent_type=Explore`，所以没有该工具的 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 可能会跳过并行探索，而不是替代自己的。技能仍然运行；扫描只是不那么彻底。一个与 harness 无关的重写已被提议但未合并。

**我实际上如何在 TypeScript 中实现深模块？**

技能没有附带好的答案。反复的请求是一个 `TYPESCRIPT.md` 提供具体文件和模块布局的原则，它不存在。技能会告诉你深化在哪里以及什么应该在 seam 后面；将其转化为包或目录结构目前由你负责。

## 达标表现

- 候选方案命名你领域的概念，而不是发明的类名："the Order intake module"，而不是"the FooBarHandler"。
- 候选方案集中在你最近编辑过的文件中，而不是仓库的休眠角落。
- 运行期间没有代码更改。唯一的新文件是你临时目录中的 HTML 报告。
- 它在报告后停止并询问你想要哪个候选方案，而不是继续。
- 每张卡片将收益解释为 locality 或 leverage，并说哪些测试变得简单，而不仅仅是"this is cleaner"。
- 因持久原因拒绝候选方案会让你提议记录 ADR，这样下次运行就不会重新建议它。

## 适合位置

`improve-codebase-architecture` 是**定期维护**：每几天运行一次，在任何链之外，排队工作而不是执行它。它的邻居是 [codebase-design](https://aihero.dev/skills-codebase-design)，拥有每个候选方案写作的 depth-and-seam 词汇，[grilling](https://aihero.dev/skills-grilling)，在你选择候选方案后走决策树，以及 [domain-modeling](https://aihero.dev/skills-domain-modeling)，在决策确定时保持 `CONTEXT.md` 和 ADR 最新。它产生的一个想法，在 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 或 [to-spec](https://aihero.dev/skills-to-spec) 处重新进入主构建流程。对于哪种技能适合情况，[ask-matt](https://aihero.dev/skills-ask-matt) 是整个集合的路由器。
