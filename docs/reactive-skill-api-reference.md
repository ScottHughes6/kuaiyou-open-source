# ReactiveSkill API 协议参考手册

`ReactiveSkill` 是快游大师的下一代响应式自动化描述协议。它使用 JSON 格式声明目标和步骤，完全摆脱了传统的硬编码流程，非常适合由大语言模型（LLM）通过理解屏幕节点树直接生成。

## 1. JSON 结构总览

一个标准的 `ReactiveSkill` 必须包含以下根级别字段：

```json
{
  "id": "skill_unique_id",
  "name": "每日签到",
  "description": "自动打开任务页并点击签到",
  "executionMode": "REACTIVE",
  "agentId": "",
  "termination": {
    "type": "AllGoalsComplete"
  },
  "goals": [
    // Goal 对象的列表
  ]
}
```

### 关键字段说明
- `id` / `name` / `description`：元数据信息，必填。
- `executionMode`：必须严格为 `"REACTIVE"`。
- `agentId`：如果是用户自定义技能，必须为空字符串 `""`。
- `termination`：技能结束条件。默认为 `{"type": "AllGoalsComplete"}`，表示所有 Goal 执行完即结束。也支持 `{"type": "Timeout", "timeoutMs": 60000}` 设定总超时限制。
- `goals`：这是执行流的核心，定义了具体的动作（Action）。

---

## 2. Goal 的结构与约束

`goals` 数组中的每一个对象代表一个需要执行的“目标步骤”。

```json
{
  "id": "step_1",
  "name": "点击签到按钮",
  "action": {
    "type": "ClickAction",
    "target": {
      "type": "TextTargetSelector",
      "text": "签到领金币",
      "exactMatch": true
    }
  },
  "condition": null,
  "trigger": null,
  "completion": null
}
```

### 核心属性：`action`
`action` 决定了这个 Goal 要做什么。快游大师支持多达 16 种 `GoalAction`。常用的包括：

- **ClickAction**：点击屏幕元素。必须携带 `target` 属性。
- **SwipeAction**：滑动屏幕。
- **InputTextAction**：输入文本（支持针对某个 `target` 输入）。
- **DelayAction**：显式延时。
- **NavigateAction**：返回键、Home 键等系统级导航。
- **OpenAppAction**：打开指定的包名 App。

### 核心属性：`target` (TargetSelector)
用于在屏幕上寻找操作对象，支持多态解析：
- `TextTargetSelector`：文字匹配，如 `{"type": "TextTargetSelector", "text": "签到"}`。
- `ImageTargetSelector`：图像匹配（OpenCV）。
- `CoordinateTargetSelector`：绝对坐标匹配，如 `{"type": "CoordinateTargetSelector", "x": 500, "y": 800}`。

---

## 3. 大模型生成技能时的常见踩坑指南 (Pitfalls)

当您使用 AI（例如 Cursor / Claude）通过 MCP 自动编写 `ReactiveSkill` 时，必须注意以下约束条件：

1. **悬空引用检查 (Dangling Reference)**：`RunStep.goalId` 如果有跳转逻辑，必须保证它引用的 ID 确实存在于 `goals` 列表中，否则 `ReactiveSkill.validate()` 会直接报错。
2. **死循环与退出终态**：`termination` 默认为 `Timeout(300_000L)` 可能导致意料之外的挂起。建议 AI 显式写明 `{"type": "AllGoalsComplete"}` 以避免空闲死锁。
3. **坐标安全性**：当使用 `CoordinateTargetSelector` 时，屏幕分辨率差异极易导致点击失败。建议尽可能让 AI 读取 `get_ui_tree`，转而使用 `TextTargetSelector` 保证兼容性。
4. **多态反序列化 (Sealed Class)**：`target` 和 `action` 内必须严格声明 `type` 字段（如 `"type": "ClickAction"`），因为 Gson 解析依赖这个类型标识器 (Polymorphic Type Adapter)。

只要遵循以上 API 协议，您就可以让 AI 瞬间输出可用且极具容错性的 Android 自动化脚本！
