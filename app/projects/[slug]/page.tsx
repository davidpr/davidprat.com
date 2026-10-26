import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllProjectPageSlugs, getProjectPage } from "@/lib/projectPages";
import { site } from "@/content/site";
import { MarkdownLink } from "@/components/MarkdownLink";
import { EmbeddedPage } from "@/components/EmbeddedPage";

export function generateStaticParams() {
  return getAllProjectPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getProjectPage(slug);
  if (!page) return {};
  return {
    title: `${page.title} — ${site.name}`,
    alternates: { canonical: `/projects/${slug}` },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getProjectPage(slug);
  if (!page) notFound();

  const project = site.projects.find((p) => p.page === `/projects/${slug}`);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
      <header className="pt-14 sm:pt-20">
        <p className="eyebrow">
          <Link
            href="/#portfolio"
            className="text-neutral-500 hover:text-violet-500 dark:text-neutral-400"
          >
            ← Portfolio
          </Link>
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{page.title}</h1>
        {project && (
          <p className="eyebrow mt-3 text-neutral-500 dark:text-neutral-400">
            {project.byline} · {project.period}
          </p>
        )}
      </header>
      <article className="post-body mt-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>
          {page.body}
        </ReactMarkdown>
      </article>
      {page.embed && (
        <div className="mt-10 sm:-mx-[calc((min(100vw_-_3rem,72rem)_-_100%)/2)]">
          <EmbeddedPage src={page.embed.src} title={page.embed.title} />
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            <a href={page.embed.src} className="underline hover:text-violet-500">
              Open it full screen
            </a>
          </p>
        </div>
      )}
    </main>
  );
}
