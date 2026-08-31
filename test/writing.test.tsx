import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Writing } from "@/components/Writing";
import { site } from "@/content/site";
import { getFeed } from "@/lib/posts";

describe("Writing", () => {
  it("renders intro, channel links and the All posts link", () => {
    render(<Writing />);
    expect(screen.getByText(site.writing.intro)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All posts" })).toHaveAttribute("href", "/posts");
    for (const c of site.writing.channels) {
      expect(screen.getByRole("link", { name: c.label })).toHaveAttribute("href", c.href);
    }
  });

  it("shows the three newest feed items", () => {
    render(<Writing />);
    const latest = getFeed(site.externalArticles).slice(0, 3);
    expect(latest).toHaveLength(3);
    for (const item of latest) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }
  });
});
