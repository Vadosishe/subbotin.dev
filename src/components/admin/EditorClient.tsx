"use client";

import { useState } from "react";
import { Save, Loader2, Link as LinkIcon, Calendar, Hash, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function EditorClient() {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [tags, setTags] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const generateSlug = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')       // Replace spaces with -
            .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
            .replace(/\-\-+/g, '-')     // Replace multiple - with single -
            .replace(/^-+/, '')         // Trim - from start of text
            .replace(/-+$/, '');        // Trim - from end of text
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // Only auto-generate slug if user hasn't typed a custom one (or if it's empty)
        if (!slug || generateSlug(title) === slug) {
            setSlug(generateSlug(newTitle));
        }
    };

    const handlePublish = async () => {
        if (!title || !slug || !content) {
            setError("Поля Заголовок, Slug и Текст обязательны");
            return;
        }

        setError("");
        setLoading(true);
        setSuccess(false);

        try {
            const res = await fetch("/api/admin/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, slug, date, tags, content }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Неизвестная ошибка");
            }

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setTitle("");
                setSlug("");
                setTags("");
                setContent("");
                router.refresh(); // Refresh to potentially show new data if we fetch it
            }, 3000);

        } catch (err: any) {
            setError(err.message || "Ошибка публикации");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-zinc-900 border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col h-[85vh] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Написать пост</h1>
                    <p className="text-sm text-zinc-400">Публикация напрямую в GitHub репозиторий</p>
                </div>

                <button
                    onClick={handlePublish}
                    disabled={loading || success}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> :
                        success ? <CheckCircle2 className="w-5 h-5 text-green-300" /> :
                            <Save className="w-5 h-5" />}
                    {loading ? "Публикация..." : success ? "Опубликовано!" : "Опубликовать"}
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Заголовок длинный и броский..."
                        className="w-full text-xl lg:text-3xl font-bold bg-transparent border-b-2 border-white/10 pb-2 focus:border-indigo-500 transition-colors text-white placeholder-zinc-600 focus:outline-none"
                    />
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="url-posta"
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 border border-white/5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 border border-white/5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="automation, life, tech"
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 border border-white/5 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col relative min-h-0">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Напишите текст поста здесь (поддерживается Markdown)..."
                    className="flex-1 w-full bg-zinc-950/50 rounded-xl border border-white/5 p-6 text-zinc-300 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none"
                    style={{ minHeight: "100px" }}
                />
            </div>

        </div>
    );
}
