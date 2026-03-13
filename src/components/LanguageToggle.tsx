"use client";

import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
    const { lang, setLang } = useLanguage();

    const toggleLang = () => {
        setLang(lang === "ru" ? "en" : "ru");
    };

    return (
        <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-current/5 hover:bg-current/10 transition-all duration-300 border border-current/5 group relative overflow-hidden"
            title={lang === "ru" ? "Switch to English" : "Переключить на русский"}
        >
            <span className={`text-sm font-bold transition-all duration-300 ${lang === "ru" ? "text-indigo-400" : "opacity-40"}`}>RU</span>
            <div className="w-[2px] h-4 bg-current/10" />
            <span className={`text-sm font-bold transition-all duration-300 ${lang === "en" ? "text-indigo-400" : "opacity-40"}`}>EN</span>

            {/* Индикатор активного языка */}
            <div className={`absolute bottom-0 left-0 h-[4px] bg-indigo-500 transition-all duration-500 ${lang === "ru" ? "w-1/2" : "translate-x-full w-1/2"}`} />
        </button>
    );
}
