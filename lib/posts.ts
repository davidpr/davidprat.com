import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
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
        ...(data.cover ? { cover: String(data.cover) } : {}),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
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
      ...(data.cover ? { cover: String(data.cover) } : {}),
    },
    body: content,
  };
}
