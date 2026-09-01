import Link from "next/link";
import { site } from "@/content/site";
import { getFeed } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export function Writing() {
  const { intro, channels } = site.writing;
  const latest = getFeed(site.externalArticles).slice(0, 3);
  return (
    <section id="articles" aria-labelledby="writing-heading" className="scroll-mt-16 py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">07</p>
      <h2 id="writing-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        Articles
      </h2>
      <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">{intro}</p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {latest.map((item) => (
          <PostCard key={item.href} item={item} />
        ))}
      </div>
      <p className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/posts"
          className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-neutral-900"
        >
          All posts
        </Link>
        {channels.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium transition-colors hover:border-violet-500/60 dark:border-neutral-700"
          >
            {c.label}
          </a>
        ))}
      </p>
    </section>
  );
}
