// One-off import of posts from the recovered WordPress site on the LAN.
// Usage: npm run import:posts
// Source content is treated as UNTRUSTED (the original site was compromised):
// see scripts/wp-import-lib.mjs for the sanitization pipeline.
import { mkdir, writeFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import {
  ORIGIN,
  makeTurndown,
  sanitizeToHtml,
  toMarkdown,
  plainText,
  download,
} from "./wp-import-lib.mjs";

const OUT_MD = join(process.cwd(), "content", "posts");
const OUT_IMG = join(process.cwd(), "public", "posts");
const td = makeTurndown();

const res = await fetch(`${ORIGIN}/wp-json/wp/v2/posts?per_page=100&_embed`);
const posts = await res.json();
console.log(`Fetched ${posts.length} posts`);

for (const post of posts) {
  const slug = post.slug;
  const imgDir = join(OUT_IMG, slug);
  await mkdir(imgDir, { recursive: true });
  await mkdir(OUT_MD, { recursive: true });

  let html = sanitizeToHtml(post.content.rendered);

  const imgUrls = [...new Set([...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((m) => m[1]))];
  const featured = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  if (featured) imgUrls.push(featured);

  const urlMap = new Map();
  for (const raw of imgUrls) {
    try {
      const abs = new URL(raw, ORIGIN).href;
      let name = basename(new URL(abs).pathname);
      if (!extname(name)) name += ".jpg";
      if (!urlMap.has(raw)) {
        await download(abs, join(imgDir, name));
        urlMap.set(raw, `/posts/${slug}/${name}`);
      }
    } catch (e) {
      console.warn(`  skip image ${raw}: ${e.message}`);
    }
  }
  for (const [raw, local] of urlMap) {
    html = html.split(raw).join(local);
  }

  const md = toMarkdown(td, html);
  const excerpt = plainText(post.excerpt.rendered).slice(0, 220);
  const cover = featured && urlMap.get(featured) ? urlMap.get(featured) : undefined;

  const fm = [
    "---",
    `title: ${JSON.stringify(plainText(post.title.rendered))}`,
    `date: ${JSON.stringify(post.date)}`,
    `excerpt: ${JSON.stringify(excerpt)}`,
    ...(cover ? [`cover: ${JSON.stringify(cover)}`] : []),
    "---",
    "",
  ].join("\n");

  await writeFile(join(OUT_MD, `${slug}.md`), fm + md + "\n");
  console.log(`✓ ${post.date.slice(0, 10)} ${slug} (${urlMap.size} images)`);
}
console.log("Done.");
