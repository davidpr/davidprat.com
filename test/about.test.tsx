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
