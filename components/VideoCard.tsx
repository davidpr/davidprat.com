import Image from "next/image";
import type { VideoItem } from "@/content/site";

export function VideoCard({ video }: { video: VideoItem }) {
  return (
    <article className="card reveal flex h-full flex-col overflow-hidden">
      <a
        href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col"
      >
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
          <Image
            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <span className="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {video.duration}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-semibold">{video.title}</h3>
          <p className="eyebrow mt-2 text-cyan-700 dark:text-cyan-400">Watch on YouTube</p>
        </div>
      </a>
    </article>
  );
}
