"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, GitCommitHorizontal, GitBranch, GitPullRequest, CircleDot, Star, GitFork, Trash2 } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/components/LanguageProvider";

interface ActivityEvent {
    id: string;
    type: string;
    icon: string;
    repo: string;
    repoFull: string;
    description: string;
    url: string;
    date: string;
}

function timeAgo(dateStr: string, lang: "ru" | "en"): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (lang === "ru") {
        if (minutes < 60) return `${minutes} мин. назад`;
        if (hours < 24) return `${hours} ч. назад`;
        return `${days} дн. назад`;
    } else {
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }
}

function EventIcon({ iconType }: { iconType: string }) {
    const cls = "w-4 h-4 shrink-0";
    switch (iconType) {
        case "push": return <GitCommitHorizontal className={cls} />;
        case "create": return <GitBranch className={cls} />;
        case "pr": return <GitPullRequest className={cls} />;
        case "issue": return <CircleDot className={cls} />;
        case "star": return <Star className={cls} />;
        case "fork": return <GitFork className={cls} />;
        case "delete": return <Trash2 className={cls} />;
        default: return <GitCommitHorizontal className={cls} />;
    }
}

function SkeletonRow() {
    return (
        <div className="flex items-center gap-3 py-2.5 animate-pulse">
            <div className="w-3.5 h-3.5 rounded-full bg-white/10 shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="h-2.5 bg-white/10 rounded w-3/4 mb-1.5" />
                <div className="h-2 bg-white/5 rounded w-1/3" />
            </div>
            <div className="h-2 bg-white/5 rounded w-10 shrink-0" />
        </div>
    );
}

export function GitHubWidget() {
    const { t, lang } = useLanguage();
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/github/activity")
            .then(r => r.json())
            .then(data => setEvents(data.activity ?? []))
            .catch(() => setEvents([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6 flex flex-col justify-between h-full relative overflow-hidden group">
            {/* Glow */}
            <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 opacity-20 transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                style={{ background: "var(--card-glow)" }}
            />

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-indigo-500/30 transition-colors">
                    <Github className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs md:text-sm font-bold text-green-500 uppercase tracking-tighter">
                        {t(siteConfig.ui.github.live)}
                    </span>
                </div>
            </div>

            {/* Section label */}
            <p className="relative z-10 text-xs md:text-sm font-bold uppercase tracking-widest text-zinc-500 mb-3">
                {t(siteConfig.ui.github.latestEvents)}
            </p>

            {/* Activity Feed */}
            <div className="relative z-10 flex-1 flex flex-col gap-0.5 overflow-hidden">
                {loading ? (
                    <>
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                    </>
                ) : events.length === 0 ? (
                    <p className="text-sm text-zinc-600 italic py-2">{t(siteConfig.ui.github.noActivity)}</p>
                ) : (
                    events.map((event, i) => (
                        <motion.a
                            key={event.id}
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.3 }}
                            className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-white/5 transition-colors group/item cursor-pointer"
                        >
                            {/* Icon */}
                            <span className="text-indigo-400/70 group-hover/item:text-indigo-400 transition-colors">
                                <EventIcon iconType={event.icon} />
                            </span>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate leading-tight">
                                    {event.description}
                                </p>
                                <p className="text-xs text-zinc-500 truncate mt-0.5">
                                    {event.repo}
                                </p>
                            </div>

                            {/* Time */}
                            <span className="text-xs text-zinc-500 shrink-0">
                                {timeAgo(event.date, lang)}
                            </span>
                        </motion.a>
                    ))
                )}
            </div>

            {/* Footer link */}
            <div className="relative z-10 mt-4 flex items-center justify-end">
                <a
                    href={siteConfig.socials.github}
                    target="_blank"
                    className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group/link"
                >
                    {t(siteConfig.ui.github.view)}
                    <ExternalLink className="w-4 h-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
            </div>
        </div>
    );
}
