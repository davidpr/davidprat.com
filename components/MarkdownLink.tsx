import type { AnchorHTMLAttributes } from "react";

function youtubeId(href: string): string | null {
  const m = href.match(
    /^https:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,20})/,
  );
  return m ? m[1] : null;
}

export function MarkdownLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ?? "";
  const id = youtubeId(href);
  if (id) {
    return (
      <span className="yt-embed">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title="YouTube video"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </span>
    );
  }
  return <a {...props} />;
}
