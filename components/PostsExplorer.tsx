"use client";

import { useMemo, useState } from "react";
import type { FeedItem } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export function PostsExplorer({ feed }: { feed: FeedItem[] }) {
  const [topic, setTopic] = useState<string | null>(null);
  const topics = useMemo(
    () => [...new Set(feed.flatMap((i) => i.topics))].sort(),
    [feed],
  );
  const visible = topic ? feed.filter((i) => i.topics.includes(topic)) : feed;

  const base =
    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors";
  const active =
    "border-violet-500 bg-violet-500/15 text-violet-700 dark:text-violet-300";
  const inactive =
    "border-neutral-300 text-neutral-600 hover:border-violet-500/60 dark:border-neutral-700 dark:text-neutral-400";

  return (
    <>
      <div role="group" aria-label="Filter by topic" className="mt-8 flex flex-wrap gap-2.5">
        <button
          type="button"
          aria-pressed={topic === null}
          onClick={() => setTopic(null)}
          className={`${base} ${topic === null ? active : inactive}`}
        >
          All ({feed.length})
        </button>
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={topic === t}
            onClick={() => setTopic(topic === t ? null : t)}
            className={`${base} ${topic === t ? active : inactive}`}
          >
            {t} ({feed.filter((i) => i.topics.includes(t)).length})
          </button>
        ))}
      </div>
      <div className="mt-8 space-y-5">
        {visible.map((item) => (
          <PostCard key={item.href} item={item} />
        ))}
      </div>
    </>
  );
}
