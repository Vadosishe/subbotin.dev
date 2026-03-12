"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/components/LanguageProvider";
import GitHubCalendar from "react-github-calendar";

export function GitHubWidget() {
    const { t } = useLanguage();
    const username = siteConfig.socials.github.split("/").pop() || "Vadosishe";

    return (
        <div className="p-6 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 opacity-20 transition-transform duration-700 group-hover:scale-110 pointer-events-none" style={{ background: 'var(--card-glow)' }} />

            <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-indigo-500/30 transition-colors">
                    <Github className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">
                        Активность
                    </span>
                </div>
            </div>

            <div className="relative z-10 my-4 flex-1 flex flex-col justify-center w-full overflow-hidden">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
                    Контрибьюшены за последний год
                </p>
                <div className="w-full overflow-x-auto custom-scrollbar flex items-center justify-start pb-2">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="scale-90 origin-left"
                    >
                        <GitHubCalendar
                            username={username}
                            colorScheme="dark"
                            hideTotalCount={false}
                            hideColorLegend={true}
                            labels={{
                                totalCount: '{{count}} коммитов за год',
                            }}
                            theme={{
                                dark: ['rgba(255,255,255,0.05)', '#4f46e5', '#4338ca', '#3730a3', '#312e81']
                            }}
                        />
                    </motion.div>
                </div>
            </div>

            <div className="relative z-10 mt-auto flex items-center justify-end">
                <a
                    href={siteConfig.socials.github}
                    target="_blank"
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group/link"
                >
                    {t(siteConfig.ui.github.view)}
                    <ExternalLink className="w-3 h-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
            </div>
        </div>
    );
}
