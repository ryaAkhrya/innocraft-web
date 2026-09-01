"use client";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";
import {
  defaultStudioGalleryData,
  type StudioGalleryItem,
} from "@/lib/studio/mock-gallery";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";


function toGalleryItem(row: {
  id: string;
  image_url: string | null;
  title: string | null;
  description: string | null;
}) {
  return {
    id: String(row.id),
    imageUrl: row.image_url ?? "",
    title: row.title ?? "",
    description: row.description ?? "",
  };
}

export function Gallery() {
  const { t } = useLanguage();

  // Hydration-safe: render default on first pass
  const [galleryItems, setGalleryItems] = useState<StudioGalleryItem[]>(
    defaultStudioGalleryData.items,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("id, image_url, title, description, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error("Failed to load gallery:", error);
          return;
        }

        if (data && data.length > 0) {
          setGalleryItems(data.map(toGalleryItem));
        }
        // If no data, keep defaults
      } catch (e) {
        console.error("Error loading gallery:", e);
      }
    }

    loadGallery();
    return () => {
      cancelled = true;
    };
  }, []);

  if (galleryItems.length === 0) {
    return (
      <Section id="gallery" className="py-10 sm:py-16">
        <Container>
          <SectionTitle
            eyebrow={t.gallery.eyebrow}
            title={t.gallery.title}
            description={t.gallery.description}
          />
          <div className="mt-8 text-center">
            <div className="rounded-3xl border border-border bg-white p-8 shadow-soft">
              <p className="text-base text-paragraph">
                Gallery collection coming soon.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="gallery" className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          description={t.gallery.description}
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => {
            const colors = [
              "bg-softBlue",
              "bg-softYellow",
              "bg-peach",
              "bg-softGreen",
              "bg-softLavender"
            ];
            const backingColor = colors[index % colors.length];

            return (
              <MotionWrapper
                key={item.id}
                className="relative group h-full flex flex-col"
              >
                <div className={`absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border-2 border-white pointer-events-none shadow-soft-sm transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4 ${backingColor}`} />
                <div className="relative z-10 flex flex-col flex-1 rounded-[2rem] border-4 border-white bg-white shadow-soft-lg overflow-hidden transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="relative aspect-video w-full overflow-hidden bg-websiteBgEnd">
                    {item.imageUrl && item.imageUrl.trim().length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-sm font-medium text-paragraph/60">
                          No image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-6 sm:p-8">
                    <h3 className="text-xl font-display font-bold text-heading leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-paragraph/80 leading-relaxed flex-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}