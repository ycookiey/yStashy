import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const runtime = 'edge';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "yStashy - Personal Read-Later App",
  description: "Save and manage web articles with ease. A zero-latency bookmarking app.",
  metadataBase: new URL('https://stash.ycookiey.com'),
  keywords: ["read later", "bookmark", "offline reading", "yStashy", "stash"],
  authors: [{ name: "ycookiey" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-display antialiased min-h-screen flex flex-col transition-colors duration-300`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
