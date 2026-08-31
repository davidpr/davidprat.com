# Posts Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import the 17 recovered WordPress posts as sanitized Markdown with images, and serve them plus curated LinkedIn articles at `/posts`, with the home Writing section showing the newest three.

**Architecture:** One-off import script (Turndown + WP REST API) → `content/posts/*.md` + `public/posts/<slug>/` images; `lib/posts.ts` reads them with gray-matter; static routes `/posts` and `/posts/[slug]` render via react-markdown; `content/site.ts` gains `externalArticles` merged by date.

**Tech Stack:** turndown(+gfm), gray-matter, react-markdown, remark-gfm (all installed).

**Spec:** `docs/superpowers/specs/2026-08-31-posts-section-design.md`

## Global Constraints

- Imported content is untrusted: strip script/iframe/style/form/embeds and event attributes before conversion; sanitization test enforces no `<script`, `<iframe`, `onerror=`, `javascript:` in output.
- Site stays fully static (`output: 'export'`); the import script is dev tooling only.
- No dead links; external items always carry absolute https hrefs.

---

### Task 1: Import script + run + sanitization test

**Files:** Create `scripts/import-posts.mjs`; add `"import:posts"` npm script; Test `test/posts-content.test.ts`.
**Produces:** `content/posts/*.md` (17 files, frontmatter title/date/excerpt/cover), `public/posts/<slug>/*` images.

- [ ] Write `test/posts-content.test.ts`: ≥17 md files exist; frontmatter valid; no forbidden patterns.
- [ ] Run tests → FAIL (no files).
- [ ] Write the script; `npm run import:posts`; spot-review output.
- [ ] Tests PASS; commit.

### Task 2: Post loader

**Files:** Create `lib/posts.ts`; Test `test/posts-lib.test.ts`.
**Produces:** `getAllPosts(): PostMeta[]` sorted desc; `getPost(slug): { meta: PostMeta; body: string } | null`; `PostMeta = { slug, title, date, excerpt, cover? }`.

- [ ] Failing tests (sorted desc, ≥17, getPost round-trip, null for unknown slug).
- [ ] Implement with gray-matter + node:fs.
- [ ] PASS; commit.

### Task 3: External articles + routes + Writing rework

**Files:** Modify `content/site.ts` (replace `writing.articles` with `externalArticles`), `components/Writing.tsx`; Create `app/posts/page.tsx`, `app/posts/[slug]/page.tsx`, `components/PostCard.tsx`; Tests `test/posts-pages.test.tsx`, update `test/writing.test.tsx`, `test/content.test.ts`.
**Produces:** `/posts` index merging local + external by date desc; `/posts/[slug]` static pages; Writing section shows 3 newest merged items + "All posts" link.

- [ ] Failing tests: index lists all titles; external items are outbound links; Writing shows exactly 3 + All posts link.
- [ ] Implement; `generateStaticParams` from `getAllPosts()`.
- [ ] Tests, lint, `npm run build` (verify `out/posts/index.html` and one post page exist); commit.
