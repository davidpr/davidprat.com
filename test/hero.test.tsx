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
