"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";

import { useLanguage } from "@/lib/i18n/language-provider";

export function FinalCta() {
  const { t } = useLanguage();
  return (
    <Section className="py-20 sm:py-32 bg-websiteBg relative">
      <Container>
        <MotionWrapper className="relative">
          {/* V4 Playful offset backing */}
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[3.5rem] bg-softYellow border-2 border-white pointer-events-none shadow-soft-sm" />
          
          <div className="relative overflow-hidden rounded-[3.5rem] bg-heading px-8 py-16 sm:px-16 sm:py-24 text-center shadow-soft-lg border-4 border-white z-10 transition-transform duration-500 hover:-translate-y-2">
            {/* Playful Background Elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-peach/20 blur-[80px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-skyBlue/20 blur-[80px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center">
              <div className="mb-10 inline-flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md px-5 py-2 text-sm font-bold tracking-widest text-white uppercase border border-white/20 shadow-sm">
                <Sparkles className="mr-2 h-4 w-4 text-energyYellow" />
                Mulai Petualangan
              </div>
              
              <h2 className="text-4xl font-display font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                {t.cta.title}
              </h2>
              <p className="mt-8 text-xl font-medium leading-relaxed text-gray-300">
                {t.cta.description}
              </p>
              
              {/* Playful Button Stacking */}
              <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-center w-full sm:w-auto">
                <Link 
                  href="#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border-2 border-white bg-peach px-10 py-5 text-sm font-bold uppercase tracking-widest text-heading transition-all hover:bg-coral hover:text-white shadow-soft-lg hover:shadow-color-peach hover:-translate-y-1 active:translate-y-0"
                >
                  {t.cta.action}
                  <ArrowRight className="ml-3 h-5 w-5 stroke-[2.5]" />
                </Link>
                <Link 
                  href="#projects" 
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border-2 border-white/30 bg-white/5 backdrop-blur-sm px-10 py-5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:border-white shadow-soft-sm hover:-translate-y-1 active:translate-y-0"
                >
                  Lihat Proyek Dulu
                </Link>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}
