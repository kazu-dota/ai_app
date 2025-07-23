import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | AI App Catalog",
    default: "AI App Catalog - 社内向けAIアプリケーション一覧",
  },
  description:
    "社内で開発・運用されている生成AIアプリケーションを一元管理し、社員が簡単に発見・利用できるプラットフォーム",
  keywords: ["AI", "アプリ", "カタログ", "社内ツール", "プラットフォーム"],
  authors: [{ name: "AI App Catalog Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://ai-app-catalog.company.com",
    title: "AI App Catalog",
    description: "社内向けAIアプリケーション一覧プラットフォーム",
    siteName: "AI App Catalog",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI App Catalog",
    description: "社内向けAIアプリケーション一覧プラットフォーム",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div id="root" className="min-h-full">
          {children}
        </div>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
