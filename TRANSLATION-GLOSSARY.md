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
blocking link、critical path、judgement call、scaffold、dash-case、linter、shebang、smoke

## 中文译法

| 英文 | 中文译法 | 备注 |
|------|---------|------|
| sub-agent | 子智能体 | 本仓库语境 |
| Standards axis | Standards 轴 | code-review 双轴名保留英文 |
| Spec axis | Spec 轴 | code-review 双轴名保留英文 |
| fixed point | 固定点 | code-review 语境 |
| smell baseline | smell 基线 |  |
| findings | 发现 | review 语境 |
| aggregate | 汇总 | review 语境 |
| rerank | rerank | 保留英文 |
| requirement | 需求 |  |
| behavior | 行为 |  |
| feature | 功能 |  |
| hypothesis | 假设 | 诊断语境 |
| minimise | 最小化 |  |
| reproduce | 复现 |  |
| reproducer | 复现用例 |  |
| throwaway | 一次性 |  |
| one-off | 一次性的 |  |
| third-party | 第三方 |  |
| walk through | 走完 | 向导语境 |
| interactive | 交互式 |  |
| visual report | 可视化 report |  |
| vocabulary | 词汇表 |  |
| gain | 收益 |  |
| cost | 成本 |  |
| coupling | 耦合 |  |
| cohesion | 内聚 |  |
| encapsulation | 封装 |  |
| dependency | 依赖 |  |
| dependency injection | 依赖注入 |  |
| endpoint | endpoint | 保留英文 |
| conditional logic | 条件逻辑 |  |
| system boundary | 系统边界 |  |
| boundary | 边界 |  |
| external API | 外部 API |  |
| database | 数据库 |  |
| file system | 文件系统 |  |
| call count | 调用次数 |  |
| call order | 调用顺序 |  |
| assertion | 断言 |  |
| expected value | 期望值 |  |
| independent source of truth | 独立事实来源 |  |
| pass by construction | 构造上必然通过 |  |
| implementation-coupled | 实现耦合 | anti-pattern 名 |
| horizontal slicing | 横向切分 | anti-pattern 名 |
| vertical slicing | 纵向切分 | 与 horizontal 相对 |
| bulk test | 批量测试 |  |
| imagined behavior | 想象中的行为 |  |
| minimal implementation | 最小实现 |  |
| speculative feature | 投机性功能 |  |
| anticipate future tests | 预写未来的测试 |  |
| red before green | red 先于 green |  |
| one slice at a time | 一次一个 slice |  |
| rules of the loop | 循环规则 |  |
| anti-pattern | 反模式 |  |
| where tests go | 测试放哪 |  |
| pre-agreed | 预先商定的 |  |
| edge case | 边界情况 |  |
| side channel | 侧信道 |  |
| public interface | 公开接口 |  |
| public API | 公开 API |  |
| implementation detail | 实现细节 |  |
| specification | 规格说明 |  |
| reads like a specification | 读起来像规格说明 |  |
| survives refactors | 在重构后依然成立 |  |
| refactoring | 重构 | 泛指行为时用中文 |
| fetcher | fetcher | 保留英文 |
| mockable | 可 mock 的 |  |
| shape | 形状 |  |
| hard violation | 硬性违规 |  |
| documented standard | 成文规范 |  |
| coding standard | 编码规范 |  |
| baseline | 基线 |  |
| state machine | 状态机 |  |
| label state | label 状态 | triage 状态机 |
| issue number | issue 编号 |  |
| range | 范围 |  |
| declaring edges | 声明的 blocking edges |  |
| native blocking link | 原生 blocking link |  |
| declare | 声明 |  |
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
| paper trail | 落盘记录 | 路由语境 |
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
| merge conflict | 合并冲突 |  |
| rebase conflict | 变基冲突 |  |
| automated check | 自动化检查 |  |
| blast radius | 爆炸半径 | 代码变更影响范围 |
| wide refactor | 宽重构 | 单个变更横跨整个代码库 |
| expand–contract | 扩展收缩模式 | 宽重构的序列化策略 |
| prefactoring | 预重构 | 实现前使变更更容易的重构 |
| frontier | 前线 | 所有阻塞项已完成、可立即开始的工单集合；grill 语境指设计分支集合 |
| demo | 演示 |  |
| acceptance criteria | 验收标准 |  |
| integration branch | 集成分支 | 多批次共享的验证分支 |
| rework | 返工 |  |
| floor | 下限 |  |
| brief | 简报 | agent brief 语境 |
| procedural | 流程化的 |  |
| durability | 持久性 |  |
| gold-plating | 过度装饰 |  |
| institutional memory | 机构记忆 | 知识库语境 |
| deduplication | 去重 | 知识库语境 |
| kebab-case | kebab-case | 保留英文 |
| seed templates | 种子模板 | setup 语境 |
| scout | 侦察 | setup 语境 |
| domain docs | 领域文档 | setup 语境 |
| single-context | 单上下文 | setup 语境 |
| multi-context | 多上下文 | setup 语境 |
| heredoc | heredoc | 保留英文 |
| convention | 约定 | setup 语境 |
| map | 地图 | setup 语境 |
| child ticket | 子工单 | setup 语境 |
| blocking | 阻塞 | setup 语境 |
| merge request | MR | GitLab 语境 |
| beat | 节拍 | 写作语境 |
| fragment | 片段 | 写作语境 |
| grounding | 落定 | 写作语境 |
| grounded | 已落定 | 写作语境 |
| concept | 概念 | 写作语境 |
| term | 术语 | 命名概念 |
| explore | 探索 | 写作语境 |
| exploit | 深耕 | 写作语境 |
| pile | 素材堆 | 写作语境 |
| quarry | 采石场 | 写作语境 |
| leading word | 领衔词 | 写作语境 |
| entry point | 入口文件 | setup 语境 |
| barrel | 桶文件 | 文件 |
| layering | 分层 | setup 语境 |
| task graph | 任务图 | setup 语境 |
| context pointer | 上下文指针 | setup 语境 |
| implementer subagent | 实现者子智能体 | setup 语境 |
| exploration subagent | 探索子智能体 | setup 语境 |
| merger subagent | 合并子智能体 | setup 语境 |
| loop lens | 循环透镜 | loop-me 语境 |
| loop | 循环 | 生活模式 |
| retrospective | 复盘 | retro 语境 |
| environment | 环境 | agent 语境 |
| navigation pointer | 导航指针 | retro 语境 |
| reviewer agent | 评审 agent | retro 语境 |
| No-op | 空操作 | 指令 |
| Checkpoint | 检查点 | loop-me 语境 |
| Trigger | 触发器 | loop-me 语境 |
| event | 事件 | loop-me 语境 |
| schedule | 排期 | loop-me 语境 |
| delegating | 委派 | loop-me 语境 |
| steering | 转向 | retro 语境 |
| checklist | 检查清单 | loop-me 语境 |
| context load | 上下文负荷 | writing-for-agents 语境 |
| cognitive load | 认知负荷 | writing-for-agents 语境 |
| information hierarchy | 信息层级 | writing-for-agents 语境 |
| In-file step | 文件内步骤 | writing-for-agents 语境 |
| In-file reference | 文件内参考 | writing-for-agents 语境 |
| Disclosed reference | 披露式参考 | writing-for-agents 语境 |
| progressive disclosure | 渐进披露 | writing-for-agents 语境 |
| co-location | 并置 | writing-for-agents 语境 |
| sprawl | 膨胀 | writing-for-agents 语境 |
| completion criterion | 完成标准 | writing-for-agents 语境 |
| premature completion | 过早收尾 | writing-for-agents 语境 |
| post-completion steps | 后续步骤 | writing-for-agents 语境 |
| legwork | 深挖工作 | writing-for-agents 语境 |
| exhaustiveness bar | 穷尽线 | writing-for-agents 语境 |
| negation | 否定表达 | writing-for-agents 语境 |
| guardrail | 护栏 | 跨组统一用护栏 |
| single source of truth | 单一事实来源 | writing-for-agents 语境 |
| duplication | 重复 | writing-for-agents 语境 |
| rank | 排位 | writing-for-agents 语境 |
| cache | 缓存 | writing-for-agents 语境 |
| relevance | 相关性 | writing-for-agents 语境 |
| sediment | 沉积 | writing-for-agents 语境 |
| variance bug | 不一致 bug | writing-for-agents 语境 |
| invocation | 调用 | writing-for-agents 语境 |
| router skill | 路由 skill | writing-for-agents 语境 |
| trade | 权衡 | writing-for-agents 语境 |
| lens | 镜片 | writing-for-agents 语境 |
| exemplar | 范例 | writing-for-agents 语境 |
| agency | 能动性 | writing-for-agents 语境 |
| round | 轮次 | grill 语境 |
| design tree | 设计树 | grill 语境 |
| questionnaire | 问卷 | to-questionnaire 语境 |
| send | 发送内容 | to-questionnaire 语境，作名词 |
| gap | 缺口 | to-questionnaire 语境 |
| discovery questionnaire | 发现型问卷 | to-questionnaire 语境 |
| dangerous | 危险的 | guardrails 语境 |
| destructive | 破坏性 | guardrails 语境 |
| intercept | 拦截 | guardrails 语境 |
| block | 拦截 | guardrails 语境，与 intercept 同译法 |
| authority | 权限 | guardrails 语境 |
| customization | 自定义 | guardrails 语境 |
| pattern | 模式 | guardrails 语境 |
| overwrite | 覆盖 | guardrails 语境 |
| verify | 验证 | guardrails、setup 语境 |
| exit code | 退出码 | guardrails 语境 |
| settings | 设置 | guardrails、setup 语境 |
| partial data | 部分数据 | shoehorn 语境 |
| target type | 目标类型 | shoehorn 语境 |
| large object | 大对象 | shoehorn 语境 |
| autocomplete | 自动补全 | shoehorn 语境 |
| error testing | 错误测试 | shoehorn 语境 |
| test file | 测试文件 | shoehorn 语境 |
| type check | 类型检查 | shoehorn、setup 语境 |
| function | 函数 | shoehorn 语境 |
| use case | 使用场景 | shoehorn 语境 |
| install | 安装 | shoehorn、setup 语境 |
| Before | 修改前 | shoehorn 语境，示例引导词 |
| After | 修改后 | shoehorn 语境，示例引导词 |
| stub | 存根 | scaffold 语境 |
| problem | 题目 | scaffold 语境，练习文件夹概念 |
| variant | 变体 | scaffold 语境 |
| subfolder | 子文件夹 | scaffold 语境 |
| student workspace | 学生工作区 | scaffold 语境 |
| plan | 计划 | scaffold 语境 |
| minimal | 最小 | scaffold 语境 |
| broken link | 损坏的链接 | scaffold 语境 |
| required | 必需 | scaffold 语境 |
| summary | 小结 | scaffold 语境 |
| rule | 规则 | scaffold 语境 |
| primary | 主要 | scaffold 语境 |
| move | 移动 | scaffold 语境 |
| rename | 重命名 | scaffold 语境 |
| renumber | 重新编号 | scaffold 语境 |
| history | 历史 | scaffold 语境 |
| prefix | 前缀 | scaffold 语境 |
| naming | 命名 | scaffold 语境 |
| config | 配置 | setup 语境 |
| missing | 缺失 | setup 语境 |
| script | 脚本 | setup 语境 |
| package manager | 包管理器 | setup 语境 |
| detect | 检测 | setup 语境 |
| initialize | 初始化 | setup 语境 |
| create | 创建 | setup 语境 |
| write | 写入 | setup 语境 |
| adapt | 调整 | setup 语境 |
| omit | 去掉 | setup 语境 |
| default | 默认值 | setup 语境 |
| stage | 暂存 | setup 语境，动词 |
| message | 消息 | setup 语境 |
| note | 说明 | setup 语境 |
| quality | 质量 | setup 语境 |
| check | 检查 | setup 语境 |
| tell | 告知 | setup 语境 |
| Ball Of Mud | 泥球系统 | 顶层说明语境 |
| materialization cascade | 物化级联 | 顶层说明语境 |
| session | 会话 | 全仓统一 |

## 使用规则

1. 翻译中遇到表里没有的术语：先在此表登记（按保留/中文归类），再使用。
2. "首次出现用中文（英文），之后只用中文"只适用于登记为中文译法的词；
   保留英文的词直接使用。
3. 专有名词、人名、文件名一律保留英文。

## frontmatter 语义分类

`name` 不动，保持 `ASCII` 短横线风格。`description` 与 `argument-hint` 类自然语言译为简体中文。标识符、命令、路径、包名、链接、工具名、布尔值与数字不动。可译值内部的行内代码、占位符、路径与链接原样保留。拿不准是否行为关键的值不猜，保留英文并在提交信息中注明。

## 失败关闭兜底

拿不准是否行为关键就保留英文原文，不默改安装、发现、执行、引用、接口、工具相关文本。先保留，再查表，再提问，不脑补动词。
