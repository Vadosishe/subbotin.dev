"use client";

import * as LucideIcons from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export function GearWidget() {
    return (
        <div className="flex flex-col h-full p-6 bg-gradient-to-br from-indigo-500/5 to-transparent">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs">🛠️</span>
                Gear
            </h2>

            <div className="grid grid-cols-1 gap-2 flex-grow">
                {siteConfig.gear.map((item, idx) => {
                    // Dynamic Lucide icon lookup
                    const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle;

                    return (
                        <div
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded-xl transition-all duration-200"
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                        >
                            <div className="text-indigo-400 opacity-80">
                                <IconComponent size={18} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <h3 className="text-xs font-semibold truncate">{item.name}</h3>
                                <p className="text-[9px] opacity-40 truncate">{item.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
