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
import { cn } from "@/lib/utils";


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
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {galleryItems.map((item) => (
            <MotionWrapper
              key={item.id}
              className="group overflow-hidden rounded-3xl border border-border bg-white shadow-soft transition-all duration-300 hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-t-3xl border-b border-border bg-gradient-to-br from-primaryBg/50 via-white to-white">
                {item.imageUrl && item.imageUrl.trim().length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full rounded-t-3xl object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm font-medium text-paragraph/60">
                      No image
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-heading">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-paragraph">
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