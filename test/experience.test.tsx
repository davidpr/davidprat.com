import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Experience } from "@/components/Experience";
import { site } from "@/content/site";

describe("Experience", () => {
  it("shows only the most recent roles by default", () => {
    render(<Experience />);
    const visible = site.experience.slice(0, site.experienceVisibleCount);
    const hidden = site.experience.slice(site.experienceVisibleCount);
    for (const e of visible) {
      expect(screen.getAllByText(e.period).length).toBeGreaterThan(0);
      expect(screen.getAllByText(e.role).length).toBeGreaterThan(0);
    }
    for (const e of hidden) {
      expect(screen.queryByText(e.role)).not.toBeInTheDocument();
    }
  });

  it("expands to the full timeline on click and collapses again", () => {
    render(<Experience />);
    const button = screen.getByRole("button", { name: /show full timeline/i });
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    for (const e of site.experience) {
      expect(screen.getAllByText(e.org).length).toBeGreaterThan(0);
      expect(screen.getAllByText(e.role).length).toBeGreaterThan(0);
    }
    for (const e of site.experience) {
      for (const p of e.points) {
        expect(screen.getByText(p)).toBeInTheDocument();
      }
    }

    fireEvent.click(screen.getByRole("button", { name: /show less/i }));
    const hidden = site.experience.slice(site.experienceVisibleCount);
    for (const e of hidden) {
      expect(screen.queryByText(e.role)).not.toBeInTheDocument();
    }
  });
});
