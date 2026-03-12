import { Suspense } from "react";
import { getSortedPostsData } from "@/lib/markdown";
import BuilderClient from "@/components/BuilderClient";
import Loading from "../loading";

export default function BuilderPage() {
    const allPosts = getSortedPostsData();
    return (
        <main className="max-w-7xl mx-auto px-4 md:px-0 pt-8">
            <Suspense fallback={<Loading />}>
                <BuilderClient allPosts={allPosts} />
            </Suspense>
        </main>
    );
}
