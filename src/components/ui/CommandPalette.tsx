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

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    const togglePalette = useCallback(() => setIsOpen((prev) => !prev), []);

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
        { id: "home", label: "Главная", icon: Home, action: () => router.push("/") },
        { id: "blog", label: "Блог", icon: Book, action: () => router.push("/blog") },
        { id: "github", label: "GitHub", icon: Github, action: () => window.open(siteConfig.socials.github, "_blank") },
        { id: "email", label: "Написать Email", icon: Mail, action: () => window.location.href = `mailto:${siteConfig.email}` },
        {
            id: "theme", label: "Переключить тему", icon: Moon, action: () => {
                const html = document.documentElement;
                const isDark = html.classList.contains('dark');
                html.classList.toggle('dark', !isDark);
                localStorage.setItem('theme', !isDark ? 'dark' : 'light');
            }
        },
    ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

    return (
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

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-xl bg-zinc-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto backdrop-blur-xl"
                    >
                        <div className="flex items-center p-4 border-b border-white/5">
                            <Search className="w-5 h-5 text-zinc-500 mr-3" />
                            <input
                                autoFocus
                                placeholder="Что вы ищете? (⌘+K)"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent text-white placeholder-zinc-500 outline-none text-lg"
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-zinc-500" />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {items.length > 0 ? (
                                <div className="space-y-1">
                                    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                        Команды
                                    </p>
                                    {items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                item.action();
                                                setIsOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group text-left"
                                        >
                                            <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <span className="flex-grow font-medium">{item.label}</span>
                                            <div className="text-[10px] text-zinc-600 font-mono">
                                                ENTER
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <Search className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                    <p className="text-zinc-500">Ничего не найдено по запросу "{query}"</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-zinc-800/50 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300 font-mono">↵</kbd> выбор
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300 font-mono">↑↓</kbd> навигация
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-300 font-mono">esc</kbd> закрыть
                                </span>
                            </div>
                            <div className="flex items-center gap-1 opacity-50">
                                <Command className="w-3 h-3" />
                                <span>vadosishe.com</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
