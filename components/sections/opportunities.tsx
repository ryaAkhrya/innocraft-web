"use client";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";

export function Opportunities() {
  const { t } = useLanguage();
  return (
    <Section className="py-10 sm:py-16">
      <Container>
        <MotionWrapper className="rounded-[2rem] border border-border bg-white/85 p-8 shadow-soft sm:p-10">
          <SectionTitle eyebrow={t.opportunities.eyebrow} title={t.opportunities.title} description={t.opportunities.description} />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {t.opportunities.items.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-border bg-cardBg p-5">
                <h3 className="text-lg font-semibold text-heading">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-paragraph">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-border bg-primaryBg/20 p-5 text-sm leading-7 text-paragraph">
            {/* Replace future links here */}
            {t.opportunities.note}
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}
