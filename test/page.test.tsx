import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";
import { site } from "@/content/site";

describe("Page", () => {
  it("assembles all sections in order", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(site.name);
    const h2s = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(h2s).toEqual([
      "About",
      "Experience",
      "Projects",
      "Education",
      "Writing",
      site.contact.heading,
    ]);
  });
});
