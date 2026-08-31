import Image from "next/image";
import { site } from "@/content/site";

export function Certifications() {
  return (
    <section aria-labelledby="certifications-heading" className="py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">05</p>
      <h2 id="certifications-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        Certifications
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {site.certifications.map((c) => (
          <article key={c.area} className="card flex items-start gap-4 p-5">
            <span className="flex h-14 min-w-14 shrink-0 items-center justify-center rounded-xl bg-white px-2 ring-1 ring-neutral-200">
              <Image
                src={c.logo}
                alt={c.logoAlt}
                width={96}
                height={40}
                unoptimized
                className="h-9 w-auto max-w-24 object-contain"
              />
            </span>
            <span>
              <h3 className="font-semibold">{c.area}</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {c.detail}
              </p>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
