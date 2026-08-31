import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Contact } from "@/components/Contact";
import { site } from "@/content/site";

describe("Contact", () => {
  it("renders heading, body, and links", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { name: site.contact.heading })).toBeInTheDocument();
    expect(screen.getByText(site.contact.body)).toBeInTheDocument();
    for (const l of site.contact.links) {
      expect(screen.getByRole("link", { name: l.label })).toHaveAttribute("href", l.href);
    }
  });
});
