'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { ClickToPlayVideo } from "@/components/ui/click-to-play-video";
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
          .select("id, badge, title, subtitle, primary_button_text, secondary_button_text, hero_video_url, thumbnail_url")
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
              thumbnail_url: defaultStudioHeroData.thumbnailUrl,
            })
            .select("id, badge, title, subtitle, primary_button_text, secondary_button_text, hero_video_url, thumbnail_url")
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
            thumbnailUrl: row.thumbnail_url ?? defaultStudioHeroData.thumbnailUrl,
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
          thumbnailUrl: row.thumbnail_url ?? defaultStudioHeroData.thumbnailUrl,
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
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="max-w-2xl"
            >
              {/* Cinematic spotlight behind headline */}
              <div className="relative">
                <div className="hero-spotlight hero-spotlight--primary" aria-hidden="true" />
                <div className="hero-spotlight hero-spotlight--secondary" aria-hidden="true" />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
                >
                  <p className="relative inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-heading/70">
                    <span className="h-1.5 w-1.5 bg-primaryBg" />
                    {heroData.badge || t.hero.eyebrow}
                  </p>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 } } }}
                  className="relative mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-heading sm:text-5xl lg:text-[4rem]"
                >
                  {heroData.title || t.hero.title}
                </motion.h1>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.22 } } }}
                className="mt-6 text-lg leading-relaxed text-paragraph lg:text-xl"
              >
                {heroData.subtitle || t.hero.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.32 } } }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <PrimaryButton asChild>
                  <Link href="#contact" className="group">
                    {heroData.primaryButtonText || t.hero.primaryAction}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </PrimaryButton>
                <SecondaryButton asChild>
                  <Link href="#about" className="group flex items-center gap-2">
                    <PlayCircle className="h-4 w-4 text-primaryBg transition-colors group-hover:text-heading" />
                    {heroData.secondaryButtonText || t.hero.secondaryAction}
                  </Link>
                </SecondaryButton>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
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
                    const customThumbnail = (heroData.thumbnailUrl ?? "").trim();
                    const thumbnailUrl = customThumbnail.length > 0 ? customThumbnail : undefined;

                    if (!videoUrl) {
                      // If we have a custom thumbnail but no video, show the thumbnail
                      if (thumbnailUrl) {
                        return (
                          <div
                            className="h-full min-h-[320px] w-full overflow-hidden rounded-[1.5rem] sm:min-h-[380px] lg:min-h-[430px]"
                            aria-label="Hero thumbnail"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={thumbnailUrl}
                              alt={heroData.title || "INNOCRAFT"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        );
                      }
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

                    return (
                      <div className="video-frame min-h-[320px] sm:min-h-[380px] lg:min-h-[430px]">
                        <ClickToPlayVideo
                          key={videoUrl}
                          videoUrl={videoUrl}
                          thumbnailUrl={thumbnailUrl}
                          title={heroData.title || "INNOCRAFT introduction"}
                          className="absolute inset-0 h-full w-full"
                        />
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