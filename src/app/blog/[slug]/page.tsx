import { getPostData, getSortedPostsData } from "@/lib/markdown";
import { FadeIn } from "@/components/ui/FadeIn";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import parse, { domToReact, HTMLReactParserOptions, Element } from "html-react-parser";
import { CopyBlock } from "@/components/ui/CopyBlock";

interface Params {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const postData = await getPostData(params.slug);
    
    if (postData.draft) {
        notFound();
    }
    
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

const parseOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
        if (domNode instanceof Element && domNode.name === "pre") {
            // "pre" обычно содержит "code" внутри
            const codeNode = domNode.children.find(
                (c): c is Element => c instanceof Element && c.name === "code"
            );
            
            // Пытаемся добыть raw текст для копирования
            let rawCode = "";
            if (codeNode) {
                const textNode = codeNode.children.find(c => c.type === "text" || (c as any).name === "text");
                if (textNode && "data" in textNode) {
                    rawCode = (textNode as any).data || "";
                }
            }

            return (
                <CopyBlock code={rawCode}>
                    <pre {...domNode.attribs}>
                        {domToReact(domNode.children as any, parseOptions)}
                    </pre>
                </CopyBlock>
            );
        }
    },
};

export default async function Post(props: Params) {
    const params = await props.params;
    const id = params.slug;
    const postData = await getPostData(id);

    if (postData.draft) {
        notFound();
    }

    const isEn = postData.lang === 'en';
    const backText = isEn ? "Back to articles" : "Назад к статьям";

    return (
        <article className="py-12 px-4 md:px-0 max-w-3xl mx-auto w-full">
            <FadeIn delay={0.1}>
                <div className="mb-8">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity mb-6 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {backText}
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-current opacity-90 mb-4">
                        {postData.title}
                    </h1>
                    <div className="text-gray-500 font-medium">{postData.date}</div>
                </div>
            </FadeIn>

            <FadeIn delay={0.2} className="mt-10">
                <div
                    className="prose prose-lg max-w-none prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-img:rounded-xl prose-pre:border prose-pre:border-current/10 prose-pre:p-4 prose-pre:relative"
                >
                    {parse(postData.contentHtml, parseOptions)}
                </div>
            </FadeIn>
        </article>
    );
}
