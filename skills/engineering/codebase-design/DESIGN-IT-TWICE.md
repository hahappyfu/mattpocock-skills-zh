# Design It Twice

当用户想要为选定的深化候选探索替代 interface 时，使用这种并行 sub-agent 模式。基于 Ousterhout 的「Design It Twice」原则：你的第一个想法不太可能是最好的。

使用 [SKILL.md](SKILL.md) 中的词汇：**module**、**interface**、**seam**、**adapter**、**leverage**。

## 流程

### 1. 构建问题空间

在启动 sub-agent 之前，为选定的候选写下面向用户的问题空间说明：

- 任何新 interface 需要满足的约束
- 它将依赖哪些东西，以及它们属于哪个类别（参见 [DEEPENING.md](DEEPENING.md)）
- 一个粗略的说明性代码草图，用于具体化约束，不是提案，只是让约束变得具体

向用户展示这个说明，然后立即进行步骤 2。用户在阅读和思考的同时，sub-agent 并行工作。

### 2. 启动 sub-agent

并行启动 3+ 个 sub-agent。每个必须为深化后的 module 产生一个**截然不同**的 interface。

用单独的技术简报提示每个 sub-agent（文件路径、耦合细节、[DEEPENING.md](DEEPENING.md) 中的依赖类别、seam 后面是什么）。简报独立于步骤 1 中面向用户的问题空间说明。给每个 agent 不同的设计约束：

- Agent 1：「最小化 interface：目标是 1-3 个入口点。最大化每个入口点的 leverage。」
- Agent 2：「最大化灵活性：支持多种用例和扩展。」
- Agent 3：「为最常见的调用者优化：让默认情况变得简单。」
- Agent 4（如适用）：「围绕端口与适配器模式设计跨 seam 依赖。」

在简报中包含 [SKILL.md](SKILL.md) 词汇和 CONTEXT.md 词汇，使每个 sub-agent 的命名与架构语言和项目领域语言保持一致。

每个 sub-agent 输出：

1. Interface（类型、方法、参数，加上不变量、排序、错误模式）
2. 使用示例，展示调用者如何使用它
3. 实现在 seam 后面隐藏了什么
4. 依赖策略和 adapter（参见 [DEEPENING.md](DEEPENING.md)）
5. 权衡：leverage 高的地方，leverage 薄的地方

### 3. 展示与比较

按顺序展示设计，让用户能够吸收每一个，然后用散文进行比较。从 **depth**（interface 上的 leverage）、**locality**（变更集中的地方）和 **seam 位置** 三个维度进行对比。

比较后给出你自己的推荐：你认为哪个设计最强，为什么。如果不同设计的元素能很好地结合，提出一个混合方案。要有主见：用户想要一个强有力的判断，不是一个菜单。
