import Image from "next/image";
import Link from "next/link";
import type { FeedItem } from "@/lib/posts";

export function PostCard({ item }: { item: FeedItem }) {
  const Wrapper = item.external ? "a" : Link;
  return (
    <article className="card reveal flex h-full flex-col overflow-hidden">
      <Wrapper href={item.href} className="flex h-full flex-col">
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
          {item.cover && (
            <Image
              src={item.cover}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="eyebrow shrink-0 text-neutral-500 dark:text-neutral-400">
              {item.date.slice(0, 10)}
            </p>
          </div>
          {item.excerpt && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
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
        </div>
      </Wrapper>
    </article>
  );
}
