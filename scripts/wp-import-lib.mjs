// Shared helpers for importing content from the recovered WordPress site.
// Source content is treated as UNTRUSTED (the original site was compromised).
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

export const ORIGIN = "http://192.168.1.40";

export function makeTurndown() {
  const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
  td.use(gfm);
  td.remove(["script", "style", "iframe", "object", "embed", "form", "noscript"]);
  return td;
}

export function decodeEntities(s) {
  return s
    .replace(/&#8221;|&#8220;|&quot;/g, '"')
    .replace(/&#8217;|&#8216;/g, "'")
    .replace(/&amp;/g, "&");
}

export function extractVideos(html) {
  return html.replace(/\[vc_video\s+([^\]]*)\]/gi, (_, attrs) => {
    const m = decodeEntities(attrs).match(/link="([^"]+)"/i);
    return m ? `</p><p><a href="${m[1]}">Watch the video tutorial on YouTube</a></p><p>` : "";
  });
}

export function stripShortcodes(s) {
  return s.replace(/\[\/?[a-z0-9_]+(?:\s[^\]]*)?\]/gi, "");
}

export function normalizeBarePre(html) {
  return html.replace(/<pre(?![^>]*>\s*<code)[^>]*>([\s\S]*?)<\/pre>/gi, (whole, inner) => {
    if (/<code|<xmp/i.test(inner)) return whole;
    return `<pre><code>${inner.replace(/<[^>]+>/g, "")}\n</code></pre>`;
  });
}

export function normalizeCodeBlocks(html) {
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

export function stripUnsafe(html) {
  return html
    .replace(/<(script|style|iframe|object|embed|form|noscript)[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|iframe|object|embed)[^>]*\/>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function plainText(html) {
  return stripShortcodes(stripUnsafe(html))
    .replace(/<[^>]+>/g, " ")
    .replace(/&#\d+;|&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeToHtml(raw) {
  let html = raw;
  html = extractVideos(html);
  html = stripShortcodes(html);
  html = normalizeCodeBlocks(html);
  html = normalizeBarePre(html);
  html = stripUnsafe(html);
  return html;
}

export function toMarkdown(td, html) {
  let md = td.turndown(html);
  md = md.replace(/\\?\[\\?\/?vc\\?_[^\]\n]*\\?\]/gi, "");
  md = md.split(ORIGIN).join("");
  return md;
}

export async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  await pipeline(res.body, createWriteStream(dest));
}
