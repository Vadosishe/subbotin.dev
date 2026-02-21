"use client";

import { motion } from "framer-motion";

const stack = [
    { name: "TypeScript", icon: "TS", color: "#3178C6" },
    { name: "React", icon: "⚛", color: "#61DAFB" },
    { name: "Next.js", icon: "N", color: "#ffffff" },
    { name: "Node.js", icon: "⬢", color: "#339933" },
    { name: "Python", icon: "🐍", color: "#3776AB" },
    { name: "Tailwind", icon: "🌊", color: "#06B6D4" },
];

export function TechStackWidget() {
    return (
        <div className="bento-card col-span-1 rounded-3xl p-6 flex flex-col h-full min-h-[140px]">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>
                Tech Stack
            </h3>
            <div className="grid grid-cols-3 gap-2 flex-grow items-center">
                {stack.map((tech, i) => (
                    <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 hover:scale-110 cursor-default"
                        title={tech.name}
                    >
                        <span className="text-lg" style={{ color: tech.color }}>
                            {tech.icon}
                        </span>
                        <span className="text-[10px] font-medium" style={{ color: 'var(--muted)' }}>
                            {tech.name}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
