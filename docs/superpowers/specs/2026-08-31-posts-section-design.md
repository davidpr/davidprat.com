# Posts Section — Recovered Blog + LinkedIn Articles

**Date:** 2026-08-31
**Status:** Approved defaults (autonomous mode)

## Purpose

Recover the 17 technical posts (2018–2023) from the restored old WordPress site (LAN, http://192.168.1.40) into the static site, and merge them with curated LinkedIn long-form articles into a single "Posts" stream, newest first. Short LinkedIn feed posts and reposts are explicitly out of scope; so are the old site's pages (CV, book reviews, templates).

## Security constraint

The source WordPress site was compromised in the past. All imported content is treated as untrusted: the import pipeline converts HTML to Markdown and drops scripts, iframes, embeds, forms and event attributes; only text, headings, lists, links, code blocks, tables and images survive. Imported Markdown is reviewed before commit. The site remains fully static — no runtime fetching.

## Architecture

- **Import pipeline** — `scripts/import-posts.mjs` (Node, run manually via `npm run import:posts`, idempotent):
  - Fetches `wp-json/wp/v2/posts?per_page=100` with `_embed` for featured media.
  - Converts `content.rendered` HTML → GitHub-flavored Markdown with Turndown (+ gfm plugin); scripts/iframes/styles removed before conversion.
  - Downloads every image referenced in the post (and the featured image) to `public/posts/<slug>/`, rewriting references to `/posts/<slug>/<file>`.
  - Writes `content/posts/<slug>.md` with frontmatter: `title`, `date` (ISO), `excerpt` (plain text), `cover` (optional path).
  - The WP origin (`http://192.168.1.40`) is a constant in the script; the script is dev tooling, never imported by app code.
- **Post loading** — `lib/posts.ts`: reads `content/posts/*.md` (gray-matter), exports `getAllPosts(): PostMeta[]` (sorted date desc) and `getPost(slug)`. `PostMeta = { slug, title, date, excerpt, cover? }`.
- **External articles** — `content/site.ts` gains `externalArticles: { title, date, href, source }[]` (LinkedIn articles). Merged with local posts in the index by date.
- **Routes** —
  - `app/posts/page.tsx`: all items (local + external) newest first; local link to `/posts/<slug>`, external link out with a source tag.
  - `app/posts/[slug]/page.tsx` + `generateStaticParams`: renders Markdown via react-markdown + remark-gfm in a server component; back-link; date; existing design tokens (single column, cards, eyebrows).
- **Home Writing section** — shows the 3 newest items across both sources plus an "All posts" link to `/posts`; keeps the channels row (LinkedIn articles page, YouTube). The old `writing.articles` field is replaced by `externalArticles`.

## Testing

- `lib/posts.ts` unit-tested against the real imported files (≥17 posts, valid frontmatter, sorted desc).
- Import sanitization test: no `<script`, `<iframe`, `onerror=`, `javascript:` in any imported markdown file.
- Index and post page components render titles/dates; external items expose outbound hrefs.
- `next build` static-exports all `/posts/*` pages.

## Out of scope

Old-site pages (CV, portfolio, book reviews), LinkedIn short posts/reposts, comments, tags/categories, RSS, deployment.
