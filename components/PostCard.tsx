import Link from "next/link";
import type { FeedItem } from "@/lib/posts";

export function PostCard({ item }: { item: FeedItem }) {
  const Wrapper = item.external ? "a" : Link;
  return (
    <article className="card reveal p-5">
      <Wrapper href={item.href} className="block">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="eyebrow text-neutral-500 dark:text-neutral-400">
            {item.date.slice(0, 10)}
          </p>
        </div>
        {item.excerpt && (
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {item.excerpt}
          </p>
        )}
        {item.external && item.source && (
          <p className="eyebrow mt-2 text-cyan-700 dark:text-cyan-400">
            Read on {item.source}
          </p>
        )}
        {item.topics.length > 0 && (
          <p className="mt-3 flex flex-wrap gap-2">
            {item.topics.map((t) => (
              <span
                key={t}
                className="rounded-full border border-neutral-300/60 px-2.5 py-0.5 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
              >
                {t}
              </span>
            ))}
          </p>
        )}
      </Wrapper>
    </article>
  );
}
