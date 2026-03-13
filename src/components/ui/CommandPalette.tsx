"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Home,
    Book,
    User,
    Mail,
    Github,
    Moon,
    Sun,
    Command,
    X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/data/siteConfig";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const { lang, setLang, t } = useLanguage();

    const togglePalette = useCallback(() => setIsOpen((prev) => !prev), []);
    const toggleLang = useCallback(() => setLang(lang === "ru" ? "en" : "ru"), [lang, setLang]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                console.log("Command Palette shortcut triggered");
                togglePalette();
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        const handleOpenEvent = () => {
            console.log("Command Palette event triggered");
            setIsOpen(true);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("open-command-palette", handleOpenEvent);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("open-command-palette", handleOpenEvent);
        };
    }, [togglePalette]);

    const items = [
        { id: "home", label: t(siteConfig.ui.nav.home), icon: Home, action: () => router.push("/") },
        { id: "blog", label: t(siteConfig.ui.nav.blog), icon: Book, action: () => router.push("/blog") },
        { id: "github", label: "GitHub", icon: Github, action: () => window.open(siteConfig.socials.github, "_blank") },
        { id: "email", label: t(siteConfig.ui.common.email), icon: Mail, action: () => window.location.assign(`mailto:${siteConfig.email}`) },
        {
            id: "theme",
            label: theme === "dark"
                ? (lang === "ru" ? "Переключить на светлую" : "Switch to light mode")
                : (lang === "ru" ? "Переключить на темную" : "Switch to dark mode"),
            icon: theme === "dark" ? Sun : Moon,
            action: toggleTheme
        },
        {
            id: "language",
            label: lang === "ru" ? "Switch to English" : "Переключить на русский",
            icon: Search, // Можно заменить на иконку планеты если есть
            action: toggleLang
        }
    ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

    return (
        <>
            {/* Floating Action Button (FAB) */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group overflow-hidden"
                aria-label="Open Command Palette"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-600 transition-opacity" />
                <Search className="w-6 h-6 relative z-10 transition-transform group-hover:rotate-12" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-xl border border-current/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto backdrop-blur-xl"
                            style={{ backgroundColor: 'var(--card-bg)' }}
                        >
                            <div className="flex items-center p-4 border-b border-current/5">
                                <Search className="w-5 h-5 text-zinc-500 mr-3" />
                                <input
                                    autoFocus
                                    placeholder={t({ ru: "Поиск и команды...", en: "Search and commands..." })}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full bg-transparent text-current placeholder:opacity-50 outline-none text-lg"
                                />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-current/5 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {items.length > 0 ? (
                                    <div className="space-y-1">
                                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest opacity-50">
                                            {t({ ru: "Навигация", en: "Navigation" })}
                                        </p>
                                        {items.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    item.action();
                                                    setIsOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-current/5 opacity-80 hover:opacity-100 transition-all group text-left"
                                            >
                                                <div className="p-2 rounded-lg bg-current/5 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                                    <item.icon className="w-4 h-4" />
                                                </div>
                                                <span className="flex-grow font-medium">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <Search className="w-12 h-12 opacity-30 mx-auto mb-4" />
                                        <p className="opacity-50">{t({ ru: "Ничего не найдено", en: "Nothing found" })}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
