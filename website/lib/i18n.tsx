"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "zh" | "en";

export const DEFAULT_LOCALE: Locale = "zh";
export const LOCALE_STORAGE_KEY = "kuaiyou-locale";
export const LOCALE_QUERY_KEY = "lang";

type Dict = Record<string, string>;

const zh: Dict = {
  "meta.siteName": "快游大师 CLI",
  "meta.home.title": "快游大师 CLI — 用 AI 构建 Android 自动化技能",
  "meta.home.description":
    "快游大师 CLI：用 AI 理解 Android 界面，生成并校验 ReactiveSkill，再下发到手机本地执行。",
  "meta.docs.title": "文档 — 快速开始与 ReactiveSkill 指南",
  "meta.docs.description":
    "了解如何安装快游大师 CLI、连接 AI 客户端，并开始编写与运行 ReactiveSkill。",
  "meta.notfound.title": "页面未找到",
  "skip.link": "跳到主要内容",
  "nav.primary": "主导航",
  "nav.home": "首页",
  "nav.docs": "文档",
  "nav.getStarted": "快速开始",
  "nav.star": "Star GitHub",
  "nav.starAria": "在 GitHub 上 Star 本仓库",
  "nav.opensNewTab": "（在新标签页打开）",
  "lang.switch": "语言",
  "lang.zh": "中文",
  "lang.en": "EN",

  "home.badge": "快游大师 CLI · ReactiveSkill V2",
  "home.title.line1": "用 AI 构建",
  "home.title.line2": "Android 自动化技能",
  "home.title.line3": "ReactiveSkill",
  "home.subtitle":
    "快游大师 CLI 让 AI 理解当前 Android 界面，生成可校验的 ReactiveSkill，并下发到手机本地执行。",
  "home.cta.primary": "快速开始 — 5 分钟上手",
  "home.cta.how": "了解工作原理",
  "home.cta.source": "查看源码",
  "home.boundary":
    "开源部分：快游大师 CLI、ReactiveSkill 规范、示例与技能。必需运行时：快游大师 App（可在华为、小米、Vivo、OPPO、荣耀、应用宝等应用商店下载）。",
  "home.tags.aria": "产品约束",
  "home.tag.android": "Android系统",
  "home.tag.app": "快游大师自动化引擎",
  "home.tag.mcp": "官方开源 Skill 和 MCP",
  "home.tag.bridge": "局域网或 ADB",

  "home.how.title": "工作原理",
  "home.how.subtitle": "从 AI 理解界面，到手机本地执行自动化技能",
  "home.how.node1.title": "AI 客户端",
  "home.how.node1.desc": "理解任务并生成技能",
  "home.how.arrow1": "生成技能",
  "home.how.node2.title": "快游大师 CLI",
  "home.how.node2.desc": "读取界面、校验并下发",
  "home.how.arrow2": "下发到手机",
  "home.how.node3.title": "快游大师",
  "home.how.node3.desc": "确认后在手机本地执行",
  "home.how.sr":
    "AI 客户端通过快游大师 CLI 读取 Android 界面、生成并校验 ReactiveSkill，再下发到快游大师，用户确认后在手机本地执行。",

  "home.cap.title": "快游大师 CLI 能做什么",
  "home.cap.subtitle": "聚焦结果，而不是工具链细节",
  "home.cap.1.title": "看懂当前界面",
  "home.cap.1.desc":
    "让 AI 获取手机当前页面信息，基于真实界面生成自动化技能。",
  "home.cap.2.title": "生成 ReactiveSkill",
  "home.cap.2.desc":
    "用结构化技能描述自动化流程，比固定坐标脚本更易维护。",
  "home.cap.3.title": "下发前先校验",
  "home.cap.3.desc":
    "先检查技能是否合法，再下发到手机，减少无效调试。",
  "home.cap.4.title": "手机本地执行",
  "home.cap.4.desc":
    "技能在手机端确认后本地运行，不依赖运行中的外部模型。",

  "home.qs.title": "快速开始",
  "home.qs.subtitle": "五步开始你的第一个 ReactiveSkill",
  "home.qs.1.strong": "安装快游大师",
  "home.qs.1.rest": "到 Android 手机，并完成基础权限设置。",
  "home.qs.2.strong": "连接手机：",
  "home.qs.2.rest": "通过局域网或 ADB 让电脑与手机互通。",
  "home.qs.3": "在电脑上运行快游大师 CLI。",
  "home.qs.4": "让 AI 查看当前界面，并开始生成技能。",
  "home.qs.5": "校验技能后下发到手机，并在手机上确认运行。",
  "home.qs.openGuide": "打开安装指南",
  "home.qs.tools": "能力说明",

  "home.skills.title": "ReactiveSkill 示例",
  "home.skills.subtitle":
    "浏览 {examples} 个示例与 {tests} 个兼容性测试技能。下载或复制后，校验并下发到手机运行。",

  "home.sec.title": "安全与边界",
  "home.sec.subtitle": "使用前需要了解的关键信息",
  "home.sec.1": "快游大师 CLI 运行在你的电脑本地。",
  "home.sec.2":
    "界面信息会在手机与本地工具之间传输；是否继续交给 AI，取决于你使用的客户端。",
  "home.sec.3": "导入前请审阅 ReactiveSkill。手机端会在运行前要求确认。",
  "home.sec.4": "兼容常见 AI 客户端。与 Anthropic 无隶属或背书关系。",
  "home.sec.5":
    "本仓库开源的是快游大师 CLI；手机端执行能力由快游大师提供，仍为闭源。",

  "skills.searchAria": "ReactiveSkill",
  "skills.filterAria": "技能分类",
  "skills.filter.all": "全部",
  "skills.filter.examples": "示例",
  "skills.filter.tests": "兼容性测试",
  "skills.searchLabel": "按名称、描述或 ID 搜索技能",
  "skills.searchPlaceholder": "按名称、描述或 ID 搜索…",
  "skills.result": "找到 {count} 个技能",
  "skills.howto.title": "如何运行技能",
  "skills.howto.1": "打开或下载技能文件。",
  "skills.howto.2.before": "用 AI 客户端",
  "skills.howto.2.after": "校验技能内容。",
  "skills.howto.3.before": "校验通过后",
  "skills.howto.3.after": "下发到手机。",
  "skills.howto.4": "在 Android 手机上确认并运行。",
  "skills.howto.note":
    "复制链接只是获取技能文件，不会自动部署。需要完成校验、下发和手机确认。",
  "skills.empty": "没有匹配“{query}”的技能。",
  "skills.category.examples": "示例",
  "skills.category.tests": "兼容性测试",
  "skills.viewJson": "查看技能",
  "skills.copyIdle": "复制链接",
  "skills.copyCopying": "复制中…",
  "skills.copySuccess": "已复制！",
  "skills.copyError": "复制失败",
  "skills.copyFallback": "剪贴板不可用。请手动复制此链接：",
  "skills.copyFallbackAria": "{id} 的技能链接",
  "skills.showMore": "查看更多",
  "skills.showLess": "收起",

  "docs.navAria": "文档导航",
  "docs.nav.intro": "简介",
  "docs.nav.quick": "快速开始",
  "docs.nav.write": "编写第一个技能",
  "docs.nav.tools": "核心能力",
  "docs.nav.boundaries": "开源边界",
  "docs.intro.title": "快游大师 CLI 文档",
  "docs.intro.p1":
    "欢迎使用快游大师 CLI。这里帮助你用 AI 生成、校验并运行 Android 自动化技能。核心对象是",
  "docs.intro.p1.mid": "，一种可下发到手机本地执行的结构化技能。",
  "docs.intro.note.strong": "说明：",
  "docs.intro.note":
    "本仓库开源快游大师 CLI、ReactiveSkill 规范、示例与技能。快游大师 Android App 为闭源，且是端侧执行的必需依赖。",
  "docs.quick.title": "快速开始",
  "docs.quick.p":
    "准备好手机端快游大师后，在电脑上启动快游大师 CLI，即可开始生成和运行 ReactiveSkill。",
  "docs.quick.prereq": "1. 前置条件",
  "docs.quick.prereq.1": "可用的电脑开发环境",
  "docs.quick.prereq.2": "Android 手机上已安装快游大师 App",
  "docs.quick.prereq.3":
    "局域网模式：在 App 中开启局域网服务并记录 IP。",
  "docs.quick.prereq.4": "USB 模式：通过数据线连接手机。",
  "docs.quick.start": "2. 启动快游大师 CLI",
  "docs.quick.lan": "局域网连接（推荐，替换为你的设备 IP）：",
  "docs.quick.usb": "USB 连接（无需 IP）：",
  "docs.quick.connect": "3. 连接你的 AI 客户端",
  "docs.quick.claude": "如果你使用支持 MCP 的 AI 客户端，可参考如下配置",
  "docs.quick.compat":
    "快游大师 CLI 面向常见 AI 客户端接入。文档重点说明怎么用，而不是客户端内部实现。",
  "docs.write.title": "编写第一个技能",
  "docs.write.p":
    "ReactiveSkill 是一种结构化自动化技能。它描述“在什么情况下做什么”，比固定坐标脚本更易复用。示例见",
  "docs.write.p.end": "。",
  "docs.write.tip.strong": "提示：",
  "docs.write.tip":
    "推送到手机前，先校验技能是否合法。确认无误后再下发，并在手机上确认运行。",
  "docs.tools.title": "核心能力",
  "docs.tools.p": "快游大师 CLI 当前主要提供这些能力：",
  "docs.tools.1": "获取手机当前界面信息。",
  "docs.tools.2": "截取当前屏幕。",
  "docs.tools.3": "校验 ReactiveSkill 是否合法。",
  "docs.tools.4": "将技能下发到手机，确认后本地执行。",
  "docs.bound.title": "开源边界",
  "docs.bound.1":
    "开源：快游大师 CLI、ReactiveSkill 规范、文档、示例与技能。",
  "docs.bound.2": "闭源：快游大师 Android App / 手机端执行能力。",
  "docs.bound.3":
    "界面信息会经过你的本地工具。是否继续交给 AI，取决于你连接的客户端。",
  "docs.bound.4":
    "与 Anthropic 无隶属或背书关系。兼容常见 AI 客户端。",

  "footer.brand": "快游大师 CLI",
  "footer.desc":
    "用 AI 构建 Android 自动化技能，并在手机本地执行。",
  "footer.nav": "页脚导航",
  "footer.github": "GitHub",
  "footer.docs": "文档",
  "footer.quick": "快速开始",
  "footer.skills": "技能示例",
  "footer.copy":
    "© {year} 快游大师团队。Apache-2.0 开源工具链。",
  "footer.note":
    "开源快游大师 CLI、规范、文档与技能。快游大师 Android App 运行时为闭源且为执行所必需。兼容常见 AI 客户端；与 Anthropic 无隶属或背书关系。",

  "notfound.title": "页面未找到",
  "notfound.desc":
    "该路径不属于快游大师 CLI 站点。请返回首页或查看安装指南。",
  "notfound.home": "返回首页",
  "notfound.docs": "打开快速开始",
};

