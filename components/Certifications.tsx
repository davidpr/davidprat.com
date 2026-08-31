import Image from "next/image";
import { site } from "@/content/site";

export function Certifications() {
  return (
    <section aria-labelledby="certifications-heading" className="py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">05</p>
      <h2 id="certifications-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        Certifications
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {site.certifications.map((c) => (
          <li key={c.name} className="card flex flex-col items-center p-5 text-center">
            <Image
              src={c.badge}
              alt={`${c.name} badge`}
              width={112}
              height={112}
              unoptimized
              className="h-28 w-28 object-contain"
            />
            <h3 className="mt-4 text-sm leading-snug font-medium">{c.name}</h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{c.issuer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
