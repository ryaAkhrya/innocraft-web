"use client";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";
import {
  defaultStudioMentorData,
  type StudioMentor,
} from "@/lib/studio/mock-mentor";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";


function toMentor(row: {
  id: string;
  photo_url: string | null;
  name: string | null;
  position: string | null;
  description: string | null;
}) {
  return {
    id: String(row.id),
    photoUrl: row.photo_url ?? "",
    name: row.name ?? "",
    position: row.position ?? "",
    description: row.description ?? "",
  };
}

export function Mentor() {
  const { t } = useLanguage();

  // Hydration-safe: render default on first pass
  const [mentors, setMentors] = useState<StudioMentor[]>(defaultStudioMentorData.mentors);

  useEffect(() => {
    let cancelled = false;

    async function loadMentors() {
      try {
        const { data, error } = await supabase
          .from("mentors")
          .select("id, photo_url, name, position, description, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error("Failed to load mentor:", error);
          return;
        }

        if (data && data.length > 0) {
          setMentors(data.map(toMentor));
        }
        // Keep defaults if no data
      } catch (e) {
        console.error("Error loading mentor:", e);
      }
    }

    loadMentors();
    return () => {
      cancelled = true;
    };
  }, []);

  // Single mentor: larger premium card
  if (mentors.length === 1) {
    const mentor = mentors[0];
    return (
      <Section className="py-10 sm:py-16">
        <Container>
          <MotionWrapper className="rounded-3xl border border-border bg-white p-8 shadow-soft sm:p-10">
            <div className="text-center lg:text-left">
              <SectionTitle
                eyebrow={t.mentor.eyebrow}
                title={t.mentor.title}
                description={t.mentor.description}
              />
            </div>
            <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
              <MotionWrapper className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primaryBg/50 via-white to-white p-4">
                {mentor?.photoUrl?.trim() ? (
                  // eslint-disable-next-line @next/next/no-img-element
<img
  src={mentor.photoUrl}
  alt={mentor.name}
  className="h-full w-full rounded-xl object-cover"
  loading="lazy"
/>
                ) : (
                  <div className="flex h-80 items-center justify-center rounded-xl border border-white/70 bg-white/80">
                    <span className="text-sm font-medium text-paragraph/70">
                      No photo
                    </span>
                  </div>
                )}
              </MotionWrapper>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-semibold text-heading sm:text-3xl">
                  {mentor?.name || "Untitled"}
                </h3>
                <p className="mt-2 text-lg font-medium text-primary">
                  {mentor?.position || "No position"}
                </p>
                {mentor?.description && (
                  <p className="mt-4 text-base leading-relaxed text-paragraph">
                    {mentor.description}
                  </p>
                )}
              </div>
            </div>
          </MotionWrapper>
        </Container>
      </Section>
    );
  }

  // Two or more mentors: responsive grid
  return (
    <Section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          eyebrow={t.mentor.eyebrow}
          title={t.mentor.title}
          description={t.mentor.description}
        />
        {mentors.length === 0 ? (
          <div className="mt-8 text-center">
            <div className="rounded-3xl border border-border bg-white p-8 shadow-soft">
              <p className="text-base text-paragraph">
                Mentor profiles coming soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {mentors.map((mentor) => (
              <MotionWrapper
                key={mentor.id}
                className="group overflow-hidden rounded-3xl border border-border bg-white shadow-soft transition-all duration-300 hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {mentor.photoUrl?.trim() ? (
                    // eslint-disable-next-line @next/next/no-img-element
<img
  src={mentor.photoUrl}
  alt={mentor.name}
  className="h-full w-full rounded-t-3xl object-cover transition-transform duration-500 group-hover:scale-105"
  loading="lazy"
/>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-t-3xl border-b border-border bg-gradient-to-br from-primaryBg/50 to-white">
                      <span className="text-sm font-medium text-paragraph/60">
                        No photo
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-heading">{mentor.name || "Untitled"}</h3>
                  <p className="mt-1 text-base font-medium text-primary">
                    {mentor.position || "No position"}
                  </p>
                  {mentor.description && (
                    <p className="mt-3 text-sm leading-relaxed text-paragraph">
                      {mentor.description}
                    </p>
                  )}
                </div>
              </MotionWrapper>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}