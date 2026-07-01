# 快游大师贡献指南 (Contributing to Kuaiyou Master)

首先，感谢您花时间为快游大师贡献代码或技能库！快游大师是一个致力于普及端侧 AI 自动化编程生态的开源项目。无论您是修复 Bug、改进 MCP Server，还是用大模型捏出了一个好用的神仙脚本（ReactiveSkill），我们都热烈欢迎！

## 1. 我们需要什么贡献？

我们特别鼓励以下两种形式的贡献：

- **核心工具贡献**：改进 `kuaiyou-mcp-server` 的协议稳定性。
- **开源技能库 (ReactiveSkill) 贡献**：您使用 AI 或手动编写的自动化 JSON，如果具有较好的普适性（如自动清理缓存、每日自动签到），欢迎提交到我们的官方技能中心，造福更多人！

---

## 2. 如何提交一个优秀的 ReactiveSkill (技能)

我们极力推荐您通过 **Cursor / Claude 结合 MCP Server** 来生成技能，这比手写 JSON 效率高得多。

### 提交要求：
如果您想将一个技能合并到我们的官方案例库中，请确保您的 Pull Request 包含以下内容：

1. **完整的 JSON 文件**：您的技能 JSON 文件（必须包含正确的 `id`, `name`, `description` 以及 `executionMode: "REACTIVE"`）。
2. **适用版本声明**：说明这个技能是基于哪款 App 的哪个版本测试通过的。
3. **效果演示**：请附带一段简短的 GIF 动图或视频链接，展示自动化脚本在真机上的运行过程。

### 🌟 AI 辅助提交一键指令
不知道怎么写 PR 描述？您可以直接复制下面这段提示词给您的 AI 助手：

> "请帮我将当前测试成功的 ReactiveSkill JSON 整理成一个标准的 Markdown 提交提案。
> 提案需包含：1. 技能名称与简介；2. 该技能解决了什么痛点；3. JSON 核心逻辑代码块；4. 提醒用户该技能适用的 App 版本。
> 请按照 GitHub PR Template 的风格输出。"

将 AI 生成的文本粘贴到您的 Pull Request 描述中即可！

---

## 3. 开发环境与提交流程 (Development Workflow)

如果您想修改项目本身的代码（Android 或 Node.js Server），请遵循标准的 GitHub Fork 工作流：

1. **Fork 本仓库** 到您的个人账号下。
2. **Clone 到本地**：
   ```bash
   git clone https://github.com/YOUR-USERNAME/kuaiyou-app.git
   ```
3. **创建特性分支**：
   ```bash
   git checkout -b feature/your-amazing-feature
   ```
4. **提交代码 (Commit)**：
   我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。请使用规范的提交信息格式（例如 `feat: add new target selector` 或 `fix: mcp server adb fallback`）。
5. **推送到远程并提交 PR**：
   ```bash
   git push origin feature/your-amazing-feature
   ```
   然后在 GitHub 页面点击 "Compare & pull request"。

### 代码风格规范
- **Node.js (MCP Server)**：基于 TypeScript，请在提交前运行 `npm run lint` 和 `npm run build` 确保没有 TS 编译错误。

## 4. 取得联系与反馈

如果您在贡献过程中遇到任何问题，欢迎在 GitHub 的 Issues 中发起提问。维护者通常会在 24 小时内回复您。

期待您的奇思妙想，让我们一起打造最强悍的终端 AI 自动化生态！🚀
