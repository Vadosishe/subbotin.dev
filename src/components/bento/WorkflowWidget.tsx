"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/data/siteConfig";
import { Database, Workflow, AppWindow, ExternalLink } from "lucide-react";

// 1. Выносим вспомогательный компонент наружу, чтобы не пересоздавать его при каждом рендере
const NodeContent = ({
    id,
    icon: Icon,
    text,
    isCenter = false,
    hoveredNode,
    t
}: {
    id: string,
    icon: any,
    text: { ru: string, en: string },
    isCenter?: boolean,
    hoveredNode: string | null,
    t: any
}) => {
    const isHovered = hoveredNode === id;

    return (
        <AnimatePresence mode="wait">
            {isHovered ? (
                <motion.div
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.15 } }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    className="absolute inset-0 flex items-center justify-center p-3 z-20 rounded-[inherit]"
                    style={{ background: 'var(--background)' }}
                >
                    <span className={`text-xs md:text-sm leading-tight text-center font-medium ${isCenter ? 'text-indigo-300' : 'text-current opacity-90'}`}>
                        {t(text)}
                    </span>
                </motion.div>
            ) : (
                <motion.div
                    key="icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                >
                    <Icon className={isCenter ? "text-indigo-400 group-hover:text-indigo-300 transition-colors" : "opacity-60 group-hover:opacity-90 transition-opacity"} size={20} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// 2. Оставляем ТОЛЬКО ОДНО объявление экспорта
export function WorkflowWidget() {
    const { t } = useLanguage();
    const [currentScenario, setCurrentScenario] = useState(0);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    const config = siteConfig.ui.widgets.workflow;
    const scenarios = config.scenarios;
    const nodes = config.nodes;

    // Цикл смены сценариев
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentScenario((prev) => (prev + 1) % scenarios.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [scenarios.length]);

    return (
        <div className="flex flex-col h-full p-6 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden group/card">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-20 text-current opacity-90">
                <span className="w-6 h-6 rounded border border-current/10 bg-current/5 opacity-70 flex items-center justify-center">
                    <Workflow size={14} />
                </span>
                {t(config.title)}
            </h2>

            <div className="flex-grow flex flex-col items-center justify-center relative z-10 w-full h-full min-h-[140px]">
                <div className="relative w-full max-w-[95%] h-28 flex items-center justify-between mx-auto">

                    {/* Линии и потоки данных */}
                    <div className="absolute left-[15%] right-[15%] h-[2px] bg-current/[0.03] border-t border-dashed border-current/10 z-0">
                        <motion.div
                            className="absolute -top-[1.5px] -translate-y-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                            initial={{ left: "0%", opacity: 0 }}
                            animate={{ left: "95%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    {/* Узлы (Nodes) */}
                    <motion.div
                        className={`transition-all duration-300 rounded-xl border flex items-center justify-center shadow-lg relative z-10 group cursor-help ${hoveredNode === 'source' ? 'w-36 h-24 border-current/30' : 'w-12 h-12 border-current/10'}`}
                        style={{ background: 'var(--background)' }}
                        onMouseEnter={() => setHoveredNode('source')}
                        onMouseLeave={() => setHoveredNode(null)}
                    >
                        <NodeContent id="source" icon={Database} text={nodes.source} hoveredNode={hoveredNode} t={t} />
                    </motion.div>

                    <motion.div
                        className={`transition-all duration-300 rounded-2xl border flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.15)] relative z-10 group cursor-help ${hoveredNode === 'engine' ? 'w-44 h-28 border-indigo-500/60' : 'w-14 h-14 border-indigo-500/30'}`}
                        style={{ background: 'var(--background)' }}
                        onMouseEnter={() => setHoveredNode('engine')}
                        onMouseLeave={() => setHoveredNode(null)}
                    >
                        <NodeContent id="engine" icon={Workflow} text={nodes.engine} isCenter={true} hoveredNode={hoveredNode} t={t} />
                    </motion.div>

                    <motion.div
                        className={`transition-all duration-300 rounded-xl border flex items-center justify-center shadow-lg relative z-10 group cursor-help ${hoveredNode === 'output' ? 'w-36 h-24 border-current/30' : 'w-12 h-12 border-current/10'}`}
                        style={{ background: 'var(--background)' }}
                        onMouseEnter={() => setHoveredNode('output')}
                        onMouseLeave={() => setHoveredNode(null)}
                    >
                        <NodeContent id="output" icon={AppWindow} text={nodes.output} hoveredNode={hoveredNode} t={t} />
                    </motion.div>
                </div>

                {/* Ссылка на сценарий */}
                <div className="mt-8 h-8 flex items-center justify-center relative z-20 w-full text-center">
                    <AnimatePresence mode="wait">
                        <motion.a
                            key={currentScenario}
                            href={scenarios[currentScenario].link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-2 text-xs md:text-sm font-medium text-indigo-400 hover:text-indigo-400/80 bg-current/5 hover:bg-current/10 px-4 py-1.5 rounded-full border border-current/5"
                        >
                            <span>{t(scenarios[currentScenario])}</span>
                            <ExternalLink size={12} className="opacity-70" />
                        </motion.a>
                    </AnimatePresence>
                </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />
        </div>
    );
}