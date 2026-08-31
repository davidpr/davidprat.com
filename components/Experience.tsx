import { site } from "@/content/site";

export function Experience() {
  return (
    <section aria-labelledby="experience-heading" className="py-8">
      <h2 id="experience-heading" className="text-xl font-semibold">
        Experience
      </h2>
      <div className="mt-4 space-y-8">
        {site.experience.map((e) => (
          <article key={`${e.org}-${e.role}`}>
            <h3 className="font-medium">{e.org}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{e.role}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {e.points.map((p) => (
                <li key={p} className="leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
