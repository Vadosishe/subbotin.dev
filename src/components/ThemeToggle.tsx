"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-current/5 hover:bg-current/10 border border-current/10 transition-all duration-300 cursor-pointer group"
            aria-label="Переключить тему"
            title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
        >
            {theme === "dark" ? (
                <Sun className="w-6 h-6 text-yellow-400 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
                <Moon className="w-6 h-6 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
            )}
        </button>
    );
}