const en: Dict = {
  "meta.siteName": "Kuaiyou Master CLI",
  "meta.home.title": "Kuaiyou Master CLI — Build Android Automation Skills with AI",
  "meta.home.description":
    "Kuaiyou Master CLI helps AI understand Android screens, create validated ReactiveSkills, and run them locally on your phone.",
  "meta.docs.title": "Docs — Quick Start and ReactiveSkill Guide",
  "meta.docs.description":
    "Learn how to set up Kuaiyou Master CLI, connect an AI client, and start building ReactiveSkills.",
  "meta.notfound.title": "Page not found",
  "skip.link": "Skip to main content",
  "nav.primary": "Primary",
  "nav.home": "Home",
  "nav.docs": "Docs",
  "nav.getStarted": "Get started",
  "nav.star": "Star on GitHub",
  "nav.starAria": "Star on GitHub",
  "nav.opensNewTab": " (opens in a new tab)",
  "lang.switch": "Language",
  "lang.zh": "中文",
  "lang.en": "EN",

  "home.badge": "Kuaiyou Master CLI · ReactiveSkill V2",
  "home.title.line1": "Build Android",
  "home.title.line2": "automation skills",
  "home.title.line3": "with ReactiveSkill",
  "home.subtitle":
    "Kuaiyou Master CLI helps AI understand the current Android screen, create a validated ReactiveSkill, and run it locally on your phone.",
  "home.cta.primary": "Get started — 5 minute setup",
  "home.cta.how": "See how it works",
  "home.cta.source": "View source",
  "home.boundary":
    "Open source: Kuaiyou Master CLI, ReactiveSkill format, examples, and skills. Required runtime: Kuaiyou Master App (download from Huawei, Xiaomi, vivo, OPPO, Honor, Tencent Appstore, and other app stores).",
  "home.tags.aria": "Product constraints",
  "home.tag.android": "Android",
  "home.tag.app": "Kuaiyou Master automation engine",
  "home.tag.mcp": "Official open-source Skill & MCP",
  "home.tag.bridge": "LAN or ADB",

  "home.how.title": "How It Works",
  "home.how.subtitle":
    "From understanding a screen to running automation on your phone",
  "home.how.node1.title": "AI client",
  "home.how.node1.desc": "Understands the task and creates a skill",
  "home.how.arrow1": "Create skill",
  "home.how.node2.title": "Kuaiyou Master CLI",
  "home.how.node2.desc": "Reads the screen, validates, and sends",
  "home.how.arrow2": "Send to phone",
  "home.how.node3.title": "Kuaiyou Master",
  "home.how.node3.desc": "Confirm and run locally on device",
  "home.how.sr":
    "An AI client uses Kuaiyou Master CLI to understand the Android screen, create and validate a ReactiveSkill, then send it to Kuaiyou Master for local execution after confirmation.",

  "home.cap.title": "What you can do today",
  "home.cap.subtitle": "Focus on outcomes, not tool internals",
  "home.cap.1.title": "Understand the current screen",
  "home.cap.1.desc":
    "Let AI see what is on the phone before creating an automation skill.",
  "home.cap.2.title": "Create ReactiveSkills",
  "home.cap.2.desc":
    "Describe automation as structured skills that are easier to reuse than hard-coded coordinates.",
  "home.cap.3.title": "Validate before sending",
  "home.cap.3.desc":
    "Check the skill first, then send it to the phone to reduce failed runs.",
  "home.cap.4.title": "Run locally on the phone",
  "home.cap.4.desc":
    "After confirmation in Kuaiyou Master, the skill runs on-device without a live external model.",

  "home.qs.title": "Quick Start",
  "home.qs.subtitle": "Five steps to your first ReactiveSkill",
  "home.qs.1.strong": "Install Kuaiyou Master",
  "home.qs.1.rest": "on Android and finish basic permission setup.",
  "home.qs.2.strong": "Connect the phone:",
  "home.qs.2.rest": "use LAN or ADB so your computer can reach the device.",
  "home.qs.3": "Start Kuaiyou Master CLI on your computer.",
  "home.qs.4": "Let AI inspect the current screen and start creating a skill.",
  "home.qs.5": "Validate the skill, send it to the phone, and confirm the run.",
  "home.qs.openGuide": "Open setup guide",
  "home.qs.tools": "Capabilities",

  "home.skills.title": "ReactiveSkill examples",
  "home.skills.subtitle":
    "Browse {examples} example and {tests} compatibility-test skills. Download or copy one, then validate and send it to the phone.",

  "home.sec.title": "Safety & boundaries",
  "home.sec.subtitle": "What you should know before using it",
  "home.sec.1": "Kuaiyou Master CLI runs locally on your computer.",
  "home.sec.2":
    "Screen information moves between the phone and local tooling; whether it is shared with AI depends on the client you use.",
  "home.sec.3":
    "Review each ReactiveSkill before import. The phone asks for confirmation before running.",
  "home.sec.4":
    "Works with common AI clients. Not affiliated with or endorsed by Anthropic.",
  "home.sec.5":
    "This repository open-sources Kuaiyou Master CLI. On-device execution is provided by Kuaiyou Master and remains closed source.",

  "skills.searchAria": "ReactiveSkill",
  "skills.filterAria": "Skill category",
  "skills.filter.all": "All",
  "skills.filter.examples": "Examples",
  "skills.filter.tests": "Compatibility tests",
  "skills.searchLabel": "Search skills by name, description or ID",
  "skills.searchPlaceholder": "Search skills by name, description or ID...",
  "skills.result": "{count} skill(s) found",
  "skills.howto.title": "How to run a skill",
  "skills.howto.1": "Open or download the skill file.",
  "skills.howto.2.before": "Use your AI client to",
  "skills.howto.2.after": "validate the skill.",
  "skills.howto.3.before": "After validation,",
  "skills.howto.3.after": "send it to the phone.",
  "skills.howto.4": "Confirm and run it on Android.",
  "skills.howto.note":
    "Copying a link only gets the skill file. You still need validation, delivery, and phone confirmation.",
  "skills.empty": 'No skills found matching "{query}".',
  "skills.category.examples": "Example",
  "skills.category.tests": "Compatibility test",
  "skills.viewJson": "View skill",
  "skills.copyIdle": "Copy link",
  "skills.copyCopying": "Copying…",
  "skills.copySuccess": "Copied!",
  "skills.copyError": "Copy failed",
  "skills.copyFallback": "Clipboard access failed. Copy this link manually:",
  "skills.copyFallbackAria": "Skill link for {id}",
  "skills.showMore": "Show more",
  "skills.showLess": "Show less",

  "docs.navAria": "Documentation",
  "docs.nav.intro": "Introduction",
  "docs.nav.quick": "Quick Start",
  "docs.nav.write": "Write your first skill",
  "docs.nav.tools": "Core capabilities",
  "docs.nav.boundaries": "Open-source boundaries",
  "docs.intro.title": "Kuaiyou Master CLI docs",
  "docs.intro.p1":
    "Welcome to Kuaiyou Master CLI. This guide helps you create, validate, and run Android automation skills with AI. The core format is",
  "docs.intro.p1.mid":
    ", a structured skill that can be sent to the phone for local execution.",
  "docs.intro.note.strong": "Note:",
  "docs.intro.note":
    "This repository open-sources Kuaiyou Master CLI, the ReactiveSkill format, examples, and skills. The Kuaiyou Master Android App is closed source and required for on-device execution.",
  "docs.quick.title": "Quick Start",
  "docs.quick.p":
    "After Kuaiyou Master is ready on your phone, start Kuaiyou Master CLI on your computer and begin building ReactiveSkills.",
  "docs.quick.prereq": "1. Prerequisites",
  "docs.quick.prereq.1": "A ready computer environment",
  "docs.quick.prereq.2": "Kuaiyou Master installed on an Android phone",
  "docs.quick.prereq.3":
    "LAN mode: enable the LAN service in the app and note the IP.",
  "docs.quick.prereq.4": "USB mode: connect the phone with a cable.",
  "docs.quick.start": "2. Start Kuaiyou Master CLI",
  "docs.quick.lan": "LAN connection (recommended, replace with your device IP):",
  "docs.quick.usb": "USB connection (no IP needed):",
  "docs.quick.connect": "3. Connect your AI client",
  "docs.quick.claude":
    "If your AI client supports MCP, you can use a config like this",
  "docs.quick.compat":
    "Kuaiyou Master CLI is designed for common AI clients. The docs focus on how to use it, not client internals.",
  "docs.write.title": "Write your first skill",
  "docs.write.p":
    "A ReactiveSkill is a structured automation skill. It describes when something should happen and what to do next, which is easier to reuse than hard-coded coordinates. See examples under",
  "docs.write.p.end": ".",
  "docs.write.tip.strong": "Tip:",
  "docs.write.tip":
    "Validate the skill before sending it to the phone. After delivery, confirm the run on the device.",
  "docs.tools.title": "Core capabilities",
  "docs.tools.p": "Kuaiyou Master CLI currently focuses on these outcomes:",
  "docs.tools.1": "Read the current phone screen context.",
  "docs.tools.2": "Capture the current screen.",
  "docs.tools.3": "Validate a ReactiveSkill.",
  "docs.tools.4": "Send a skill to the phone for local execution after confirmation.",
  "docs.bound.title": "Open-source boundaries",
  "docs.bound.1":
    "Open source: Kuaiyou Master CLI, ReactiveSkill format, docs, examples, and skills.",
  "docs.bound.2":
    "Closed source: Kuaiyou Master Android App / on-device execution.",
  "docs.bound.3":
    "Screen information passes through your local tooling. Whether it is shared with AI depends on the client you connect.",
  "docs.bound.4":
    "Not affiliated with or endorsed by Anthropic. Works with common AI clients.",

  "footer.brand": "Kuaiyou Master CLI",
  "footer.desc":
    "Build Android automation skills with AI and run them locally on your phone.",
  "footer.nav": "Footer",
  "footer.github": "GitHub",
  "footer.docs": "Documentation",
  "footer.quick": "Quick Start",
  "footer.skills": "Skill examples",
  "footer.copy":
    "© {year} Kuaiyou Master Team. Apache-2.0 open source tooling.",
  "footer.note":
    "Open-source Kuaiyou Master CLI, format, docs, and skills. The Kuaiyou Master Android App runtime is closed source and required for execution. Works with common AI clients; not affiliated with or endorsed by Anthropic.",

  "notfound.title": "Page not found",
  "notfound.desc":
    "That route is not part of the Kuaiyou Master CLI site. Try the homepage or the setup guide.",
  "notfound.home": "Back to homepage",
  "notfound.docs": "Open Quick Start",
};

