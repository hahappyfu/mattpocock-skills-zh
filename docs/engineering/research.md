Quickstart:

```bash
npx skills add mattpocock/skills --skill=research
```

```bash
npx skills update research
```

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/research)

## 它做什么

`research` 通过阅读拥有答案的来源来回答问题，并留下一个带有引用的 Markdown 文件。它只使用**一级来源**：官方文档、源代码、规格说明、一方 API，从不使用二手转述，因此它保存的内容可以追溯到权威来源，而不是摘要的摘要。

## 何时使用

输入 `/research`，或者当任务变成阅读工作时，智能体会自动调用它。

当下一步是从工作目录之外*查找信息*时使用它：API 的行为、规格说明的实际内容、声明是否成立，而你不想因阅读而阻塞自己的线程。要通过访谈而不是阅读来完善计划，使用 [grilling](https://aihero.dev/skills-grilling)；要通过一次性代码探索要构建什么，使用 [prototype](https://aihero.dev/skills-prototype)。

## 委托的阅读工作

定义性的动作是阅读作为**后台智能体**运行。你继续工作；它离开，将每个声明追溯到其一级来源，并将一个带有引用的 Markdown 文件放入仓库已有的笔记位置。调研是你委托的阅读工作，而不是外包的思考：你得到一份可以做出反应的文档，带有其来源。

## 它的位置

一个随时可用的独立流程，为思考型 skill 提供信息：它产出的文件可以用来 grilling、规划或设计，因此它位于 [grilling](https://aihero.dev/skills-grilling) 和 [to-prd](https://aihero.dev/skills-to-prd) 等工作的上游，而不是在构建链中。要查看完整地图，请参阅 [ask-matt](https://aihero.dev/skills-ask-matt)。
