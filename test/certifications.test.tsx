import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { Certifications } from "@/components/Certifications";
import { site } from "@/content/site";

describe("Certifications", () => {
  it("renders every certification with its own badge image, name and issuer", () => {
    render(<Certifications />);
    expect(screen.getByRole("heading", { name: /certifications/i })).toBeInTheDocument();
    for (const c of site.certifications) {
      expect(screen.getByText(c.name)).toBeInTheDocument();
      expect(screen.getByRole("img", { name: `${c.name} badge` })).toBeInTheDocument();
    }
  });

  it("uses a distinct badge file per certification, present in public/", () => {
    const badges = site.certifications.map((c) => c.badge);
    expect(new Set(badges).size).toBe(badges.length);
    for (const b of badges) {
      expect(existsSync(join(process.cwd(), "public", b)), `${b} missing`).toBe(true);
    }
  });
});
