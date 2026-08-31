import { site } from "@/content/site";

export function Writing() {
  const { intro, articles, channels } = site.writing;
  return (
    <section aria-labelledby="writing-heading" className="py-8">
      <h2 id="writing-heading" className="text-xl font-semibold">
        Writing
      </h2>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">{intro}</p>
      {articles.length > 0 && (
        <ul aria-label="Articles" className="mt-3 list-disc space-y-1 pl-5">
          {articles.map((a) => (
            <li key={a.href}>
              <a href={a.href} className="underline underline-offset-4 hover:no-underline">
                {a.title}
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 flex gap-4">
        {channels.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="text-sm underline underline-offset-4 hover:no-underline"
          >
            {c.label}
          </a>
        ))}
      </p>
    </section>
  );
}
