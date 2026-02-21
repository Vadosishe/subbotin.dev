import { BentoGrid } from "@/components/bento/BentoGrid";
import { ProfileCard } from "@/components/bento/ProfileCard";
import { ServicesCard } from "@/components/bento/ServicesCard";
import { StatusWidget } from "@/components/bento/StatusWidget";
import { TechStackWidget } from "@/components/bento/TechStackWidget";
import { TimeWidget } from "@/components/bento/TimeWidget";
import { FadeIn } from "@/components/ui/FadeIn";
import { getSortedPostsData } from "@/lib/markdown";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const latestPosts = getSortedPostsData().slice(0, 2);

  return (
    <div className="pb-10">
      <BentoGrid>
        {/* Профиль — большая карточка слева */}
        <FadeIn delay={0.1} className="col-span-1 md:col-span-2 row-span-2">
          <ProfileCard />
        </FadeIn>

        {/* Проекты — справа */}
        <FadeIn delay={0.2} className="col-span-1 md:col-span-1 row-span-2">
          <ServicesCard />
        </FadeIn>

        {/* Последние записи блога */}
        <FadeIn delay={0.3} className="col-span-1 md:col-span-2 row-span-1 h-full">
          <div className="bento-card rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between">
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
          </div>
        </FadeIn>

        {/* Статус */}
        <FadeIn delay={0.4} className="col-span-1 row-span-1">
          <StatusWidget />
        </FadeIn>

        {/* Tech Stack */}
        <FadeIn delay={0.5} className="col-span-1 md:col-span-2 row-span-1">
          <TechStackWidget />
        </FadeIn>

        {/* Часы */}
        <FadeIn delay={0.6} className="col-span-1 row-span-1">
          <TimeWidget />
        </FadeIn>
      </BentoGrid>
    </div>
  );
}
