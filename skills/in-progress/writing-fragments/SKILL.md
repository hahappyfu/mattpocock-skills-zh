---
name: writing-fragments
description: "写作探索：挖原始片段，暂不定结构。"
disable-model-invocation: true
---

<what-to-do>

这是纯粹的**探索（explore）**：把可写的东西撑开，不急着定结构。定结构是深耕（exploit）的事，是另一个 skill 的活。跑一场 grilling 会话挖片段（fragment），就用户想写的东西无情追问，在这里加阶段、加提纲、加文章结构都越界（scope）。

对话两侧冒出的片段都追加到同一个 markdown 文件。

用户没给路径就问一次存哪，问完整个会话记住它。

从用户说的第一句话（包括最初的 prompt）就开始收片段。

第一次落盘时，顶部只放一个 H1 写暂定标题（以后可改），除此之外什么都没有：不要元数据，不要目录，不要日期。

</what-to-do>

<supporting-info>

## 什么是片段

片段是任何可能活到终稿的文字。它必须*作者可读*（作者能看懂意思），但不需要定义术语，也不需要冷读者能看懂。标准是"这是不是一段好文字"，不是"这是不是自洽的论证"。

片段故意要杂，可能是：

- 一句锋利的话，想用但还没想好放哪。
- 一个带一句话论据的主张。
- 一段小品：发生的事、一段代码、一个场景、一个类比。
- 半个想法："something about how X feels like Y, work this out later."
- 一句引用、一段对话、一句听来的话。
- 一簇凭感觉串在一起的相关观察。
- 一句抱怨、一句自白、一个包袱。
- 一个**领衔词（leading word）**：全文能挂上去的紧凑隐喻或新造词（一个词点出想法，就像 _tracer bullets_ 或 _fog of war_ 点出一整套模式）。

其中领衔词是最值得挖到的片段，它承重：探索阶段定准一个，后续结构、过渡、标题全跟着走，整个深耕阶段持续分红。当对话围着一个反复出现的想法打转，就推一把定一个词给它。

范本是小说家的日记：多年不成结构的见闻，留待日后挖作素材。片段就是见闻。

## 文件格式

```markdown
# Working title

A first fragment lives here.

It can be multiple paragraphs. It can include lists, code, quotes: whatever
shape the fragment naturally takes.

---

A second fragment.

---

> A quoted line that the user wants to keep around.

A reaction to it.

---

- A cluster of related observations
- That hang together by feel
- And want to be near each other
```

片段之间用水平线（`\n---\n`）分隔，正文里不加标题，不打标签，除了追加顺序不排序。

## 写作节奏

静默追加，每条片段不用请示。顺带提一句加了什么（"adding that"），但别拿存盘对话框打断对话。

每次落盘前先从磁盘重读文件，用户可能在回合之间编辑、重排或删除片段，所以保留他们的改动。绝不整文件覆盖，只追加（用户点名改某条时原地改那一条）。

用户随时可以说 "cut the last one"、"rewrite that one sharper"、"merge those two"，都当一等指令执行。

</supporting-info>
