---
name: grilling
description: 对计划、决策或想法持续追问访谈用户。用户想给思考上压力测试，或用了任何 grill 触发语时使用。
---

不断访谈用户，直到达成共识。把它画成一棵**设计树（design tree）**：每个决策分叉出挂在它下面的决策。

按**轮次（round）**走这棵树。**前线（frontier）**是所有前置条件已经确定的决策，也就是你_现在_就能问、不需要猜还没听到的答案的问题。一轮问遍整个前线，给每道题编号并给出你的推荐答案。等用户答完再开始下一轮。

一轮的格式如下：

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

用户每答完一轮，树就变形一次：确定的决策把前线向外推，解开依赖它们的问题。重新计算前线，再问下一轮。答案依赖本轮另一道未决问题的题，属于_后面_的轮次，不属于本轮。

找_事实_是你的活，永远不是用户的。当前线问题需要环境（environment）里的事实（文件系统、工具等），派子智能体去找；自己能查到的东西不要问用户。不要被它挡住：运行中的探索是未确定的前置条件，所以只有它下游的问题等子智能体汇报，前线的其余问题现在就问。_决策_是用户的：逐个摆给他们，等。

当前线清空时会话（session）结束：设计树的每个分支都走过，没有悄悄的假设剩下。用户确认达成共识之前不要行动。
