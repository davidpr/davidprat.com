import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PostsPage from "@/app/posts/page";
import { getFeed, getAllPosts } from "@/lib/posts";
import { site } from "@/content/site";

describe("Posts index page", () => {
  it("lists every feed item newest first with correct links", () => {
    render(<PostsPage />);
    const feed = getFeed(site.externalArticles);
    expect(feed.length).toBeGreaterThanOrEqual(18);
    for (const item of feed) {
      const link = screen.getByText(item.title).closest("a");
      expect(link).toHaveAttribute("href", item.href);
    }
  });

  it("marks external items with their source", () => {
    render(<PostsPage />);
    for (const a of site.externalArticles) {
      expect(screen.getByText(`Read on ${a.source}`)).toBeInTheDocument();
    }
  });

  it("local posts link under /posts/", () => {
    const locals = getAllPosts();
    expect(locals.length).toBeGreaterThanOrEqual(17);
    render(<PostsPage />);
    const first = locals[0];
    expect(screen.getByText(first.title).closest("a")).toHaveAttribute(
      "href",
      `/posts/${first.slug}`,
    );
  });
});
