import { site } from "@/content/site";

export function Stats() {
  return (
    <section aria-label="Career highlights" className="fade-up delay-4 pb-6">
      <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {site.stats.map((s) => (
          <div key={s.label} className="card flex flex-col px-3 py-3.5 text-center">
            <dt className="order-last mt-0.5 text-xs leading-snug text-neutral-500 dark:text-neutral-400">
              {s.label}
            </dt>
            <dd className="gradient-text text-xl font-bold tracking-tight sm:text-2xl">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
