"use client";

import { motion } from "framer-motion";

const technologies = [
    "TypeScript", "React", "Next.js", "Node.js", "Python", "Tailwind CSS",
    "Framer Motion", "Git", "GitHub", "Vercel", "OpenAI", "Pinecone", "n8n", "Docker"
];

export function TechMarquee() {
    // We double the list to create a seamless loop
    const list = [...technologies, ...technologies, ...technologies];

    return (
        <div className="bento-card col-span-1 md:col-span-3 rounded-3xl p-6 overflow-hidden relative group">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-6 opacity-50 text-center">
                My Stack & Tools
            </h3>

            <div className="relative flex overflow-hidden">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 25,
                            ease: "linear",
                        },
                    }}
                    className="flex gap-8 whitespace-nowrap whitespace-nowrap"
                >
                    {list.map((tech, i) => (
                        <span
                            key={i}
                            className="text-xl md:text-2xl font-bold tracking-tight opacity-40 hover:opacity-100 hover:scale-110 transition-all cursor-default"
                        >
                            {tech}
                        </span>
                    ))}
                </motion.div>

                {/* Gradient overlays for smooth fade edges */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
}
