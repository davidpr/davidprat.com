import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "@/components/About";
import { site } from "@/content/site";

describe("About", () => {
  it("renders an About heading and every paragraph", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
    for (const p of [...site.about, ...site.aboutClosing]) {
      expect(screen.getByText(p)).toBeInTheDocument();
    }
  });

  it("renders every highlight with title and text", () => {
    render(<About />);
    for (const h of site.aboutHighlights) {
      expect(screen.getByText(h.title)).toBeInTheDocument();
      expect(screen.getByText(h.text)).toBeInTheDocument();
    }
  });
});
