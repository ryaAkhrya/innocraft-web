"use client";

import { Box, Code, Hexagon, Triangle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";

export function Opportunities() {
  const { t } = useLanguage();
  return (
    <Section className="py-12 sm:py-24 bg-gradient-to-b from-[#E0F2FE] to-white relative overflow-hidden">
      {/* Decorative sky background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-white/40 blur-3xl rounded-[100%]" />
      
      <Container className="relative">
        <MotionWrapper className="rounded-[2.5rem] border-2 border-white/60 bg-white/60 p-8 shadow-[0_20px_60px_-15px_rgba(30,58,138,0.05)] backdrop-blur-lg sm:p-12 lg:p-16">
          <SectionTitle eyebrow={t.opportunities.eyebrow} title={t.opportunities.title} description={t.opportunities.description} className="max-w-2xl" />
          
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {t.opportunities.items.map((item, i) => {
              const icons = [Box, Code, Triangle, Hexagon];
              const Icon = icons[i % icons.length];
              return (
                <div key={item.title} className="group relative rounded-[2rem] border-2 border-white bg-white/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E0F2FE] text-[#0369A1] transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-bold text-heading">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-paragraph">{item.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 rounded-[1.5rem] border-2 border-dashed border-[#BAE6FD] bg-[#F0F9FF] p-6 text-sm leading-relaxed text-[#075985] font-medium text-center shadow-sm">
            {t.opportunities.note}
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}
