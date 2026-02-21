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
        <div className="bento-card col-span-1 md:col-span-2 row-span-2 rounded-3xl p-8 h-full relative overflow-hidden group">
            {/* Фоновое свечение */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110 pointer-events-none" style={{ background: 'var(--card-glow)' }} />

            <div className="relative z-10 h-full flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch flex-grow">
                    {/* Текст (2/3) */}
                    <div className="md:col-span-2 flex flex-col justify-center py-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                            {siteConfig.name}
                        </h1>
                        <p className="text-xl font-medium mb-4" style={{ color: 'var(--accent)' }}>
                            {siteConfig.role}
                        </p>
                        <p className="text-base leading-relaxed opacity-60 mb-6 max-w-sm">
                            {siteConfig.bio}
                        </p>
                        <p className="opacity-40 text-xs font-semibold uppercase tracking-widest mt-auto">
                            {siteConfig.age} years old • Based in MSK
                        </p>
                    </div>

                    {/* Вытянутое фото справа (1/3) с отступом */}
                    <div className="md:col-span-1 flex justify-center md:justify-end">
                        <div className="relative group/avatar h-full flex items-center">
                            <div className="w-full aspect-[3/4] md:w-56 md:h-full max-h-[320px] rounded-[2rem] overflow-hidden border-2 flex items-center justify-center bg-zinc-900 shadow-2xl transition-all duration-500 group-hover:scale-[1.02]" style={{ borderColor: 'var(--card-border)' }}>
                                {siteConfig.avatar ? (
                                    <img
                                        src={siteConfig.avatar}
                                        alt={siteConfig.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-6xl font-bold" style={{ color: 'var(--muted)' }}>VS</span>
                                )}
                            </div>
                            {/* Свечение за фото */}
                            <div className="absolute -inset-4 bg-indigo-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                        </div>
                    </div>
                </div>

                {/* Соцсети снизу */}
                <div className="mt-8 flex flex-wrap gap-3">
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
        </div>
    );
}
