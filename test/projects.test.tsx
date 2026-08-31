import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Projects } from "@/components/Projects";
import { site } from "@/content/site";

describe("Projects", () => {
  it("renders every project with name, role, period, description and link", () => {
    render(<Projects />);
    expect(screen.getByRole("heading", { name: /projects/i })).toBeInTheDocument();
    for (const p of site.projects) {
      expect(screen.getByText(p.name)).toBeInTheDocument();
      expect(screen.getByText(p.role)).toBeInTheDocument();
      expect(screen.getByText(p.period)).toBeInTheDocument();
      expect(screen.getByText(p.description)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: `Visit ${p.name}` })).toHaveAttribute(
        "href",
        p.href,
      );
    }
  });
});
