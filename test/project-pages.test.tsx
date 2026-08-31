import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, fireEvent } from "@testing-library/react";
import { Projects } from "@/components/Projects";
import { getAllProjectPageSlugs, getProjectPage } from "@/lib/projectPages";
import { site } from "@/content/site";

describe("project case-study pages", () => {
  it("has a markdown file for every project that declares a page", () => {
    const withPage = site.projects.filter((p) => p.page);
    expect(withPage.length).toBeGreaterThanOrEqual(6);
    for (const p of withPage) {
      const slug = p.page!.replace("/projects/", "");
      const file = join(process.cwd(), "content", "projects", `${slug}.md`);
      expect(existsSync(file), `${p.page} missing markdown`).toBe(true);
      const page = getProjectPage(slug);
      expect(page!.title).toBe(p.name);
      expect(page!.body.length).toBeGreaterThan(50);
    }
  });

  it("imported case studies are sanitized", () => {
    for (const slug of getAllProjectPageSlugs()) {
      const body = readFileSync(
        join(process.cwd(), "content", "projects", `${slug}.md`),
        "utf8",
      );
      for (const bad of ["<script", "<iframe", "vc_row", "javascript:"]) {
        expect(body.toLowerCase().includes(bad), `${slug} contains ${bad}`).toBe(false);
      }
    }
  });

  it("cards with a case study hide the inline image and link to the page", () => {
    render(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: /show all projects/i }));
    for (const p of site.projects.filter((x) => x.page)) {
      if (p.image) {
        expect(screen.queryByRole("img", { name: p.imageAlt })).not.toBeInTheDocument();
      }
    }
    const caseLinks = screen.getAllByRole("link", { name: "Case study" });
    expect(caseLinks.length).toBe(site.projects.filter((x) => x.page).length);
  });
});
