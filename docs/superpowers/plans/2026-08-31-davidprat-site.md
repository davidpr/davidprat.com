# davidprat.com Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, fully static personal site for David Prat Robles, coherent with his LinkedIn positioning (Head of Engineering / Engineering Director — AI Infrastructure & LLM Platforms).

**Architecture:** Next.js App Router with `output: 'export'` (pure static build, no server code). All copy lives in a typed content module (`content/site.ts`); five small presentational section components render it; `app/page.tsx` assembles them. Vitest + React Testing Library for component tests.

**Tech Stack:** Next.js (latest, App Router), TypeScript, Tailwind CSS v4, Vitest, @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-08-31-davidprat-site-design.md`

## Global Constraints

- Fully static: `output: 'export'` in `next.config.ts`; no API routes, no middleware, no runtime fetching.
- All copy and links in `content/site.ts`; components never hardcode copy.
- Tone: plain text, no emoji, no hype adjectives.
- Unfilled placeholder content (`null` fields / empty arrays) renders as omitted — no dead links, no empty headings.
- Do NOT publish an email address anywhere.
- No external font or asset requests; system font stack.
- Light and dark themes via `prefers-color-scheme` (Tailwind `dark:` variant default behavior).
- Deployment is OUT OF SCOPE — never run `vercel` or push to any remote.

---

### Task 1: Scaffold project and test tooling

**Files:**
- Create: entire Next.js scaffold at repo root (create-next-app), `next.config.ts`, `vitest.config.mts`, `vitest.setup.ts`
- Modify: `package.json` (test script)

**Interfaces:**
- Produces: a repo where `npm run build` emits a static export to `out/` and `npm test` runs Vitest with jsdom + RTL. Path alias `@/*` → repo root.

- [ ] **Step 1: Scaffold Next.js in the existing directory**

Run (repo root; create-next-app tolerates existing `.git` and `docs/`):

```bash
npx --yes create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes --skip-install --disable-git
npm install
```

If it refuses because the directory is non-empty, scaffold into a temp dir and move everything except `.git`/`docs` back:

```bash
npx --yes create-next-app@latest /tmp/dp-scaffold --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes --disable-git
rsync -a --exclude .git --exclude docs /tmp/dp-scaffold/ ./
npm install
```

- [ ] **Step 2: Configure static export**

Replace `next.config.ts` content with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
```

- [ ] **Step 3: Verify static build works**

Run: `npm run build`
Expected: success, and `out/index.html` exists (`ls out/index.html`).

- [ ] **Step 4: Install and configure Vitest + RTL**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom vite-tsconfig-paths
```

Create `vitest.config.mts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 5: Verify test runner works**

Run: `npm test`
Expected: "No test files found" exit (or passes with zero tests) — the runner itself starts without config errors. If Vitest exits non-zero on zero tests, add `passWithNoTests: true` to the `test` block in `vitest.config.mts`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js static-export project with Vitest"
```

---

### Task 2: Typed content module

**Files:**
- Create: `content/site.ts`
- Test: `test/content.test.ts`

**Interfaces:**
- Produces: `site` export of type `SiteContent`:

```ts
export type LinkItem = { label: string; href: string };
export type ExperienceItem = { org: string; role: string; points: string[] };
export type ArticleItem = { title: string; href: string };
export type SiteContent = {
  name: string;
  headline: string;
  location: string;
  heroLinks: LinkItem[];          // only filled links; no null hrefs
  about: string[];                // paragraphs
  experience: ExperienceItem[];
  writing: {
    intro: string;
    articles: ArticleItem[];      // empty until user pins articles — section renders links list only when non-empty
    channels: LinkItem[];         // LinkedIn articles page now; YouTube later
  };
  contact: { heading: string; body: string; links: LinkItem[] };
};
```

- [ ] **Step 1: Write the failing test**

Create `test/content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("site content", () => {
  it("has the core identity fields", () => {
    expect(site.name).toBe("David Prat Robles");
    expect(site.headline.length).toBeGreaterThan(10);
    expect(site.location).toContain("Barcelona");
  });

  it("contains no emoji or unicode-bold characters anywhere", () => {
    const all = JSON.stringify(site);
    expect(all).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1D400}-\u{1D7FF}]/u);
  });

  it("has only absolute https hrefs in links", () => {
    const links = [
      ...site.heroLinks,
      ...site.writing.articles,
      ...site.writing.channels,
      ...site.contact.links,
    ];
    for (const l of links) expect(l.href).toMatch(/^https:\/\//);
  });

  it("does not publish an email address", () => {
    expect(JSON.stringify(site)).not.toMatch(/@gmail|mailto:/i);
  });

  it("has experience highlights with points", () => {
    expect(site.experience.length).toBeGreaterThanOrEqual(3);
    for (const e of site.experience) {
      expect(e.org).toBeTruthy();
      expect(e.role).toBeTruthy();
      expect(e.points.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `@/content/site`.

- [ ] **Step 3: Write the content module**

Create `content/site.ts`:

```ts
export type LinkItem = { label: string; href: string };
export type ExperienceItem = { org: string; role: string; points: string[] };
export type ArticleItem = { title: string; href: string };
export type SiteContent = {
  name: string;
  headline: string;
  location: string;
  heroLinks: LinkItem[];
  about: string[];
  experience: ExperienceItem[];
  writing: {
    intro: string;
    articles: ArticleItem[];
    channels: LinkItem[];
  };
  contact: { heading: string; body: string; links: LinkItem[] };
};

// TODO(user): when articles are pinned on LinkedIn Featured, add them to
// writing.articles; add the YouTube channel URL to writing.channels.
export const site: SiteContent = {
  name: "David Prat Robles",
  headline: "Engineering leader — AI Infrastructure & LLM Platforms",
  location: "Barcelona · remote EU",
  heroLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/davidpratrobles/" },
    { label: "Finlooker.io", href: "https://finlooker.io" },
  ],
  about: [
    "Engineering leader with 15+ years building AI-driven products, most recently as Senior Engineering Manager at Multiverse Computing, leading 4 teams (30+ ML engineers and tech leads) delivering custom LLMs and SLMs to enterprise clients in healthcare, banking and energy.",
    "Before that: Interim Head of Infrastructure and Engineering Manager at IAG, senior cloud and SRE consulting for AUDI AG, and founder of Finlooker, a macroeconomic-intelligence platform.",
    "Executive MBA (EAE, 2026). I write about AI infrastructure and LLM internals.",
  ],
  experience: [
    {
      org: "Multiverse Computing",
      role: "Senior Engineering Manager",
      points: [
        "Managed 4 teams (30+ ML engineers, 4 tech leads) building custom LLMs and SLMs for enterprise clients in healthcare, banking and energy.",
        "Cut model size 50%+ at 2–3% benchmark cost with CompactifAI, saving clients roughly half their inference budget on average.",
        "Co-led the cross-department LLM pipeline from research to production API serving and on-device deployment; open releases on Hugging Face.",
        "Partnered with the CTPO on roadmap and OKRs; owned GPU allocation across teams.",
      ],
    },
    {
      org: "IAG",
      role: "Interim Head of Infrastructure · Engineering Manager",
      points: [
        "Led DevSecOps architecture across the MRO department.",
        "Led technical delivery of an aircraft-maintenance AI assistant (RAG, hierarchical agents, serverless ingestion) within a €40M cost-savings programme.",
      ],
    },
    {
      org: "AUDI AG",
      role: "Senior Cloud / DevSecOps / SRE Consultant",
      points: [
        "Senior cloud, DevSecOps and SRE consulting for global automotive platforms.",
      ],
    },
    {
      org: "Finlooker.io",
      role: "Founder",
      points: [
        "Building a macroeconomic-intelligence platform solo: Next.js on Vercel and Render, GitHub Actions CI/CD, Storybook and Chromatic for visual regression, PostHog for product analytics.",
      ],
    },
  ],
  writing: {
    intro: "I write about AI infrastructure and LLM internals.",
    articles: [],
    channels: [
      {
        label: "Articles on LinkedIn",
        href: "https://www.linkedin.com/in/davidpratrobles/recent-activity/articles/",
      },
    ],
  },
  contact: {
    heading: "Contact",
    body: "The fastest way to reach me is a LinkedIn message.",
    links: [
      { label: "Message me on LinkedIn", href: "https://www.linkedin.com/in/davidpratrobles/" },
    ],
  },
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (all 5 tests).

- [ ] **Step 5: Commit**

```bash
git add content/site.ts test/content.test.ts
git commit -m "feat: add typed site content module"
```

---

### Task 3: Hero and About components

**Files:**
- Create: `components/Hero.tsx`, `components/About.tsx`
- Test: `test/hero.test.tsx`, `test/about.test.tsx`

**Interfaces:**
- Consumes: `site`, `LinkItem` from `@/content/site` (Task 2).
- Produces: `Hero()` and `About()` — parameterless server-compatible React components rendering from `site`.

- [ ] **Step 1: Write the failing tests**

Create `test/hero.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/Hero";
import { site } from "@/content/site";

describe("Hero", () => {
  it("renders name as the top-level heading", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(site.name);
  });

  it("renders headline, location, and every hero link", () => {
    render(<Hero />);
    expect(screen.getByText(site.headline)).toBeInTheDocument();
    expect(screen.getByText(site.location)).toBeInTheDocument();
    for (const l of site.heroLinks) {
      expect(screen.getByRole("link", { name: l.label })).toHaveAttribute("href", l.href);
    }
  });
});
```

Create `test/about.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "@/components/About";
import { site } from "@/content/site";

describe("About", () => {
  it("renders an About heading and every paragraph", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
    for (const p of site.about) {
      expect(screen.getByText(p)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `@/components/Hero` / `@/components/About`.

- [ ] **Step 3: Implement the components**

Create `components/Hero.tsx`:

```tsx
import { site } from "@/content/site";

export function Hero() {
  return (
    <header className="pt-16 pb-12">
      <h1 className="text-3xl font-semibold tracking-tight">{site.name}</h1>
      <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">{site.headline}</p>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">{site.location}</p>
      <nav aria-label="Profiles" className="mt-4 flex gap-4">
        {site.heroLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm underline underline-offset-4 hover:no-underline"
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
```

Create `components/About.tsx`:

```tsx
import { site } from "@/content/site";

export function About() {
  return (
    <section aria-labelledby="about-heading" className="py-8">
      <h2 id="about-heading" className="text-xl font-semibold">
        About
      </h2>
      <div className="mt-3 space-y-3">
        {site.about.map((p) => (
          <p key={p} className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx components/About.tsx test/hero.test.tsx test/about.test.tsx
git commit -m "feat: add Hero and About sections"
```

---

### Task 4: Experience, Writing, and Contact components

**Files:**
- Create: `components/Experience.tsx`, `components/Writing.tsx`, `components/Contact.tsx`
- Test: `test/experience.test.tsx`, `test/writing.test.tsx`, `test/contact.test.tsx`

**Interfaces:**
- Consumes: `site` from `@/content/site` (Task 2).
- Produces: `Experience()`, `Writing()`, `Contact()` — parameterless components. `Writing` renders the articles list ONLY when `site.writing.articles` is non-empty.

- [ ] **Step 1: Write the failing tests**

Create `test/experience.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Experience } from "@/components/Experience";
import { site } from "@/content/site";

describe("Experience", () => {
  it("renders a heading and one entry per experience item", () => {
    render(<Experience />);
    expect(screen.getByRole("heading", { name: /experience/i })).toBeInTheDocument();
    for (const e of site.experience) {
      expect(screen.getByText(e.org)).toBeInTheDocument();
      expect(screen.getByText(e.role)).toBeInTheDocument();
    }
  });

  it("renders every point of every entry", () => {
    render(<Experience />);
    for (const e of site.experience) {
      for (const p of e.points) {
        expect(screen.getByText(p)).toBeInTheDocument();
      }
    }
  });
});
```

Create `test/writing.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Writing } from "@/components/Writing";
import { site } from "@/content/site";

describe("Writing", () => {
  it("renders intro and channel links", () => {
    render(<Writing />);
    expect(screen.getByText(site.writing.intro)).toBeInTheDocument();
    for (const c of site.writing.channels) {
      expect(screen.getByRole("link", { name: c.label })).toHaveAttribute("href", c.href);
    }
  });

  it("omits the articles list when there are no articles", () => {
    render(<Writing />);
    if (site.writing.articles.length === 0) {
      expect(screen.queryByRole("list", { name: /articles/i })).not.toBeInTheDocument();
    } else {
      for (const a of site.writing.articles) {
        expect(screen.getByRole("link", { name: a.title })).toHaveAttribute("href", a.href);
      }
    }
  });
});
```

Create `test/contact.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Contact } from "@/components/Contact";
import { site } from "@/content/site";

describe("Contact", () => {
  it("renders heading, body, and links", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { name: site.contact.heading })).toBeInTheDocument();
    expect(screen.getByText(site.contact.body)).toBeInTheDocument();
    for (const l of site.contact.links) {
      expect(screen.getByRole("link", { name: l.label })).toHaveAttribute("href", l.href);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement the components**

Create `components/Experience.tsx`:

```tsx
import { site } from "@/content/site";

export function Experience() {
  return (
    <section aria-labelledby="experience-heading" className="py-8">
      <h2 id="experience-heading" className="text-xl font-semibold">
        Experience
      </h2>
      <div className="mt-4 space-y-8">
        {site.experience.map((e) => (
          <article key={`${e.org}-${e.role}`}>
            <h3 className="font-medium">{e.org}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{e.role}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {e.points.map((p) => (
                <li key={p} className="leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Create `components/Writing.tsx`:

```tsx
import { site } from "@/content/site";

export function Writing() {
  const { intro, articles, channels } = site.writing;
  return (
    <section aria-labelledby="writing-heading" className="py-8">
      <h2 id="writing-heading" className="text-xl font-semibold">
        Writing
      </h2>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">{intro}</p>
      {articles.length > 0 && (
        <ul aria-label="Articles" className="mt-3 list-disc space-y-1 pl-5">
          {articles.map((a) => (
            <li key={a.href}>
              <a href={a.href} className="underline underline-offset-4 hover:no-underline">
                {a.title}
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 flex gap-4">
        {channels.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="text-sm underline underline-offset-4 hover:no-underline"
          >
            {c.label}
          </a>
        ))}
      </p>
    </section>
  );
}
```

Create `components/Contact.tsx`:

```tsx
import { site } from "@/content/site";

export function Contact() {
  return (
    <section aria-labelledby="contact-heading" className="py-8">
      <h2 id="contact-heading" className="text-xl font-semibold">
        {site.contact.heading}
      </h2>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
        {site.contact.body}
      </p>
      <p className="mt-3 flex gap-4">
        {site.contact.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm underline underline-offset-4 hover:no-underline"
          >
            {l.label}
          </a>
        ))}
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/Experience.tsx components/Writing.tsx components/Contact.tsx test/experience.test.tsx test/writing.test.tsx test/contact.test.tsx
git commit -m "feat: add Experience, Writing, and Contact sections"
```

---

### Task 5: Page assembly, layout metadata, and final verification

**Files:**
- Modify: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`
- Delete: scaffold assets not used (`public/*.svg` defaults, if present)
- Test: `test/page.test.tsx`

**Interfaces:**
- Consumes: all five components from Tasks 3–4; `site` from Task 2.

- [ ] **Step 1: Write the failing test**

Create `test/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";
import { site } from "@/content/site";

describe("Page", () => {
  it("assembles all sections in order", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(site.name);
    const h2s = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(h2s).toEqual(["About", "Experience", "Writing", site.contact.heading]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — default scaffold page has no such headings.

- [ ] **Step 3: Implement page and layout**

Replace `app/page.tsx`:

```tsx
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Writing } from "@/components/Writing";
import { Contact } from "@/components/Contact";

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-6 pb-24">
      <Hero />
      <About />
      <Experience />
      <Writing />
      <Contact />
    </main>
  );
}
```

Replace `app/layout.tsx` (keep the scaffold's globals.css import; drop Google font imports — system stack only):

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.headline}`,
  description: site.about[0],
  openGraph: {
    title: site.name,
    description: site.headline,
    url: "https://davidprat.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
```

Replace `app/globals.css` with (Tailwind v4 syntax; if scaffold generated v3 syntax with `@tailwind` directives, keep those directives instead of the import line):

```css
@import "tailwindcss";

:root {
  color-scheme: light dark;
}

body {
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

Remove unused scaffold assets if present:

```bash
rm -f public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
```

- [ ] **Step 4: Run all tests, lint, and build**

Run: `npm test && npm run lint && npm run build`
Expected: all tests PASS, lint clean, build succeeds with `out/index.html` present. If the scaffolded `package.json` has no `lint` script (newer create-next-app versions), run `npx eslint .` instead.

- [ ] **Step 5: Verify rendered output contains real content**

Run: `grep -o "David Prat Robles" out/index.html | head -1`
Expected: `David Prat Robles`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: assemble single-page site with metadata and system font stack"
```
