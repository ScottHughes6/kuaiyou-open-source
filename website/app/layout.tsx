import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentMeta from "@/components/DocumentMeta";
import { I18nProvider } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "快游大师 CLI — 用 AI 构建 Android 自动化技能",
    template: "%s | 快游大师 CLI",
  },
  description:
    "快游大师 CLI：用 AI 理解 Android 界面，生成并校验 ReactiveSkill，再下发到手机本地执行。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "快游大师 CLI",
    title: "快游大师 CLI — 用 AI 构建 Android 自动化技能",
    description:
      "用 AI 理解 Android 界面，创建 ReactiveSkill，并在手机本地执行。",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "快游大师 CLI — 用 AI 构建 Android 自动化技能",
    description:
      "快游大师 CLI 帮助你用 AI 构建 Android 自动化技能，并在手机本地执行。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <I18nProvider>
          <DocumentMeta />
          <a href="#main-content" className="skip-link">
            跳到主要内容
          </a>
          <Navbar />
          <div className="page-shell">{children}</div>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
