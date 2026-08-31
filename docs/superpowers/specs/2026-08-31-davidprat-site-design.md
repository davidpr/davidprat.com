# davidprat.com — Personal Site Design

**Date:** 2026-08-31
**Status:** Approved defaults (autonomous mode); user may course-correct at any time

## Purpose

Replace the old hacked WordPress site (self-hosted on a Raspberry Pi, offline since ~2025; the domain currently does not resolve) with a small, static personal site that is coherent with David's LinkedIn positioning: **Head of Engineering / Engineering Director — AI Infrastructure & LLM Platforms**, Barcelona or remote EU.

Explicit non-goals, per the originating claude.ai conversation:
- No restore of the old "technical freelancer" content or framing.
- No CMS, no server-side code, no database — minimal attack surface is a stated requirement after the hack.
- No blog. David publishes on LinkedIn and YouTube; the site links out.

## Architecture

- **Framework:** Next.js (App Router) + TypeScript, `output: 'export'` — a fully static build. No API routes, no middleware, no server components that fetch at runtime.
- **Styling:** Tailwind CSS. System font stack, no external font requests.
- **Hosting (later):** Vercel, with the davidprat.com domain pointed at it. **Deployment is out of scope for implementation and requires explicit user approval** — it is outward-facing.
- **Analytics:** none for now (YAGNI; can add Vercel Analytics later).

## Structure

Single page (`app/page.tsx`) composed of small section components, one file each, plus a shared content module:

```
app/
  layout.tsx        — metadata (title, description, OpenGraph), html shell
  page.tsx          — assembles sections in order
  globals.css
components/
  Hero.tsx          — name, headline, location, links (LinkedIn, Finlooker; optional GitHub/YouTube slots)
  About.tsx         — short bio
  Experience.tsx    — highlight cards
  Writing.tsx       — links to articles / channels
  Contact.tsx       — how to reach David
content/
  site.ts           — ALL copy and links as typed data; components render it
```

All text lives in `content/site.ts` so copy edits never touch markup. Components are presentational and independently testable.

## Content (from the LinkedIn About rewritten in the claude.ai chat)

- **Hero:** "David Prat Robles" — "Engineering leader — AI Infrastructure & LLM Platforms" — Barcelona / remote EU. Links: LinkedIn (https://www.linkedin.com/in/davidpratrobles/), Finlooker.io.
- **About:** 2–3 sentence bio: 15+ years building AI-driven products; most recently Senior Engineering Manager at Multiverse Computing leading 4 teams (30+ ML engineers and tech leads) delivering custom LLMs/SLMs to enterprise clients in healthcare, banking and energy; Executive MBA (EAE, 2026); writes about AI infrastructure and LLM internals.
- **Experience highlights** (3–4 short cards, scope + outcome, no dates-as-justification):
  - Multiverse Computing — Senior Engineering Manager: 4 teams / 30+ ML engineers; CompactifAI compression (50%+ size cut, 2–3% benchmark loss); open models on Hugging Face; GPU allocation and CTPO partnership.
  - IAG — Interim Head of Infrastructure / Engineering Manager: DevSecOps architecture across the MRO department; aircraft-maintenance AI assistant (RAG, hierarchical agents) within a €40M cost-savings programme.
  - AUDI AG — Senior Cloud / DevSecOps / SRE consultant.
  - Finlooker.io — Founder: macro-intelligence platform; Next.js on Vercel/Render, CI/CD, Storybook/Chromatic, PostHog.
- **Writing:** link to LinkedIn articles page; placeholder slots for 2 featured articles (the LinkedIn Featured section is currently empty — David is still choosing/pinning them) and for the YouTube channel URL. Placeholders are clearly marked `TODO(user)` in `content/site.ts` and render nothing until filled — no dead links ship.
- **Contact:** LinkedIn message as the primary channel. Email is NOT published unless David explicitly asks.
- **Tone:** plain text, no emoji, no hype adjectives — consistent with the LinkedIn cleanup.

## Design

Clean, executive, text-first. Light and dark via `prefers-color-scheme`. Single column, max-width ~42rem, generous whitespace. No images required for v1 (optional headshot slot later). Accessible: semantic landmarks, visible focus states, AA contrast.

## Error handling

Static site — the failure modes are build-time. Empty/placeholder content fields render as omitted sections/items, never as broken links or empty headings. TypeScript types on `content/site.ts` enforce required fields.

## Testing

- `next build` must pass (static export).
- Vitest + React Testing Library: each section component renders its content from a fixture; Writing section omits unfilled placeholders; page assembles all sections.
- Lint (eslint) clean.

## Out of scope for v1

Deployment to Vercel, domain DNS changes, analytics, blog, contact form, CV download, i18n.
