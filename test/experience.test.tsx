import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Experience } from "@/components/Experience";
import { site } from "@/content/site";

describe("Experience", () => {
  it("renders a heading and one entry per experience item", () => {
    render(<Experience />);
    expect(screen.getByRole("heading", { name: /experience/i })).toBeInTheDocument();
    for (const e of site.experience) {
      expect(screen.getAllByText(e.org).length).toBeGreaterThan(0);
      expect(screen.getAllByText(e.role).length).toBeGreaterThan(0);
      expect(screen.getAllByText(e.period).length).toBeGreaterThan(0);
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