const dictionaries: Record<Locale, Dict> = { zh, en };

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function format(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] === undefined ? `{${key}}` : String(vars[key])
  );
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "zh" || value === "en";
}

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(value)) return value;
  } catch {
    // ignore storage failures
  }
  return null;
}

function readQueryLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const value = new URLSearchParams(window.location.search).get(
      LOCALE_QUERY_KEY
    );
    if (isLocale(value)) return value;
  } catch {
    // ignore URL parsing failures
  }
  return null;
}

function writeLocaleToUrl(locale: Locale) {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    // Keep URLs clean for the default language.
    if (locale === DEFAULT_LOCALE) {
      url.searchParams.delete(LOCALE_QUERY_KEY);
    } else {
      url.searchParams.set(LOCALE_QUERY_KEY, locale);
    }
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  } catch {
    // ignore history failures
  }
}

function resolveDocumentMeta(locale: Locale, pathname: string) {
  const dict = dictionaries[locale] || dictionaries.zh;
  const fallback = dictionaries.zh;
  const isDocs =
    pathname === "/docs" ||
    pathname === "/docs/" ||
    pathname.endsWith("/docs") ||
    pathname.endsWith("/docs/");

  if (isDocs) {
    return {
      title: dict["meta.docs.title"] || fallback["meta.docs.title"],
      description:
        dict["meta.docs.description"] || fallback["meta.docs.description"],
    };
  }

  return {
    title: dict["meta.home.title"] || fallback["meta.home.title"],
    description:
      dict["meta.home.description"] || fallback["meta.home.description"],
  };
}

