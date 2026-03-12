"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Loader2, Link as LinkIcon, Calendar, Hash, CheckCircle2, ImagePlus, FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostItem {
    title: string;
    slug: string;
    date: string;
    tags: string;
    content: string;
}

export function EditorClient() {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [tags, setTags] = useState("");
    const [content, setContent] = useState("");

    const [posts, setPosts] = useState<PostItem[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        fetch("/api/admin/posts")
            .then(res => res.json())
            .then(data => {
                if (data.posts) setPosts(data.posts);
            })
            .catch(err => console.error("Error fetching posts", err))
            .finally(() => setLoadingPosts(false));
    }, []);

    const generateSlug = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!slug || generateSlug(title) === slug) {
            setSlug(generateSlug(newTitle));
        }
    };

    const loadPost = (p: PostItem) => {
        setTitle(p.title);
        setSlug(p.slug);
        setDate(p.date || new Date().toISOString().split("T")[0]);
        setTags(p.tags);
        setContent(p.content);
        setError("");
        setSuccess(false);
    };

    const handleNewPost = () => {
        setTitle("");
        setSlug("");
        setDate(new Date().toISOString().split("T")[0]);
        setTags("");
        setContent("");
        setError("");
        setSuccess(false);
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

            // Refresh post list
            fetch("/api/admin/posts").then(r => r.json()).then(d => {
                if (d.posts) setPosts(d.posts);
            });

            setTimeout(() => {
                setSuccess(false);
                router.refresh();
            }, 3000);

        } catch (err: any) {
            setError(err.message || "Ошибка публикации");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Ошибка загрузки картинки");

            const imageUrl = data.url;
            const imageMarkdown = `\n![${file.name}](${imageUrl})\n`;

            // Insert at cursor position if possible
            if (textareaRef.current) {
                const start = textareaRef.current.selectionStart;
                const end = textareaRef.current.selectionEnd;
                const currentContent = textareaRef.current.value;
                const newContent = currentContent.substring(0, start) + imageMarkdown + currentContent.substring(end);
                setContent(newContent);
                setTimeout(() => {
                    if (textareaRef.current) {
                        textareaRef.current.selectionStart = start + imageMarkdown.length;
                        textareaRef.current.selectionEnd = start + imageMarkdown.length;
                        textareaRef.current.focus();
                    }
                }, 0);
            } else {
                setContent(prev => prev + imageMarkdown);
            }
        } catch (err: any) {
            setError(err.message || "Failed to upload image");
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex h-[85vh]">

            {/* Sidebar with existing posts */}
            <div className="w-64 bg-zinc-950/50 border-r border-white/5 flex flex-col hidden md:flex shrink-0">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-900">
                    <h2 className="text-sm font-semibold text-zinc-300">Посты ({posts.length})</h2>
                    <button onClick={handleNewPost} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-zinc-300 transition-colors" title="Новый пост">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {loadingPosts ? (
                        <div className="p-4 flex justify-center"><Loader2 className="w-5 h-5 text-zinc-500 animate-spin" /></div>
                    ) : (
                        posts.map(p => (
                            <button
                                key={p.slug}
                                onClick={() => loadPost(p)}
                                className={`w-full text-left p-3 rounded-xl transition-colors text-sm flex items-start gap-3
                                    ${slug === p.slug && title === p.title ? 'bg-indigo-500/10 text-indigo-300' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
                            >
                                <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                                <div className="truncate min-w-0 flex-1">
                                    <div className="truncate font-medium">{p.title}</div>
                                    <div className="text-xs opacity-50 truncate">{p.date}</div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Editor */}
            <div className="flex-1 flex flex-col min-w-0 p-6 lg:p-8 overflow-y-auto custom-scrollbar bg-zinc-900">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold text-white mb-2 truncate">Написать пост</h1>
                        <p className="text-sm text-zinc-400 font-mono text-xs truncate">{slug || "новый-пост"}.md</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium transition-colors disabled:opacity-50"
                        >
                            {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                            <span className="hidden lg:inline">Картинка</span>
                        </button>

                        <button
                            onClick={handlePublish}
                            disabled={loading || success}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                success ? <CheckCircle2 className="w-5 h-5 text-green-300" /> :
                                    <Save className="w-5 h-5" />}
                            <span className="hidden sm:inline">{loading ? "Сохранение..." : success ? "Успех!" : "Сохранить"}</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 shrink-0">
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

                <div className="flex-1 flex flex-col relative min-h-[300px]">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Напишите текст поста здесь (поддерживается Markdown)..."
                        className="flex-1 w-full h-full bg-zinc-950/50 rounded-xl border border-white/5 p-6 text-zinc-300 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none leading-relaxed custom-scrollbar"
                    />
                </div>
            </div>

        </div>
    );
}
