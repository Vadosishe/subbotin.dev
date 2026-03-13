"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/components/LanguageProvider";
import { motion, useSpring, useTransform } from "framer-motion";
import { BarChart3 } from "lucide-react";

function AnimatedNumber({ value }: { value: number }) {
    const spring = useSpring(0, { bounce: 0, duration: 2500 });
    const display = useTransform(spring, (current) => Math.round(current));
    const [started, setStarted] = useState(false);

    useEffect(() => {
        spring.set(value);
        // Small delay to ensure the spring started animating properly
        const timer = setTimeout(() => setStarted(true), 50);
        return () => clearTimeout(timer);
    }, [spring, value]);

    return (
        <motion.span className="tabular-nums">
            {started ? display : "0"}
        </motion.span>
    );
}

export function MetricsWidget() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col h-full p-6 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden group">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10 text-current opacity-90">
                <span className="w-6 h-6 rounded border border-current/10 bg-current/5 opacity-70 flex items-center justify-center">
                    <BarChart3 size={14} />
                </span>
                {t(siteConfig.ui.widgets.metrics)}
            </h2>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 flex-grow relative z-10">
                {siteConfig.metrics.map((metric, idx) => (
                    <div key={idx} className="flex flex-col justify-center">
                        <div className="text-3xl lg:text-4xl font-black tracking-tight text-current opacity-90 flex transition-transform group-hover:scale-[1.02] origin-left items-baseline">
                            <AnimatedNumber value={metric.value} />
                            <span className="opacity-40 ml-1 text-xl font-bold">{metric.suffix}</span>
                        </div>
                        <p className="text-xs md:text-sm font-medium opacity-50 uppercase tracking-widest mt-1">
                            {t(metric.label)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Background decoration */}
            <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
        </div>
    );
}
