"use client";

import { useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/components/LanguageProvider";
import * as LucideIcons from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function TechMarquee() {
    const { t } = useLanguage();
    const [hoveredSkill, setHoveredSkill] = useState<typeof siteConfig.skills[0] | null>(null);

    // Duplicate list for seamless marquee loop
    const list = [...siteConfig.skills, ...siteConfig.skills, ...siteConfig.skills];

    return (
        <div className="flex flex-col justify-center h-full p-4 overflow-hidden relative group min-h-[140px]">
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .scrolling-content {
                    width: max-content;
                    animation: scroll 40s linear infinite;
                }
                .marquee-container:hover .scrolling-content {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="h-[50px] mb-2 flex flex-col items-center justify-end">
                <AnimatePresence mode="wait">
                    {hoveredSkill ? (
                        <motion.div
                            key={hoveredSkill.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="text-center w-full"
                        >
                            <h3 className="text-sm font-bold text-indigo-400 mb-1">{hoveredSkill.name}</h3>
                            <p className="text-xs md:text-sm opacity-80 leading-snug max-w-[95%] mx-auto">
                                {t(hoveredSkill.description)}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="default"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center justify-center h-full"
                        >
                            <h3 className="text-sm font-medium opacity-40 text-center mb-1">
                                {t(siteConfig.ui.skills.title)}
                            </h3>
                            <p className="text-xs opacity-30">{t(siteConfig.ui.skills.hoverPrompt)}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="relative flex overflow-hidden py-4 marquee-container">
                <div className="flex gap-8 scrolling-content">
                    {list.map((skill, i) => {
                        const Icon = (LucideIcons as any)[skill.icon] || LucideIcons.Code2;
                        const isHovered = hoveredSkill?.name === skill.name;
                        const isAnyHovered = hoveredSkill !== null;
                        
                        return (
                            <div
                                key={i}
                                className={`flex items-center gap-2 transition-all duration-300 cursor-default select-none py-1
                                    ${isAnyHovered ? (isHovered ? 'opacity-100 scale-110 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'opacity-20 blur-[1px]') : 'opacity-50 hover:opacity-100'}`}
                                onMouseEnter={() => setHoveredSkill(skill)}
                                onMouseLeave={() => setHoveredSkill(null)}
                            >
                                <Icon size={24} className={isHovered ? "text-indigo-400" : ""} />
                                <span className="text-lg md:text-xl font-bold tracking-tight">
                                    {skill.name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
}
