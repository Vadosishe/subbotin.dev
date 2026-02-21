import { getSortedPostsData } from "@/lib/markdown";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  const allPosts = getSortedPostsData();

  return <HomeClient allPosts={allPosts} />;
}
