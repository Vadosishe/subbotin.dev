import { getSortedPostsData } from "@/lib/markdown";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  const latestPosts = getSortedPostsData().slice(0, 2);

  return <HomeClient latestPosts={latestPosts} />;
}
