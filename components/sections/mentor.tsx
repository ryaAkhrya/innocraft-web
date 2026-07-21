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
}): StudioMentor {
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

  // Dynamic layout based on mentor count
  const mentorCount = mentors.length;

  // Single mentor: larger premium card
  if (mentorCount === 1) {
    const mentor = mentors[0];
    return (
      <Section className="py-10 sm:py-16">
        <Container>
          <MotionWrapper className="rounded-[2rem] border border-border bg-white p-8 shadow-soft sm:p-10">
            <div className="text-center lg:text-left">
              <SectionTitle
                eyebrow={t.mentor.eyebrow}
                title={t.mentor.title}
                description={t.mentor.description}
              />
            </div>
            <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
              <div className="overflow-hidden rounded-[1.75rem] border border-border bg-gradient-to-br from-primaryBg/70 via-white to-white p-6">
                {mentor?.photoUrl?.trim() ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mentor.photoUrl}
                    alt={mentor.name}
                    className="h-[360px] w-full rounded-[1.5rem] border border-white/70 object-cover"
                  />
                ) : (
                  <div className="flex h-[360px] items-center justify-center rounded-[1.5rem] border border-white/70 bg-white/80 text-center text-sm font-medium text-paragraph">
                    No photo
                  </div>
                )}
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-semibold text-heading sm:text-3xl">
                  {mentor?.name || "Untitled"}
                </h3>
                <p className="mt-2 text-lg font-medium text-primary">
                  {mentor?.position || "No position"}
                </p>
                {mentor?.description && (
                  <p className="mt-4 text-base leading-7 text-paragraph">
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

  // Two mentors: two-column layout
  if (mentorCount === 2) {
    return (
      <Section className="py-10 sm:py-16">
        <Container>
          <SectionTitle
            eyebrow={t.mentor.eyebrow}
            title={t.mentor.title}
            description={t.mentor.description}
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {mentors.map((mentor) => (
              <MotionWrapper
                key={mentor.id}
                className="rounded-[1.75rem] border border-border bg-white p-6 shadow-soft"
              >
                {mentor.photoUrl?.trim() ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mentor.photoUrl}
                    alt={mentor.name}
                    className="h-56 w-full rounded-xl border border-white/70 object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-xl border border-white/70 bg-white/80 text-center text-sm font-medium text-paragraph">
                    No photo
                  </div>
                )}
                <h3 className="mt-4 text-xl font-semibold text-heading">
                  {mentor.name || "Untitled"}
                </h3>
                <p className="mt-1 text-base font-medium text-primary">
                  {mentor.position || "No position"}
                </p>
                {mentor.description && (
                  <p className="mt-3 text-sm leading-6 text-paragraph">
                    {mentor.description}
                  </p>
                )}
              </MotionWrapper>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  // Three or more mentors: responsive grid
  return (
    <Section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          eyebrow={t.mentor.eyebrow}
          title={t.mentor.title}
          description={t.mentor.description}
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mentors.map((mentor) => (
            <MotionWrapper
              key={mentor.id}
              className="rounded-[1.75rem] border border-border bg-white p-6 shadow-soft"
            >
              {mentor.photoUrl?.trim() ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mentor.photoUrl}
                  alt={mentor.name}
                  className="aspect-[4/3] w-full rounded-xl border border-white/70 object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-white/70 bg-white/80 text-center text-sm font-medium text-paragraph">
                  No photo
                </div>
              )}
              <h3 className="mt-4 text-xl font-semibold text-heading">
                {mentor.name || "Untitled"}
              </h3>
              <p className="mt-1 text-base font-medium text-primary">
                {mentor.position || "No position"}
              </p>
              {mentor.description && (
                <p className="mt-3 text-sm leading-6 text-paragraph">
                  {mentor.description}
                </p>
              )}
            </MotionWrapper>
          ))}
        </div>
        {mentors.length === 0 && (
          <div className="mt-6 rounded-3xl border border-border bg-cardBg p-6">
            <p className="text-sm text-paragraph">
              No mentors available yet.
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}