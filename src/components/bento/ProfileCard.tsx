"use client";

import { useState } from "react";
import { Check, Copy, Github, Send } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/components/LanguageProvider";

export function ProfileCard() {
    const [copied, setCopied] = useState(false);
    const { t } = useLanguage();

    const copyEmail = () => {
        navigator.clipboard.writeText(siteConfig.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full w-full relative overflow-hidden group">
            <div className="flex flex-col md:flex-row h-full w-full">

                {/* Левый контейнер: Текст и Соцсети (60%) */}
                <div className="md:w-[60%] h-full p-6 md:p-10 flex flex-col justify-between relative overflow-hidden">

                    {/* Локальное свечение для текста */}
                    <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl -ml-20 -mt-20 transition-transform duration-700 group-hover:scale-110 pointer-events-none opacity-50"
                        style={{ background: 'var(--card-glow)' }} />

                    <div className="relative z-10 flex-grow flex flex-col justify-center">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-2 italic">
                            {t(siteConfig.name)}
                        </h1>
                        <p className="text-2xl font-medium mb-4" style={{ color: 'var(--accent)' }}>
                            {t(siteConfig.role)}
                        </p>
                        <p className="text-lg md:text-xl leading-relaxed opacity-70 mb-6 max-w-lg">
                            {t(siteConfig.bio)}
                        </p>
                        <p className="opacity-50 text-xs md:text-sm font-bold uppercase tracking-widest">
                            {siteConfig.age} {t(siteConfig.ui.common.age)} • {t(siteConfig.ui.common.location)}
                        </p>
                    </div>

                    <div className="relative z-10 mt-6 flex flex-wrap gap-2">
                        <a
                            href={siteConfig.socials.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                        >
                            <Send className="w-4 h-4 text-indigo-400" />
                            @vlvdvlvd
                        </a>

                        <a
                            href={siteConfig.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                        >
                            <Github className="w-4 h-4 text-indigo-400" />
                            vadosishe
                        </a>

                        <button
                            onClick={copyEmail}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 cursor-pointer"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                        >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
                            {copied ? t(siteConfig.ui.common.copied) : t(siteConfig.ui.common.email)}
                        </button>
                    </div>
                </div>

                {/* Правый контейнер: Фото (40%) */}
                <div className="md:w-[40%] min-h-[300px] md:h-auto overflow-hidden relative group/avatar">
                    {siteConfig.avatar ? (
                        <img
                            src={siteConfig.avatar}
                            alt={t(siteConfig.name)}
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                            <span className="text-6xl font-bold opacity-10">VS</span>
                        </div>
                    )}

                    {/* Градиентный оверлей */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />

                    {/* Эффект свечения при наведении */}
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
