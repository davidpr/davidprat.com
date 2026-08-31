// Imports the six portfolio case-study pages from the recovered WordPress
// site (custom post type "project") into content/projects/*.md.
// Usage: npm run import:project-pages
import { mkdir, writeFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import {
  ORIGIN,
  makeTurndown,
  sanitizeToHtml,
  toMarkdown,
  download,
} from "./wp-import-lib.mjs";

// old WP slug → { slug on the new site, card name in content/site.ts }
const MAPPING = [
  { old: "assefy", slug: "assefy-data-catalog", name: "Universal Data Catalog in AWS" },
  { old: "aseme", slug: "aseme", name: "Electricity Consumption Analytics" },
  { old: "imidomics", slug: "imidomics", name: "Genomics Data Catalog for Diseases" },
  {
    old: "simigsolutions",
    slug: "estabanell-energia",
    name: "Estabanell Energia — Electric Consumption Measurements Automation",
  },
  {
    old: "international-project-management-environments",
    slug: "international-project-management",
    name: "International Project Management Environments",
  },
  {
    old: "adaptive-reconfiguration-for-power7",
    slug: "power7-reconfiguration",
    name: "Runtime-Guided Hardware Prefetcher Reconfiguration on the IBM POWER7",
  },
];

const OUT_MD = join(process.cwd(), "content", "projects");
const OUT_IMG = join(process.cwd(), "public", "projects");
const td = makeTurndown();

for (const { old, slug, name } of MAPPING) {
  const res = await fetch(`${ORIGIN}/wp-json/wp/v2/project?slug=${old}&_fields=title,content`);
  const items = await res.json();
  if (!items.length) {
    console.warn(`✗ ${old}: not found`);
    continue;
  }
  let html = sanitizeToHtml(items[0].content.rendered);

  const imgDir = join(OUT_IMG, slug);
  await mkdir(imgDir, { recursive: true });
  await mkdir(OUT_MD, { recursive: true });

  const imgUrls = [...new Set([...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((m) => m[1]))];
  for (const raw of imgUrls) {
    try {
      const abs = new URL(raw, ORIGIN).href;
      let file = basename(new URL(abs).pathname);
      if (!extname(file)) file += ".jpg";
      await download(abs, join(imgDir, file));
      html = html.split(raw).join(`/projects/${slug}/${file}`);
    } catch (e) {
      console.warn(`  skip image ${raw}: ${e.message}`);
    }
  }

  const md = toMarkdown(td, html);
  const fm = ["---", `title: ${JSON.stringify(name)}`, "---", ""].join("\n");
  await writeFile(join(OUT_MD, `${slug}.md`), fm + md + "\n");
  console.log(`✓ ${slug} (${imgUrls.length} images)`);
}
console.log("Done.");
