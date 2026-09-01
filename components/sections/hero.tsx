'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/ui/button";
import { ClickToPlayVideo } from "@/components/ui/click-to-play-video";
import { Container } from "@/components/ui/container";
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
    <Section id="home" className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden bg-websiteBg">
      {/* V4 Soft Playful Environment */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-peach/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-softGreen/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Geometry */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="absolute top-24 right-[5%] hidden xl:block"
      >
        <div className="w-16 h-16 rounded-3xl bg-peach/80 border-2 border-white rotate-12 shadow-color-peach flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-white/60" />
        </div>
        <div className="w-8 h-8 rounded-xl bg-softYellow border-2 border-white absolute -bottom-4 -left-4 -rotate-12 shadow-soft-sm" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        className="absolute bottom-24 left-[5%] hidden xl:block"
      >
        <div className="w-24 h-24 rounded-full bg-softBlue border-2 border-white -rotate-12 shadow-color-blue flex items-center justify-center">
          <div className="w-10 h-10 rounded-lg bg-skyBlue rotate-12" />
        </div>
      </motion.div>

      <Container className="relative z-10">
        <PageTransition>
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="max-w-2xl"
            >
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0 } } }}
                >
                  <p className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-heading/80">
                    <span className="h-3 w-3 rounded-full bg-coral animate-pulse" />
                    {heroData.badge || t.hero.eyebrow}
                  </p>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 } } }}
                  className="mt-6 text-4xl sm:text-[2.75rem] md:text-5xl font-display font-extrabold leading-[1.1] tracking-tight text-heading lg:text-[4.25rem]"
                >
                  {(() => {
                    const titleText = heroData.title || t.hero.title;
                    const parts = titleText.split("Kreator Digital");
                    if (parts.length === 2) {
                      return (
                        <>
                          {parts[0]}
                          <span className="relative inline-block whitespace-nowrap px-3 mx-1">
                            <span className="relative z-10">Kreator Digital</span>
                            <motion.span 
                              initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                              variants={{ visible: { scale: 1, opacity: 1, rotate: -2, transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.3 } } }}
                              className="absolute inset-0 -z-10 rounded-2xl bg-softBlue shadow-soft-sm"
                            />
                          </span>
                          {parts[1]}
                        </>
                      );
                    }
                    return titleText;
                  })()}
                </motion.h1>
              </div>
              
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 } } }}
                className="mt-8 text-lg font-medium leading-relaxed text-paragraph lg:text-xl max-w-lg"
              >
                {heroData.subtitle || t.hero.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 } } }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <PrimaryButton asChild>
                  <Link href="#contact" className="group">
                    {heroData.primaryButtonText || t.hero.primaryAction}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </PrimaryButton>
                <SecondaryButton asChild>
                  <Link href="#about" className="group flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-skyBlue group-hover:text-skyBlue transition-colors" />
                    {heroData.secondaryButtonText || t.hero.secondaryAction}
                  </Link>
                </SecondaryButton>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
              className="order-2 lg:order-none relative"
            >
              {/* Soft colored backing plate */}
              <div className="absolute inset-0 translate-x-4 translate-y-6 rounded-[3rem] bg-softYellow rotate-3 pointer-events-none shadow-soft-sm" />
              
              <div className="relative rounded-[3rem] border-4 border-white bg-white overflow-hidden shadow-soft-lg z-10 transition-transform duration-500 hover:-translate-y-2">
                {(() => {
                  const rawUrl = (heroData.heroVideoUrl ?? "").trim();
                  const videoUrl = rawUrl.length > 0 ? rawUrl : null;
                  const customThumbnail = (heroData.thumbnailUrl ?? "").trim();
                  const thumbnailUrl = customThumbnail.length > 0 ? customThumbnail : undefined;

                  if (!videoUrl) {
                    if (thumbnailUrl) {
                      return (
                        <div className="h-full min-h-[360px] w-full lg:min-h-[480px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumbnailUrl}
                            alt={heroData.title || "INNOCRAFT"}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                          />
                        </div>
                      );
                    }
                    return (
                      <div className="h-full min-h-[360px] w-full flex items-center justify-center lg:min-h-[480px] bg-websiteBgEnd">
                        <span className="font-medium text-paragraph/50">Tidak ada video terpilih</span>
                      </div>
                    );
                  }

                  return (
                    <div className="video-frame min-h-[360px] lg:min-h-[480px]">
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
                
                {/* Visual Label */}
                <div className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 rounded-2xl border-2 border-white bg-white/90 backdrop-blur-md px-5 py-3 text-xs font-bold uppercase tracking-widest text-heading shadow-soft-sm">
                  <span className="h-3 w-3 rounded-full bg-freshGreen" />
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