"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

export function Projects() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? site.projects : site.projects.slice(0, site.projectsVisibleCount);
  const hiddenCount = site.projects.length - site.projectsVisibleCount;

  return (
    <section aria-labelledby="projects-heading" className="py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">03</p>
      <h2 id="projects-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        Projects
      </h2>
      <div className="mt-6 space-y-5">
        {visible.map((p) => (
          <article key={p.name} className="card p-4 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="eyebrow text-neutral-500 dark:text-neutral-400">{p.period}</p>
            </div>
            <p className="eyebrow mt-1 text-cyan-700 dark:text-cyan-400">{p.byline}</p>
            <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              {p.description}
            </p>
            {p.image && !p.page && (
              <Image
                src={p.image}
                alt={p.imageAlt ?? `${p.name} diagram`}
                width={1400}
                height={800}
                unoptimized
                className="mt-4 h-auto w-full rounded-lg bg-white"
              />
            )}
            {p.stack && (
              <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">{p.stack}</p>
            )}
            {(p.href || p.page) && (
              <p className="mt-5 flex flex-wrap gap-3">
                {p.page && (
                  <Link
                    href={p.page}
                    className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-neutral-900"
                  >
                    Case study
                  </Link>
                )}
                {p.href && (
                  <a
                    href={p.href}
                    className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium transition-colors hover:border-violet-500/60 dark:border-neutral-700"
                  >
                    {p.linkLabel ?? `Visit ${p.name}`}
                  </a>
                )}
              </p>
            )}
          </article>
        ))}
      </div>
      {hiddenCount > 0 && (
        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll((v) => !v)}
          className="mt-8 rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium transition-colors hover:border-violet-500/60 dark:border-neutral-700"
        >
          {showAll ? "Show fewer projects" : `Show all projects (${hiddenCount} more)`}
        </button>
      )}
    </section>
  );
}
