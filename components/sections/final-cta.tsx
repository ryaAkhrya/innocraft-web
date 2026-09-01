"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PrimaryButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";

import { useLanguage } from "@/lib/i18n/language-provider";

export function FinalCta() {
  const { t } = useLanguage();
  return (
    <Section className="py-16 sm:py-24 bg-websiteBg relative">
      <Container>
        <MotionWrapper className="relative overflow-hidden rounded-[2.5rem] bg-heading px-8 py-16 sm:px-16 sm:py-20 text-center shadow-2xl">
          {/* Explosive Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-accentEnergy/30 blur-[100px] rounded-full" />
          <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-accentDigitalBlue/40 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] bg-accentLavender/40 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold tracking-widest text-white uppercase border border-white/20 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-accentEnergy" />
              Mulai Petualangan
            </div>
            
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              {t.cta.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-300 sm:text-xl">
              {t.cta.description}
            </p>
            
            {/* Dense Button Stacking */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
              <PrimaryButton asChild className="w-full sm:w-auto px-8 py-4 text-base bg-accentEnergy hover:bg-orange-600 text-white border-2 border-transparent shadow-[0_6px_0_rgba(153,27,27,1)] active:shadow-none active:translate-y-[6px]">
                <Link href="#contact">
                  {t.cta.action}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </PrimaryButton>
              <Link href="#projects" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-colors inline-flex items-center justify-center">
                Lihat Proyek Dulu
              </Link>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}
