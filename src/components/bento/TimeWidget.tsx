"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function TimeWidget() {
    const [time, setTime] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const update = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Moscow",
                })
            );
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
            <Clock className="w-4 h-4 opacity-50" />
            <div className="flex flex-col">
                <span className="text-sm font-mono font-bold leading-none">{time}</span>
                <span className="text-[10px] opacity-40 leading-none mt-1">MSK</span>
            </div>
        </div>
    );
}
