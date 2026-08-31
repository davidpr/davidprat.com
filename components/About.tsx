import { site } from "@/content/site";

export function About() {
  return (
    <section aria-labelledby="about-heading" className="py-8">
      <h2 id="about-heading" className="text-xl font-semibold">
        About
      </h2>
      <div className="mt-3 space-y-3">
        {site.about.map((p) => (
          <p key={p} className="leading-relaxed text-neutral-700 dark:text-neutral-300">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
