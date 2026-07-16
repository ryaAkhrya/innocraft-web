"use client";

import { CalendarDays, Clock3, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";
import { useMockCmsState } from "@/lib/studio/cms-storage";
import {
  defaultStudioProgramData,
  type StudioProgramData,
} from "@/lib/studio/mock-program";

const STORAGE_KEY = "studio.program.mock";

export function ClassInfo() {
  const { t } = useLanguage();

  const { value: saved } = useMockCmsState<StudioProgramData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioProgramData,
  });

  // Collect all features from all programs as the facilities list
  const facilities = saved.programs.flatMap((p) => p.features);

  return (
    <Section className="py-10 sm:py-16">
      <Container>
        <MotionWrapper className="rounded-[2rem] border border-border bg-white/90 p-8 shadow-soft sm:p-10">
          <SectionTitle
            eyebrow={t.classInfo.eyebrow}
            title={t.classInfo.title}
            description={t.classInfo.description}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-border bg-cardBg p-6">
              <div className="flex items-center gap-3 text-heading">
                <CalendarDays className="h-5 w-5" />
                <p className="font-semibold">{t.classInfo.schedule}</p>
              </div>
              <div className="mt-4 flex items-center gap-3 text-paragraph">
                <Clock3 className="h-5 w-5" />
                <p>{t.classInfo.time}</p>
              </div>
              <div className="mt-4 flex items-center gap-3 text-paragraph">
                <Sparkles className="h-5 w-5" />
                <p>{t.classInfo.age}</p>
              </div>
              <div className="mt-4 flex items-center gap-3 text-paragraph">
                <MapPin className="h-5 w-5" />
                <p>{t.classInfo.note}</p>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-border bg-primaryBg/20 p-6">
              <h3 className="text-xl font-semibold text-heading">
                {t.classInfo.eyebrow}
              </h3>
              <ul className="mt-4 space-y-3">
                {facilities.length > 0
                  ? facilities.map((facility) => (
                      <li
                        key={facility}
                        className="rounded-full border border-border bg-white/70 px-4 py-2 text-sm text-paragraph"
                      >
                        {facility}
                      </li>
                    ))
                  : t.classInfo.facilities.map((facility) => (
                      <li
                        key={facility}
                        className="rounded-full border border-border bg-white/70 px-4 py-2 text-sm text-paragraph"
                      >
                        {facility}
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