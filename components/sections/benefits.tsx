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
    <Section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          eyebrow={badge}
          title={title}
          description={subtitle}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {benefitCards.map((card) => (
            <MotionWrapper
              key={card.id}
              className="group rounded-3xl border border-border bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                {/* Text-based icon (emoji / string) rendered consistently */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primaryBg/70 text-2xl transition-transform duration-300 group-hover:scale-110">
                  <span aria-hidden="true">{card.icon || "⭐"}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-heading">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-paragraph">
                    {card.description}
                  </p>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </Container>
    </Section>
  );
}