import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CommandPalette } from "@/components/ui/CommandPalette";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Влад Субботин | Tech Explorer & Creator",
  description: "Персональный сайт-визитка Влада Субботина. Разработчик, энтузиаст новых технологий.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-indigo-500/30`}>
        <ThemeProvider>
          <LanguageProvider>
            <ScrollProgress />
            <CommandPalette />
            <div className="max-w-5xl mx-auto flex flex-col min-h-screen px-4 md:px-6">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
