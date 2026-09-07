## 它做什么

`wizard` 生成一个交互式 bash 脚本，逐步引导人类完成一个手动过程：连接第三方服务、运行一次性迁移、将项目从状态 A 移动到状态 B。它打开每个 URL，说明点击和复制什么，捕获返回的内容，并将其写入 `.env` 文件和 GitHub Actions secret。

[Agent](https://www.aihero.dev/ai-coding-dictionary/agent) 编写脚本；它从不运行它。你运行它，在你自己的机器上。所以 wizard 不是你遵循的指令列表；它是驱动过程并持有状态的程序，你的部分是点击、粘贴和按回车。

## 何时使用

你可以输入 `/wizard`，智能体也可以自行调用它。当它遇到一个你必须执行的步骤（它无法生成的密钥、它无法点击的 dashboard）时，它会为你构建一个 wizard，而不是将指令写入聊天记录中，然后被滚动出去。

当阻碍你的下一个事项是需要访问 dashboard 时使用它：

| 场景 | Wizard 做什么 |
| --- | --- |
| 新开发者需要在应用启动前配置六个服务 | 按顺序打开每个 dashboard，捕获密钥，写入 `.env` 和 CI |
| 一次性迁移需要按特定顺序翻转开关 | 在确认门后序列化不可逆步骤 |
| 项目需要从状态 A 移动到状态 B | 引导转换过程并报告无法完成的内容 |
| 你即将把这些步骤写入 README | 写一个可执行版本，它不会静默腐烂 |

不要使用它来*决定*构建什么；为此，[grill-with-docs](https://aihero.dev/skills-grill-with-docs) 和 [to-spec](https://aihero.dev/skills-to-spec) 是合适的工具。

## 前置条件

没有生成限制。Wizard 编写的脚本在 bash 上运行，在设置 GitHub secret 或变量的阶段使用 `gh`。如果 `gh` 缺失或未认证，该阶段会变成警告，最终总结会告诉你手动设置的内容，而不是让运行失败。

## 阶段

**阶段（Stage）** 是一个屏幕上的一项聚焦任务。脚本在阶段之间清除终端，因此溢出屏幕的阶段会丢失滚动出去的部分。你按依赖顺序编写阶段并设置 `TOTAL_STAGES`，它驱动进度显示。

范围界定（Scoping）在编写任何一行代码之前完成。[Skill](https://www.aihero.dev/ai-coding-dictionary/skill) 读取 repo 而不是从零开始询问：`.env*`、`docker-compose*`、框架配置，以及 `.github/workflows/` 中的每个 `secrets.*` / `vars.*` 引用：这些都是 wizard 必须产生的值。然后它向你显示有序的阶段列表以供确认，之后才将每个阶段映射到人类遵循的确切路径（"Dashboard → Developers → API keys → Reveal test key → copy"）。对于不了解当前 UI 的地方，它会询问你或检查文档，而不是凭空编造点击操作。

对于每个捕获的值，范围界定确定其归属：

| 目的地 | 何时 |
| --- | --- |
| 仅 `.env` | 本地开发需要，CI 不需要 |
| GitHub secret | CI 需要，且是敏感信息 |
| GitHub variable | CI 需要，且是公开信息 |
| `.env` 和 secret | 本地开发和 CI 都需要 |
| 无处 | 阶段是纯操作：翻转开关、升级计划 |

## 模板已解决 UX

[模板](https://github.com/mattpocock/skills/blob/main/skills/engineering/wizard/template.sh) 提供完整体验：带剩余时间的进度、确认门、跨平台 URL 打开（包括 WSL）、隐藏 secret 输入、幂等 `.env` 更新、`gh secret` / `gh variable` 写入，以及所有跳过内容的最终总结。`STAGES` 标记上方的所有内容都是固定库，在每个 wizard 中相同且从不手动编辑。一致性是重点。你的工作只是界定过程范围并编写其阶段。

编写 wizard 的智能体从不端到端运行它，因为它会打开浏览器并等待人类输入。它通过静态验证代替：`bash -n`、可用时的 `shellcheck`，以及追踪每个值是否按范围界定所说的位置落地，每个 `set_secret` 名称与 CI 中真实的 `secrets.*` 引用匹配。相应地调整你的期望：第一次运行是你的，那次运行就是测试。

## 默认临时

| 你有什么 | 如何处理脚本 |
| --- | --- |
| 一次性迁移、个人设置、永远不会重复的转换 | 保存到临时或 `scripts/` 路径，运行，删除 |
| 下一个 repo 用户也需要的设置路径 | 提交它并从 README 链接，这样他们运行脚本而不是重新询问智能体 |

## 常见问题

**我的 API 密钥最终会进入模型的上下文吗？**

不会。智能体编写脚本；它不运行它。你自己运行脚本，它使用隐藏终端输入捕获密钥并直接写入 `.env` 或 `gh secret`。Wizard 是一个 CLI，模型没有连接到它。一个注意事项：这适用于 wizard 在运行时捕获的值。如果你在范围界定过程中将密钥粘贴到聊天记录中，它就像任何其他粘贴的文本一样在[上下文](https://www.aihero.dev/ai-coding-dictionary/context)中。

**我可以回去修正我输入错误的值吗？**

运行中不行。没有返回按钮：阶段向前运行，第 3 阶段的错误答案意味着 Ctrl-C 并重新运行。重新运行设计上很轻量：任何已写入 `.env` 的值都会作为默认值提供回来，所以你可以按回车通过正确的阶段，只重新输入错误的那个。这在发布周被提出，至今未关闭："太喜欢了！但有一件事，有办法回去修正你输入的内容吗？"

有一个相关的未修复 bug。`ask` 提示中的方向键插入 `^[[D` / `^[[C` 而不是移动光标，因为提示使用 `read -r` 而不是 Readline（[issue #741](https://github.com/mattpocock/skills/issues/741)）。退格键有效；方向键无效。删除回到错误位置，而不是移动光标到其中。

**它知道我已经设置的内容吗？**

部分知道，且比发布时的反应假设的少。它在询问之前读取 repo（你的 `.env` 文件、`docker-compose`、框架配置、CI 中的 `secrets.*` 引用），所以它界定为真正缺失的值，而不是像 README 那样从零开始。它不做的检查第三方服务。如果密钥存在于你的 `.env` 中，wizard 会提供回来，按回车保留；如果你已创建 Stripe 账户但从未保存密钥，wizard 仍然会将你发送到 dashboard。

**它在工作流中处于什么位置，在 grilling 和 spec 之后？**

没有特定位置。它是独立的，不是链上的一步。常见的猜测是 `/grill-with-docs → /to-spec → /wizard`，这个序列没问题，但触发条件是手动过程的出现，这可能在任何时间点发生：在你开始之前、构建中途，或发布很久之后。它也作为一个发现工具：范围界定揭示任务的隐藏前提，比如你未曾考虑的三个 API 密钥，在你承诺工作之前。

**它能在 Claude Code 之外工作吗？**

这个产物可以，无条件地：它是一个普通的 bash 脚本，不关心哪个[环境](https://www.aihero.dev/ai-coding-dictionary/harness)生成了它。该技能本身是 model-invoked，所以它在任何地方都有列出：在 Claude Code 中输入 `/wizard` 或在 Codex 中输入 `$wizard`，或者直接描述你卡住的设置。作为 model-invoked 也使其避免了 [#693](https://github.com/mattpocock/skills/issues/693)，其中 Claude 的桌面和网页界面从[模型](https://www.aihero.dev/ai-coding-dictionary/model)列表中删除 *user-invoked* 技能并报告为未安装。

**它以前不是 user-invoked 吗？**

是的。它现在是 model-invoked，所以当智能体遇到你必须执行的步骤时，它会主动调用它。你之前能做的任何事情都没有停止工作：model-invocation *增加*了智能体的调用，它从不移除你的，所以 `/wizard` 的行为与以前完全一样。改变的是它退役的失败模式：智能体在构建中途遇到凭据墙，将六个编号步骤转储到聊天记录中让你手动遵循。

**它以前在 `in-progress/` 中：现在在哪？**

`engineering/`，自 v1.2 起。它从 beta 桶毕业，现在随插件一起发布，所以它随其他推广技能一起到达，而不需要单独安装。毕业时行为没有改变。

## 达标表现

- 在任何脚本存在之前，你被显示一个有序的阶段列表、每个阶段产生的值，并被要求确认。
- 每个 URL 在该页面的值被询问之前打开。你从未被要求粘贴你未被发送去获取的内容。
- Secret 盲打。没有敏感内容回显到你的滚动缓冲区。
- 每个阶段适合一个屏幕。你仍然需要的内容没有滚动出去。
- Ctrl-C 并重新运行从你离开的地方继续，将已保存的值作为默认值提供。
- 最终屏幕列出写入的内容，单独列出无法完成的内容以及你必须手动完成的内容。

## 适合位置

`wizard` 是一个随时调用的独立技能，位于自动化停止和人类必须点击的界限。它的最近邻居是 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills)，因为两者都存在是为了让 repo 进入工作状态：一个配置这个技能集，而 `wizard` 为其他一切生成设置路径。它也与 [implement](https://aihero.dev/skills-implement) 配对：当构建落地一个需要凭据或手动切换的功能时，wizard 是人类部分完成的方式。当你不确定哪个技能适合当前时刻时，[ask-matt](https://aihero.dev/skills-ask-matt) 为你路由。
