import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { render, screen, fireEvent } from "@testing-library/react";
import { Certifications } from "@/components/Certifications";
import { site } from "@/content/site";

describe("Certifications", () => {
  it("shows only the first certifications by default and expands on click", () => {
    render(<Certifications />);
    expect(screen.getByRole("heading", { name: /certifications/i })).toBeInTheDocument();
    const visible = site.certifications.slice(0, site.certificationsVisibleCount);
    const hidden = site.certifications.slice(site.certificationsVisibleCount);
    for (const c of visible) {
      expect(screen.getByText(c.name)).toBeInTheDocument();
    }
    for (const c of hidden) {
      expect(screen.queryByText(c.name)).not.toBeInTheDocument();
    }

    const button = screen.getByRole("button", { name: /show all certifications/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    for (const c of site.certifications) {
      expect(screen.getByText(c.name)).toBeInTheDocument();
      expect(screen.getByRole("img", { name: `${c.name} badge` })).toBeInTheDocument();
    }
  });

  it("covers the Kubernetes, AWS and Terraform credential families", () => {
    const all = site.certifications.map((c) => c.name).join(" | ");
    expect(all).toMatch(/Kubernetes Administrator/);
    expect(all).toMatch(/Kubernetes Application Developer/);
    expect(all).toMatch(/Kubernetes Security Specialist/);
    expect(all).toMatch(/AWS Certified DevOps Engineer/);
    expect(all).toMatch(/AWS Certified Solutions Architect/);
    expect(all).toMatch(/Terraform Associate/);
    expect(all).toMatch(/Prometheus/);
    expect(site.certifications.length).toBeGreaterThanOrEqual(15);
  });

  it("uses a distinct badge file per certification, present in public/", () => {
    const badges = site.certifications.map((c) => c.badge);
    expect(new Set(badges).size).toBe(badges.length);
    for (const b of badges) {
      expect(existsSync(join(process.cwd(), "public", b)), `${b} missing`).toBe(true);
    }
  });
});
