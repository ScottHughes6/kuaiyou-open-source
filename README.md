# Kuaiyou Open Source (快游大师开源生态)

![Kuaiyou Master](https://via.placeholder.com/800x200?text=Kuaiyou+Master+Open+Source)

欢迎来到 **快游大师 (Kuaiyou Master)** 的官方开源生态仓库！

本仓库致力于打造下一代基于 AI 大模型与 MCP (Model Context Protocol) 协议的**Android 端侧响应式自动化 (Reactive Automation)** 生态。通过这里的开源工具，您可以让 Cursor、Claude 等桌面端 AI 直接“看到”并“控制”您的 Android 手机，实现**零代码、秒级热重载**的自动化脚本开发！

> **⚠️ 注意**：
> 快游大师 Android 客户端（包含底层的无障碍执行引擎与商业化模块）为闭源项目。您可以在各大手机应用商店（如华为、小米、应用宝等）搜索 **“快游大师”** 免费下载安装。本开源仓库包含的是与 App 配套的 MCP 中介服务及开源技能库。

---

## 📦 包含的内容

1. **[kuaiyou-mcp-server](./kuaiyou-mcp-server/)**
   - 一个轻量级的 Node.js 服务端，实现了官方的 MCP 协议。
   - 能够通过局域网 (HTTP) 或 USB 数据线 (ADB) 连接您的手机，向 AI 暴露提取界面节点、截图和下发脚本的能力。
2. **[skills (自动化技能案例库)](./skills/)**
   - 社区共建的 `ReactiveSkill` JSON 脚本库。
   - 包含了大量经典的端侧自动化场景，如自动签到、自动答题、自动文章浏览等。
3. **[agent-skills (大模型外挂技能)](./agent-skills/)**
   - 专门供 AI Agent（如 Claude / Cursor / Antigravity）加载的指令技能（如 `kuaiyou-agent-sync`）。
   - 让您的 AI 助手瞬间掌握如何通过 ADB 下发 JSON 脚本并直接在您的手机上调起快游大师。
4. **[docs (开发者文档)](./docs/)**
   - [MCP 生态使用教程](./docs/mcp-ecosystem-tutorial.md)：教您如何在 Cursor/Claude 中配置并使用快游大师。
   - [ReactiveSkill API 参考](./docs/reactive-skill-api-reference.md)：详解自动化 JSON 的协议与规范。
   - [AI 生成技能案例](./docs/ai-skill-cases.md)：看看大家是如何让 AI 秒写自动化程序的。

---

## 🚀 快速开始

如果您想体验这套震撼的 AI 自动化开发流程，只需以下三步：

### 1. 准备手机端
- 在应用商店下载并安装最新版的 **“快游大师”**。
- 打开 App 的设置，勾选 **“局域网 MCP 服务 (LAN MCP Service)”**，并记录下显示的局域网 IP（例如 `192.168.1.100`）。
- *（如果没有局域网环境，请用数据线连接电脑并开启 Android 的 USB 调试，我们的中介服务会自动 Fallback 到 ADB 模式。）*

### 2. 在 AI 中配置 MCP Server
我们已将核心逻辑发布至 NPM。在您的 Cursor (Settings -> Features -> MCP) 或 Claude Desktop 配置中，添加一个 Command 类型的 MCP Server，命令如下：

```bash
# 局域网直连模式（推荐，速度最快）
KUAIYOU_DEVICE_IP=192.168.1.100 npx -y kuaiyou-mcp-server

# USB 数据线 ADB 模式
npx -y kuaiyou-mcp-server
```

### 3. 给 AI 下指令！
在 Composer 或聊天框中直接对 AI 说话：
> “请使用截图和节点树工具看看我现在的手机界面，然后写一个点击‘去签到’按钮的 JSON，并推送到我的手机上运行。”

您的手机会立刻弹出调试窗口并自动执行，开发就是这么简单！

---

## 🤝 参与贡献

我们极其渴望极客玩家和开发者们参与到这套全新生态的建设中来！无论您是优化 MCP Server，还是想把您刚用 AI 捏出来的、非常实用的自动化 JSON 分享给大家，我们都非常欢迎！

请查阅我们的 [贡献指南 (CONTRIBUTING.md)](./CONTRIBUTING.md) 了解如何提 PR，指南中还包含了一键让 AI 帮您生成 PR 描述的神奇指令哦。

---

## 📄 开源协议

本项目下的所有代码、文档及 JSON 技能库均采用 **Apache License 2.0** 协议开源。
您可以自由地使用、修改和分发，但请保留相关的版权声明。
