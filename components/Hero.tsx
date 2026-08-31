import { site } from "@/content/site";

export function Hero() {
  return (
    <header className="pt-16 pb-12">
      <h1 className="text-3xl font-semibold tracking-tight">{site.name}</h1>
      <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">{site.headline}</p>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">{site.location}</p>
      <nav aria-label="Profiles" className="mt-4 flex gap-4">
        {site.heroLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm underline underline-offset-4 hover:no-underline"
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
