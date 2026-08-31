import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { Certifications } from "@/components/Certifications";
import { site } from "@/content/site";

describe("Certifications", () => {
  it("renders every certification area with logo and detail", () => {
    render(<Certifications />);
    expect(screen.getByRole("heading", { name: /certifications/i })).toBeInTheDocument();
    for (const c of site.certifications) {
      expect(screen.getByRole("heading", { name: c.area })).toBeInTheDocument();
      expect(screen.getByText(c.detail)).toBeInTheDocument();
      expect(screen.getByRole("img", { name: c.logoAlt })).toBeInTheDocument();
    }
  });

  it("references badge files that exist in public/", () => {
    for (const c of site.certifications) {
      expect(existsSync(join(process.cwd(), "public", c.logo)), `${c.logo} missing`).toBe(true);
    }
  });
});
