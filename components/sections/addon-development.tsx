"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";

import { ClickToPlayVideo } from "@/components/ui/click-to-play-video";
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
    <Section id="addon-development" className="py-12 sm:py-20 relative">
      <div className="absolute inset-0 bg-websiteBg/40 -z-10" />
      <Container>
        <MotionWrapper>
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-border bg-white shadow-[0_8px_0_rgba(243,231,229,1)] lg:shadow-[0_12px_0_rgba(243,231,229,1)]">
            <div className="absolute top-0 right-0 h-16 w-16 bg-primaryBg/10" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />

            <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] items-stretch">
              {/* Visual — video / thumbnail */}
              <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[500px] overflow-hidden bg-accentSoft/30 p-6 sm:p-8 border-b-2 lg:border-b-0 lg:border-r-2 border-border">
                <div className="relative h-full w-full overflow-hidden rounded-[1rem] border-2 border-white shadow-md bg-white">
                  {hasVideo ? (
                    <ClickToPlayVideo
                      key={data.videoUrl}
                      videoUrl={data.videoUrl}
                      thumbnailUrl={data.thumbnailUrl || undefined}
                      title={data.title || "Addon development"}
                      className="h-full w-full"
                    />
                  ) : hasThumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.thumbnailUrl}
                      alt={data.title || "Addon development"}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-white shadow-sm">
                        <Play className="h-8 w-8 text-paragraph ml-1" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16 lg:py-16 relative">
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="h-2 w-2 bg-primaryBg" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-heading/60">Creative Process</p>
                </div>
                {data.title ? (
                  <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl lg:text-[2.5rem] leading-[1.15]">
                    {data.title}
                  </h2>
                ) : null}

                {data.description ? (
                  <div className="mt-6 sm:mt-8">
                    <p className="text-base leading-relaxed text-paragraph sm:text-lg sm:leading-relaxed">
                      {data.description}
                    </p>
                  </div>
                ) : null}

                {/* Pixel decorative element */}
                <div className="mt-12 flex gap-1">
                  <div className="h-1.5 w-1.5 bg-primaryBg/40" />
                  <div className="h-1.5 w-1.5 bg-primaryBg/60" />
                  <div className="h-1.5 w-1.5 bg-primaryBg" />
                  <div className="h-1.5 w-8 bg-primaryBg" />
                </div>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}