function applyDocumentMeta(locale: Locale) {
  if (typeof document === "undefined") return;

  document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";

  const { title, description } = resolveDocumentMeta(
    locale,
    window.location.pathname
  );
  document.title = title;

  const ensureMeta = (selector: string, attr: "name" | "property", key: string) => {
    let node = document.head.querySelector(selector) as HTMLMetaElement | null;
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute(attr, key);
      document.head.appendChild(node);
    }
    node.setAttribute("content", description);
  };

  ensureMeta('meta[name="description"]', "name", "description");
  ensureMeta('meta[property="og:description"]', "property", "og:description");
  ensureMeta('meta[name="twitter:description"]', "name", "twitter:description");

  const ogTitle = document.head.querySelector(
    'meta[property="og:title"]'
  ) as HTMLMetaElement | null;
  if (ogTitle) ogTitle.setAttribute("content", title);

  const twitterTitle = document.head.querySelector(
    'meta[name="twitter:title"]'
  ) as HTMLMetaElement | null;
  if (twitterTitle) twitterTitle.setAttribute("content", title);

  const ogLocale = document.head.querySelector(
    'meta[property="og:locale"]'
  ) as HTMLMetaElement | null;
  if (ogLocale) {
    ogLocale.setAttribute("content", locale === "zh" ? "zh_CN" : "en_US");
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    // URL query wins over localStorage so shared links stay predictable.
    const fromQuery = readQueryLocale();
    const fromStorage = readStoredLocale();
    const initial = fromQuery || fromStorage || DEFAULT_LOCALE;
    setLocaleState(initial);
    writeLocaleToUrl(initial);
    applyDocumentMeta(initial);
  }, []);

  useEffect(() => {
    applyDocumentMeta(locale);
  }, [locale]);

  useEffect(() => {
    const onRouteMeta = () => applyDocumentMeta(locale);
    window.addEventListener("kuaiyou:route-meta", onRouteMeta);
    return () => window.removeEventListener("kuaiyou:route-meta", onRouteMeta);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // ignore storage failures
    }
    writeLocaleToUrl(next);
    applyDocumentMeta(next);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = dictionaries[locale] || dictionaries.zh;
      const fallback = dictionaries.zh[key] || key;
      return format(dict[key] || fallback, vars);
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
