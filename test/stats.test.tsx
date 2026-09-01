import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stats } from "@/components/Stats";
import { site } from "@/content/site";

describe("Stats", () => {
  it("renders all eight highlight cards", () => {
    render(<Stats />);
    expect(site.stats).toHaveLength(8);
    for (const s of site.stats) {
      expect(screen.getByText(s.value)).toBeInTheDocument();
      expect(screen.getByText(s.label)).toBeInTheDocument();
    }
  });

  it("hero links include GitHub", () => {
    expect(site.heroLinks.map((l) => l.href)).toContain("https://github.com/davidpr");
  });
});
