"use client";

import { motion } from "framer-motion";

const technologies = [
    "TypeScript", "React", "Next.js", "Node.js", "Python", "Tailwind CSS",
    "Framer Motion", "Git", "GitHub", "Vercel", "OpenAI", "Pinecone", "n8n", "Docker"
];

export function TechMarquee() {
    const list = [...technologies, ...technologies, ...technologies];

    return (
        <div className="flex flex-col justify-center h-full p-6 overflow-hidden relative group min-h-[120px]">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest mb-4 opacity-30 text-center">
                Stack & Workflow
            </h3>

            <div className="relative flex overflow-hidden py-2">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                    className="flex gap-10 whitespace-nowrap"
                >
                    {list.map((tech, i) => (
                        <span
                            key={i}
                            className="text-lg md:text-xl font-bold tracking-tight opacity-40 hover:opacity-100 hover:scale-110 transition-all cursor-default select-none"
                        >
                            {tech}
                        </span>
                    ))}
                </motion.div>

                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
}
