# 汉化术语表（TRANSLATION-GLOSSARY）

术语译法全表统一。翻译时严格查表。遇到表里没有的词：先加表，再翻。
首次出现用"中文（英文）"格式，之后只用中文。专有名词保留英文。

## 保留英文的词

skill、workflow、prompt、handoff、grilling、triage、spec、ticket、issue、PR、
commit、merge、rebase、merge-base、upstream、diff、hunk、staged、working tree、
checkout、branch、tag、ADR、agent、harness、tracker、issue tracker、
review、smell、Fowler、seam、red、green、red-green-refactor、vertical slice、
tracer bullet、mock、test-first、frontmatter、YAML、slash command、
model-invoked、user-invoked、scope creep、deep module、domain model、
domain language、wizard、provisioning、credential、secret、cutover、
migration、dashboard、deepening opportunity、discipline、module、interface、
depth、adapter、leverage、locality、hook、plugin、marketplace、lint、CI、
label、milestone、bug、regression、regression test、feedback loop、
instrument、endpoint、SDK-style、type safety、test setup、collaborator、
private method、assert、snapshot、tautological、known-good literal、
worked example、scaffolding、sketch、user story、blocking edge、
blocking link、critical path、judgement call

## 中文译法

| 英文 | 中文译法 | 备注 |
|------|---------|------|
| sub-agent | 子智能体 | 本仓库语境 |
| Standards axis | Standards 轴 | code-review 双轴名保留英文 |
| Spec axis | Spec 轴 | code-review 双轴名保留英文 |
| fixed point | 固定点 | code-review 语境 |
| smell baseline | smell 基线 | — |
| findings | 发现 | review 语境 |
| aggregate | 汇总 | review 语境 |
| rerank | rerank | 保留英文 |
| requirement | 需求 | — |
| behavior | 行为 | — |
| feature | 功能 | — |
| hypothesis | 假设 | 诊断语境 |
| minimise | 最小化 | — |
| reproduce | 复现 | — |
| reproducer | 复现用例 | — |
| throwaway | 一次性 | — |
| one-off | 一次性的 | — |
| third-party | 第三方 | — |
| walk through | 走完 | 向导语境 |
| interactive | 交互式 | — |
| visual report | 可视化 report | — |
| vocabulary | 词汇表 | — |
| gain | 收益 | — |
| cost | 成本 | — |
| coupling | 耦合 | — |
| cohesion | 内聚 | — |
| encapsulation | 封装 | — |
| dependency | 依赖 | — |
| dependency injection | 依赖注入 | — |
| endpoint | endpoint | 保留英文 |
| conditional logic | 条件逻辑 | — |
| system boundary | 系统边界 | — |
| boundary | 边界 | — |
| external API | 外部 API | — |
| database | 数据库 | — |
| file system | 文件系统 | — |
| call count | 调用次数 | — |
| call order | 调用顺序 | — |
| assertion | 断言 | — |
| expected value | 期望值 | — |
| independent source of truth | 独立事实来源 | — |
| pass by construction | 构造上必然通过 | — |
| implementation-coupled | 实现耦合 | anti-pattern 名 |
| horizontal slicing | 横向切分 | anti-pattern 名 |
| vertical slicing | 纵向切分 | 与 horizontal 相对 |
| bulk test | 批量测试 | — |
| imagined behavior | 想象中的行为 | — |
| minimal implementation | 最小实现 | — |
| speculative feature | 投机性功能 | — |
| anticipate future tests | 预写未来的测试 | — |
| red before green | red 先于 green | — |
| one slice at a time | 一次一个 slice | — |
| rules of the loop | 循环规则 | — |
| anti-pattern | 反模式 | — |
| where tests go | 测试放哪 | — |
| pre-agreed | 预先商定的 | — |
| edge case | 边界情况 | — |
| side channel | 侧信道 | — |
| public interface | 公开接口 | — |
| public API | 公开 API | — |
| implementation detail | 实现细节 | — |
| specification | 规格说明 | — |
| reads like a specification | 读起来像规格说明 | — |
| survives refactors | 在重构后依然成立 | — |
| refactoring | 重构 | 泛指行为时用中文 |
| fetcher | fetcher | 保留英文 |
| mockable | 可 mock 的 | — |
| shape | 形状 | — |
| hard violation | 硬性违规 | — |
| documented standard | 成文规范 | — |
| coding standard | 编码规范 | — |
| baseline | 基线 | — |
| state machine | 状态机 | — |
| label state | label 状态 | triage 状态机 |
| issue number | issue 编号 | — |
| range | 范围 | — |
| declaring edges | 声明的 blocking edges | — |
| native blocking link | 原生 blocking link | — |
| declare | 声明 | — |
| scope | scope | 保留英文 |
| flow | 流程 | 路由语境 |
| main flow | 主流程 | 路由语境 |
| on-ramps | 入口流程 | 路由语境 |
| standalone | 独立流程 | 路由语境 |
| vocabulary layer | 词汇层 | 路由语境 |
| phase boundary | 阶段边界 | 路由语境 |
| primary source | 一级来源 | 路由语境 |
| secondary source | 二级来源 | 路由语境 |
| smart zone | 智能区 | 路由语境 |
| context window | 上下文窗口 | 路由语境 |
| working directory | 工作目录 | 路由语境 |
| paper trail | 纸质记录 | 路由语境 |
| stateful | 有状态的 | 路由语境 |
| stateless | 无状态的 | 路由语境 |
| context | 上下文 | 路由语境 |
| implement | 实现 | 路由语境 |
| wayfinder | 探路者 | 路由语境 |
| grill-with-docs | 带文档访谈 | 路由语境 |
| grill-me | 访谈我 | 路由语境 |
| to-spec | 转规格 | 路由语境 |
| to-tickets | 转工单 | 路由语境 |
| prototype | 原型 | 路由语境 |
| research | 调研 | 路由语境 |
| to-questionnaire | 转问卷 | 路由语境 |
| wait-what | 等等什么 | 路由语境 |
| teach | 教学 | 路由语境 |
| writing-for-agents | 为智能体写作 | 路由语境 |
| setup-matt-pocock-skills | 安装 matt-pocock-skills | 路由语境 |
| ubiquitous language | 通用语言 | DDD 语境 |
| merge conflict | 合并冲突 | — |
| rebase conflict | 变基冲突 | — |
| automated check | 自动化检查 | — |
| blast radius | 爆炸半径 | 代码变更影响范围 |
| wide refactor | 宽重构 | 单个变更横跨整个代码库 |
| expand–contract | 扩展收缩模式 | 宽重构的序列化策略 |
| prefactoring | 预重构 | 实现前使变更更容易的重构 |
| frontier | 前线 | 所有阻塞项已完成、可立即开始的工单集合 |
| demo | 演示 | — |
| acceptance criteria | 验收标准 | — |
| integration branch | 集成分支 | 多批次共享的验证分支 |
| rework | 返工 | — |
| floor | 下限 | — |
| brief | 简报 | agent brief 语境 |
| procedural | 流程化的 | — |
| durability | 持久性 | — |
| gold-plating | 过度装饰 | — |
| institutional memory | 机构记忆 | 知识库语境 |
| deduplication | 去重 | 知识库语境 |
| kebab-case | kebab-case | 保留英文 |
| seed templates | 种子模板 | setup 语境 |
| scout | 侦察 | setup 语境 |

## 使用规则

1. 翻译中遇到表里没有的术语：先在此表登记（按保留/中文归类），再使用。
2. "首次出现用中文（英文），之后只用中文"只适用于登记为中文译法的词；
   保留英文的词直接使用。
3. 专有名词、人名、文件名一律保留英文。
