"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";

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
    <Section className="py-10 sm:py-16">
      <Container>
        <MotionWrapper>
          {/* Eyebrow */}
          <div className="mb-6 sm:mb-8">
            <span className="inline-block rounded-full border border-border bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-wider text-heading">
              {t.about.eyebrow}
            </span>
          </div>

          {/* Main Layout: Desktop two-column, Mobile stacked */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image Column - Hero Visual */}
            <div className="relative order-2 lg:order-1">
              <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-2xl">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={aboutData.title || t.about.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center">
                    <span className="text-sm font-medium text-paragraph/50">
                      [Brand Visual]
                    </span>
                  </div>
                )}
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-[#FFCFC9]/30 to-[#9AE6FF]/30 blur-xl" />
            </div>

            {/* Story Content Column */}
            <div className="order-1 lg:order-2">
              {/* Title */}
              <h2 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl lg:text-5xl">
                {aboutData.title || t.about.title}
              </h2>

              {/* Subtitle as Tag */}
              {aboutData.subtitle && (
                <div className="mt-4">
                  <span className="inline-block rounded-xl border border-border bg-white/90 px-3 py-1.5 text-sm font-medium text-paragraph">
                    {aboutData.subtitle}
                  </span>
                </div>
              )}

              {/* Description with improved typography */}
              <div className="mt-6 space-y-4">
                <p className="text-base leading-relaxed text-paragraph sm:text-lg">
                  {aboutData.description || t.about.description}
                </p>
              </div>

              {/* Decorative accent line */}
              <div className="mt-8 h-1 w-16 rounded-full bg-gradient-to-r from-primaryBackground to-[#9AE6FF]" />
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}