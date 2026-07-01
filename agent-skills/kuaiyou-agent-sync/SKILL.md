---
name: kuaiyou-agent-sync
description: Sync generated ReactiveSkill JSON to Kuaiyou App via ADB and Intent
---

# Sync ReactiveSkill to Kuaiyou App

When you generate a `ReactiveSkill` JSON for the Kuaiyou Android app, you can use this skill to automatically push the skill to the device and open the app's import confirmation dialog.

```json
{
  "id": "my_unique_skill_id",
  "name": "My AI Generated Skill",
  "agentId": "",
  "description": "This skill automatically ...",
  "executionMode": "REACTIVE"
}
```

## Requirements

- The user must have their Android device connected via ADB.
- `adb` must be available in the system PATH.

## Execution Steps

1. Save the generated `ReactiveSkill` JSON to a local file, e.g., `/tmp/generated_skill.json`.

2. Push the JSON file to the secure App sandbox directory on the Android device using `adb push`.
   *The destination directory must be strictly: `/sdcard/Android/data/com.kuaiyou.automator.clicker.test/files/`*
   
   ```bash
   adb push /tmp/generated_skill.json /sdcard/Android/data/com.kuaiyou.automator.clicker.test/files/generated_skill.json
   adb shell "chmod 666 /sdcard/Android/data/com.kuaiyou.automator.clicker.test/files/generated_skill.json"
   ```

3. Trigger the Import DeepLink using `adb shell am start`.
   *Pass the absolute path on the Android device as the `path` query parameter.*

   ```bash
   adb shell am start -a android.intent.action.VIEW -d "kuaiyou://import_skill?path=/sdcard/Android/data/com.kuaiyou.automator.clicker.test/files/generated_skill.json"
   ```

4. The Kuaiyou app will wake up and prompt the user to review and confirm the import. Wait for the user to confirm success.
