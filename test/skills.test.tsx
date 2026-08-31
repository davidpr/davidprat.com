import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skills } from "@/components/Skills";
import { site } from "@/content/site";

describe("Skills", () => {
  it("renders the LinkedIn top skills", () => {
    render(<Skills />);
    expect(site.topSkills).toHaveLength(9);
    for (const s of site.topSkills) {
      expect(screen.getByText(s)).toBeInTheDocument();
    }
    expect(site.topSkills).toContain("Artificial Intelligence (AI)");
    expect(site.topSkills).toContain("DevSecOps");
  });
});
