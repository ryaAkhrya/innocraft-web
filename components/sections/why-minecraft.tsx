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
    <Section id="about" className="py-20 sm:py-32 relative bg-websiteBgEnd/85">
      <Container className="relative">
        <MotionWrapper>
          <div className="relative rounded-[2rem] sm:rounded-[3rem] bg-white dark:bg-slate-800 p-6 sm:p-12 lg:p-16 border-4 border-white shadow-soft-lg z-10">
            <SectionTitle 
              eyebrow={t.whyMinecraft.eyebrow} 
              title={t.whyMinecraft.title} 
              description={t.whyMinecraft.description} 
              className="mb-16 max-w-2xl"
              highlightWord="Minecraft"
              highlightColor="yellow"
            />
            
            <div className="relative mt-8">
              <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
                {t.whyMinecraft.items.map((item, index) => {
                  const icons = [Sparkles, Compass, Brain, MessageSquare];
                  const Icon = icons[index % icons.length];
                  
                  // V4 Playful Color Blocks
                  const blockColors = ["bg-peach/40", "bg-softGreen", "bg-softYellow", "bg-softBlue"];
                  const iconColors = ["text-coral", "text-freshGreen", "text-[#101B35]", "text-skyBlue"];
                  const blockClass = blockColors[index % blockColors.length];
                  const iconClass = iconColors[index % iconColors.length];

                  return (
                    <div key={item.title} className={cn("relative flex flex-col rounded-[2rem] p-6 sm:p-8 transition-transform duration-500 hover:-translate-y-2 hover:shadow-soft-sm border-2 border-white", blockClass)}>
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-white/50">
                        <Icon className={cn("h-7 w-7", iconClass)} />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-[#101B35] dark:text-[#101B35] mb-3">{item.title}</h3>
                      <p className="text-slate-700 dark:text-slate-800 text-lg font-medium leading-relaxed">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Playful backplate */}
          <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 sm:translate-x-3 sm:translate-y-3 lg:translate-x-6 lg:translate-y-6 rounded-[2rem] sm:rounded-[3rem] bg-softLavender border-2 border-white pointer-events-none -z-10 shadow-soft-sm" />
        </MotionWrapper>
      </Container>
    </Section>
  );
}
