## 它做什么

`research` 通过阅读拥有答案的来源来回答问题，然后在仓库中留下一个带有引用的 Markdown 文件。它只使用**[一级来源（primary source）](https://www.aihero.dev/ai-coding-dictionary/primary-source)**：官方文档、源代码、规格说明、一方 API。它将每个声明追溯到拥有它的来源，因此当 API 自己的文档可以访问时，它不会重复博客文章中对该 API 的描述。

它不会在对话中回答你。输出是一个文件，写在仓库已有的笔记位置，每个声明都有链接。这就是重点：一份你可以做出反应、交给另一个智能体或丢弃的文档，而不是一个在[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)结束后就消失的答案。

## 何时使用

输入 `/research`，或者当任务变成阅读工作时，[智能体（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)会自动调用它。

当下一步是从工作目录之外*查找信息*时使用它（第三方 API 的行为、规格说明的实际内容、版本声明是否成立），而你不想因阅读而阻塞自己的线程。你的需求决定使用哪个 skill：

| 你的需求 | 使用 |
| --- | --- |
| 决策所依赖的外部事实 | `research` |
| 与你一起*通过*访谈做出的决策 | [grilling](https://aihero.dev/skills-grilling) |
| 持久的架构决策，写入 `CONTEXT.md` 和 ADR | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |
| 想知道某个方法在你的代码库中是否可行 | [prototype](https://aihero.dev/skills-prototype) |
| 范围太大无法在单个会话中完成的计划 | [wayfinder](https://aihero.dev/skills-wayfinder) |

`research` 和 `grill-with-docs` 的区别在于**返回内容的保质期**。调研产生的是短期资产：这个库的认证机制本周是怎么工作的。ADR 记录的是你保留的决策。如果你要产出的是决策而不是事实，那你是在 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling)，不是在调研。

## 委托的阅读工作

定义性的动作是阅读作为**后台智能体**运行。你继续工作；它离开，将每个声明追溯到其一级来源，写入一个 Markdown 文件，然后回报。调研是你委托的阅读工作，而不是外包的思考：你得到一份可以用来 grilling、规划或设计的文档，而你仍然做决定。

委托是无守卫的，后台智能体可以生成自己的后台智能体。这是该 skill 最有记录的粗糙边缘。

文件存放位置由仓库决定，而不是由 skill 决定：它遵循仓库已有的任何笔记约定，如果没有就选择一个合理的位置并告诉你。每次运行写入一个文件。

## 常见问题

**它生成了第二个调研智能体。这是预期的行为吗？**

不是。这是一个已知的 bug，[issue #530](https://github.com/mattpocock/skills/issues/530)。该 skill 告诉调用者启动一个后台智能体，但不限制智能体类型，因此它生成的智能体是一个持有 `Agent` 工具和相同指令的 `general-purpose` 智能体，并再次触发它们。一位报告者测量到单个调研任务在三次重叠运行中花费约 450k [token](https://www.aihero.dev/ai-coding-dictionary/token)，副本在半小时后完全不可见地完成。它在 Claude Code 之外也可以复现；在 Codex 和 GPT-5.6-sol 中也确认了相同的嵌套。目前没有发布的修复。用户已经在自己的安装副本中修补了一行，告诉已经是[子智能体（subagent）](https://www.aihero.dev/ai-coding-dictionary/subagent)的智能体自己做这项工作，这有帮助但只是指令层面的，不是结构性的。调用后监控你的后台任务列表，并停止重复。

相反的故障也存在：如果你的全局指令禁止智能体重新委托工作，后台智能体将礼貌地拒绝任务，该 skill 会静默地什么都不做。

**文件应该放在哪里，我应该提交它吗？**

该 skill 将文件放在仓库已有的笔记位置，除此之外没有意见。社区的共识相当明确：ADR 被保留，调研文件不被保留。来自一个讨论这个精确问题的 Discord 帖子中最尖锐的说法："ADRs 保留。其他所有内容在完成后存档或删除。否则它会成为工作残留物，并在你偏离规格说明/调研时毒化未来的仓库读取。"调研文件记录的是编写当天的事实，因此过期的文件比没有更糟。总的来说，这些工件不属于 git，也没有规范的存放位置：人们使用 Obsidian、单独的知识仓库或 issue tracker 代替。

**什么算作"高信任度"的一级来源，谁来决定？**

[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)决定。该 skill 指出了符合条件的来源*种类*（官方文档、源代码、规格说明、一方 API），没有白名单、域名守卫或验证过程。这是该 skill 最初提出时最响亮的反对意见，至今没有公开回答："五个调研子智能体指向垃圾只是给你五个自信的错误答案更快。你如何守卫什么算作高信任度来源？"你实际拥有的缓解措施是每个声明上的引用。跟踪其中两三个。如果它们指向的是某个东西的总结而不是那个东西本身，那么运行就失败了它的唯一任务。

**后续会话会重用早期运行发现的内容吗？**

不会。没有任何东西自动加载过去的调研文件；它是一份在仓库中静置的文档，直到人类或 skill 指向它。这在早期就被提出作为对设计最强有力的挑战："价值在于 markdown 成为智能体稍后重新阅读的上下文，而不是获取本身。一个只写一次的死文件只是一个花哨的搜索。"已发布的 skill 没有解决这个问题。实际上，该文件通过被刻意输入到下一步来证明其价值：附加到规格说明中，引用到 grilling 会话中，将一个 [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket) 指向它。

**为什么不直接让智能体去阅读文档？**

你可以这样做，而这个 skill 替代的正是这种做法的两行提示。该 skill 相比提示的两个优点：它在后台运行，因此你的会话保持其[上下文（context）](https://www.aihero.dev/ai-coding-dictionary/context)干净，而且一级来源约束和带引用的文件输出每次以相同的方式产生，而不是取决于你碰巧如何措辞。与 [harness](https://www.aihero.dev/ai-coding-dictionary/harness) 自己的深度调研模式相比，区别在于工件和来源纪律，而不是搜索。如果两行提示在小问题上给你需要的答案，就使用两行提示。

**它什么时候停止阅读？**

该 skill 中没有停止标准，这表现为两种看似相反但实际上是相同缺口的抱怨：走得太深的智能体，和广泛覆盖主题但遗漏了一个重要细节的智能体。一位实践者这样说："深度调研 skill 有时有点太深了。而且让智能体调研通常会导致遗漏关键细节。"范围界定由你负责。一个狭窄、可回答的问题（一个 API、一个行为、一个版本声明）比"调研 X"返回的结果好得多。

**`/wayfinder` 创建了调研 ticket。我自己解决它们吗？**

不是，它现在为你触发它们。在 v1.1 以来未发布的更改中，一个制图会话为每个调研 ticket 生成一个 `/research` 子智能体，并并行消耗它们，在一个一次性的 `research/<name>` 分支上捕获发现，带有来自 ticket 的[上下文指针（context pointer）](https://www.aihero.dev/ai-coding-dictionary/context-pointer)。调研 ticket 是 wayfinder 每会话一票规则的唯一例外，因为它们是 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) 的：没有什么在等待你。这些分支有两个已知问题：已被观察到子智能体从一个永远不会合并的分支打开一个 draft PR（[issue #576](https://github.com/mattpocock/skills/issues/576)），以及稍后删除分支会破坏 ticket 持有的上下文指针。

## 达标表现

- 你自己的会话继续进行。如果你坐着看它阅读，委托就没有发生。
- 恰好出现一个新的后台任务。第二个名称几乎相同的是嵌套 bug。
- 一个新的 Markdown 文件出现，位于仓库已有的笔记文件夹中，智能体告诉你路径。
- 每个声明都带有链接，随机跟踪两个会落到官方文档、规格说明或实际的源文件上，而不是某人的转述上。
- 你可以仅从文件本身做出你卡住的决策，而不需要自己回到来源。

## 它的位置

一个随时可用的独立流程，为思考型 skill 提供信息，而不是坐在构建链中。它的文件是需要带*入*流程的东西：[grilling](https://aihero.dev/skills-grilling) 和 [grill-with-docs](https://aihero.dev/skills-grill-with-docs) 当事实已经在桌上时会问更尖锐的问题，[to-spec](https://aihero.dev/skills-to-spec) 可以针对它进行综合。[wayfinder](https://aihero.dev/skills-wayfinder) 是唯一直接调用它的 skill，用 `/research` 子智能体解决其地图上的每个调研 ticket。要查看完整地图，请参阅 [ask-matt](https://aihero.dev/skills-ask-matt)。
