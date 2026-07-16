"use client";

import { BadgeCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";
import { useMockCmsState } from "@/lib/studio/cms-storage";
import {
  defaultStudioMentorData,
  type StudioMentorData,
} from "@/lib/studio/mock-mentor";

const STORAGE_KEY = "studio.mentor.mock";

export function Mentor() {
  const { t } = useLanguage();

  const { value: saved } = useMockCmsState<StudioMentorData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioMentorData,
  });

  const data = saved.mentors.length > 0 ? saved : defaultStudioMentorData;

  return (
    <Section className="py-10 sm:py-16">
      <Container>
        <MotionWrapper className="rounded-[2rem] border border-border bg-white p-8 shadow-soft sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="rounded-[1.75rem] border border-border bg-gradient-to-br from-primaryBg/50 to-white p-6">
              {data.mentors[0].photoUrl &&
              data.mentors[0].photoUrl.trim().length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.mentors[0].photoUrl}
                  alt={data.mentors[0].name}
                  className="h-[320px] w-full rounded-[1.5rem] border border-white/70 object-cover"
                />
              ) : (
                <div className="flex h-[320px] items-center justify-center rounded-[1.5rem] border border-white/70 bg-white/80 text-center text-sm font-medium text-paragraph">
                  <div>
                    <Sparkles className="mx-auto mb-3 h-8 w-8 text-heading" />
                    <p>{t.mentor.eyebrow}</p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <SectionTitle
                eyebrow={t.mentor.eyebrow}
                title={t.mentor.title}
                description={t.mentor.description}
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {t.mentor.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.25rem] border border-border bg-cardBg p-4"
                  >
                    <p className="text-sm font-semibold text-heading">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-paragraph">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <ul className="mt-6 space-y-3">
                {t.mentor.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-sm leading-7 text-paragraph"
                  >
                    <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-heading" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}