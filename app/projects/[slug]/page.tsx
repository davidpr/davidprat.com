import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllProjectPageSlugs, getProjectPage } from "@/lib/projectPages";
import { site } from "@/content/site";
import { MarkdownLink } from "@/components/MarkdownLink";

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
  return { title: `${page.title} — ${site.name}` };
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
            href="/#projects-heading"
            className="text-neutral-500 hover:text-violet-500 dark:text-neutral-400"
          >
            ← Projects
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
    </main>
  );
}
