import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Languages } from "@/components/Languages";
import { site } from "@/content/site";

describe("Languages", () => {
  it("renders every language with its level", () => {
    render(<Languages />);
    expect(screen.getByRole("heading", { name: /languages/i })).toBeInTheDocument();
    for (const l of site.languages) {
      expect(screen.getByText(l.name)).toBeInTheDocument();
    }
    expect(screen.getAllByText("Native")).toHaveLength(2);
    expect(screen.getByText("C2")).toBeInTheDocument();
    expect(screen.getAllByText("B2")).toHaveLength(2);
  });

  it("renders credential lines only where present", () => {
    render(<Languages />);
    for (const l of site.languages) {
      if (l.credential) {
        expect(screen.getByText(l.credential)).toBeInTheDocument();
      }
    }
    expect(screen.getByText(/Cambridge English/)).toBeInTheDocument();
  });
});
