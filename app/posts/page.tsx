import type { Metadata } from "next";
import Link from "next/link";
import { getFeed } from "@/lib/posts";
import { site } from "@/content/site";
import { PostsExplorer } from "@/components/PostsExplorer";

export const metadata: Metadata = {
  title: `Posts — ${site.name}`,
  description: "Technical posts on AI infrastructure, Kubernetes, data platforms and LLMs.",
  alternates: { canonical: "/posts" },
};

export default function PostsPage() {
  const feed = getFeed(site.externalArticles);
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:max-w-4xl">
      <header className="pt-14 sm:pt-24">
        <p className="eyebrow">
          <Link href="/" className="text-neutral-500 hover:text-violet-500 dark:text-neutral-400">
            ← davidprat.com
          </Link>
        </p>
        <h1 className="gradient-text mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Posts
        </h1>
        <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
          Technical writing on AI infrastructure, Kubernetes, data platforms and LLMs —
          from 2018 to today.
        </p>
      </header>
      <PostsExplorer feed={feed} />
    </main>
  );
}
