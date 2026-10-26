import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const DIR = join(process.cwd(), "content", "projects");

export function getAllProjectPageSlugs(): string[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export type ProjectPage = {
  title: string;
  body: string;
  embed?: { src: string; title: string };
};

export function getProjectPage(slug: string): ProjectPage | null {
  const file = join(DIR, `${slug}.md`);
  if (!/^[a-z0-9-]+$/.test(slug) || !existsSync(file)) return null;
  const { data, content } = matter(readFileSync(file, "utf8"));
  const embed = data.embed
    ? { src: String(data.embed.src), title: String(data.embed.title) }
    : undefined;
  return { title: String(data.title), body: content, embed };
}
