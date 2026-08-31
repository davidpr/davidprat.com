import { site } from "@/content/site";

export function Projects() {
  return (
    <section aria-labelledby="projects-heading" className="py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">03</p>
      <h2 id="projects-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        Projects
      </h2>
      <div className="mt-6 space-y-5">
        {site.projects.map((p) => (
          <article key={p.name} className="card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="eyebrow text-neutral-500 dark:text-neutral-400">{p.period}</p>
            </div>
            <p className="eyebrow mt-1 text-cyan-700 dark:text-cyan-400">{p.role}</p>
            <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
              {p.description}
            </p>
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">{p.stack}</p>
            <p className="mt-5">
              <a
                href={p.href}
                className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium transition-colors hover:border-violet-500/60 dark:border-neutral-700"
              >
                Visit {p.name}
              </a>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
