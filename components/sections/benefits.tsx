"use client";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import {
  defaultStudioBenefitData,
  StudioBenefitCard,
  StudioBenefitData,
} from "@/lib/studio/mock-benefit";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";


// ---- Helpers ---------------------------------------------------------------

type BenefitRow = {
  id: string;
  icon: string | null;
  title: string | null;
  description: string | null;
  display_order: number;
};

type BenefitSectionRow = {
  id: string;
  badge: string | null;
  title: string | null;
  subtitle: string | null;
};

function toBenefitCard(row: BenefitRow): StudioBenefitCard {
  return {
    id: String(row.id),
    icon: row.icon ?? "⭐",
    title: row.title ?? "",
    description: row.description ?? "",
  };
}

// ---- Component -------------------------------------------------------------

export function Benefits() {
  // Hydration-safe: render default on first pass (SSR + initial client render).
  const [benefitData, setBenefitData] = useState<StudioBenefitData>(
    defaultStudioBenefitData,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadBenefits() {
      try {
        // 1) Load section-level data (badge, title, subtitle) from benefit_section.
        const { data: sectionRows, error: sectionError } = await supabase
          .from("benefit_section")
          .select("id, badge, title, subtitle")
          .limit(1);

        if (cancelled) return;

        let section: { badge: string; title: string; subtitle: string };

        if (sectionError || !sectionRows || sectionRows.length === 0) {
          // Fallback to defaults if table is empty or error
          section = {
            badge: defaultStudioBenefitData.badge,
            title: defaultStudioBenefitData.title,
            subtitle: defaultStudioBenefitData.subtitle,
          };
        } else {
          const row = sectionRows[0] as BenefitSectionRow;
          section = {
            badge: row.badge ?? defaultStudioBenefitData.badge,
            title: row.title ?? defaultStudioBenefitData.title,
            subtitle: row.subtitle ?? defaultStudioBenefitData.subtitle,
          };
        }

        // 2) Load benefit cards from benefits table (dynamic, all active rows).
        const { data: cardRows, error: cardsError } = await supabase
          .from("benefits")
          .select("id, icon, title, description, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (cancelled) return;

        let cards: StudioBenefitCard[];

        if (cardsError || !cardRows || cardRows.length === 0) {
          // Fallback to default cards
          cards = defaultStudioBenefitData.cards.map((c) => ({ ...c }));
        } else {
          const sorted = (cardRows as BenefitRow[]).sort(
            (a, b) => a.display_order - b.display_order,
          );
          cards = sorted.map(toBenefitCard);
        }

        setBenefitData({
          badge: section.badge,
          title: section.title,
          subtitle: section.subtitle,
          cards,
        });
      } catch (e) {
        console.error("Error loading benefits:", e);
      }
    }

    loadBenefits();
    return () => {
      cancelled = true;
    };
  }, []);

  const { badge, title, subtitle, cards: benefitCards } = benefitData;

  if (benefitCards.length === 0) {
    return (
      <Section className="py-20 sm:py-32">
        <Container>
          <SectionTitle
            eyebrow={badge}
            title={title}
            description={subtitle}
          />
          <div className="mt-8 text-center">
            <div className="rounded-[3rem] border-4 border-white bg-white p-8 shadow-soft-lg">
              <p className="text-base font-medium text-paragraph">
                Benefits coming soon.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="py-20 sm:py-32 relative overflow-hidden bg-websiteBg/85 dark:bg-[#101B35] transition-colors duration-500">
      {/* Playful blobs */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-softYellow/30 rounded-full blur-[80px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionTitle
          eyebrow={badge}
          title={title}
          description={subtitle}
          highlightWord="kualitas"
          highlightColor="green"
        />
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {benefitCards.map((card, i) => {
            // V4 Playful Solid Color Variants
            const iconAccents = ["bg-peach text-heading", "bg-softBlue text-heading", "bg-softYellow text-heading", "bg-softGreen text-heading"];
            const numberAccents = ["text-coral/20 dark:text-coral/30 group-hover:text-coral/40 dark:group-hover:text-coral/50", "text-skyBlue/20 dark:text-skyBlue/30 group-hover:text-skyBlue/40 dark:group-hover:text-skyBlue/50", "text-heading/10 dark:text-slate-400/20 group-hover:text-heading/20 dark:group-hover:text-slate-400/30", "text-freshGreen/20 dark:text-freshGreen/30 group-hover:text-freshGreen/40 dark:group-hover:text-freshGreen/50"];
            
            const iconAccent = iconAccents[i % iconAccents.length];
            const numberAccent = numberAccents[i % numberAccents.length];

            return (
              <MotionWrapper
                key={card.id}
                className="group relative h-full"
              >
                {/* Offset shadow block */}
                <div className={`absolute inset-0 translate-x-1.5 translate-y-1.5 sm:translate-x-3 sm:translate-y-3 rounded-[2rem] sm:rounded-[3rem] border-2 border-white ${iconAccent.split(' ')[0]} pointer-events-none transition-transform duration-500 sm:group-hover:translate-x-4 sm:group-hover:translate-y-4`} />
                
                <div className="relative flex flex-col items-start gap-6 rounded-[2rem] sm:rounded-[3rem] border-4 border-white bg-white dark:bg-[#18243A] p-6 sm:p-10 transition-transform duration-500 sm:hover:-translate-y-2 shadow-soft-lg overflow-hidden h-full z-10">
                  <div className="absolute top-0 right-0 p-8 select-none pointer-events-none transition-colors duration-500">
                    <span className={`text-8xl font-display font-black transition-colors duration-500 ${numberAccent}`}>
                      0{i + 1}
                    </span>
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-start gap-6">
                    {/* Text-based icon (emoji / string) rendered consistently */}
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm border-2 border-white text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 ${iconAccent}`}>
                      <span aria-hidden="true">{card.icon || "⭐"}</span>
                    </div>
                    <div className="min-w-0 mt-2 pr-8">
                      <h3 className="text-2xl font-display font-bold text-heading dark:text-slate-100">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-lg font-medium leading-relaxed text-paragraph dark:text-slate-300">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}