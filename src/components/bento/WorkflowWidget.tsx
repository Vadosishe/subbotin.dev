"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/data/siteConfig";
import { Database, Workflow, AppWindow, ExternalLink } from "lucide-react";

export function WorkflowWidget() {
    const { t } = useLanguage();
    const [currentScenario, setCurrentScenario] = useState(0);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    const config = siteConfig.ui.widgets.workflow;
    const scenarios = config.scenarios;
    const nodes = config.nodes;
    
    // Cycle through scenarios
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentScenario((prev) => (prev + 1) % scenarios.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [scenarios.length]);

    // Component for node content that switches between icon and text
    const NodeContent = ({ 
        id, 
        icon: Icon, 
        text, 
        isCenter = false 
    }: { 
        id: string, 
        icon: any, 
        text: { ru: string, en: string },
        isCenter?: boolean
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
                        className="absolute inset-0 flex items-center justify-center p-3 z-20 bg-[#0a0a0a] rounded-[inherit]"
                    >
                        <span className={`text-xs md:text-sm leading-tight text-center font-medium ${isCenter ? 'text-indigo-300' : 'text-white/90'}`}>
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
                        <Icon className={isCenter ? "text-indigo-400 group-hover:text-indigo-300 transition-colors" : "text-white/60 group-hover:text-white/90 transition-colors"} size={20} />
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

    return (
        <div className="flex flex-col h-full p-6 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden group/card">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-20 text-white/90">
                <span className="w-6 h-6 rounded border border-white/10 bg-white/5 text-white/70 flex items-center justify-center">
                    <Workflow size={14} />
                </span>
                {t(config.title)}
            </h2>

            <div className="flex-grow flex flex-col items-center justify-center relative z-10 w-full h-full min-h-[140px]">
                
                {/* Unified container for nodes and connecting lines for perfect alignment */}
                <div className="relative w-full max-w-[95%] h-28 flex items-center justify-between mx-auto">
                    
                    {/* Background track and animated data streams */}
                    <div className="absolute left-[15%] right-[15%] h-[2px] bg-white/[0.03] border-t border-dashed border-white/10 z-0">
                        <motion.div 
                            className="absolute -top-[1.5px] -translate-y-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                            initial={{ left: "0%", opacity: 0 }}
                            animate={{ left: "95%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div 
                            className="absolute -top-[1.5px] -translate-y-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-sky-400/80 to-transparent shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                            initial={{ left: "0%", opacity: 0 }}
                            animate={{ left: "95%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
                        />
                    </div>

                    {/* Node 1: Source */}
                    <motion.div
                        className={`transition-all duration-300 rounded-xl bg-[#0a0a0a] border flex items-center justify-center shadow-lg relative z-10 group cursor-help ${hoveredNode === 'source' ? 'w-36 h-24 border-white/30' : 'w-12 h-12 border-white/10'}`}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        onMouseEnter={() => setHoveredNode('source')}
                        onMouseLeave={() => setHoveredNode(null)}
                    >
                        <div className="absolute inset-0 bg-white/5 rounded-xl pointer-events-none transition-opacity" />
                        <NodeContent id="source" icon={Database} text={nodes.source} />
                    </motion.div>

                    {/* Node 2: Engine */}
                    <motion.div
                        className={`transition-all duration-300 rounded-2xl bg-[#0a0a0a] border flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.15)] relative z-10 group cursor-help ${hoveredNode === 'engine' ? 'w-44 h-28 border-indigo-500/60' : 'w-14 h-14 border-indigo-500/30'}`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        onMouseEnter={() => setHoveredNode('engine')}
                        onMouseLeave={() => setHoveredNode(null)}
                    >
                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                            <motion.div 
                                 className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-50"
                                 animate={{ rotate: 360 }}
                                 transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                        <NodeContent id="engine" icon={Workflow} text={nodes.engine} isCenter={true} />
                    </motion.div>

                    {/* Node 3: Output */}
                    <motion.div
                        className={`transition-all duration-300 rounded-xl bg-[#0a0a0a] border flex items-center justify-center shadow-lg relative z-10 group cursor-help ${hoveredNode === 'output' ? 'w-36 h-24 border-white/30' : 'w-12 h-12 border-white/10'}`}
                        animate={{ y: [0, 3, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        onMouseEnter={() => setHoveredNode('output')}
                        onMouseLeave={() => setHoveredNode(null)}
                    >
                        <div className="absolute inset-0 bg-white/5 rounded-xl pointer-events-none transition-opacity" />
                        <NodeContent id="output" icon={AppWindow} text={nodes.output} />
                    </motion.div>
                </div>

                {/* Value Proposition Link Text */}
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
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 text-xs md:text-sm font-medium text-indigo-300/70 hover:text-indigo-300 bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full border border-white/5 hover:border-indigo-500/30 transition-all tracking-wide shadow-sm"
                        >
                            <span>{t(scenarios[currentScenario])}</span>
                            <ExternalLink size={12} className="opacity-70" />
                        </motion.a>
                    </AnimatePresence>
                </div>
            </div>

            {/* Subtle light glow behind the center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />
        </div>
    );
}
