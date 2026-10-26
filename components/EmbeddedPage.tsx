"use client";

import { useEffect, useRef } from "react";

// Same-origin iframe that grows to its content, so a self-contained page
// (own CSS and scripts) can sit inside a site page without style clashes.
export function EmbeddedPage({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let observer: ResizeObserver | undefined;
    const fit = () => {
      const doc = frame.contentDocument;
      if (!doc?.body) return;
      doc.documentElement.style.overflow = "hidden";
      const resize = () => {
        frame.style.height = `${doc.documentElement.scrollHeight}px`;
      };
      resize();
      observer?.disconnect();
      observer = new ResizeObserver(resize);
      observer.observe(doc.body);
    };
    if (frame.contentDocument?.readyState === "complete") fit();
    frame.addEventListener("load", fit);
    return () => {
      frame.removeEventListener("load", fit);
      observer?.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      className="block h-[80vh] w-full rounded-lg border border-neutral-200 dark:border-neutral-800"
    />
  );
}
