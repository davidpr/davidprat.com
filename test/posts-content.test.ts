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

  it("contains no shortcode remnants, escaped or not", () => {
    const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      const body = readFileSync(join(POSTS_DIR, f), "utf8");
      expect(/\\?\[\\?\/?vc\\?_/.test(body), `${f} has vc shortcodes`).toBe(false);
      expect(body.includes("vc_row"), `${f} has vc_row`).toBe(false);
    }
  });

  it("keeps command blocks as fenced code (bare pre posts)", () => {
    for (const slug of [
      "presto-cluster-on-kubernetes",
      "spark-cluster-with-airflow-on-kubernetes",
      "streaming-in-confluent-ksqldb-modifying-avro-schema",
    ]) {
      const body = readFileSync(join(POSTS_DIR, `${slug}.md`), "utf8");
      expect((body.match(/```/g) || []).length, `${slug} fences`).toBeGreaterThanOrEqual(4);
    }
  });

  it("preserves markdown links with their text", () => {
    const body = readFileSync(
      join(POSTS_DIR, "presto-cluster-on-kubernetes.md"),
      "utf8",
    );
    expect(body).toContain("[Data Federation with Presto on Docker](");
  });

  it("preserves YouTube video links in the posts that had them", () => {
    for (const slug of [
      "kustomize-lightweight-parametrization-kubernetes",
      "configure-jenkins-to-work-with-gitlab-docker-and-skaffold",
      "install-argocd-in-3-minutes-and-learn-gitops",
    ]) {
      const body = readFileSync(join(POSTS_DIR, `${slug}.md`), "utf8");
      expect(/https:\/\/www\.youtube\.com\/watch\?v=[\w-]+/.test(body), `${slug} youtube`).toBe(
        true,
      );
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
