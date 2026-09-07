## 它做什么

`writing-for-agents` 是写面向智能体文档查的参考：skill、`AGENTS.md` / `CLAUDE.md`、[spec](https://www.aihero.dev/ai-coding-dictionary/spec)、运行时提示词、README，[智能体（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)读的任何文档。包装不同，写法相同：同样的杠杆让每种可预期，智能体每轮走同样的*流程*，而不是产出同样的输出。

默认动作是删，不是讲。让智能体给另一个智能体写指令，它大半字花在讲[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)已知的东西上。每一行都是**无效句**，花[上下文（context）](https://www.aihero.dev/ai-coding-dictionary/context)不改行为。这个参考是找它们的镜片，所以空白文件和已有文档一样常挣得位置。

它 v1.1 前叫 `writing-great-skills`。改名跟上了它一直以来的里子：几乎没有 skill 专用。skill 专属机制（frontmatter、模型侧用户侧选择、路由 skill）披露到链过去的 `SKILL-MECHANICS.md`，眼前的文档是 skill 才读。

## 何时使用

输入 `/writing-for-agents`，或建改 skill、改 `AGENTS.md` 或 `CLAUDE.md` 时智能体主动调用。

智能体读的别的东西亲手拿它：文档、spec 和[工单（ticket）](https://www.aihero.dev/ai-coding-dictionary/ticket)、系统和 [AFK](https://www.aihero.dev/ai-coding-dictionary/afk) 提示词。测试只有一问：智能体读这个吗？怎么到它面前的无所谓，指针点名、人粘贴、躺在仓库都算。先搞清代码库里有什么用 [grill-with-docs](https://aihero.dev/skills-grill-with-docs)，这个参考管文档怎么读，不管它知道什么。

## 两种负荷

参考转的那个概念是一对预算，每篇文档每个指针都花：

- **上下文负荷**：常驻材料在智能体窗口上的花费：`AGENTS.md` 的一行、skill 描述、每[轮（turn）](https://www.aihero.dev/ai-coding-dictionary/turn)都坐在上下文里的任何东西，不管触发没触发。
- **认知负荷**：你身上的花费，哪些文档存在、何时摸哪个。你是索引。不求省：它是人类能动性的价格。

两种负荷想明白，多数写作决策（拆不拆、内联还是披露、指还是推）是同一笔权衡换地方做。

## 杠杆

- **[上下文指针](https://www.aihero.dev/ai-coding-dictionary/context-pointer)**：上下文里存的引用，点名上下文外的材料，写清何时够它。skill 描述和 `AGENTS.md` 里点文档的行是同一东西，指针*措辞*不看目标定智能体够得多稳。
- **信息层级**：文件内步骤、文件内参考、指针后披露式参考的梯子。**[渐进披露](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure)**是顺梯子下移让顶层可读。
- **完成标准**：每步完工条件的清晰和分量，分量驱动的**深挖工作**，防**过早收尾**。
- **引导词**：模型预训练里已有的紧凑概念（*tight*、*red*、*tracer bullet*），智能体跑文档时拿它想事。正文锚执行，指针锚调用。
- **剪枝**：单一事实来源、相关性、逐句无效句测试，对付**重复**、**沉积**和**膨胀**。

## 常见问题

**`/writing-great-skills` 去哪了？**
就是这个 skill，v1.1 改的名。早就有人拿它对准 `AGENTS.md`、文档、spec、工单和运行时提示词，名字才跟上；结构、引导词、剪枝是智能体读的任何文字的手艺。没别名。新名字重装。

**"为智能体写作"，写的是智能体？**
反了。你是作者，智能体是读者。这是这个文体全部的难：读者什么都读过，解释是浪费，精确是全部的活。

**让智能体替我写不行吗？**
行，出来啰嗦。模型独处解释它已知的东西，无效句测试不做，引导词不摸。拿参考过草稿：审稿那一遍是它价值主要落的地方。

**让智能体瘦文档，它把功能砍了。**
告诉智能体"精简"按长度优化，因为长度是它看得见的东西。无效句测试是行为的不是审美的：删掉这行问智能体行为变没变。句子挂了整句删不修词，分歧跑文档裁不靠吵。

**怎么知道写完了？**
跑通了，重复沉积无效句找不着了。这里没自动 `eval`，检查是手跑加失败模式词汇当诊断。文档跑坏，那套词汇也是修它的工具箱：先点失败模式的名，再修那个。

**该住 `CLAUDE.md` 还是别处？**
问想花哪种负荷。`CLAUDE.md` 每[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)无条件加载；指针后的材料触发前只花指针自己那一行。十次用一次的东西次次交上下文负荷。

**换模型要重写文档吗？**
多数不用，给单个模型特调本身是坑。换模型多是再过一遍无效句，不是重写。

**我的 skill 只在孵出它的那个任务上能用。**
常见路线（干一次，让智能体写成 skill）单轮过拟合，范例太具体。留那轮当证据，刻意抽象：剥掉那仓库那文件的东西，为一类任务写。

**英语不是母语，引导词优势没了吗？**
没。把最多行为压进最少[词元（token）](https://www.aihero.dev/ai-coding-dictionary/token)是参考替你干的活。本来就是它干这个用的之一。

## 达标表现

- 文档越改越短，短到你惊讶剩这么点。
- 能指着一个引导词看它在多处干活。
- 一句话不说两遍，任何形式都不行。重复是文档没跑过的最稳信号。
- 单分支要的参考藏指针后，不在主文件。

## 它的位置

随时可用的独立参考。链里没邻居，它在全集底下不在某 skill 边上：这里每个 skill 按它写的，别的 skill 落的文档（`CONTEXT.md` 和 ADR、spec、工单）被智能体读时归它管。哪个 skill 或流程合适拿不准，[ask-matt](https://aihero.dev/skills-ask-matt) 带你走全集。
