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
}): StudioGalleryItem {
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

  return (
    <Section id="gallery" className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          description={t.gallery.description}
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {galleryItems.map((item) => (
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
          ))}
        </div>
      </Container>
    </Section>
  );
}