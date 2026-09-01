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
      <Section className="py-10 sm:py-16">
        <Container>
          <SectionTitle
            eyebrow={badge}
            title={title}
            description={subtitle}
          />
          <div className="mt-8 text-center">
            <div className="rounded-3xl border border-border bg-white p-8 shadow-soft">
              <p className="text-base text-paragraph">
                Benefits coming soon.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="py-12 sm:py-24 relative overflow-hidden bg-white">
      {/* Decorative background geometry */}
      <div className="absolute inset-0 bg-grid-subtle opacity-[0.15] bg-[length:40px_40px]" />
      
      <Container className="relative">
        <SectionTitle
          eyebrow={badge}
          title={title}
          description={subtitle}
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {benefitCards.map((card, i) => {
            const accents = ["bg-accentSage/20 border-accentSage/50", "bg-accentDigitalBlue/20 border-accentDigitalBlue/50", "bg-accentEnergy/20 border-accentEnergy/50", "bg-accentLavender/20 border-accentLavender/50"];
            const iconAccents = ["bg-accentSage text-[#4A5D23]", "bg-accentDigitalBlue text-[#1E3A8A]", "bg-accentEnergy text-[#92400E]", "bg-accentLavender text-[#6B21A8]"];
            const accent = accents[i % accents.length];
            const iconAccent = iconAccents[i % iconAccents.length];

            return (
              <MotionWrapper
                key={card.id}
                className={`group relative rounded-[2rem] border-2 p-6 sm:p-8 transition-transform duration-300 hover:-translate-y-1 ${accent}`}
              >
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <span className="text-6xl font-bold font-display italic">
                    0{i + 1}
                  </span>
                </div>
                
                <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                  {/* Text-based icon (emoji / string) rendered consistently */}
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110 shadow-sm ${iconAccent}`}>
                    <span aria-hidden="true">{card.icon || "⭐"}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-heading">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-paragraph">
                      {card.description}
                    </p>
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