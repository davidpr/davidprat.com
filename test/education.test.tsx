import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Education } from "@/components/Education";
import { site } from "@/content/site";

describe("Education", () => {
  it("renders every education entry with school, degree and period", () => {
    render(<Education />);
    expect(screen.getByRole("heading", { name: /education/i })).toBeInTheDocument();
    for (const e of site.education) {
      expect(screen.getAllByText(e.school).length).toBeGreaterThan(0);
      expect(screen.getByText(e.degree)).toBeInTheDocument();
      expect(screen.getAllByText(e.period).length).toBeGreaterThan(0);
    }
  });
});
