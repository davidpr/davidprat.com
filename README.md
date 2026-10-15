# davidprat.com

Personal website of David Prat Robles: profile, experience, projects and articles on AI, data and platform engineering.

Live at [davidprat.com](https://davidprat.com).

## Stack

- [Next.js](https://nextjs.org) (App Router) with static export (`output: "export"`), React 19, Tailwind CSS 4
- Posts in Markdown (`content/posts/*.md`), rendered with react-markdown and remark-gfm; `:::details <summary>` blocks
  become collapsible sections
- Site content in `content/site.ts`; résumé PDF generated with `@react-pdf/renderer`
- Tests with Vitest and Testing Library
- Deployed on Vercel: every push to `main` deploys to production

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # unit and component tests
npm run build        # static export to out/
npm run generate:resume
```

## Layout

- `app/` routes: home, `/posts`, `/posts/[slug]`, `/projects/[slug]`
- `components/` page sections and cards
- `content/` site content, posts and project pages
- `public/` images, résumé and post assets
- `diagrams/` sources of the article diagrams (see `diagrams/README.md`)
- `scripts/` content importers and the résumé generator
