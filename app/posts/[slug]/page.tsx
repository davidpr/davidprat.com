import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPost, splitDetails } from "@/lib/posts";
import { site } from "@/content/site";
import { MarkdownLink } from "@/components/MarkdownLink";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.meta.title} — ${site.name}`,
    description: post.meta.excerpt,
    alternates: { canonical: `/posts/${slug}` },
    openGraph: {
      title: post.meta.title,
      description: post.meta.excerpt,
      type: "article",
      publishedTime: post.meta.date,
      authors: [site.name],
      ...(post.meta.cover ? { images: [{ url: post.meta.cover }] } : {}),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
      <header className="pt-14 sm:pt-20">
        <p className="eyebrow">
          <Link
            href="/posts"
            className="text-neutral-500 hover:text-violet-500 dark:text-neutral-400"
          >
            ← All posts
          </Link>
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {post.meta.title}
        </h1>
        <p className="eyebrow mt-3 text-neutral-500 dark:text-neutral-400">
          {post.meta.date.slice(0, 10)}
        </p>
      </header>
      <article className="post-body mt-8">
        {splitDetails(post.body).map((seg, i) =>
          seg.kind === "details" ? (
            <details key={i} className="post-details">
              <summary>{seg.summary}</summary>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>
                {seg.text}
              </ReactMarkdown>
            </details>
          ) : (
            <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>
              {seg.text}
            </ReactMarkdown>
          ),
        )}
      </article>
    </main>
  );
}
