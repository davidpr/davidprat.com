import { site } from "@/content/site";

export function Experience() {
  return (
    <section aria-labelledby="experience-heading" className="py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">02</p>
      <h2 id="experience-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        Experience
      </h2>
      <div className="mt-6 space-y-5">
        {site.experience.map((e) => (
          <article key={`${e.org}-${e.role}`} className="card p-6">
            <h3 className="text-lg font-semibold">{e.org}</h3>
            <p className="eyebrow mt-1 text-cyan-700 dark:text-cyan-400">{e.role}</p>
            <ul className="mt-4 space-y-2">
              {e.points.map((p) => (
                <li
                  key={p}
                  className="flex gap-3 leading-relaxed text-neutral-700 dark:text-neutral-300"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                  />
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
