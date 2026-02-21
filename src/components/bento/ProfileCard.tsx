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
        <div className="bento-card col-span-1 md:col-span-2 row-span-2 rounded-3xl p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110 pointer-events-none" style={{ background: 'var(--card-glow)' }} />

            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-12 z-10 w-full h-full">
                {/* Текст слева */}
                <div className="flex-1 flex flex-col justify-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40 leading-[0.9]">
                        {siteConfig.name}
                    </h1>
                    <p className="text-xl md:text-2xl font-medium tracking-tight mb-4" style={{ color: 'var(--accent)' }}>
                        {siteConfig.role}
                    </p>

                    <div className="hidden md:block mb-8">
                        <p className="text-lg leading-relaxed opacity-60 max-w-sm">
                            {siteConfig.bio}
                        </p>
                    </div>

                    <p className="opacity-40 text-xs font-bold uppercase tracking-widest">
                        {siteConfig.age} y.o. • Based in MSK
                    </p>
                </div>

                {/* Огромное фото справа */}
                <div className="relative shrink-0 flex items-center justify-center">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3.5rem] overflow-hidden border-2 flex items-center justify-center bg-zinc-900 shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:scale-[1.03] group-hover:-rotate-2" style={{ borderColor: 'var(--card-border)' }}>
                        {siteConfig.avatar ? (
                            <img
                                src={siteConfig.avatar}
                                alt={siteConfig.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <span className="text-7xl font-bold" style={{ color: 'var(--muted)' }}>VS</span>
                        )}
                    </div>
                    {/* Многослойное свечение */}
                    <div className="absolute -inset-10 bg-indigo-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3.5rem] pointer-events-none" />
                </div>
            </div>



            <div className="mt-8 md:mt-auto z-10 w-full">
                <div className="flex flex-wrap gap-3">

                    <a
                        href={siteConfig.socials.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                        <Send className="w-4 h-4" />
                        @vlvdvlvd
                    </a>

                    <a
                        href={siteConfig.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                        <Github className="w-4 h-4" />
                        vadosishe
                    </a>

                    <button
                        onClick={copyEmail}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Скопировано!" : "Email"}
                    </button>
                </div>
            </div>
        </div>
    );
}
