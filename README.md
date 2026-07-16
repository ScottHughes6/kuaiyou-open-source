# Kuaiyou Open Source (快游大师开源生态)

<div align="center">
  <img src="https://via.placeholder.com/800x200?text=Kuaiyou+Master+Open+Source" alt="Kuaiyou Master Logo">
  <h3>下一代基于大模型与 MCP 协议的 Android 端侧响应式自动化 (Reactive Automation) 生态</h3>
  <br />
  <a href="https://github.com/ScottHughes6/kuaiyou-open-source">
    <img src="https://img.shields.io/github/stars/ScottHughes6/kuaiyou-open-source?style=social" alt="GitHub Repo stars" />
  </a>
  <a href="https://github.com/ScottHughes6/kuaiyou-open-source/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License" />
  </a>
</div>

---

欢迎来到 **快游大师 (Kuaiyou Master)** 官方开源仓库！

我们致力于打破传统的端侧自动化壁垒。通过这套完全开源的 MCP 中介服务与标准化技能库，您可以让 **Cursor、Claude** 等任何支持 MCP (Model Context Protocol) 协议的 AI 助理，直接“看到”并“操控”您的 Android 手机，从而实现**零代码、一句话、秒级热重载**的自动化脚本开发。

> **⚠️ 注意**：
> 快游大师的 Android 客户端本体（包含底层的无障碍执行引擎与商业化模块）为闭源项目。您可以在各大安卓应用商店（华为、小米、应用宝等）搜索 **“快游大师”** 免费下载。
> **本仓库包含了与该 App 配套的所有生态工具、MCP 服务端、通信协议 (Schema) 以及社区共建的技能案例库。**

---

## 🌟 核心特性与愿景

- 🤖 **大模型原生的 MCP 集成**：AI 可以随时提取 Android 屏幕的 UI Tree 结构、精准计算中心点坐标，并实时截取屏幕画面，不再是“盲人摸象”。
- ⚡️ **极速开发体验 (所见即所得)**：AI 编写完 JSON 格式的自动化脚本后，可通过局域网 HTTP 秒级推送到手机端直接运行，告别繁琐的代码编译和数据线调试。
- 🧩 **响应式架构 (ReactiveSkill)**：抛弃传统的阻塞型脚本（如按序 `sleep`），使用我们独创的基于“触发器 (Trigger) + 动作 (Action)”的解耦模型，脚本异常健壮，完美应对广告弹窗和网络卡顿。

---

## 📦 仓库导航

| 目录/模块 | 描述 |
| --- | --- |
| **[kuaiyou-mcp-server](./kuaiyou-mcp-server/)** | 核心 Node.js 服务端，实现了 MCP 协议标准。负责连接您的 Android 手机，向 AI 暴露技能校验、节点提取、截图和脚本下发四大核心能力。 |
| **[schema.json](./schema.json)** | 全局标准的 Zod 导出的 `ReactiveSkill` JSON Schema，支持主流 IDE 的代码自动补全。 |
| **[skills](./skills/)** | 社区共建的 JSON 脚本库，涵盖签到、阅读、表单填写等常见场景，开箱即用。 |
| **[agent-skills](./agent-skills/)** | 供 AI (Claude/Cursor) 加载的外挂指导技能文档，教 AI 如何生成合规的快游自动化 JSON。 |
| **[docs](./docs/)** | 详尽的开发者指南，包含 MCP 接入教程、API 参数表和最佳实践。 |

---

## 🚀 快速开始

想要体验“对 AI 说话就能写出 Android 自动化脚本”的震撼流程？只需三步：

### 1. 准备手机端
- 在应用商店下载并安装最新版 **“快游大师”**。
- 打开 App 的“设置”页面，勾选 **“局域网 MCP 服务 (LAN MCP Service)”**，并记录显示的局域网 IP（例如 `192.168.1.100`）。
- *(如果没有局域网环境，请开启 Android 的 USB 调试并连上数据线，我们的系统会自动回退到 ADB 模式。)*

### 2. 在 AI 助理中配置 MCP Server
我们已将核心逻辑发布，您只需在您的 Cursor (Settings -> Features -> MCP) 或 Claude Desktop 配置中，添加一个 Command 类型的服务器：

```bash
# 局域网直连模式（推荐，速度最快，请替换为您手机的 IP）
KUAIYOU_DEVICE_IP=192.168.1.100 npx -y kuaiyou-mcp-server

# USB 数据线直连模式 (Fallback)
npx -y kuaiyou-mcp-server
```

### 3. 开始向 AI 下达指令！
回到对话框，直接向 AI 说：
> “请使用工具查看我现在的手机界面，然后写一个点击‘去签到’按钮的 JSON 脚本，并推送到我的手机上运行。”

您的手机会立刻弹出导入窗口并开始自动化点击，开发就是如此简单优雅！

---

## 🤝 参与贡献

我们极其渴望极客玩家和开发者们参与到这套全新生态的建设中来！无论您是优化 MCP Server，还是想把刚用 AI 生成的实用自动化 JSON 分享给大家，我们都热烈欢迎！

- 🐛 **提交 Bug 或建议**: 欢迎在 [GitHub Issues](https://github.com/ScottHughes6/kuaiyou-open-source/issues) 留言。
- 📖 **贡献代码与脚本**: 请查阅我们的 [贡献指南 (CONTRIBUTING.md)](./CONTRIBUTING.md) 了解如何向仓库提交 PR。

---

## 📄 开源协议

本项目下的所有代码、文档及 JSON 技能库均采用 **Apache License 2.0** 协议开源。
您可以自由地使用、修改和分发，但请保留相关的版权声明。
