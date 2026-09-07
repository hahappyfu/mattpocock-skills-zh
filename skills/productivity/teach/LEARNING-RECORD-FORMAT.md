# 学习记录格式

学习记录住在 `./learning-records/` 里，按顺序编号：`0001-slug.md`、`0002-slug.md`，往下排。目录懒创建：写第一条记录时才建。

它们是教学版 ADR：记不显然的教训、关键洞察和说出口的先验知识，引导以后的课。用它算最近发展区。

## 模板

```md
# {Short title of what was learned or established}

{1-3 sentences: what was learned (or what prior knowledge was established), and why it matters for future sessions.}
```

格式全文就这些。学习记录可以只有一段。价值在记下*这个*已知、以及它为什么改变下节教什么，不在填节。

## 可选节

真增值才加。多数记录用不上。

- **Status** frontmatter（`active | superseded by LR-NNNN`）：早先理解错了被替换时有用。
- **Evidence**：用户怎么证明懂了（答对一道题、做完一个练习、报过先验经验）。以后可能复查时有用。
- **Implications**：解锁或排除以后课的什么。不显然时值得记。

## 编号

扫 `./learning-records/` 找最大号，加一。

## 何时写学习记录

下面任何一条成立就写一条：

1. **用户真懂了不简单的东西**：不止见过，有证据会用。给下节课定了新下限。
2. **用户报了先验知识**："X 我已经会。"记下来，以后不重教。*深*到什么程度也记。
3. **纠正了一个误解**：用户原来信错了，现在知道为什么。这些价值最高，能预测相关主题以后的坑。
4. **学着学着使命变了**：用户发现自己在乎的跟原来想的不一样。链到 [[MISSION.md]] 并更新它。

### 什么不够格

- 只讲过没证据的材料。讲过不等于学会。等证据。
- [[GLOSSARY.md]] 里一句话能记清的词条定义。别重复。
- 逐课流水账。学习记录不是日记，是决策级洞察。

## 替代

后记录打翻前记录（理解加深或纠正），给旧记录标 `Status: superseded by LR-NNNN`，不删除。理解怎么演化的历史本身就是信号。
