import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Projects } from "@/components/Projects";
import { site } from "@/content/site";

describe("Projects", () => {
  it("shows only the first projects by default", () => {
    render(<Projects />);
    const visible = site.projects.slice(0, site.projectsVisibleCount);
    const hidden = site.projects.slice(site.projectsVisibleCount);
    for (const p of visible) {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    }
    for (const p of hidden) {
      expect(screen.queryByText(p.name)).not.toBeInTheDocument();
    }
  });

  it("expands to all projects on click, rendering details and links", () => {
    render(<Projects />);
    const button = screen.getByRole("button", { name: /show all projects/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    for (const p of site.projects) {
      expect(screen.getByText(p.name)).toBeInTheDocument();
      expect(screen.getByText(p.description)).toBeInTheDocument();
      if (p.image) {
        expect(screen.getByRole("img", { name: p.imageAlt })).toBeInTheDocument();
      }
      expect(screen.getAllByText(p.period).length).toBeGreaterThan(0);
      if (p.href) {
        const label = p.linkLabel ?? `Visit ${p.name}`;
        const links = screen.getAllByRole("link", { name: label });
        expect(links.some((l) => l.getAttribute("href") === p.href)).toBe(true);
      }
    }
  });
});
