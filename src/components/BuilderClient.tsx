// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import type { Layout, LayoutItem } from "react-grid-layout";
import { BlogPostData } from "@/lib/markdown";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { RenderBlock } from "@/components/bento/Registry";
import { gridConfig, GridBlock } from "@/data/gridConfig";
import { RotateCcw, Download } from "lucide-react";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function BuilderClient({ allPosts }: { allPosts: BlogPostData[] }) {
    const [GridLayoutComponent, setGridLayoutComponent] = useState<any>(null);
    const [currentLayout, setCurrentLayout] = useState<Layout>([]);
    const [mounted, setMounted] = useState(false);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [width, setWidth] = useState(1200);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadRGL = async () => {
            try {
                const RGL: any = await import("react-grid-layout");
                const R = RGL.Responsive || RGL.default?.Responsive || RGL.ResponsiveGridLayout || RGL.default?.ResponsiveGridLayout;

                if (R) {
                    setGridLayoutComponent(() => R);
                    const initialLayout = gridConfig.map((block, idx) => ({
                        i: block.id,
                        x: (idx % 3),
                        y: Math.floor(idx / 3) * 2,
                        w: block.colSpan,
                        h: block.rowSpan || 1,
                    }));
                    setCurrentLayout(initialLayout);
                    setMounted(true);
                } else {
                    setLoadingError("Could not find Responsive component in react-grid-layout");
                }
            } catch (err: any) {
                setLoadingError("Load error: " + err.message);
            }
        };
        loadRGL();
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        const handleResize = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        };
        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);
        handleResize();
        return () => observer.disconnect();
    }, [mounted]);

    const onLayoutChange = (layout: Layout) => {
        setCurrentLayout(layout);
    };

    const handleExport = () => {
        const newConfig = gridConfig.map(block => {
            const layoutItem = currentLayout.find(item => item.i === block.id);
            if (layoutItem) {
                return {
                    ...block,
                    colSpan: layoutItem.w,
                    rowSpan: layoutItem.h,
                };
            }
            return block;
        });
        const json = JSON.stringify(newConfig, null, 4);
        navigator.clipboard.writeText(json);
        alert("Конфигурация скопирована в буфер обмена!");
    };

    if (loadingError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-red-900/10 border border-red-500/20 rounded-3xl">
                <p className="text-red-400 font-bold mb-4">Ошибка загрузки конструктора</p>
                <code className="text-xs opacity-70 block mb-6 bg-black/20 p-4 rounded-xl border border-white/5">{loadingError}</code>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                    Попробовать снова
                </button>
            </div>
        );
    }

    if (!mounted || !GridLayoutComponent) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-sm opacity-50 uppercase tracking-widest animate-pulse">Инициализация...</p>
                </div>
            </div>
        );
    }

    const ResponsiveGrid = GridLayoutComponent;

    return (
        <div className="min-h-screen pb-20">
            <div className="sticky top-4 z-[100] mb-8 p-4 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
                <div>
                    <h1 className="text-lg font-bold text-white">Bento Builder</h1>
                    <p className="text-xs text-white/50">Перетаскивайте и меняйте размер блоков</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        title="Сбросить"
                    >
                        <RotateCcw className="w-5 h-5 text-white/70" />
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-600/20"
                    >
                        <Download className="w-5 h-5" />
                        Экспортировать JSON
                    </button>
                </div>
            </div>

            <div
                ref={containerRef}
                className="builder-container relative bg-white/[0.02] border border-dashed border-white/10 rounded-3xl min-h-[1000px] overflow-visible"
            >
                <ResponsiveGrid
                    className="layout"
                    layouts={{ lg: currentLayout }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 }}
                    rowHeight={150}
                    width={width}
                    draggableHandle=".drag-handle"
                    onLayoutChange={onLayoutChange}
                    margin={[16, 16]}
                    useCSSTransforms={true}
                >
                    {gridConfig.map((block) => (
                        <div key={block.id} className="group relative">
                            <SpotlightCard
                                className="h-full w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl"
                                color={block.color || "rgba(255, 255, 255, 0.05)"}
                            >
                                <div className="drag-handle absolute top-2 right-2 z-50 p-2 rounded-lg bg-black/60 opacity-0 group-hover:opacity-100 cursor-move transition-all hover:bg-indigo-600 border border-white/10">
                                    <div className="grid grid-cols-2 gap-0.5">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="w-1 h-1 rounded-full bg-white" />
                                        ))}
                                    </div>
                                </div>

                                <div className="pointer-events-none select-none h-full scale-[0.98] origin-center opacity-90 group-active:opacity-100 transition-opacity">
                                    <RenderBlock
                                        type={block.type}
                                        props={block.type === 'BlogWidget' ? { allPosts } : block.props}
                                    />
                                </div>
                            </SpotlightCard>
                        </div>
                    ))}
                </ResponsiveGrid>
            </div>

            <style jsx global>{`
                .react-grid-layout {
                    position: relative;
                    transition: height 200ms ease;
                }
                .react-grid-item {
                    transition: all 200ms ease;
                    transition-property: left, top, right, bottom;
                }
                .react-grid-item.cssTransforms {
                    transition-property: transform;
                }
                .react-grid-item.resizing {
                    z-index: 1000;
                    will-change: width, height;
                }
                .react-grid-item.react-draggable-dragging {
                    transition: none;
                    z-index: 1000;
                    will-change: transform;
                }
                .react-grid-placeholder {
                    background: rgba(99, 102, 241, 0.1) !important;
                    border-radius: 1.5rem !important;
                    opacity: 0.5 !important;
                    z-index: 2;
                    transition-duration: 100ms;
                }
                .react-resizable-handle {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    bottom: 0;
                    right: 0;
                    cursor: se-resize;
                    z-index: 100;
                }
                .react-resizable-handle::after {
                    content: "";
                    position: absolute;
                    right: 5px;
                    bottom: 5px;
                    width: 8px;
                    height: 8px;
                    border-right: 2px solid white;
                    border-bottom: 2px solid white;
                    opacity: 0.3;
                }
                .group:hover .react-resizable-handle::after {
                    opacity: 0.8;
                }
            `}</style>
        </div>
    );
}
