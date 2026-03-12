import { getSortedPostsData } from "@/lib/markdown";
import BuilderClient from "@/components/BuilderClient";

export default function BuilderPage() {
    const allPosts = getSortedPostsData();
    return (
        <main className="max-w-7xl mx-auto px-4 md:px-0 pt-8">
            <BuilderClient allPosts={allPosts} />
        </main>
    );
}
