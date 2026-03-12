"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
    Save, Loader2, Link as LinkIcon, Calendar, Hash,
    CheckCircle2, ImagePlus, FileText, Plus, Trash2,
    Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
    ExternalLink, Code, Code2, Quote, List, ListOrdered,
    BookOpen, FolderOpen, Globe, Github as GithubIcon, Tag, Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { KeyboardShortcuts } from "./tiptap-extensions";

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = "posts" | "projects";

interface PostItem {
    title: string; slug: string; date: string; tags: string; content: string;
}

interface ProjectItem {
    title: string; slug: string; date: string;
    stack: string; description: string;
    link: string; github: string;
    status: "active" | "beta" | "archived";
    content: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlug(text: string) {
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

// ─── Bubble Menu Button ───────────────────────────────────────────────────────

function BubBtn({
    active, onClick, title, children,
}: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
    return (
        <button
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            title={title}
            className={`flex items-center justify-center w-8 h-8 rounded transition-colors
        ${active ? "bg-indigo-500/30 text-indigo-300" : "text-zinc-300 hover:bg-white/10 hover:text-white"}`}
        >
            {children}
        </button>
    );
}

// ─── Sidebar Item ─────────────────────────────────────────────────────────────

function SidebarItem({
    title, subtitle, active, onClick,
}: { title: string; subtitle?: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-3 rounded-xl transition-colors text-sm flex items-start gap-3
        ${active ? "bg-indigo-500/10 text-indigo-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`}
        >
            <FileText className="w-4 h-4 mt-0.5 shrink-0 opacity-60" />
            <div className="truncate min-w-0 flex-1">
                <div className="truncate font-medium">{title}</div>
                {subtitle && <div className="text-xs opacity-50 truncate mt-0.5">{subtitle}</div>}
            </div>
        </button>
    );
}

// ─── Floating Bubble Menu ──────────────────────────────────────────────────────

function Sep() {
    return <div className="w-px h-5 bg-white/10 mx-0.5" />;
}

function FloatingBubbleMenu({
    editor,
    showLinkInput, setShowLinkInput,
    linkInput, setLinkInput,
    linkInputRef,
    applyLink,
}: {
    editor: Editor;
    showLinkInput: boolean;
    setShowLinkInput: (v: boolean) => void;
    linkInput: string;
    setLinkInput: (v: string) => void;
    linkInputRef: React.RefObject<HTMLInputElement | null>;
    applyLink: () => void;
}) {
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
    const [visible, setVisible] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function update() {
            const { from, to } = editor.state.selection;
            if (from === to) { setVisible(false); return; }

            const sel = window.getSelection();
            if (!sel || sel.rangeCount === 0) { setVisible(false); return; }
            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (!rect || rect.width === 0) { setVisible(false); return; }

            const menuH = menuRef.current?.offsetHeight || 40;
            setPos({
                top: rect.top - menuH - 8,
                left: rect.left + rect.width / 2,
            });
            setVisible(true);
        }

        editor.on("selectionUpdate", update);
        editor.on("blur", () => { if (!showLinkInput) setVisible(false); });
        return () => { editor.off("selectionUpdate", update); };
    }, [editor, showLinkInput]);

    if (!visible && !showLinkInput) return null;

    const menu = (
        <div
            ref={menuRef}
            style={pos
                ? { position: "fixed", top: pos.top, left: pos.left, transform: "translateX(-50%)", zIndex: 9999 }
                : { position: "fixed", visibility: "hidden" }}
            className="flex items-center gap-0.5 px-1.5 py-1 rounded-xl border border-white/10 bg-zinc-900/97 backdrop-blur-md shadow-xl shadow-black/50"
        >
            {/* ─ Text styles ─ */}
            <BubBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold (Ctrl+B)">
                <Bold className="w-3.5 h-3.5" />
            </BubBtn>
            <BubBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic (Ctrl+I)">
                <Italic className="w-3.5 h-3.5" />
            </BubBtn>
            <BubBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
                <Strikethrough className="w-3.5 h-3.5" />
            </BubBtn>
            <BubBtn active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code">
                <Code className="w-3.5 h-3.5" />
            </BubBtn>

            <Sep />

            {/* ─ Headings ─ */}
            <BubBtn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="H1">
                <Heading1 className="w-3.5 h-3.5" />
            </BubBtn>
            <BubBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2">
                <Heading2 className="w-3.5 h-3.5" />
            </BubBtn>
            <BubBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="H3">
                <Heading3 className="w-3.5 h-3.5" />
            </BubBtn>

            <Sep />

            {/* ─ Blocks ─ */}
            <BubBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote ( > )">
                <Quote className="w-3.5 h-3.5" />
            </BubBtn>
            <BubBtn active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code block ( ``` )">
                <Code2 className="w-3.5 h-3.5" />
            </BubBtn>
            <BubBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list ( - )">
                <List className="w-3.5 h-3.5" />
            </BubBtn>
            <BubBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list ( 1. )">
                <ListOrdered className="w-3.5 h-3.5" />
            </BubBtn>

            <Sep />

            {/* ─ Link ─ */}
            {showLinkInput ? (
                <div className="flex items-center gap-1">
                    <input
                        ref={linkInputRef}
                        type="text"
                        value={linkInput}
                        onChange={e => setLinkInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") applyLink(); if (e.key === "Escape") setShowLinkInput(false); }}
                        placeholder="https://…"
                        className="w-40 px-2 py-0.5 text-xs rounded bg-zinc-800 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                        onMouseDown={e => { e.preventDefault(); applyLink(); }}
                        className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold px-1"
                    >
                        OK
                    </button>
                </div>
            ) : (
                <BubBtn
                    active={editor.isActive("link")}
                    onClick={() => {
                        setLinkInput(editor.getAttributes("link").href || "");
                        setShowLinkInput(true);
                        setTimeout(() => linkInputRef.current?.focus(), 50);
                    }}
                    title="Link"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                </BubBtn>
            )}
        </div>
    );

    return typeof document !== "undefined" ? createPortal(menu, document.body) : null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EditorClient() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleSaveRef = useRef<(() => void) | null>(null);

    // ── Mode ──
    const [mode, setMode] = useState<Mode>("posts");

    // ── Shared fields ──
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");

    // ── Post fields ──
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [tags, setTags] = useState("");

    // ── Project fields ──
    const [description, setDescription] = useState("");
    const [stack, setStack] = useState("");
    const [projectLink, setProjectLink] = useState("");
    const [projectGithub, setProjectGithub] = useState("");
    const [projectStatus, setProjectStatus] = useState<"active" | "beta" | "archived">("active");
    const [autoTranslate, setAutoTranslate] = useState(false);

    // Вспомогательная функция для перевода через API
    const translateText = async (text: string, type: 'title' | 'content') => {
        try {
            const res = await fetch('/api/admin/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, type })
            });
            const data = await res.json();
            if (data.success) return data.translated;
            console.error("Translate err:", data.error);
            return text; // fallback
        } catch (e) {
            console.error("Translate fetch err:", e);
            return text;
        }
    };

    // ── Lists ──
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loadingList, setLoadingList] = useState(true);

    // ── UI state ──
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [success, setSuccess] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [linkInput, setLinkInput] = useState("");
    const [showLinkInput, setShowLinkInput] = useState(false);
    const linkInputRef = useRef<HTMLInputElement>(null);

    // ── Editor ──
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Markdown.configure({ html: false, transformPastedText: true, transformCopiedText: true }),
            Link.configure({ openOnClick: false }),
            Image,
            Placeholder.configure({
                placeholder: "Пишите здесь… поддерживается Markdown",
            }),
            KeyboardShortcuts.configure({
                onSave: () => handleSaveRef.current?.(),
            }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
            setContent((editor.storage as any).markdown.getMarkdown());
        },
        editorProps: {
            attributes: {
                class: "prose prose-invert prose-indigo max-w-none focus:outline-none min-h-[300px] h-full",
            },
        },
    });

    // ── Sync handleSave ref ──
    const handleSave = useCallback(async () => {
        if (!title || !slug) { setError("Заголовок и slug обязательны"); return; }
        setError(""); setLoading(true); setSuccess(false);

        try {
            const endpoint = mode === "posts" ? "/api/admin/post" : "/api/admin/project";
            
            // Base payload for RU version
            const body: any = mode === "posts"
                ? { title, slug, date, tags, content }
                : { title, slug, date, content, description, stack, link: projectLink, github: projectGithub, status: projectStatus };

            // 2. Если включен автоперевод, переводим и прикрепляем EN версию к основному запросу
            if (autoTranslate) {
                const enTitle = await translateText(title, 'title');
                const enDesc = (mode === "projects" && description) ? await translateText(description, 'title') : "";
                const enContent = await translateText(content, 'content');
                
                body.titleEn = enTitle;
                body.descriptionEn = enDesc;
                body.contentEn = enContent;
            }

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Ошибка сохранения");

            setSuccess(true);
            refreshList();
            setTimeout(() => { setSuccess(false); router.refresh(); }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [title, slug, date, tags, content, description, stack, projectLink, projectGithub, projectStatus, mode, router, autoTranslate]);

    useEffect(() => { handleSaveRef.current = handleSave; }, [handleSave]);

    // ── Load list ──
    function refreshList() {
        setLoadingList(true);
        const endpoint = mode === "posts" ? "/api/admin/posts" : "/api/admin/projects";
        fetch(endpoint)
            .then(r => r.json())
            .then(d => {
                if (mode === "posts" && d.posts) setPosts(d.posts);
                if (mode === "projects" && d.projects) setProjects(d.projects);
            })
            .catch(console.error)
            .finally(() => setLoadingList(false));
    }

    useEffect(() => { refreshList(); }, [mode]);

    // ── Helper: set markdown content into editor as rich text ──
    function setEditorMarkdown(md: string) {
        if (!editor) return;
        try {
            const parsed = (editor.storage as any).markdown.parse(md);
            editor.commands.setContent(parsed);
        } catch {
            editor.commands.setContent(md);
        }
    }

    // ── Reset form ──
    function resetForm() {
        setTitle(""); setSlug(""); setContent(""); setDate(new Date().toISOString().split("T")[0]);
        setTags(""); setDescription(""); setStack(""); setProjectLink("");
        setProjectGithub(""); setProjectStatus("active");
        setError(""); setSuccess(false);
        editor?.commands.setContent("");
    }

    // ── Load post ──
    function loadPost(p: PostItem) {
        setTitle(p.title); setSlug(p.slug); setDate(p.date || "");
        setTags(Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "");
        setContent(p.content); setError(""); setSuccess(false);
        setEditorMarkdown(p.content);
    }

    // ── Load project ──
    function loadProject(p: ProjectItem) {
        setTitle(p.title); setSlug(p.slug); setDate(p.date || "");
        setDescription(p.description || "");
        setStack(Array.isArray(p.stack) ? p.stack.join(", ") : p.stack || "");
        setProjectLink(p.link || ""); setProjectGithub(p.github || "");
        setProjectStatus(p.status || "active"); setContent(p.content);
        setError(""); setSuccess(false);
        setEditorMarkdown(p.content);
    }

    // ── Delete ──
    async function handleDelete() {
        if (!slug) return;
        if (!confirm(`Удалить "${title || slug}"?`)) return;
        setDeleting(true); setError("");
        try {
            const endpoint = mode === "posts" ? `/api/admin/post?slug=${slug}` : `/api/admin/project?slug=${slug}`;
            const res = await fetch(endpoint, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Ошибка удаления");
            refreshList(); resetForm(); router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    }

    // ── Image upload ──
    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !editor) return;
        setUploadingImage(true); setError("");
        try {
            const fd = new FormData(); fd.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Ошибка загрузки");
            editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    // ── Link set ──
    function applyLink() {
        if (!editor) return;
        const url = linkInput.trim();
        if (!url) { editor.chain().focus().extendMarkRange("link").unsetLink().run(); }
        else { editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run(); }
        setShowLinkInput(false); setLinkInput("");
    }

    // ── Derived ──
    const existingSlugs = mode === "posts" ? posts.map(p => p.slug) : projects.map(p => p.slug);
    const isExisting = existingSlugs.includes(slug);

    return (
        <div className="w-full bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex h-[88vh]">

            {/* ─── Sidebar ─────────────────────────────────────────── */}
            <div className="w-64 shrink-0 hidden md:flex flex-col bg-zinc-950/60 border-r border-white/5">

                {/* Mode Switcher */}
                <div className="p-3 border-b border-white/5">
                    <div className="flex rounded-xl overflow-hidden border border-white/8 text-[11px] font-bold uppercase tracking-wider">
                        <button
                            onClick={() => { setMode("posts"); resetForm(); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors
                ${mode === "posts" ? "bg-indigo-600 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}`}
                        >
                            <BookOpen className="w-3 h-3" />
                            Посты
                        </button>
                        <button
                            onClick={() => { setMode("projects"); resetForm(); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors
                ${mode === "projects" ? "bg-indigo-600 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"}`}
                        >
                            <FolderOpen className="w-3 h-3" />
                            Проекты
                        </button>
                    </div>
                </div>

                {/* List header */}
                <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                    <span className="text-xs font-semibold text-zinc-400">
                        {mode === "posts" ? `Постов (${posts.length})` : `Проектов (${projects.length})`}
                    </span>
                    <button
                        onClick={resetForm}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-zinc-300 transition-colors"
                        title="Новый"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Item list */}
                <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
                    {loadingList ? (
                        <div className="flex justify-center p-6">
                            <Loader2 className="w-5 h-5 text-zinc-600 animate-spin" />
                        </div>
                    ) : mode === "posts" ? (
                        posts.map(p => (
                            <SidebarItem
                                key={p.slug}
                                title={p.title}
                                subtitle={p.date}
                                active={slug === p.slug && title === p.title}
                                onClick={() => loadPost(p)}
                            />
                        ))
                    ) : (
                        projects.map(p => (
                            <SidebarItem
                                key={p.slug}
                                title={p.title}
                                subtitle={p.status}
                                active={slug === p.slug && title === p.title}
                                onClick={() => loadProject(p)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* ─── Main Editor ─────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 bg-zinc-900 overflow-y-auto custom-scrollbar">

                {/* Toolbar */}
                <div className="shrink-0 px-6 py-4 border-b border-white/5 flex items-center justify-between gap-4 bg-zinc-900/80 sticky top-0 z-20 backdrop-blur-sm">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                            {mode === "posts" ? "Пост" : "Проект"} / {slug || "новый"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <label className="flex items-center gap-2 text-sm text-gray-300 font-medium cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={autoTranslate} 
                                onChange={(e) => setAutoTranslate(e.target.checked)}
                                className="rounded border-white/20 bg-black/50 text-indigo-500 focus:ring-indigo-500"
                            />
                            Translate (EN)
                        </label>
                        {isExisting && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting || loading}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors disabled:opacity-40"
                            >
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                <span className="hidden sm:inline">Удалить</span>
                            </button>
                        )}
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            title="Загрузить изображение"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-colors disabled:opacity-40"
                        >
                            {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                            <span className="hidden lg:inline">Фото</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading || success}
                            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> :
                                success ? <CheckCircle2 className="w-4 h-4 text-green-300" /> :
                                    <Save className="w-4 h-4" />}
                            {loading ? "…" : success ? "Готово!" : "Сохранить"}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col p-6 lg:p-8 gap-6">

                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* ── Title + Slug ── */}
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            value={title}
                            onChange={e => {
                                setTitle(e.target.value);
                                if (!slug || generateSlug(title) === slug)
                                    setSlug(generateSlug(e.target.value));
                            }}
                            placeholder={mode === "posts" ? "Заголовок поста…" : "Название проекта…"}
                            className="w-full text-2xl lg:text-3xl font-bold bg-transparent border-b-2 border-white/10 pb-2 focus:border-indigo-500 transition-colors text-white placeholder-zinc-700 focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                            <LinkIcon className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                            <input
                                type="text"
                                value={slug}
                                onChange={e => setSlug(e.target.value)}
                                placeholder="url-slug"
                                className="flex-1 text-xs text-zinc-500 bg-transparent focus:outline-none focus:text-zinc-300 font-mono"
                            />
                        </div>
                    </div>

                    {/* ── Meta fields ── */}
                    {mode === "posts" ? (
                        /* Post meta */
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                                <input
                                    type="date" value={date} onChange={e => setDate(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-zinc-800 border border-white/5 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                                <input
                                    type="text" value={tags} onChange={e => setTags(e.target.value)}
                                    placeholder="теги, через запятую"
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-zinc-800 border border-white/5 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-zinc-600"
                                />
                            </div>
                        </div>
                    ) : (
                        /* Project meta */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Description */}
                            <div className="sm:col-span-2 relative">
                                <Tag className="absolute left-3 top-3 w-3.5 h-3.5 text-zinc-600" />
                                <input
                                    type="text" value={description} onChange={e => setDescription(e.target.value)}
                                    placeholder="Краткое описание (одна строка)"
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-zinc-800 border border-white/5 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-zinc-600"
                                />
                            </div>
                            {/* Stack */}
                            <div className="sm:col-span-2 relative">
                                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                                <input
                                    type="text" value={stack} onChange={e => setStack(e.target.value)}
                                    placeholder="Стек: Next.js, Python, PostgreSQL"
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-zinc-800 border border-white/5 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-zinc-600"
                                />
                            </div>
                            {/* Link */}
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                                <input
                                    type="text" value={projectLink} onChange={e => setProjectLink(e.target.value)}
                                    placeholder="Live URL (необязательно)"
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-zinc-800 border border-white/5 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-zinc-600"
                                />
                            </div>
                            {/* GitHub */}
                            <div className="relative">
                                <GithubIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                                <input
                                    type="text" value={projectGithub} onChange={e => setProjectGithub(e.target.value)}
                                    placeholder="GitHub URL (необязательно)"
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-zinc-800 border border-white/5 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-zinc-600"
                                />
                            </div>
                            {/* Status */}
                            <div className="sm:col-span-2 flex items-center gap-2">
                                <span className="text-xs text-zinc-600 font-semibold uppercase tracking-wider">Статус:</span>
                                {(["active", "beta", "archived"] as const).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setProjectStatus(s)}
                                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${projectStatus === s
                                            ? s === "active" ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                : s === "beta" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                                    : "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30"
                                            : "bg-white/5 text-zinc-600 hover:bg-white/10"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Tiptap Editor ── */}
                    <div className="flex-1 flex flex-col relative rounded-xl border border-white/5 bg-zinc-950/40 overflow-hidden">
                        {editor && (
                            <FloatingBubbleMenu
                                editor={editor}
                                showLinkInput={showLinkInput}
                                setShowLinkInput={setShowLinkInput}
                                linkInput={linkInput}
                                setLinkInput={setLinkInput}
                                linkInputRef={linkInputRef}
                                applyLink={applyLink}
                            />
                        )}
                        <EditorContent editor={editor} className="flex-1 px-6 py-5 overflow-y-auto custom-scrollbar" />
                    </div>

                    {/* Footer hint */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-700 shrink-0">
                        <span>Ctrl+S — сохранить · выделите текст для форматирования</span>
                        <span>{content.length} символов</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
