import type { Metadata } from "next";
import DocsPageContent from "@/components/DocsPage";

export const metadata: Metadata = {
  title: "文档 — 快速开始与 ReactiveSkill 指南",
  description:
    "了解如何安装快游大师 CLI、连接 AI 客户端，并开始编写与运行 ReactiveSkill。",
  alternates: {
    canonical: "/docs/",
  },
};

export default function DocsPage() {
  return <DocsPageContent />;
}
