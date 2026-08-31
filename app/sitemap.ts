import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getAllProjectPageSlugs } from "@/lib/projectPages";

export const dynamic = "force-static";

const BASE = "https://davidprat.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((p) => ({
    url: `${BASE}/posts/${p.slug}`,
    lastModified: new Date(p.date),
  }));
  const projects = getAllProjectPageSlugs().map((slug) => ({
    url: `${BASE}/projects/${slug}`,
    lastModified: new Date(),
  }));
  return [
    { url: BASE, lastModified: new Date(), priority: 1 },
    { url: `${BASE}/posts`, lastModified: new Date(), priority: 0.8 },
    ...posts,
    ...projects,
  ];
}
