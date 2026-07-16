"use client";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";
import { useMockCmsState } from "@/lib/studio/cms-storage";
import {
  defaultStudioGalleryData,
  type StudioGalleryData,
} from "@/lib/studio/mock-gallery";

const STORAGE_KEY = "studio.gallery.mock";

export function Gallery() {
  const { t } = useLanguage();

  const { value: saved } = useMockCmsState<StudioGalleryData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioGalleryData,
  });

  const hasCmsData = saved.items.length > 0;
  const cmsItems = saved.items;

  return (
    <Section id="gallery" className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          description={t.gallery.description}
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {hasCmsData
            ? cmsItems.map((item) => (
                <MotionWrapper
                  key={item.id}
                  className="group overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-soft"
                >
                  <div className="h-44 border-b border-border bg-gradient-to-br from-primaryBg/70 via-white to-white p-6">
                    {item.imageUrl && item.imageUrl.trim().length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/60">
                        <span className="text-sm font-medium text-heading/50">
                          No image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-heading">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-paragraph">
                      {item.description}
                    </p>
                  </div>
                </MotionWrapper>
              ))
            : t.gallery.items.map((item, index) => (
                <MotionWrapper
                  key={index}
                  className="group overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-soft"
                >
                  <div className="h-44 border-b border-border bg-gradient-to-br from-primaryBg/70 via-white to-white p-6">
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/60">
                      <span className="text-sm font-medium text-heading/50">
                        No image
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-heading">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-paragraph">
                      {item.description}
                    </p>
                  </div>
                </MotionWrapper>
              ))}
        </div>
      </Container>
    </Section>
  );
}