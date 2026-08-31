# Full Certification Wall Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the Certifications section to all 15 verified certifications — Kubernetes (CKA/CKAD/CKS), AWS (DevOps Pro, SA Associate, Security Specialty, SysOps Associate), Terraform Associate, Prometheus CA, LPIC-1, the three SAFe 6 certs and two Microsoft Azure fundamentals — each with its own official badge image, collapsed to the first 6 with an expand toggle.

**Architecture:** Badge images already recovered into `public/badges/` (10 new files from the Wayback archive of the old davidprat.com, 5 already present from Credly). `content/site.ts` gains the 10 new `CertificationItem` entries plus a `certificationsVisibleCount`; `Certifications.tsx` becomes a client component with the same show/hide pattern as Experience and Projects.

**Tech Stack:** Existing Next.js static-export site, Vitest + RTL.

**Spec:** `docs/superpowers/specs/2026-08-31-davidprat-site-design.md` (Certifications section follows the established collapse pattern; content rules: no dead links, tone plain).

## Global Constraints

- Badge files must exist in `public/badges/` and be unique per certification (existing test enforces this).
- Cert names must match the credentials verified from the user's own former site and LinkedIn — no invented credential titles.
- Toggle must expose `aria-expanded`, matching Experience/Projects.

---

### Task 1: Extend content, add toggle, update tests

**Files:**
- Modify: `content/site.ts` (certifications array + `certificationsVisibleCount`)
- Modify: `components/Certifications.tsx` (client component with toggle)
- Test: `test/certifications.test.tsx`

**Interfaces:**
- Consumes: `CertificationItem { name, issuer, badge }`, `site.certifications`.
- Produces: `site.certificationsVisibleCount: number` (6); `Certifications()` renders first 6, button "Show all certifications (N more)" expands.

- [ ] **Step 1: Extend the failing tests** — default renders exactly `certificationsVisibleCount` badges; clicking the toggle shows all 15; badge files exist and are unique.
- [ ] **Step 2: Run tests, confirm failure** (`npm test`).
- [ ] **Step 3: Add the 10 entries and count to `content/site.ts`; convert `Certifications.tsx` to a client component with the toggle.**
- [ ] **Step 4: Run tests, lint, build** (`npm test && npm run lint && npm run build`).
- [ ] **Step 5: Commit.**
