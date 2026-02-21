import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

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
      <body className="antialiased selection:bg-indigo-500/30">
        <ThemeProvider>
          <div className="max-w-5xl mx-auto flex flex-col min-h-screen px-4 md:px-6">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
