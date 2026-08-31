import { site } from "@/content/site";

export function Writing() {
  const { intro, articles, channels } = site.writing;
  return (
    <section aria-labelledby="writing-heading" className="py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">05</p>
      <h2 id="writing-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        Writing
      </h2>
      <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">{intro}</p>
      {articles.length > 0 && (
        <ul aria-label="Articles" className="mt-4 space-y-3">
          {articles.map((a) => (
            <li key={a.href}>
              <a href={a.href} className="card block p-5 font-medium">
                {a.title}
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-5 flex flex-wrap gap-3">
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
