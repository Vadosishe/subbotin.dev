"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, GitCommit, Star, ExternalLink, RefreshCw } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/components/LanguageProvider";

interface GitHubEvent {
    type: string;
    repo: { name: string };
    created_at: string;
    payload?: {
        commits?: Array<{ message: string }>;
        action?: string;
    };
}

export function GitHubWidget() {
    const [event, setEvent] = useState<GitHubEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    const fetchActivity = async () => {
        setLoading(true);
        try {
            const username = siteConfig.socials.github.split("/").pop();
            const res = await fetch(`https://api.github.com/users/${username}/events/public`);
            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
                setEvent(data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch GitHub activity:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, []);

    const getEventDescription = (event: GitHubEvent) => {
        switch (event.type) {
            case "PushEvent":
                return {
                    label: t({ ru: "Отправил в", en: "Pushed to" }),
                    icon: GitCommit,
                    detail: event.payload?.commits?.[0]?.message || (t({ ru: "Коммиты", en: "Commits" }))
                };
            case "WatchEvent":
                return {
                    label: t({ ru: "Оценил", en: "Starred" }),
                    icon: Star,
                    detail: t({ ru: "Проект", en: "Project" })
                };
            default:
                return {
                    label: t({ ru: "Активность в", en: "Activity in" }),
                    icon: Github,
                    detail: t({ ru: "Репозиторий", en: "Repository" })
                };
        }
    };

    const activity = event ? getEventDescription(event) : null;

    return (
        <div className="bento-card col-span-1 row-span-1 rounded-3xl p-6 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 opacity-20 transition-transform duration-700 group-hover:scale-110 pointer-events-none" style={{ background: 'var(--card-glow)' }} />

            <div className="relative z-10 flex justify-between items-start">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-indigo-500/30 transition-colors">
                    <Github className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">
                        {t(siteConfig.ui.github.live)}
                    </span>
                </div>
            </div>

            <div className="relative z-10 mt-4">
                {loading ? (
                    <div className="flex items-center gap-3 animate-pulse opacity-50">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-16 bg-zinc-800 rounded" />
                            <div className="h-3 w-24 bg-zinc-800 rounded" />
                        </div>
                    </div>
                ) : (event && activity) ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-1"
                    >
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                            {t(siteConfig.ui.github.title)}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <activity.icon className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="opacity-60">{activity.label}</span>
                            <span className="truncate max-w-[120px]">{event.repo.name.split("/").pop()}</span>
                        </div>
                        <p className="text-xs opacity-40 line-clamp-1 italic">
                            "{activity.detail}"
                        </p>
                    </motion.div>
                ) : (
                    <p className="text-xs opacity-40">{t({ ru: "Нет активности", en: "No recent activity" })}</p>
                )}
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between">
                <button
                    onClick={fetchActivity}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-zinc-600 hover:text-indigo-400"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <a
                    href={siteConfig.socials.github}
                    target="_blank"
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group/link"
                >
                    {t(siteConfig.ui.github.view)}
                    <ExternalLink className="w-3 h-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
            </div>
        </div>
    );
}
