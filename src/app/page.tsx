import { Suspense } from "react";
import { getSortedPostsData } from "@/lib/markdown";
import HomeClient from "@/components/HomeClient";
import Loading from "./loading";

export default function Home() {
  const allPosts = getSortedPostsData();

  return (
    <Suspense fallback={<Loading />}>
      <HomeClient allPosts={allPosts} />
    </Suspense>
  );
}
