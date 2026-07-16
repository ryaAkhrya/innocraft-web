"use client";

import { Brain, Compass, MessageSquare, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";

export function WhyMinecraft() {
  const { t } = useLanguage();
  return (
    <Section id="about" className="py-10 sm:py-16">
      <Container>
        <MotionWrapper>
          <div className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft sm:p-10">
            <SectionTitle eyebrow={t.whyMinecraft.eyebrow} title={t.whyMinecraft.title} description={t.whyMinecraft.description} />
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {t.whyMinecraft.items.map((item, index) => {
                const icons = [Sparkles, Compass, Brain, MessageSquare];
                const Icon = icons[index % icons.length];
                return (
                  <div key={item.title} className="rounded-[1.5rem] border border-border bg-cardBg p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primaryBg/70 text-heading">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-heading">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-paragraph">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}
