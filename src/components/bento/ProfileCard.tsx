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

            <div className="flex justify-between items-start z-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">{siteConfig.name}</h1>
                    <p className="text-lg font-medium" style={{ color: 'var(--muted)' }}>{siteConfig.role}</p>
                    <p className="mt-1 opacity-50">{siteConfig.age} лет</p>
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center" style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}>
                    <span className="text-2xl font-bold" style={{ color: 'var(--muted)' }}>VS</span>
                </div>
            </div>

            <div className="mt-auto pt-10 z-10">
                <p className="text-base leading-relaxed max-w-md mb-8" style={{ color: 'var(--muted)' }}>
                    {siteConfig.bio}
                </p>

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
