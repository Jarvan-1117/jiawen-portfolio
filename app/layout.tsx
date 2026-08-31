import type { Metadata } from "next";
import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/components/border-glow.css";
import "@/components/swarm-cursor.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Jiawen Wang | Data Analytics & Machine Learning Portfolio",
  description:
    "Portfolio of Jiawen (Jarvan) Wang, a Master of Information Technology student at UTS focused on data analytics and applied machine learning.",
  keywords: [
    "Jiawen Wang",
    "Jarvan Wang",
    "data analytics",
    "data analyst",
    "Python",
    "SQL",
    "machine learning",
    "computer vision",
    "UTS"
  ],
  authors: [{ name: "Jiawen (Jarvan) Wang" }],
  creator: "Jiawen (Jarvan) Wang",
  openGraph: {
    title: "Jiawen Wang | Data Analytics & Machine Learning Portfolio",
    description:
      "Data analytics and applied machine learning portfolio for Jiawen (Jarvan) Wang.",
    url: "https://jarvan-1117.github.io",
    siteName: "Jiawen Wang Portfolio",
    locale: "en_AU",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Jiawen Wang | Data Analytics & Machine Learning Portfolio",
    description:
      "Portfolio of Jiawen (Jarvan) Wang, focused on data analytics and applied machine learning."
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} bg-neutral-50 font-sans text-ink antialiased dark:bg-[#0f1115] dark:text-neutral-100`}>
        {children}
      </body>
    </html>
  );
}
