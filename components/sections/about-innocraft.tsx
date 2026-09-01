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
    <Section className="py-12 sm:py-24 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute right-0 top-0 h-64 w-64 bg-accentLavender/20 blur-[80px]" />
      <div className="absolute left-0 bottom-0 h-64 w-64 bg-primaryBg/10 blur-[80px]" />

      <Container className="relative">
        <MotionWrapper>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Story Content Column */}
            <div className="order-2 lg:order-1 flex flex-col justify-center">
              {/* Eyebrow / Labels */}
              <div className="mb-8 flex gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-accentLavender/30 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-[#6B21A8]">
                  <span className="h-1.5 w-1.5 bg-[#6B21A8]" />
                  Create
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-accentDigitalBlue/20 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-[#1E3A8A]">
                  <span className="h-1.5 w-1.5 bg-[#1E3A8A]" />
                  Code
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl font-extrabold tracking-tight text-heading sm:text-5xl lg:text-[3.5rem] leading-[1.1]">
                {aboutData.title || t.about.title}
              </h2>

              {/* Subtitle as Tag */}
              {aboutData.subtitle && (
                <div className="mt-6">
                  <span className="inline-block rounded-lg border-2 border-border bg-white px-4 py-2 text-sm font-bold text-paragraph shadow-sm">
                    {aboutData.subtitle}
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="mt-8 space-y-6">
                <p className="text-lg leading-relaxed text-paragraph sm:text-xl">
                  {aboutData.description || t.about.description}
                </p>
              </div>

              {/* Decorative accent line */}
              <div className="mt-10 h-1.5 w-24 bg-heading" />
            </div>

            {/* Image Column - Physical Photo Aesthetic */}
            <div className="order-1 lg:order-2 relative px-4 sm:px-8">
              <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full rotate-2 rounded-xl bg-white p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-200 transition-transform hover:rotate-0 duration-500">
                <div className="h-full w-full overflow-hidden rounded-lg bg-gray-100">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={aboutData.title || t.about.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-sm font-medium text-paragraph/50">
                        {aboutData.title || "INNOCRAFT"}
                      </span>
                    </div>
                  )}
                </div>
                {/* Physical photo bottom text area */}
                <div className="absolute bottom-6 right-8 text-xs font-mono text-gray-400 rotate-90 origin-right">
                  IMG_001
                </div>
              </div>

              {/* Abstract decorative blocks */}
              <div className="absolute -z-10 -bottom-6 -left-2 h-24 w-24 bg-accentEnergy/80 rounded-2xl -rotate-6" />
              <div className="absolute -z-10 -top-4 -right-4 h-16 w-16 bg-primaryBg/80 rounded-xl rotate-12" />
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}