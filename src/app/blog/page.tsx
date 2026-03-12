import { Suspense } from "react";
import { getSortedPostsData } from "@/lib/markdown";
import BlogListClient from "@/components/BlogListClient";
import { Metadata } from "next";
import Loading from "../loading";

export const metadata: Metadata = {
    title: "Блог | Влад Субботин",
    description: "Статьи о разработке, технологиях и жизни.",
};

export default function BlogPage() {
    const allPosts = getSortedPostsData();

    return (
        <Suspense fallback={<Loading />}>
            <BlogListClient allPosts={allPosts} />
        </Suspense>
    );
}
