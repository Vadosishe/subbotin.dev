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
                    second: "2-digit",
                    timeZone: "Europe/Moscow",
                })
            );
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) {
        return (
            <div className="bento-card col-span-1 rounded-3xl p-6 flex flex-col justify-center items-center text-center h-full min-h-[140px]">
                <Clock className="w-5 h-5 mb-2" style={{ color: 'var(--muted)' }} />
                <span className="text-2xl font-mono font-bold tracking-widest">--:--:--</span>
                <span className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Москва (UTC+3)</span>
            </div>
        );
    }

    return (
        <div className="bento-card col-span-1 rounded-3xl p-6 flex flex-col justify-center items-center text-center h-full min-h-[140px]">
            <Clock className="w-5 h-5 mb-2" style={{ color: 'var(--muted)' }} />
            <span className="text-2xl font-mono font-bold tracking-widest">{time}</span>
            <span className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Москва (UTC+3)</span>
        </div>
    );
}
