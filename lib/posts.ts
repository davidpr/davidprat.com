import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  topics: string[];
  cover?: string;
};

const POSTS_DIR = join(process.cwd(), "content", "posts");

export function getAllPosts(): PostMeta[] {
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data } = matter(readFileSync(join(POSTS_DIR, f), "utf8"));
      return {
        slug: f.replace(/\.md$/, ""),
        title: String(data.title),
        date: String(data.date),
        excerpt: String(data.excerpt ?? ""),
        topics: Array.isArray(data.topics) ? data.topics.map(String) : [],
        ...(data.cover ? { cover: String(data.cover) } : {}),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export type FeedItem = {
  title: string;
  date: string;
  excerpt?: string;
  href: string;
  external: boolean;
  source?: string;
  topics: string[];
  cover?: string;
};

export function getFeed(
  external: {
    title: string;
    date: string;
    href: string;
    source: string;
    topics?: string[];
    cover?: string;
  }[],
): FeedItem[] {
  const local: FeedItem[] = getAllPosts().map((p) => ({
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    href: `/posts/${p.slug}`,
    external: false,
    topics: p.topics,
    ...(p.cover ? { cover: p.cover } : {}),
  }));
  const ext: FeedItem[] = external.map((a) => ({
    title: a.title,
    date: a.date,
    href: a.href,
    external: true,
    source: a.source,
    topics: a.topics ?? [],
    ...(a.cover ? { cover: a.cover } : {}),
  }));
  return [...local, ...ext].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): { meta: PostMeta; body: string } | null {
  const file = join(POSTS_DIR, `${slug}.md`);
  if (!/^[a-z0-9-]+$/.test(slug) || !existsSync(file)) return null;
  const { data, content } = matter(readFileSync(file, "utf8"));
  return {
    meta: {
      slug,
      title: String(data.title),
      date: String(data.date),
      excerpt: String(data.excerpt ?? ""),
      topics: Array.isArray(data.topics) ? data.topics.map(String) : [],
      ...(data.cover ? { cover: String(data.cover) } : {}),
    },
    body: content,
  };
}
