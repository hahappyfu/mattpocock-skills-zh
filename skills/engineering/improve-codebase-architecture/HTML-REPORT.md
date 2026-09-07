# HTML 报告格式

架构审查作为单个独立的 HTML 文件在操作系统临时目录中渲染。Tailwind 和 Mermaid 都来自 CDN。Mermaid 能可靠地处理图形形状的图表；手工构建的 div 和内联 SVG 处理更具编辑性的视觉效果（批量图、横截面）。混合使用两者：不要所有东西都依赖 Mermaid，否则会开始显得通用。

## 脚手架

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Architecture review for {{repo name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      /* small custom layer for things Tailwind doesn't cover cleanly:
         dashed seam lines, hand-drawn-feeling arrow heads, etc. */
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## 头部

仓库名称、日期和一个紧凑的图例：实线框 = 模块，虚线 = seam，红色箭头 = 泄露，粗深色框 = 深模块。没有介绍段落。直接进入候选方案。

## 候选卡片

图表承担重任。文字简洁、朴实，使用术语表术语（来自 `/codebase-design` 技能）而不加修饰。

每个候选方案是一个 `<article>`：

- **Title**：简短，命名深化（例如"Collapse the Order intake pipeline"）。
- **Badge row**：推荐强度（`Strong` = 翡翠色，`Worth exploring` = 琥珀色，`Speculative` = 石板色），加上依赖类别标签（`in-process`、`local-substitutable`、`ports & adapters`、`mock`）。
- **Files**：等宽字体列表，`font-mono text-sm`。
- **Before / After diagram**：核心。两列，并排。参见下面的模式。
- **Problem**：一句话。什么造成摩擦。
- **Solution**：一句话。什么会改变。
- **Wins**：要点，每个 ≤6 个单词。例如"Tests hit one interface"、"Pricing logic stops leaking"、"Delete 4 shallow wrappers"。
- **ADR callout**（如适用）：琥珀色背景框中的一行。

没有解释段落。如果图表需要一段话来理解，请重新绘制图表。

## 图表模式

选择适合候选方案的模式。混合使用。不要让每个图表看起来都一样。多样性是重点的一部分。

### Mermaid 图（依赖/调用流程的工作马）

当要点是"X 调用 Y 调用 Z，看看这个混乱"时，使用 Mermaid `flowchart` 或 `graph`。将其包装在 Tailwind 样式的卡片中，使其感觉不像空降而来。使用 classDef 为泄露边着色为红色，深模块着色为深色。序列图适用于"前：6 次往返；后：1 次"。

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[OrderHandler] --> B[OrderValidator]
      B --> C[OrderRepo]
      C -.leak.-> D[PricingClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### 手工构建的框和箭头（当 Mermaid 布局与你作对时）

模块作为带边框和标签的 `<div>`。箭头作为内联 SVG `<line>` 或 `<path>` 元素，相对于容器绝对定位。当你想要"后"图表感觉像是一个粗边框深模块，内部为灰色时使用它，因为 Mermaid 不会以正确的权重渲染。

### 横截面（适用于分层的浅层）

堆叠水平条带（`h-12 border-l-4`）以显示调用经过的层。前：6 个薄层，每个都不做任何事情。后：1 个粗条带，标记有合并的责任。

### 批量图（适用于"接口与实现一样宽"）

每个模块两个矩形：一个用于接口表面积，一个用于实现。前：接口矩形几乎与实现矩形一样高（浅）。后：接口矩形短，实现矩形高（深）。

### 调用图折叠

前：函数调用树渲染为嵌套框。后：相同的树折叠成一个框，现在内部的调用显示为淡化的。

## 样式指南

- 倾向编辑性，而非企业仪表板。充足的空白。标题可选衬线字体（`font-serif` 在 stone/slate 上效果很好）。
- 节制使用颜色：一种强调色（翡翠色或靛蓝色）加红色用于泄露和琥珀色用于警告。
- 保持图表约 320px 高，这样前后对比可以舒适地并排显示而无需滚动。
- 在图表内的模块标签上使用 `text-xs uppercase tracking-wider`，使其看起来像示意图，而不是 UI。
- 唯一的脚本是 Tailwind CDN 和 Mermaid ESM 导入。报告是静态的：没有应用代码，没有超出 Mermaid 自身渲染的交互性。

## 顶部推荐部分

一个更大的卡片。候选方案名称，一句话解释为什么，锚点链接到其卡片。就是这样。

## 语气

简明英文，简洁，但架构名词和动词直接来自 `/codebase-design` 技能。简洁不是偏离的借口。

**精确使用：** module、interface、implementation、depth、deep、shallow、seam、adapter、leverage、locality。

**永远不要替换：** component、service、unit（代替 module）· API、signature（代替 interface）· boundary（代替 seam）· layer、wrapper（代替 module，当指的是 module 时）。

**符合风格的短语：**

- "Order intake module is shallow: interface nearly matches the implementation."
- "Pricing leaks across the seam."
- "Deepen: one interface, one place to test."
- "Two adapters justify the seam: HTTP in prod, in-memory in tests."

**Wins 要点**用术语表术语命名收益：*"locality: bugs concentrate in one module"*、*"leverage: one interface, N call sites"*、*"interface shrinks; implementation absorbs the wrappers"*。不要写*"easier to maintain"*或*"cleaner code"*，因为这些术语不在术语表中，没有依据。

没有模糊，没有清嗓子，没有"it's worth noting that…"。如果一句话可以是要点，就把它做成要点。如果一个要点可以删掉，就删掉。如果一个术语不在 `/codebase-design` 术语表中，在发明新术语之前先找一个在术语表中的。
