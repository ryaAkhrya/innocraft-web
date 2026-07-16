"use client";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";
import { useMockCmsState } from "@/lib/studio/cms-storage";
import { defaultStudioTentangData, StudioTentangData } from "@/lib/studio/mock-tentang";

const STORAGE_KEY = "studio.tentang.mock";

export function AboutInnocraft() {
  const { t } = useLanguage();

  const { value: saved } = useMockCmsState<StudioTentangData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioTentangData,
  });

  const imageUrl = saved.imageUrl && saved.imageUrl.trim().length > 0
    ? saved.imageUrl
    : null;

  return (
    <Section className="py-10 sm:py-16">
      <Container>
        <MotionWrapper className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-soft sm:p-10">
            <SectionTitle
              eyebrow={t.about.eyebrow}
              title={saved.title || t.about.title}
              description={saved.description || t.about.description}
            />
          </div>
          <div className="grid gap-4">
            {imageUrl ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-border bg-gradient-to-br from-primaryBg/50 to-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={saved.title || t.about.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-[1.5rem] border border-border bg-gradient-to-br from-primaryBg/50 to-white">
                <span className="text-sm font-medium text-heading/50">
                  No image
                </span>
              </div>
            )}
            <div className="rounded-[1.5rem] border border-border bg-white/90 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-heading">{saved.subtitle || t.about.eyebrow}</h3>
              <p className="mt-3 text-sm leading-7 text-paragraph">{saved.description || t.about.description}</p>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}