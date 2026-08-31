import { site } from "@/content/site";

export function Education() {
  return (
    <section id="education" aria-labelledby="education-heading" className="scroll-mt-16 py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">04</p>
      <h2 id="education-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        Education
      </h2>
      <ul className="mt-6 space-y-5">
        {site.education.map((e) => (
          <li
            key={`${e.school}-${e.degree}`}
            className="reveal flex flex-col gap-1 border-l-2 border-violet-500/40 pl-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          >
            <div>
              <p className="font-medium">{e.school}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{e.degree}</p>
            </div>
            <p className="eyebrow shrink-0 text-neutral-500 dark:text-neutral-400">{e.period}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
