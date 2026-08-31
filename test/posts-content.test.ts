import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const POSTS_DIR = join(process.cwd(), "content", "posts");

describe("imported posts content", () => {
  it("has at least 17 markdown posts with valid frontmatter", () => {
    const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
    expect(files.length).toBeGreaterThanOrEqual(17);
    for (const f of files) {
      const { data } = matter(readFileSync(join(POSTS_DIR, f), "utf8"));
      expect(data.title, `${f} title`).toBeTruthy();
      expect(String(data.date), `${f} date`).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(typeof data.excerpt, `${f} excerpt`).toBe("string");
    }
  });

  it("contains no unsafe HTML remnants", () => {
    const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      const body = readFileSync(join(POSTS_DIR, f), "utf8");
      for (const bad of ["<script", "<iframe", "onerror=", "javascript:"]) {
        expect(body.toLowerCase().includes(bad), `${f} contains ${bad}`).toBe(false);
      }
    }
  });

  it("references only local images that exist", () => {
    const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      const body = readFileSync(join(POSTS_DIR, f), "utf8");
      const refs = [...body.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]);
      for (const r of refs) {
        expect(r.startsWith("/posts/"), `${f} image ${r} not local`).toBe(true);
        expect(
          readdirSync(join(process.cwd(), "public", "posts")).length,
        ).toBeGreaterThan(0);
      }
    }
  });
});
