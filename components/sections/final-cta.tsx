"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PrimaryButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";

import { useLanguage } from "@/lib/i18n/language-provider";

export function FinalCta() {
  const { t } = useLanguage();
  return (
    <Section className="py-10 sm:py-16">
      <Container>
        <MotionWrapper className="rounded-[2rem] border border-border bg-heading p-8 text-white shadow-soft sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.cta.title}</h2>
              <p className="mt-4 text-base leading-8 text-white/80">{t.cta.description}</p>
            </div>
            <PrimaryButton asChild className="bg-white text-heading hover:bg-primaryBg">
              <Link href="#contact">
                {t.cta.action}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </PrimaryButton>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}
