"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  createYouTubeEmbedUrl,
  createYouTubeThumbnailUrl,
  detectYouTubeUrl,
} from "@/lib/video";

type ClickToPlayVideoProps = {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  className?: string;
  preferYouTubeThumbnail?: boolean;
};

export function ClickToPlayVideo({
  videoUrl,
  thumbnailUrl,
  title = "Video",
  className,
  preferYouTubeThumbnail = false,
}: ClickToPlayVideoProps) {
  const normalizedVideoUrl = videoUrl.trim();
  const [startedVideoUrl, setStartedVideoUrl] = useState<string | null>(null);
  const hasStarted = startedVideoUrl === normalizedVideoUrl;
  const isYouTube = detectYouTubeUrl(normalizedVideoUrl);
  const embedUrl = isYouTube
    ? createYouTubeEmbedUrl(normalizedVideoUrl)
    : null;
  const youtubeThumbnailUrl = isYouTube
    ? createYouTubeThumbnailUrl(normalizedVideoUrl)
    : null;
  const previewUrl = preferYouTubeThumbnail
    ? youtubeThumbnailUrl || thumbnailUrl?.trim()
    : thumbnailUrl?.trim() || youtubeThumbnailUrl;

  if (!normalizedVideoUrl) return null;

  if (hasStarted) {
    if (embedUrl) {
      return (
        <iframe
          src={embedUrl}
          title={title}
          className={cn("h-full w-full border-0", className)}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      );
    }

    return (
      <video
        src={normalizedVideoUrl}
        title={title}
        className={cn("h-full w-full object-cover", className)}
        autoPlay
        controls
        playsInline
        preload="auto"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setStartedVideoUrl(normalizedVideoUrl)}
      className={cn(
        "group/video relative block h-full w-full overflow-hidden bg-gradient-to-br from-primaryBg/25 via-white/70 to-accentBlue/20 text-left",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primaryBg/60 focus-visible:ring-inset",
        className,
      )}
      aria-label={`Play video: ${title}`}
    >
      {previewUrl ? (
        // A plain image supports CMS and YouTube hosts without Next image config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt=""
          className="h-full w-full object-cover transition duration-700 ease-out group-hover/video:scale-[1.025]"
        />
      ) : (
        <div className="h-full w-full" aria-hidden="true" />
      )}

      <span
        className="absolute inset-0 bg-gradient-to-t from-heading/35 via-heading/5 to-transparent transition duration-500 group-hover/video:from-heading/45"
        aria-hidden="true"
      />
      <span
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/70 bg-white/85 text-heading shadow-[0_16px_45px_-12px_rgba(15,23,42,0.55)] backdrop-blur-md transition duration-300 group-hover/video:scale-110 group-hover/video:bg-white sm:h-24 sm:w-24">
          <Play className="ml-1 h-8 w-8 fill-current sm:h-10 sm:w-10" />
        </span>
      </span>
    </button>
  );
}