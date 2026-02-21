"use client";

import { BentoGrid } from "@/components/bento/BentoGrid";
import { ProfileCard } from "@/components/bento/ProfileCard";
import { ServicesCard } from "@/components/bento/ServicesCard";
import { StatusWidget } from "@/components/bento/StatusWidget";
import { TechMarquee } from "@/components/bento/TechMarquee";
import { GearWidget } from "@/components/bento/GearWidget";
import { FadeIn } from "@/components/ui/FadeIn";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogPostData } from "@/lib/markdown";

export default function HomeClient({ latestPosts }: { latestPosts: BlogPostData[] }) {
    return (
        <div className="pb-10">
            <BentoGrid>
                {/* Row 1-2: Profile & Services */}
                <FadeIn delay={0.1} className="col-span-1 md:col-span-2 row-span-2">
                    <SpotlightCard className="h-full rounded-3xl" color="rgba(129, 140, 248, 0.15)">
                        <ProfileCard />
                    </SpotlightCard>
                </FadeIn>

                <FadeIn delay={0.2} className="col-span-1 md:col-span-1 row-span-2">
                    <SpotlightCard className="h-full rounded-3xl" color="rgba(99, 102, 241, 0.1)">
                        <ServicesCard />
                    </SpotlightCard>
                </FadeIn>

                {/* Row 3: Blog & Status */}
                <FadeIn delay={0.3} className="col-span-1 md:col-span-2">
                    <SpotlightCard className="rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between" color="rgba(16, 185, 129, 0.12)">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">✍️</span>
                                Последние записи
                            </h2>
                            <Link href="/blog" className="text-sm flex items-center gap-1 transition-opacity opacity-60 hover:opacity-100">
                                Все посты <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                            {latestPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
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
                                <p className="text-sm py-4" style={{ color: 'var(--muted)' }}>Постов пока нет.</p>
                            )}
                        </div>
                    </SpotlightCard>
                </FadeIn>

                <FadeIn delay={0.4} className="col-span-1">
                    <SpotlightCard className="rounded-3xl h-full" color="rgba(34, 197, 94, 0.15)">
                        <StatusWidget />
                    </SpotlightCard>
                </FadeIn>

                {/* Row 4: Gear & Tech Marquee */}
                <FadeIn delay={0.5} className="col-span-1 md:col-span-1">
                    <SpotlightCard className="rounded-3xl h-full" color="rgba(249, 115, 22, 0.1)">
                        <GearWidget />
                    </SpotlightCard>
                </FadeIn>

                <FadeIn delay={0.6} className="col-span-1 md:col-span-2">
                    <TechMarquee />
                </FadeIn>

            </BentoGrid>
        </div>
    );
}
