import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PostsExplorer } from "@/components/PostsExplorer";
import { getFeed } from "@/lib/posts";
import { site } from "@/content/site";

describe("PostsExplorer", () => {
  it("shows all items by default with topic counts", () => {
    const feed = getFeed(site.externalArticles);
    render(<PostsExplorer feed={feed} />);
    expect(screen.getByRole("button", { name: `All (${feed.length})` })).toBeInTheDocument();
    for (const t of ["AI & LLMs", "Kubernetes", "DevOps & CI/CD", "Data & Streaming"]) {
      expect(screen.getByRole("button", { name: new RegExp(t.replace(/[&/]/g, ".")) })).toBeInTheDocument();
    }
  });

  it("filters the list when a topic is selected and toggles back", () => {
    const feed = getFeed(site.externalArticles);
    render(<PostsExplorer feed={feed} />);
    const kub = screen.getByRole("button", { name: /^Kubernetes/ });
    fireEvent.click(kub);
    expect(kub).toHaveAttribute("aria-pressed", "true");
    const shown = screen.getAllByRole("heading", { level: 3 });
    const expected = feed.filter((i) => i.topics.includes("Kubernetes"));
    expect(shown).toHaveLength(expected.length);
    expect(shown.length).toBeGreaterThanOrEqual(4);
    for (const h of shown) {
      const item = feed.find((i) => i.title === h.textContent);
      expect(item?.topics).toContain("Kubernetes");
    }
    fireEvent.click(kub);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(feed.length);
  });

  it("every post carries at least one topic", () => {
    const feed = getFeed(site.externalArticles);
    for (const i of feed) {
      expect(i.topics.length, `${i.title} has no topics`).toBeGreaterThan(0);
    }
  });
});
