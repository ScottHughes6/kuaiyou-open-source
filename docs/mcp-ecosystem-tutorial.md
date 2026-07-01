# 快游大师 MCP 生态使用教程：端到端热重载开发

在传统的 Android 自动化脚本开发中，开发者往往需要繁琐地导出 UI 节点、手动编写代码、重新编译和推送到设备，开发周期极其漫长。

现在，借助于**模型上下文协议 (Model Context Protocol, MCP)** 以及快游大师强大的 `ReactiveSkill` 动态解析引擎，您可以直接在电脑端的 Cursor 或 Claude 桌面版中，让 AI 帮您“看”屏幕、“想”逻辑、“写” JSON，并且**瞬间热重载**到手机上执行！

## 核心原理解析

这套基于 AI 的端到端热重载体系由三部分组成：
1. **快游大师 App（手机端）**：内置基于无障碍服务的 `ReactiveExecutionEngine` 与微型 HTTP Server，负责提供截屏/节点树和执行传入的 `ReactiveSkill` 任务。
2. **kuaiyou-mcp-server（PC 端中介）**：连接 AI 与手机。通过局域网 (HTTP) 或 USB (ADB) 获取手机状态，并将代码转化为手机可读的指令。
3. **Cursor / Claude Desktop（AI 客户端）**：作为超级大脑，根据用户的自然语言需求和当前屏幕状态，自动编写和修改自动化代码。

---

## 环境准备

### 1. 手机端配置
1. 在各大手机应用商店（如华为、小米、应用宝等）搜索并安装最新版 **“快游大师”**。
2. 打开 App 设置，找到并开启 **“局域网 MCP 服务 (LAN MCP Service)”** 选项。
3. 记录下界面显示的设备局域网 IP（例如 `192.168.1.100`）。
*(若无法使用局域网，可通过数据线连接电脑并开启 Android 开发者模式的 USB 调试即可)*

### 2. PC 端配置 MCP Server
我们通过 NPM 提供了极其轻量的 `kuaiyou-mcp-server`。

**在 Cursor 中配置：**
1. 打开 Cursor Settings > Features > MCP。
2. 点击 **+ Add New MCP Server**。
3. Name 填写 `kuaiyou-mcp`。
4. Type 选择 `command`。
5. Command 填写：
   ```bash
   npx -y kuaiyou-mcp-server
   ```
   *如果您使用局域网连接，请传入环境变量告诉 Server 手机的 IP（或者在项目根目录建一个 `.env` 文件）：*
   ```bash
   KUAIYOU_DEVICE_IP=192.168.1.100 npx -y kuaiyou-mcp-server
   ```

**在 Claude Desktop 中配置：**
修改您的 `claude_desktop_config.json`：
```json
{
  "mcpServers": {
    "kuaiyou-mcp": {
      "command": "npx",
      "args": ["-y", "kuaiyou-mcp-server"],
      "env": {
        "KUAIYOU_DEVICE_IP": "192.168.1.100"
      }
    }
  }
}
```

---

## 实战演练：让 AI 帮你写个自动化脚本

配置完成后，打开 Cursor 的 Composer 或 Claude 对话框。快游大师提供了以下几个强大的内置 MCP 工具：
- `get_ui_tree`：获取手机当前界面的无障碍节点树。
- `capture_screenshot`：截取当前手机屏幕图像。
- `push_reactive_skill`：向手机瞬间推送新的自动化任务并自动弹窗执行。
- `validate_kuaiyou_skill`：验证大模型生成的 JSON 格式。

### 尝试发送你的第一个指令
你可以直接对 AI 这样说：
> “请使用 `capture_screenshot` 和 `get_ui_tree` 看看我现在手机的界面，帮我写一个自动点击‘每日签到’的 ReactiveSkill JSON，然后用 `push_reactive_skill` 推送到我手机上运行。”

**接下来发生的事情会让你惊叹：**
1. AI 自动调用工具，获取了您手机的界面节点和图片。
2. AI 分析发现屏幕上有一个文本为“签到领金币”的按钮，其坐标为 `[250, 400]`。
3. AI 开始撰写符合快游大师规范的 `ReactiveSkill` JSON，使用 `GoalAction: ClickAction` 并配以 `TextTargetSelector`。
4. AI 调用 `push_reactive_skill`。
5. 你的手机屏幕上瞬间弹出了“是否执行此调试技能？”的提示。你点击运行，手机自动完成了签到！

如果过程有任何偏差，你只需要告诉 AI：“没点中，帮我换成图像识别模式再试一次”，AI 将在 3 秒内把修改后的代码推送到你的手机。**这就是快游大师 MCP 生态带来的极致开发体验！**
