"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogPostData } from "@/lib/markdown";
import { useLanguage } from "@/components/LanguageProvider";
import { siteConfig } from "@/data/siteConfig";

interface BlogWidgetProps {
    allPosts: BlogPostData[];
}

export function BlogWidget({ allPosts }: BlogWidgetProps) {
    const { t, lang } = useLanguage();

    // Фильтруем посты по текущему языку и берем последние 3
    const latestPosts = allPosts
        .filter(post => post.lang === lang)
        .slice(0, 3);

    return (
        <div className="h-full flex flex-col justify-between p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">✍️</span>
                    {t(siteConfig.ui.blog.latest)}
                </h2>
                <Link href="/blog" className="text-sm flex items-center gap-1 transition-opacity opacity-60 hover:opacity-100">
                    {t(siteConfig.ui.blog.all)} <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
                {latestPosts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.id}`}
                        className="group p-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between h-full"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                        <div>
                            <h3 className="font-semibold group-hover:text-emerald-400 mb-1 transition-colors">{post.title}</h3>
                            <p className="text-sm line-clamp-2" style={{ color: 'var(--muted)' }}>{post.excerpt}</p>
                        </div>
                        <span className="text-xs mt-4 block" style={{ color: 'var(--muted)' }}>{post.date}</span>
                    </Link>
                ))}
                {latestPosts.length === 0 && (
                    <p className="text-sm py-4" style={{ color: 'var(--muted)' }}>{t(siteConfig.ui.blog.empty)}</p>
                )}
            </div>
        </div>
    );
}
