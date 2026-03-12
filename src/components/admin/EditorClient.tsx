"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Save, Loader2, Link as LinkIcon, Calendar, Hash, CheckCircle2, ImagePlus, FileText, Plus, Trash2, Bold, Italic, Code, Quote, List, ListOrdered } from "lucide-react";
import { useRouter } from "next/navigation";

// TipTap
import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import { KeyboardShortcuts } from './tiptap-extensions';

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
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // TipTap Editor setup
    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown.configure({
                html: false,
                transformPastedText: true,
                transformCopiedText: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Placeholder.configure({
                placeholder: 'Напишите текст поста здесь (команды: /, поддержка Markdown)...',
            }),
            KeyboardShortcuts.configure({
                onSave: () => {
                    handlePublishRef.current?.();
                }
            })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.storage.markdown.getMarkdown());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-indigo max-w-none focus:outline-none min-h-[300px] h-full',
            },
        },
    });

    // To use handlePublish inside TipTap extension
    const handlePublishRef = useRef<() => void>(null);

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

        if (editor) {
            editor.commands.setContent(p.content);
        }
    };

    const handleNewPost = () => {
        setTitle("");
        setSlug("");
        setDate(new Date().toISOString().split("T")[0]);
        setTags("");
        setContent("");
        setError("");
        setSuccess(false);

        if (editor) {
            editor.commands.setContent("");
        }
    };

    const handlePublish = useCallback(async () => {
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
    }, [title, slug, date, tags, content, router]);

    // Bind ref
    useEffect(() => {
        // @ts-ignore
        handlePublishRef.current = handlePublish;
    }, [handlePublish]);


    const handleDelete = async () => {
        if (!slug) return;
        if (!confirm(`Вы уверены, что хотите удалить пост "${title || slug}"?`)) return;

        setError("");
        setDeleting(true);

        try {
            const res = await fetch(`/api/admin/post?slug=${slug}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Ошибка удаления");
            }

            // Refresh post list
            fetch("/api/admin/posts").then(r => r.json()).then(d => {
                if (d.posts) setPosts(d.posts);
            });

            handleNewPost();
            router.refresh();

        } catch (err: any) {
            setError(err.message || "Ошибка удаления");
        } finally {
            setDeleting(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

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

            // Insert using tiptap
            editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
            // This will trigger onUpdate, which updates the markdown `content` state

        } catch (err: any) {
            setError(err.message || "Failed to upload image");
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor]);

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
                    <div className="min-w-0 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-white mb-2 truncate">Написать пост</h1>
                            <p className="text-sm text-zinc-400 font-mono text-xs truncate">{slug || "новый-пост"}.md</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {posts.some(p => p.slug === slug) && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting || loading}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors disabled:opacity-50"
                                title="Удалить пост"
                            >
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                <span className="hidden lg:inline">Удалить</span>
                            </button>
                        )}
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
                            <span className="hidden sm:inline">{loading ? "..." : success ? "Успех!" : "Сохранить"}</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex-shrink-0">
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

                {/* TipTap Editor */}
                <div className="flex-1 flex flex-col relative w-full bg-zinc-950/50 rounded-xl border border-white/5 px-6 py-4 custom-scrollbar overflow-y-auto">
                    {editor && (
                        <BubbleMenu
                            editor={editor}
                            tippyOptions={{ duration: 100 }}
                            className="flex items-center bg-zinc-800 border border-white/10 shadow-2xl rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={`p-2 hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'text-indigo-400 bg-white/5' : 'text-zinc-300'}`}
                            >
                                <Bold className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={`p-2 hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'text-indigo-400 bg-white/5' : 'text-zinc-300'}`}
                            >
                                <Italic className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleCode().run()}
                                className={`p-2 hover:bg-white/10 transition-colors ${editor.isActive('code') ? 'text-indigo-400 bg-white/5' : 'text-zinc-300'}`}
                            >
                                <Code className="w-4 h-4" />
                            </button>
                            <button
                                onClick={setLink}
                                className={`p-2 hover:bg-white/10 transition-colors ${editor.isActive('link') ? 'text-indigo-400 bg-white/5' : 'text-zinc-300'}`}
                            >
                                <LinkIcon className="w-4 h-4" />
                            </button>
                            <div className="w-px h-6 bg-white/10 mx-1" />
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={`px-2 py-1 text-sm font-bold hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-indigo-400 bg-white/5' : 'text-zinc-300'}`}
                            >
                                H2
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                className={`px-2 py-1 text-sm font-bold hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'text-indigo-400 bg-white/5' : 'text-zinc-300'}`}
                            >
                                H3
                            </button>
                            <div className="w-px h-6 bg-white/10 mx-1" />
                            <button
                                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                className={`p-2 hover:bg-white/10 transition-colors ${editor.isActive('blockquote') ? 'text-indigo-400 bg-white/5' : 'text-zinc-300'}`}
                            >
                                <Quote className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                className={`p-2 hover:bg-white/10 transition-colors ${editor.isActive('bulletList') ? 'text-indigo-400 bg-white/5' : 'text-zinc-300'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </BubbleMenu>
                    )}
                    <EditorContent editor={editor} className="flex-1 min-h-[300px]" />
                </div>

                <div className="mt-4 text-xs font-mono text-zinc-500 opacity-50 flex justify-between items-center shrink-0">
                    <p>TipTap Markdown Editor / Поддерживает Ctrl+S</p>
                    <p>{content.length} characters</p>
                </div>
            </div>

        </div>
    );
}
