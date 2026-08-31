"use client";

import { useState } from "react";
import { site } from "@/content/site";

export function Experience() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll
    ? site.experience
    : site.experience.slice(0, site.experienceVisibleCount);
  const hiddenCount = site.experience.length - site.experienceVisibleCount;

  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-16 py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">02</p>
      <h2 id="experience-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        Experience
      </h2>
      <div className="timeline relative mt-8 space-y-10">
        {visible.map((e, i) => (
          <article key={`${e.org}-${e.role}`} className="reveal relative pl-8 sm:pl-10">
            <span
              aria-hidden="true"
              className={`timeline-dot absolute top-1 left-[9px] h-[15px] w-[15px] rounded-full border-2 border-violet-500 bg-white dark:bg-neutral-950 ${
                i === 0 ? "pulse-dot border-emerald-500" : ""
              }`}
            />
            <p className="eyebrow text-neutral-500 dark:text-neutral-400">{e.period}</p>
            <div className="card mt-2 p-4 sm:p-6">
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
            </div>
          </article>
        ))}
      </div>
      {hiddenCount > 0 && (
        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll((v) => !v)}
          className="mt-8 ml-8 rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium transition-colors hover:border-violet-500/60 sm:ml-10 dark:border-neutral-700"
        >
          {showAll ? "Show less" : `Show full timeline (${hiddenCount} more roles)`}
        </button>
      )}
    </section>
  );
}
