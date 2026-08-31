import { site } from "@/content/site";

export function Stats() {
  return (
    <section aria-label="Highlights" className="fade-up delay-5 pb-8">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {site.stats.map((s) => (
          <div key={s.label} className="card flex flex-col px-4 py-5 text-center">
            <dt className="order-last mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {s.label}
            </dt>
            <dd className="gradient-text text-3xl font-bold tracking-tight">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
