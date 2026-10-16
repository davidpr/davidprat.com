import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";

describe("Footer", () => {
  it("credits the author, copyright range, and last-update date", () => {
    render(<Footer />);
    expect(screen.getByText(`Designed and made by ${site.name}`)).toBeInTheDocument();
    const year = new Date().getFullYear();
    const line = screen.getByText(new RegExp(`© 2018–${year}`));
    expect(line).toHaveTextContent("All rights reserved");
    expect(line).toHaveTextContent(/Last updated: \w+ \d{4}/);
    expect(line).not.toHaveTextContent(/Last updated: \d/);
  });

  it("links to the RSS feed", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "RSS feed" })).toHaveAttribute("href", "/feed.xml");
  });
});
