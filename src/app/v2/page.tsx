import { getSortedPostsData } from "@/lib/markdown";
import DraftHomeClient from "@/components/DraftHomeClient";

export default function V2Page() {
    const allPosts = getSortedPostsData();
    return (
        <main className="max-w-7xl mx-auto px-4 md:px-0">
            <DraftHomeClient allPosts={allPosts} />
        </main>
    );
}
