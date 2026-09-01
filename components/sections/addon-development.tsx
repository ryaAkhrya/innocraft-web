"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";

import { ClickToPlayVideo } from "@/components/ui/click-to-play-video";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

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
    <Section id="addon-development" className="py-20 sm:py-32 relative overflow-hidden bg-websiteBg">
      {/* Playful environment blobs */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 w-[500px] h-[500px] bg-softYellow/30 rounded-full blur-[100px] pointer-events-none" />

      <Container className="relative z-10">
        <MotionWrapper>
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-16 lg:gap-24">
            
            {/* Visual — video / thumbnail */}
            <div className="relative order-2 lg:order-1">
              {/* V4 playful offset block */}
              <div className="absolute inset-0 -translate-x-6 translate-y-6 bg-freshGreen rounded-[3rem] -rotate-3 pointer-events-none shadow-color-green" />
              
              <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[500px] w-full overflow-hidden rounded-[3rem] border-4 border-white bg-white shadow-soft-lg z-10 transition-transform duration-500 hover:-translate-y-2">
                {hasVideo ? (
                  <ClickToPlayVideo
                    key={data.videoUrl}
                    videoUrl={data.videoUrl}
                    thumbnailUrl={data.thumbnailUrl || undefined}
                    title={data.title || "Addon development"}
                    className="absolute inset-0 h-full w-full"
                  />
                ) : hasThumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.thumbnailUrl}
                    alt={data.title || "Addon development"}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full min-h-[400px] items-center justify-center bg-websiteBgEnd">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-border bg-white shadow-soft-sm text-heading/50">
                      <Play className="h-6 w-6 ml-1" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center order-1 lg:order-2">
              <SectionTitle
                eyebrow="Creative Process"
                title={data.title}
                description={data.description}
                highlightWord="Addon"
                highlightColor="green"
              />

              {/* Minimal decorative element */}
              <div className="mt-12 flex gap-3 items-center">
                <div className="h-3 w-3 rounded-full bg-freshGreen shadow-color-green" />
                <div className="h-3 w-3 rounded-full bg-softBlue shadow-color-blue" />
                <div className="h-3 w-12 rounded-full bg-peach shadow-color-peach" />
              </div>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}