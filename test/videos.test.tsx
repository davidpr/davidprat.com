import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Videos } from "@/components/Videos";
import { site } from "@/content/site";

describe("Videos", () => {
  it("shows only the first videos by default and expands on click", () => {
    render(<Videos />);
    expect(screen.getByRole("heading", { name: /videos/i })).toBeInTheDocument();
    const visible = site.videos.slice(0, site.videosVisibleCount);
    const hidden = site.videos.slice(site.videosVisibleCount);
    for (const v of visible) {
      expect(screen.getByText(v.title)).toBeInTheDocument();
    }
    for (const v of hidden) {
      expect(screen.queryByText(v.title)).not.toBeInTheDocument();
    }

    const button = screen.getByRole("button", { name: /show all videos/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    for (const v of site.videos) {
      expect(screen.getByText(v.title)).toBeInTheDocument();
    }
  });

  it("shows a link to the YouTube channel alongside the show-all toggle", () => {
    render(<Videos />);
    expect(screen.getByRole("button", { name: /show all videos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: site.youtubeChannel.label })).toHaveAttribute(
      "href",
      site.youtubeChannel.href,
    );
  });

  it("links each video to its YouTube watch page with a distinct id", () => {
    const ids = site.videos.map((v) => v.youtubeId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(site.videos.length).toBe(9);
    for (const v of site.videos) {
      expect(v.youtubeId).toMatch(/^[\w-]{11}$/);
    }
  });
});
