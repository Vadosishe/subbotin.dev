"use client";

import { useState } from "react";
import { Check, Copy, Github, Send } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export function ProfileCard() {
    const [copied, setCopied] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText(siteConfig.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bento-card col-span-1 md:col-span-2 row-span-2 rounded-3xl h-full relative overflow-hidden group flex flex-col md:flex-row">
            {/* Текст (2/3) */}
            <div className="p-8 md:p-10 flex-grow md:w-2/3 flex flex-col justify-between relative z-10">
                {/* Фоновое свечение только для текстовой части */}
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl -ml-20 -mt-20 transition-transform duration-700 group-hover:scale-110 pointer-events-none" style={{ background: 'var(--card-glow)' }} />

                <div className="relative z-10 flex-grow flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                        {siteConfig.name}
                    </h1>
                    <p className="text-xl font-medium mb-4" style={{ color: 'var(--accent)' }}>
                        {siteConfig.role}
                    </p>
                    <p className="text-base leading-relaxed opacity-60 mb-6 max-w-sm">
                        {siteConfig.bio}
                    </p>
                    <p className="opacity-40 text-xs font-semibold uppercase tracking-widest">
                        {siteConfig.age} years old • Based in MSK
                    </p>
                </div>

                {/* Соцсети снизу */}
                <div className="relative z-10 mt-8 flex flex-wrap gap-3">
                    <a
                        href={siteConfig.socials.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                        <Send className="w-3.5 h-3.5" />
                        @vlvdvlvd
                    </a>

                    <a
                        href={siteConfig.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                        <Github className="w-3.5 h-3.5" />
                        vadosishe
                    </a>

                    <button
                        onClick={copyEmail}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Скопировано!" : "Email"}
                    </button>
                </div>
            </div>

            {/* Фото (1/3) - На всю высоту */}
            <div className="md:w-1/3 relative h-64 md:h-full overflow-hidden border-l border-white/5">
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                    {siteConfig.avatar ? (
                        <img
                            src={siteConfig.avatar}
                            alt={siteConfig.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <span className="text-6xl font-bold opacity-20">VS</span>
                    )}
                </div>
                {/* Оверлей градиента для более мягкого перехода */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/20 md:to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
        </div>
    );
}
