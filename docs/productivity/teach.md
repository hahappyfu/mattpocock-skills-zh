## 它做什么

`teach` 把你运行它的目录变成常驻教学工作区，用短小自包含的 HTML 课跨多个[会话（session）](https://www.aihero.dev/ai-coding-dictionary/session)教你一个主题。

它不用[模型（model）](https://www.aihero.dev/ai-coding-dictionary/model)已知的东西教学。参数知识（parametric knowledge）当不可信处理：开教之前先找高信任资源，记进 `RESOURCES.md`，每课引用。另一个结构事实是它**有状态的（stateful）**：使命、资源、课和学到什么的记录都以文件住在目录里，下一场会话从这些文件续上，而不是从上场对话剩下的东西续上。

## 何时使用

输入 `/teach` 即可调用；[智能体（agent）](https://www.aihero.dev/ai-coding-dictionary/agent)不会主动调用它。

学习本身就是项目时用它：一门语言、一个框架、刚加入的代码库、瑜伽、shader、一门认证。顺手讲一句别用它。

| 你想要 | 用这个 |
| --- | --- |
| 用几周学一个主题，课越攒越多 | `teach` |
| 在当前会话里讲清一个概念 | 直接在那场会话里问 |
| 智能体上一句话没听懂，让它重讲 | [wait-what](https://aihero.dev/skills-wait-what) |
| 打磨已有想法，而不是拿新东西 | [grill-me](https://aihero.dev/skills-grill-me) |
| 后台智能体读[一级来源（primary source）](https://www.aihero.dev/ai-coding-dictionary/primary-source)留一份带引用的文档 | [research](https://aihero.dev/skills-research) |
| 访谈中冒出要学的东西，不想打断 [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) | [handoff](https://aihero.dev/skills-handoff) 到教学工作区，那边 `teach` |

## 前置条件

`teach` 建目录不产文件，一个工作区只认一个使命，所以在能交给单个主题的地方运行。别放进正在干活的项目：单独开仓库是推荐做法，别用全局 `~/.learnings/` 文件夹，也别直接用工作项目。独立仓库还能提交课，团队就这么分享。

目录里会攒下这些：

| 路径 | 里面是什么 |
| --- | --- |
| `MISSION.md` | 为什么学这个。别的都挂它下面；缺了它，`teach` 第一件事就是访谈你直到有为止 |
| `RESOURCES.md` | 经审核的来源，分知识与智慧（社区）两块 |
| `lessons/*.html` | 编号课，教学的基本单位 |
| `reference/*.html` | 压缩速查表、算法、词汇表，真正会回翻的文档 |
| `learning-records/*.md` | ADR 式笔记，记你切实学会了什么，决定下节教什么 |
| `assets/*` | 可复用组件，先有共享样式表，让课看起来像一门课 |
| `NOTES.md` | 你说过的教学偏好 |

名单上有两句实话。多数主题配词汇表合适，但 skill 自带的 `GLOSSARY-FORMAT.md` 已经没有 `SKILL.md` 链它，你开口要才有（[issue #559](https://github.com/mattpocock/skills/issues/559)）。工作区也不总建在你以为的地方，长课搭上去之前先看下面第一个问题。

## 存储强度，不拼流畅度

想的时候认准**存储强度（storage strength）**这个词：长期留存，对应**流畅度（fluency）**，读着会、过一周没的那种当场回忆。`teach` 用合意难度建前者：提取练习、间隔练习、交错练习。知识先行，那里难度是敌人，吃掉你理解用的工作记忆；然后 skill 用紧 feedback loop 操练，那里难度是工具。

教你什么由两样东西定。**使命**（要这个的实打实现实原因）给每课垫底；没它课就飘，下节教什么也没人拍板。从使命和学习记录出发，`teach` 在你的**最近发展区（zone of proximal development）**里挑下节课：费点劲够得着，别远到学不动。

这也是 skill 顶回去而不顺着的原因。问到要**智慧**（真实世界判断）先试着答，再指一个能去试的社区。测验是门禁，不是过场：有用户说了句"多谢"被告知操练还没过。

## 课、参考与组件

**课（lesson）**是一个自包含 HTML 文件，一次坐定能学完，扣使命，给一个实在收获。带来源引用，推荐一个值得自己去读的一级来源，链兄弟课和参考文档。

值得知道的分工：课很少回翻，参考文档会。所以课的压缩精华（语法表、算法、体式序列、词汇表）住 `reference/`，不埋在介绍它的课里。

课由 `assets/` 里的**组件**搭成：样式表、测验挂件、模拟器、图表小工具。复用是默认。智能体写课之前读 `assets/`，用现成的搭，第二课能用的新东西写成组件不内联。共享样式表是每个工作区挣到的第一个组件，它让产出不至于是一堆一次性。

## 常见问题

**文件放哪了？我 的落到 `~/.claude/skills` 里了。**
真实存在的开放 bug（[#377](https://github.com/mattpocock/skills/issues/377)）。`SKILL.md` 把 `./` 当两个根用：`./MISSION-FORMAT.md` 这些确实住在安装 skill 旁的 `SKILL.md` 边上，`./lessons/`、`./reference/`、`./learning-records/` 和 `./assets/` 该住你的目录。智能体按 skill 安装目录解了第一种，会连第二种一起解错，把你的课写进 skill 文件夹。搭长课之前先看第一课落哪了，开场直接点名目录，别指望"当前目录"被听懂。

**一节一会话，还是多节一会话？**
三种都行：同会话待着、新会话重调 `/teach`、同文件夹开新会话。每课一次调用。文件夹是连续性，对话不是。常见做法是在工作区开新会话说一句 `/teach next lesson for <topic>`。

**怎么知道它没在现编教我？**
光听 skill 的不行。读一级来源。`teach` 没可靠到能闭眼信，基于 LLM 的 skill 都没到。接地机制（`RESOURCES.md`、每课引用、每课推荐一个一级来源）让验证便宜不断，不是不用验证。失败不是假设：有用户学二阶魔方拿到走不通的编造公式。这种 case 的诊断单是模型、harness、投入和来源。符号精确的流程性领域风险最高，产出能立刻验证的领域（比如能跑的代码）风险最低。

**测验正确答案永远是第一个选项。**
几拨人确认过，Sonnet、Opus、GLM 上都有，没修。`SKILL.md` 现在要求选项词数相同，杀的是另一种马脚（正确答案曾是唯一充分论证的那个），位置没管。有贡献者测过指令级 fix，九课里正确答案 33 次全落 A 位（[#335](https://github.com/mattpocock/skills/issues/335)），指向 `assets/` 里缺一个渲染时洗牌的测验组件，而不是措辞问题。修好之前位置信息作废。`assets/` 目录归你改，要一个渲染时洗牌的组件是合法本地 fix。

**它默认我会很多，用没定义的词。**
最常见的实质抱怨。没有摸底步骤：`teach` 从使命和学习记录推你的水平，第一课时学习记录是空的。有用户在 wayfinder 流水线里跑原话是："它从没 grilling 摸我的起点，假设了一堆我会的。"还有人报课倚着没定义的黑话，报给硬件定制的课讲了硬件能干什么、能干什么没说什么。两件事有用：第一句话就报先验知识和缺口，课跑偏当场纠正水平，纠正会变成学习记录牵引下一课。显式知识摸底是长期挂着的功能请求（[#725](https://github.com/mattpocock/skills/issues/725)），没发货。

**它管间隔重复吗，知道何时停吗？**
第一问不，第二问不稳。间隔和交错是课的设计原则，没有排复习的东西，也没接 Anki 或日历，都是反复出现的请求。相关缺口是退出标准：有用户原话，`teach` "下节课很会出，何时停下来复习或实练不太会。"想要复习或操练直接要，skill 不会自己提换挡。

**只对代码有用？**
不，非代码用例是记录里更大的部分：韩语、日语敬语、钢琴、吉他、桌游设计、OpenSCAD、电影剧情、Azure 和 CCNA 认证、大学考试，还有八岁十岁小孩的可打印小书，主题是密室逃脱和火蜥蜴。skill 里没有一行编程专用：使命、资源、最近发展区和操练在任何领域一样转。代码圈里报得最强的用法不是从零学语言，而是在陌生代码库或新团队技术栈里找北。

**配什么模型跑？**
没有正解，报出来的差距很大。高[推理投入（reasoning effort）](https://www.aihero.dev/ai-coding-dictionary/effort)出的课据报明显好过中档。有用户同 skill 经 Copilot CLI 用 Codex 跑出 30 行 HTML 卡片，Claude Code 出整课。Claude Cowork 里免改能跑，看你组织让不让加 skill。课出薄了先换模型、[harness](https://www.aihero.dev/ai-coding-dictionary/harness)或投入，别先改提示词。

## 达标表现

- 空目录第一件事是访谈你为什么要这个，而不是产课。
- `RESOURCES.md` 先满，课后满，每课点名一个值得自己去读的一级来源。
- 课里断言带链子出去。没引用的课就是 skill 在凭记忆教。
- 一课一次坐定，出来时会一件原来不会的事。
- 文件夹里开新会话说一句"下节课"，课续上不重开。
- `learning-records/` 在长，切实会的东西课不再重教。
- 课看起来像一门课：链 `assets/` 里的样式表，不各背各的。
- 要判断的问题把你指给论坛、subreddit 或线下课，不止给答案。

## 它的位置

`teach` 是**随时可用的独立流程**。不在构建链里，跟工程流不共享 artifact，占住自己的目录，主题在它就在。

它唯一真邻居是 [handoff](https://aihero.dev/skills-handoff)，经 Matt 点名的组合回答"访谈中撞上不懂的东西怎么办"：别停下访谈去学，`/handoff` 到教学工作区，那边 `/teach` 学完回来续上。附近替代是 [research](https://aihero.dev/skills-research)，想要带引用的文档而不是课和留存时用。拿不准哪个 skill 或流程合适，[ask-matt](https://aihero.dev/skills-ask-matt) 带你走全集。
