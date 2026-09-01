"use client";

import { Brain, Compass, MessageSquare, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";

export function WhyMinecraft() {
  const { t } = useLanguage();
  return (
    <Section id="about" className="py-12 sm:py-20 relative bg-[#FFF4F2]">
      {/* Abstract modular grid background */}
      <div className="absolute inset-0 bg-grid-subtle opacity-50 bg-[length:32px_32px]" />
      
      <Container className="relative">
        <MotionWrapper>
          <div className="rounded-[2.5rem] border-2 border-border bg-white p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-12 lg:p-16">
            <SectionTitle eyebrow={t.whyMinecraft.eyebrow} title={t.whyMinecraft.title} description={t.whyMinecraft.description} className="mb-16 max-w-2xl" />
            
            <div className="relative mt-8">
              {/* Connecting line for timeline */}
              <div className="absolute left-[22px] top-4 bottom-4 w-1 bg-gradient-to-b from-primaryBg via-accentEnergy to-accentDigitalBlue hidden lg:block rounded-full opacity-60" />

              <div className="grid gap-6 lg:gap-10">
                {t.whyMinecraft.items.map((item, index) => {
                  const icons = [Sparkles, Compass, Brain, MessageSquare];
                  const Icon = icons[index % icons.length];
                  
                  // Alternate accents for each block
                  const accents = ["bg-primaryBg/30 border-primaryBg", "bg-accentSage/50 border-accentSage", "bg-accentEnergy/60 border-accentEnergy", "bg-accentDigitalBlue/60 border-accentDigitalBlue"];
                  const iconAccents = ["bg-primaryBg/70 text-heading", "bg-accentSage text-[#4A5D23]", "bg-accentEnergy text-[#92400E]", "bg-accentDigitalBlue text-[#1E3A8A]"];
                  const accentClass = accents[index % accents.length];
                  const iconAccent = iconAccents[index % iconAccents.length];

                  return (
                    <div key={item.title} className="relative flex flex-col lg:flex-row items-start gap-6 lg:gap-10 group">
                      
                      <div className="relative z-10 hidden lg:flex items-center justify-center shrink-0">
                        <div className="h-12 w-12 rounded-xl bg-white border-4 border-white shadow-sm flex items-center justify-center relative z-10">
                          <div className={cn("h-full w-full rounded-lg flex items-center justify-center", iconAccent)}>
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>

                      <div className={cn("flex-1 rounded-[1.5rem] border-2 p-6 transition-all duration-300 group-hover:-translate-y-1 bg-white", accentClass)}>
                        <div className="flex items-center gap-4 lg:hidden mb-4">
                          <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", iconAccent)}>
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-heading">{item.title}</h3>
                        <p className="mt-3 text-base leading-relaxed text-paragraph">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}
