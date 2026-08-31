import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Writing } from "@/components/Writing";
import { site } from "@/content/site";

describe("Writing", () => {
  it("renders intro and channel links", () => {
    render(<Writing />);
    expect(screen.getByText(site.writing.intro)).toBeInTheDocument();
    for (const c of site.writing.channels) {
      expect(screen.getByRole("link", { name: c.label })).toHaveAttribute("href", c.href);
    }
  });

  it("omits the articles list when there are no articles", () => {
    render(<Writing />);
    if (site.writing.articles.length === 0) {
      expect(screen.queryByRole("list", { name: /articles/i })).not.toBeInTheDocument();
    } else {
      for (const a of site.writing.articles) {
        expect(screen.getByRole("link", { name: a.title })).toHaveAttribute("href", a.href);
      }
    }
  });
});
