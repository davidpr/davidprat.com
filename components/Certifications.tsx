"use client";

import { useState } from "react";
import Image from "next/image";
import { site } from "@/content/site";

export function Certifications() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll
    ? site.certifications
    : site.certifications.slice(0, site.certificationsVisibleCount);
  const hiddenCount = site.certifications.length - site.certificationsVisibleCount;

  return (
    <section aria-labelledby="certifications-heading" className="py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">05</p>
      <h2 id="certifications-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        Certifications
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {visible.map((c) => (
          <li key={c.name} className="card flex flex-col items-center p-5 text-center">
            <span className="flex h-32 w-32 items-center justify-center rounded-xl bg-white p-2">
              <Image
                src={c.badge}
                alt={`${c.name} badge`}
                width={112}
                height={112}
                unoptimized
                className="h-28 w-28 object-contain"
              />
            </span>
            <h3 className="mt-4 text-sm leading-snug font-medium">{c.name}</h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{c.issuer}</p>
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll((v) => !v)}
          className="mt-6 rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium transition-colors hover:border-violet-500/60 dark:border-neutral-700"
        >
          {showAll ? "Show fewer certifications" : `Show all certifications (${hiddenCount} more)`}
        </button>
      )}
    </section>
  );
}
