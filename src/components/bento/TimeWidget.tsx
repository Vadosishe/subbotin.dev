"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function TimeWidget() {
    const [time, setTime] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("ru-RU", {
                    timeZone: "Asia/Tbilisi",
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );
        };
        update();
        setMounted(true);
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-default">
            <Clock className="w-5 h-5" />
            <span className="text-base font-mono font-medium tracking-tight whitespace-nowrap">{time} MSK</span>
        </div>
    );
}
