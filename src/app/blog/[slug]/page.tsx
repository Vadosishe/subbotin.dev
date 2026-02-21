import { getPostData, getSortedPostsData } from "@/lib/markdown";
import { FadeIn } from "@/components/ui/FadeIn";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

interface Params {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const postData = await getPostData(params.slug);
    return {
        title: `${postData.title} | Влад Субботин`,
        description: postData.excerpt,
    };
}

// Это выполняется на сервере для статической генерации
export async function generateStaticParams() {
    const posts = getSortedPostsData();
    return posts.map((post) => ({
        slug: post.id,
    }));
}

export default async function Post(props: Params) {
    const params = await props.params;
    const id = params.slug;
    const postData = await getPostData(id);
    const isEn = id.endsWith('.en');
    const backText = isEn ? "Back to articles" : "Назад к статьям";

    return (
        <article className="py-12 px-4 md:px-0 max-w-3xl mx-auto w-full">
            <FadeIn delay={0.1}>
                <div className="mb-8">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {backText}
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                        {postData.title}
                    </h1>
                    <div className="text-gray-500 font-medium">{postData.date}</div>
                </div>
            </FadeIn>

            <FadeIn delay={0.2} className="mt-10">
                <div
                    className="prose prose-invert prose-lg max-w-none prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-headings:text-gray-100 prose-img:rounded-xl prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/10"
                    dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
                />
            </FadeIn>
        </article>
    );
}
