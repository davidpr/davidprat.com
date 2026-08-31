import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stats } from "@/components/Stats";
import { site } from "@/content/site";

describe("Stats", () => {
  it("renders every stat value and label", () => {
    render(<Stats />);
    for (const s of site.stats) {
      expect(screen.getByText(s.value)).toBeInTheDocument();
      expect(screen.getByText(s.label)).toBeInTheDocument();
    }
  });
});
