import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AOSProvider from "./AOSProvider";
import Providers from './providers'

const inter = Inter({ variable: "--font-sans", weight: ["400","500","600","700","800"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CreatorFlow — Upload Once. Speak Every Language.",
  description:
    "Transform your videos, podcasts, and posts into global hits — automatically localized, trend-tuned, and adapted for every audience.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {/* Smooth scroll is set in globals.css */}
        <div className="min-h-dvh bg-[#F9FAFB] text-[#111827] dark:bg-[#0f172a] dark:text-[#f1f5f9] transition-colors">
          <Providers>
          <AOSProvider>
            {children}
          </AOSProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
