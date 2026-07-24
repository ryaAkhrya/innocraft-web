'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { PageTransition } from "@/components/ui/page-transition";
import { Section } from "@/components/ui/section";
import { useLanguage } from "@/lib/i18n/language-provider";
import {
  defaultStudioHeroData,
  type StudioHeroData,
} from "@/lib/studio/mock-hero";
import { supabase } from "@/lib/supabase/client";



export function Hero() {
  const { t } = useLanguage();

  // Hydration-safe: render default on first pass (SSR + initial client render).
  const [heroData, setHeroData] = useState<StudioHeroData>(
    defaultStudioHeroData,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadHero() {
      try {
        const { data, error } = await supabase
          .from("hero")
          .select("*")
          .limit(1);

        if (cancelled) return;

        if (error) {
          setHeroData(defaultStudioHeroData);
          return;
        }

        if (!data || data.length === 0) {
          const { data: inserted, error: insertError } = await supabase
            .from("hero")
            .insert({
              badge: defaultStudioHeroData.badge,
              title: defaultStudioHeroData.title,
              subtitle: defaultStudioHeroData.subtitle,
              primary_button_text: defaultStudioHeroData.primaryButtonText,
              primary_button_url: "",
              secondary_button_text: defaultStudioHeroData.secondaryButtonText,
              secondary_button_url: "",
              hero_video_url: defaultStudioHeroData.heroVideoUrl,
            })
            .select("*")
            .limit(1);

          if (cancelled) return;

          if (insertError || !inserted || inserted.length === 0) {
            setHeroData(defaultStudioHeroData);
            return;
          }

          const row = inserted[0];
          setHeroData({
            badge: row.badge ?? defaultStudioHeroData.badge,
            title: row.title ?? defaultStudioHeroData.title,
            subtitle: row.subtitle ?? defaultStudioHeroData.subtitle,
            primaryButtonText:
              row.primary_button_text ?? defaultStudioHeroData.primaryButtonText,
            secondaryButtonText:
              row.secondary_button_text ??
              defaultStudioHeroData.secondaryButtonText,
            heroVideoUrl: row.hero_video_url ?? defaultStudioHeroData.heroVideoUrl,
          });
          return;
        }

        const row = data[0];
        setHeroData({
          badge: row.badge ?? defaultStudioHeroData.badge,
          title: row.title ?? defaultStudioHeroData.title,
          subtitle: row.subtitle ?? defaultStudioHeroData.subtitle,
          primaryButtonText:
            row.primary_button_text ?? defaultStudioHeroData.primaryButtonText,
          secondaryButtonText:
            row.secondary_button_text ?? defaultStudioHeroData.secondaryButtonText,
          heroVideoUrl: row.hero_video_url ?? defaultStudioHeroData.heroVideoUrl,
        });
      } catch {
        if (!cancelled) setHeroData(defaultStudioHeroData);
      }
    }

    loadHero();

    return () => {
      cancelled = true;
    };
  }, []);


  return (
    <Section id="home" className="pt-6 pb-10 sm:pt-10 sm:pb-16">
      <Container>
        <PageTransition>
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <MotionWrapper className="max-w-2xl">
              {/* Cinematic spotlight behind headline */}
              <div className="relative">
                <div className="hero-spotlight hero-spotlight--primary" aria-hidden="true" />
                <div className="hero-spotlight hero-spotlight--secondary" aria-hidden="true" />
                <p className="relative text-sm font-semibold uppercase tracking-[0.35em] text-heading/70">
                  {heroData.badge || t.hero.eyebrow}
                </p>
                <h1 className="relative mt-4 text-4xl font-semibold leading-tight tracking-tight text-heading sm:text-5xl lg:text-6xl">
                  {heroData.title || t.hero.title}
                </h1>
              </div>
              <p className="mt-6 text-lg leading-8 text-paragraph">
                {heroData.subtitle || t.hero.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <PrimaryButton asChild>
                  <Link href="#contact">
                    {heroData.primaryButtonText || t.hero.primaryAction}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </PrimaryButton>
                <SecondaryButton asChild>
                  <Link href="#about" className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4" />
                    {heroData.secondaryButtonText || t.hero.secondaryAction}
                  </Link>
                </SecondaryButton>
              </div>
            </MotionWrapper>

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="order-2 lg:order-none"
            >
              <div className="hero-card group">
                {/* Ambient glow — always visible, pulses */}
                <div className="hero-card-glow hero-card-glow--primary" aria-hidden="true" />
                <div className="hero-card-glow hero-card-glow--secondary" aria-hidden="true" />
                {/* Hover-expanded ambient glow */}
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-primaryBg/12 via-accentSoft/6 to-accentBlue/8 opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" aria-hidden="true" />
                <div className="hero-card-inner">
                  {(() => {
                    const rawUrl = (heroData.heroVideoUrl ?? "").trim();
                    const videoUrl = rawUrl.length > 0 ? rawUrl : null;

                    if (!videoUrl) {
                      return (
                        <div
                          className="h-full min-h-[320px] w-full rounded-[1.5rem] border border-white/30 bg-white/30 sm:min-h-[380px] lg:min-h-[430px] flex items-center justify-center"
                          aria-label="No video selected"
                        >
                          <span className="px-4 text-sm font-medium text-heading/70">
                            No video selected
                          </span>
                        </div>
                      );
                    }

                    const videoType = videoUrl?.includes('.webm') 
                      ? 'video/webm' 
                      : videoUrl?.includes('.mov') 
                      ? 'video/quicktime' 
                      : 'video/mp4';
                    
                    return (
                      <div className="video-frame" style={{ minHeight: '320px' }}>
                        <video
                          key={videoUrl}
                          className="h-full min-h-[320px] w-full object-cover sm:min-h-[380px] lg:min-h-[430px]"
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls
                          preload="metadata"
                          aria-label="Intro video preview"
                        >
                          <source src={videoUrl} type={videoType} />
                        </video>
                      </div>
                    );
                  })()}

                </div>
                <div className="absolute left-6 top-6 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-medium text-heading shadow-sm backdrop-blur">
                  {t.mentor.eyebrow}
                </div>
              </div>
            </motion.div>
          </div>
        </PageTransition>
      </Container>
    </Section>
  );
}