"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";

import {
  defaultStudioAddonDevelopmentData,
  StudioAddonDevelopmentData,
} from "@/lib/studio/mock-addon-development";

import { supabase } from "@/lib/supabase/client";

export function AddonDevelopment() {
  const [data, setData] = useState<StudioAddonDevelopmentData>(
    defaultStudioAddonDevelopmentData,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const { data: rows, error } = await supabase
          .from("addon_development")
          .select("title, description, video_url, thumbnail_url")
          .limit(1);

        if (cancelled) return;

        if (error) {
          console.error("Failed to load addon development:", error);
          return;
        }

        if (!rows || rows.length === 0) {
          return;
        }

        const row = rows[0];
        setData({
          title: row.title ?? "",
          description: row.description ?? "",
          videoUrl: row.video_url ?? "",
          thumbnailUrl: row.thumbnail_url ?? "",
        });
      } catch (e) {
        console.error("Error loading addon development:", e);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasVideo = data.videoUrl && data.videoUrl.trim().length > 0;
  const hasThumbnail =
    data.thumbnailUrl && data.thumbnailUrl.trim().length > 0;
  const hasContent = data.title || data.description || hasVideo || hasThumbnail;

  if (!hasContent) return null;

  return (
    <Section id="addon-development" className="py-12 sm:py-20">
      <Container>
        <MotionWrapper>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-white shadow-[0_24px_70px_-28px_rgba(15,23,42,0.2)]">
            {/* Glow ornament */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primaryBg/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-primaryBg/10 blur-3xl" />

            <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] items-stretch">
              {/* Visual — video / thumbnail */}
              <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[500px] overflow-hidden bg-gradient-to-br from-primaryBg/20 via-white to-white p-4 sm:p-5">
                <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/50">
                  {hasVideo ? (
<video
  key={data.videoUrl}
  src={data.videoUrl}
  className="h-full w-full object-cover"
  controls
  muted
  playsInline
  preload="metadata"
  poster={data.thumbnailUrl || undefined}
/>
                  ) : hasThumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
<img
  src={data.thumbnailUrl}
  alt={data.title || "Addon development"}
  className="h-full w-full object-cover"
  loading="lazy"
/>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-heading/10 bg-white/60">
                        <Play className="h-8 w-8 text-heading/30 ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16 lg:py-16">
                {data.title ? (
                  <h2 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl lg:text-5xl leading-tight">
                    {data.title}
                  </h2>
                ) : null}

                {data.description ? (
                  <div className="mt-6 sm:mt-8">
                    <p className="text-base leading-7 text-paragraph sm:text-lg sm:leading-8">
                      {data.description}
                    </p>
                  </div>
                ) : null}

                {/* Decorative divider */}
                <div className="mt-10 h-1 w-20 rounded-full bg-gradient-to-r from-primaryBg to-primaryBg/30" />
              </div>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}