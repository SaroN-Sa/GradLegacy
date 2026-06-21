import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/store/language-context";


export const metadata: Metadata = {
  title: "GradLegacy",
  description: "Graduation Memory & Wishing Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LanguageProvider>
             {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}