import { describe, it, expect } from "vitest";
import { buildRss } from "@/lib/rss";
import { getAllPosts } from "@/lib/posts";
import { GET } from "@/app/feed.xml/route";

const post = {
  slug: "a-post",
  title: "Kafka & Flink <streams>",
  date: "2026-10-13T09:00:00",
  excerpt: "Events \"in\" motion",
  topics: ["Data", "Streaming"],
};

describe("buildRss", () => {
  it("renders an RSS 2.0 channel with one item per post", () => {
    const xml = buildRss([post]);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<atom:link href="https://davidprat.com/feed.xml" rel="self" type="application/rss+xml"/>');
    expect(xml).toContain("<link>https://davidprat.com/posts/a-post</link>");
    expect(xml).toContain('<guid isPermaLink="true">https://davidprat.com/posts/a-post</guid>');
    expect(xml).toContain("<category>Streaming</category>");
  });

  it("escapes XML special characters", () => {
    const xml = buildRss([post]);
    expect(xml).toContain("<title>Kafka &amp; Flink &lt;streams&gt;</title>");
    expect(xml).toContain("<description>Events &quot;in&quot; motion</description>");
  });

  it("uses RFC 822 dates", () => {
    const xml = buildRss([post]);
    expect(xml).toMatch(/<pubDate>Tue, 13 Oct 2026 \d{2}:00:00 GMT<\/pubDate>/);
  });
});

describe("/feed.xml route", () => {
  it("serves every post as RSS", async () => {
    const res = await GET();
    expect(res.headers.get("content-type")).toContain("application/rss+xml");
    const xml = await res.text();
    const items = xml.match(/<item>/g) ?? [];
    expect(items.length).toBe(getAllPosts().length);
  });
});
