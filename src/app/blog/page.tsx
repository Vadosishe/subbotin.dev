import { getSortedPostsData } from "@/lib/markdown";
import BlogListClient from "@/components/BlogListClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Блог | Влад Субботин",
    description: "Статьи о разработке, технологиях и жизни.",
};

export default function BlogPage() {
    const allPosts = getSortedPostsData();

    return <BlogListClient allPosts={allPosts} />;
}
