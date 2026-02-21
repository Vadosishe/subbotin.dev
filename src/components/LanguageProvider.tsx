"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "ru" | "en";

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: any) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: "ru",
    setLang: () => { },
    t: (key: any) => typeof key === 'string' ? key : key?.ru || "",
});

export function useLanguage() {
    return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Language>("ru");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("lang") as Language | null;
        if (saved && (saved === "ru" || saved === "en")) {
            setLangState(saved);
        } else {
            // Определение языка браузера
            const browserLang = navigator.language.split("-")[0];
            if (browserLang === "en") setLangState("en");
        }
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem("lang", newLang);
    };

    const t = (obj: any) => {
        if (!obj) return "";
        if (typeof obj === "string") return obj;
        return obj[lang] || obj["ru"] || "";
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}
