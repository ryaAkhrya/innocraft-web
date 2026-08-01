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
        "group/video relative block h-full w-full overflow-hidden bg-heading text-left",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primaryBg/60 focus-visible:ring-inset",
        className,
      )}
      aria-label={`Play video: ${title}`}
    >
      {previewUrl ? (
        <>
          {/* Plain images support CMS and YouTube hosts without Next image config. */}
          {/* The desktop-only background supplies a soft cinematic image bleed. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt=""
            className="absolute inset-0 hidden h-full w-full scale-110 object-cover object-center opacity-45 blur-md sm:block"
            aria-hidden="true"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt=""
            className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-center opacity-95 transition-transform duration-500 ease-out group-hover/video:scale-[1.085]"
            draggable={false}
          />
        </>
      ) : (
        <div className="h-full w-full" aria-hidden="true" />
      )}

      <span
        className="absolute inset-0 bg-heading/10"
        aria-hidden="true"
      />
      <span
        className="absolute inset-0 bg-gradient-to-t from-heading/45 via-heading/5 to-transparent"
        aria-hidden="true"
      />
      <span
        className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(15,23,42,0.18)_100%)] sm:block"
        aria-hidden="true"
      />
      <span
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/90 text-heading shadow-[0_16px_42px_-12px_rgba(15,23,42,0.58)] transition-transform duration-300 ease-out group-hover/video:scale-105 sm:h-20 sm:w-20 sm:bg-white/85 sm:backdrop-blur-md">
          <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
        </span>
      </span>
    </button>
  );
}
