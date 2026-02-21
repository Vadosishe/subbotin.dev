import { getSortedPostsData } from "@/lib/markdown";
import { FadeIn } from "@/components/ui/FadeIn";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Блог | Влад Субботин",
    description: "Статьи о разработке, технологиях и жизни.",
};

export default function BlogList() {
    const posts = getSortedPostsData();

    return (
        <div className="py-12 px-4 md:px-0 max-w-3xl mx-auto w-full">
            <FadeIn delay={0.1}>
                <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Блог</h1>
                <p className="text-gray-400 mb-10 text-lg">Пишу о технологиях, коде и своих проектах.</p>
            </FadeIn>

            <div className="flex flex-col gap-6">
                {posts.map((post, idx) => (
                    <FadeIn key={post.slug} delay={0.2 + idx * 0.1}>
                        <Link
                            href={`/blog/${post.slug}`}
                            className="group block p-6 rounded-3xl bento-card hover:bg-white/10 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-3">
                                <h2 className="text-2xl font-bold text-gray-100 group-hover:text-indigo-400 transition-colors">
                                    {post.title}
                                </h2>
                                <time className="text-sm text-gray-500 whitespace-nowrap">{post.date}</time>
                            </div>
                            <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center gap-1 text-sm font-medium text-indigo-400 group-hover:translate-x-1 transition-transform w-fit">
                                Читать далее <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </FadeIn>
                ))}

                {posts.length === 0 && (
                    <p className="text-gray-500">Здесь пока ничего нет, но скоро появятся новые записи.</p>
                )}
            </div>
        </div>
    );
}
