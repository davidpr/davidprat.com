import { site } from "@/content/site";

export function Hero() {
  return (
    <header className="pt-24 pb-14">
      <p className="eyebrow fade-up text-neutral-500 dark:text-neutral-400">davidprat.com</p>
      <h1 className="gradient-text fade-up delay-1 mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
        {site.name}
      </h1>
      <p className="fade-up delay-2 mt-4 text-xl text-neutral-700 sm:text-2xl dark:text-neutral-300">
        {site.headline}
      </p>
      <p className="fade-up delay-2 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {site.location}
      </p>
      <p className="fade-up delay-3 mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-300">
        <span aria-hidden="true" className="pulse-dot h-2 w-2 rounded-full bg-emerald-500" />
        {site.availability}
      </p>
      <nav aria-label="Profiles" className="fade-up delay-4 mt-8 flex flex-wrap gap-3">
        {site.heroLinks.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className={
              i === 0
                ? "rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-neutral-900"
                : "rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium transition-colors hover:border-violet-500/60 dark:border-neutral-700"
            }
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
