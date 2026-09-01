"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";
import { defaultStudioTentangData, StudioTentangData } from "@/lib/studio/mock-tentang";

import { supabase } from "@/lib/supabase/client";

export function AboutInnocraft() {
  const { t } = useLanguage();

  // Hydration-safe: render default on first pass (SSR + initial client render).
  const [aboutData, setAboutData] = useState<StudioTentangData>(
    defaultStudioTentangData,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadAbout() {
      try {
        const { data, error } = await supabase
          .from("about")
          .select("*")
          .limit(1);

        if (cancelled) return;

        if (error) {
          setAboutData(defaultStudioTentangData);
          return;
        }

        if (!data || data.length === 0) {
          setAboutData(defaultStudioTentangData);
          return;
        }

        const row = data[0];
        setAboutData({
          title: row.title ?? defaultStudioTentangData.title,
          subtitle: row.subtitle ?? defaultStudioTentangData.subtitle,
          description: row.description ?? defaultStudioTentangData.description,
          imageUrl: row.image_url ?? defaultStudioTentangData.imageUrl,
        });
      } catch {
        if (!cancelled) setAboutData(defaultStudioTentangData);
      }
    }

    loadAbout();

    return () => {
      cancelled = true;
    };
  }, []);

  const imageUrl = aboutData.imageUrl && aboutData.imageUrl.trim().length > 0
    ? aboutData.imageUrl
    : null;

  return (
    <Section className="py-20 sm:py-32 bg-websiteBg relative overflow-hidden">
      <Container className="relative z-10">
        <MotionWrapper>
          <div className="grid gap-16 lg:gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Story Content Column */}
            <div className="order-2 lg:order-1 flex flex-col justify-center">
              {/* Eyebrow / Labels */}
              <div className="mb-8 flex gap-3">
                <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-white bg-peach px-4 py-2 text-xs font-bold uppercase tracking-widest text-heading shadow-soft-sm">
                  <span className="h-2 w-2 rounded-full bg-coral animate-pulse" />
                  Create
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-white bg-softBlue px-4 py-2 text-xs font-bold uppercase tracking-widest text-heading shadow-soft-sm">
                  <span className="h-2 w-2 rounded-full bg-skyBlue animate-pulse" />
                  Code
                </span>
              </div>

              {/* Title and Description via SectionTitle (if appropriate, or custom since we have subtitle) */}
              <SectionTitle
                title={aboutData.title || t.about.title}
                description={aboutData.description || t.about.description}
                highlightWord="pengalaman"
                highlightColor="yellow"
              />

              {/* Subtitle as Tag */}
              {aboutData.subtitle && (
                <div className="mt-8">
                  <span className="inline-block rounded-2xl border-2 border-white bg-white px-6 py-3 text-sm font-bold text-heading shadow-soft-sm text-center">
                    {aboutData.subtitle}
                  </span>
                </div>
              )}

              {/* Decorative accent line */}
              <div className="mt-12 flex gap-2 items-center">
                <div className="h-3 w-3 rounded-full bg-softYellow shadow-color-peach" />
                <div className="h-3 w-12 rounded-full bg-coral shadow-color-peach" />
              </div>
            </div>

            {/* Image Column - Clean Editorial Aesthetic */}
            <div className="order-1 lg:order-2 relative px-4 sm:px-8 max-w-md mx-auto lg:max-w-none w-full">
              {/* Soft abstract shape behind image */}
              <div className="absolute inset-0 translate-x-4 translate-y-6 bg-coral border-2 border-white rounded-[3.5rem] pointer-events-none shadow-color-peach rotate-3" />

              <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full rounded-[3.5rem] bg-white border-4 border-white p-2 shadow-soft-lg transition-transform hover:-translate-y-2 z-10">
                <div className="h-full w-full overflow-hidden rounded-[3rem] bg-websiteBgEnd">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={aboutData.title || t.about.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-sm font-medium text-heading/50">
                        {aboutData.title || "INNOCRAFT"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subtle decorative dot */}
              <div className="absolute z-20 -top-4 -right-4 h-16 w-16 bg-softYellow border-2 border-white rounded-full shadow-soft-sm flex items-center justify-center -rotate-12">
                <div className="h-6 w-6 rounded-md bg-white opacity-80" />
              </div>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}