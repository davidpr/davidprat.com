// One-off import of posts from the recovered WordPress site on the LAN.
// Usage: npm run import:posts
// Source content is treated as UNTRUSTED (the original site was compromised):
// scripts, iframes, styles, forms, objects and event handlers are removed
// before HTML→Markdown conversion; only text, links, images and code survive.
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { join, extname, basename } from "node:path";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const ORIGIN = "http://192.168.1.40";
const OUT_MD = join(process.cwd(), "content", "posts");
const OUT_IMG = join(process.cwd(), "public", "posts");

const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
td.use(gfm);
td.remove(["script", "style", "iframe", "object", "embed", "form", "noscript"]);

// Elementor/Prism code blocks keep raw code inside <xmp>; rebuild them as
// plain <pre><code> so Turndown emits fenced blocks with newlines intact.
function normalizeCodeBlocks(html) {
  return html.replace(
    /<pre[^>]*?(?:class="[^"]*?language-(\w+)[^"]*")?[^>]*>[\s\S]*?<xmp>([\s\S]*?)<\/xmp>[\s\S]*?<\/pre>/gi,
    (_, lang, code) => {
      const esc = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim();
      return `<pre><code class="language-${lang || ""}">${esc}\n</code></pre>`;
    },
  );
}

function stripUnsafe(html) {
  return html
    .replace(/<(script|style|iframe|object|embed|form|noscript)[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|iframe|object|embed)[^>]*\/>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

function plainText(html) {
  return stripUnsafe(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&#\d+;|&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  await pipeline(res.body, createWriteStream(dest));
}

const res = await fetch(`${ORIGIN}/wp-json/wp/v2/posts?per_page=100&_embed`);
const posts = await res.json();
console.log(`Fetched ${posts.length} posts`);

for (const post of posts) {
  const slug = post.slug;
  const imgDir = join(OUT_IMG, slug);
  await mkdir(imgDir, { recursive: true });
  await mkdir(OUT_MD, { recursive: true });

  let html = stripUnsafe(normalizeCodeBlocks(post.content.rendered));

  // collect image URLs from the post body (src attributes)
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

  let md = td.turndown(html);
  // srcset/size-suffixed leftovers and origin references
  md = md.split(ORIGIN).join("");

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
