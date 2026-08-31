import { describe, it, expect } from "vitest";
import { getAllPosts, getPost } from "@/lib/posts";

describe("posts library", () => {
  it("returns at least 17 posts sorted newest first", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThanOrEqual(17);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
    for (const p of posts) {
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}/);
    }
  });

  it("round-trips a post by slug with markdown body", () => {
    const first = getAllPosts()[0];
    const post = getPost(first.slug);
    expect(post).not.toBeNull();
    expect(post!.meta.title).toBe(first.title);
    expect(post!.body.length).toBeGreaterThan(100);
  });

  it("returns null for an unknown slug", () => {
    expect(getPost("definitely-not-a-post")).toBeNull();
  });
});
