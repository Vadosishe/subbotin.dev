"use client";

import { BlogPostData } from "@/lib/markdown";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { FadeIn } from "@/components/ui/FadeIn";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { draftGridConfig } from "@/data/draftGridConfig";
import { RenderBlock } from "@/components/bento/Registry";

export default function DraftHomeClient({ allPosts }: { allPosts: BlogPostData[] }) {
    return (
        <div className="pb-10">
            <h1 className="text-center text-sm opacity-30 mb-8 uppercase tracking-widest">Draft Version (V2)</h1>
            <BentoGrid>
                {draftGridConfig.map((block) => {
                    const blockProps = { ...block.props };
                    if (block.type === 'BlogWidget') {
                        blockProps.allPosts = allPosts;
                    }

                    const colSpanClass = block.colSpan === 3
                        ? "col-span-1 md:col-span-3"
                        : block.colSpan === 2
                            ? "col-span-1 md:col-span-2"
                            : "col-span-1";

                    const rowSpanClass = block.rowSpan ? `row-span-${block.rowSpan}` : "";

                    return (
                        <FadeIn
                            key={block.id}
                            delay={block.delay || 0.1}
                            className={`${colSpanClass} ${rowSpanClass}`}
                        >
                            <SpotlightCard
                                className="h-full rounded-3xl overflow-hidden"
                                color={block.color || "rgba(255, 255, 255, 0.05)"}
                            >
                                <RenderBlock type={block.type} props={blockProps} />
                            </SpotlightCard>
                        </FadeIn>
                    );
                })}
            </BentoGrid>
        </div>
    );
}
