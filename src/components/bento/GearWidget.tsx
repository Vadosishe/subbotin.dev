"use client";

import { Laptop, Monitor, Keyboard, Mouse } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

const iconMap: Record<string, any> = {
    Laptop: Laptop,
    Monitor: Monitor,
    Keyboard: Keyboard,
    Mouse: Mouse,
};

export function GearWidget() {
    return (
        <div className="bento-card col-span-1 md:col-span-1 row-span-2 rounded-3xl p-6 flex flex-col h-full bg-gradient-to-br from-indigo-500/5 to-transparent">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm">💻</span>
                Рабочее место
            </h2>

            <div className="flex flex-col gap-4 flex-grow">
                {siteConfig.gear.map((item, idx) => {
                    return (
                        <div
                            key={idx}
                            className="flex items-start gap-4 p-3 rounded-2xl transition-all duration-200"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                        >
                            <div className="text-xl mt-1">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold">{item.name}</h3>
                                <p className="text-[10px] opacity-60 leading-tight mt-0.5">{item.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-current/5">
                <p className="text-[10px] italic opacity-50 text-center">
                    "Focus is the key to productivity"
                </p>
            </div>
        </div>
    );
}
