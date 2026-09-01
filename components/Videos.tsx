"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { VideoCard } from "@/components/VideoCard";

export function Videos() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? site.videos : site.videos.slice(0, site.videosVisibleCount);
  const hiddenCount = site.videos.length - site.videosVisibleCount;

  return (
    <section id="videos" aria-labelledby="videos-heading" className="scroll-mt-16 py-10">
      <p className="eyebrow text-violet-600 dark:text-violet-400">08</p>
      <h2 id="videos-heading" className="mt-1 text-2xl font-semibold tracking-tight">
        Videos
      </h2>
      <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
        Tutorials on Kubernetes, GitOps and cloud tooling on my YouTube channel.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((v) => (
          <VideoCard key={v.youtubeId} video={v} />
        ))}
      </div>
      <p className="mt-6 flex flex-wrap gap-3">
        {hiddenCount > 0 && (
          <button
            type="button"
            aria-expanded={showAll}
            onClick={() => setShowAll((v) => !v)}
            className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium transition-colors hover:border-violet-500/60 dark:border-neutral-700"
          >
            {showAll ? "Show less" : `Show all videos (${hiddenCount} more)`}
          </button>
        )}
        <a
          href={site.youtubeChannel.href}
          className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium transition-colors hover:border-violet-500/60 dark:border-neutral-700"
        >
          {site.youtubeChannel.label}
        </a>
      </p>
    </section>
  );
}
