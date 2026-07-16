"use client";

import { Compass, GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";
import { useMockCmsState } from "@/lib/studio/cms-storage";
import {
  defaultStudioBenefitData,
  type StudioBenefitData,
} from "@/lib/studio/mock-benefit";

const STORAGE_KEY = "studio.benefit.mock";

export function Benefits() {
  const { t } = useLanguage();

  const { value: saved } = useMockCmsState<StudioBenefitData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioBenefitData,
  });

  const icons = [GraduationCap, Sparkles, Compass, TrendingUp];

  return (
    <Section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          eyebrow={saved.badge || t.benefits.eyebrow}
          title={saved.title || t.benefits.title}
          description={saved.subtitle || t.benefits.description}
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {saved.cards.map((card, index) => {
            const Icon = icons[index % icons.length];
            return (
              <MotionWrapper
                key={card.id}
                className="rounded-[1.75rem] border border-border bg-white p-6 shadow-soft"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primaryBg/70 text-heading">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-heading">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-paragraph">
                  {card.description}
                </p>
              </MotionWrapper>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}