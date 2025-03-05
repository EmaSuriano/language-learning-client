import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import { Suspense } from "react";
import "@radix-ui/themes/styles.css";

import IntlProvider from "@/components/IntlProvider";
import { QueryClientProvider } from "@/components/QueryClientProvider";
import { Theme } from "@radix-ui/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "assistant-ui App",
  description: "Generated by create-assistant-ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          storageKey="nightwind-mode"
          defaultTheme="system"
        >
          <Theme accentColor="indigo" grayColor="slate">
            <QueryClientProvider>
              <Suspense>{children}</Suspense>
            </QueryClientProvider>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
