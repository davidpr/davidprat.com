import { site } from "@/content/site";
import type { PostMeta } from "@/lib/posts";

const BASE = "https://davidprat.com";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 feed of the site's posts (expects them sorted newest first). */
export function buildRss(posts: PostMeta[]): string {
  const items = posts
    .map((p) => {
      const url = `${BASE}/posts/${p.slug}`;
      return [
        "    <item>",
        `      <title>${esc(p.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(p.date).toUTCString()}</pubDate>`,
        ...(p.excerpt ? [`      <description>${esc(p.excerpt)}</description>`] : []),
        ...p.topics.map((t) => `      <category>${esc(t)}</category>`),
        "    </item>",
      ].join("\n");
    })
    .join("\n");
  const lastBuild = posts[0] ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)}</title>
    <link>${BASE}</link>
    <description>${esc(`Articles by ${site.name} — ${site.headline}`)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
