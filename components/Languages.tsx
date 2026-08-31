import { site } from "@/content/site";

const levelStyles: Record<string, string> = {
  Native: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  C2: "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300",
};
const defaultLevelStyle =
  "border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300";

export function Languages() {
  return (
    <section id="languages" aria-labelledby="languages-heading" className="scroll-mt-16 py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">06</p>
      <h2 id="languages-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        Languages
      </h2>
      <ul className="mt-6 flex flex-wrap gap-3">
        {site.languages.map((l) => (
          <li key={l.name} className="card reveal px-5 py-3">
            <span className="flex items-center gap-3">
              <span className="font-medium">{l.name}</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  levelStyles[l.level] ?? defaultLevelStyle
                }`}
              >
                {l.level}
              </span>
            </span>
            {l.credential && (
              <span className="mt-1 block text-xs text-neutral-500 dark:text-neutral-400">
                {l.credential}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
