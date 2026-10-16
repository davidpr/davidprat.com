import { getAllPosts } from "@/lib/posts";
import { buildRss } from "@/lib/rss";

export const dynamic = "force-static";

export async function GET() {
  return new Response(buildRss(getAllPosts()), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
