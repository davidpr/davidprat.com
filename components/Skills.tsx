import { site } from "@/content/site";

export function Skills() {
  return (
    <section aria-label="Top skills" className="fade-up delay-5 pb-8">
      <ul className="flex flex-wrap gap-2.5">
        {site.topSkills.map((s) => (
          <li
            key={s}
            className="card px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
