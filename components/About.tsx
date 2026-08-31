import { site } from "@/content/site";

export function About() {
  return (
    <section aria-labelledby="about-heading" className="py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">01</p>
      <h2 id="about-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        About
      </h2>
      <div className="mt-4 space-y-4">
        {site.about.map((p) => (
          <p key={p} className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
