"use client";

import React from "react";
import { Project } from "@/data/projects";
import { FadeIn } from "@/components/ui/FadeIn";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function ProjectClient({ project }: { project: Project }) {
    const { t } = useLanguage();

    const statusLabels: Record<string, { text: { ru: string; en: string }; color: string }> = {
        active: { text: { ru: "Актив", en: "Active" }, color: "bg-green-500/20 text-green-400" },
        beta: { text: { ru: "Бета", en: "Beta" }, color: "bg-yellow-500/20 text-yellow-400" },
        archived: { text: { ru: "Архив", en: "Archived" }, color: "bg-gray-500/20 text-gray-400" },
    };

    const badge = statusLabels[project.status];

    return (
        <article className="py-12 px-4 md:px-0 max-w-3xl mx-auto w-full">
            <FadeIn delay={0.1}>
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm transition-colors mb-6 group opacity-60 hover:opacity-100">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {t({ ru: "Назад", en: "Back" })}
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{project.title}</h1>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.color}`}>{t(badge.text)}</span>
                    </div>

                    <p className="text-lg" style={{ color: 'var(--muted)' }}>{t(project.description)}</p>

                    {/* Технологии */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {project.stack.map((tech) => (
                            <span
                                key={tech}
                                className="text-xs font-medium px-3 py-1.5 rounded-full"
                                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Ссылки */}
                    <div className="flex gap-3 mt-6">
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                                style={{ background: 'var(--accent)', color: '#fff' }}>
                                <ExternalLink className="w-4 h-4" /> {t({ ru: "Демо", en: "Demo" })}
                            </a>
                        )}
                        {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                                <Github className="w-4 h-4" /> GitHub
                            </a>
                        )}
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.2} className="mt-10">
                <div
                    className="prose prose-lg max-w-none prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-headings:tracking-tight prose-pre:border prose-pre:border-current/10"
                    dangerouslySetInnerHTML={{ __html: simpleMarkdown(t(project.longDescription)) }}
                />
            </FadeIn>
        </article>
    );
}

/** Простейший рендер Markdown-подмножества для longDescription */
function simpleMarkdown(md: string): string {
    return md
        .trim()
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^\- \*\*(.+?)\*\* — (.+)$/gm, '<li><strong>$1</strong> — $2</li>')
        .replace(/^\- (.+)$/gm, '<li>$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n{2,}/g, '</p><p>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}
