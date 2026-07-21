"use client";

import { Compass, GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";
import { defaultStudioBenefitData, StudioBenefitCard } from "@/lib/studio/mock-benefit";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";


function toStudiBenefitCard(row: {
  id: string;
  icon: string | null;
  title: string | null;
  description: string | null;
}) {
  return {
    id: String(row.id),
    icon: row.icon ?? "🧠",
    title: row.title ?? "",
    description: row.description ?? "",
  };
}

export function Benefits() {
  const { t } = useLanguage();

  // Hydration-safe: render default on first pass (SSR + initial client render).
  const [benefitCards, setBenefitCards] = useState<StudioBenefitCard[]>(
    defaultStudioBenefitData.cards,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadBenefits() {
      try {
        // Fetch specifically the 4 intended positions (0,1,2,3)
        const { data, error } = await supabase
          .from("benefits")
          .select("id, icon, title, description, display_order")
          .in("display_order", [0, 1, 2, 3])
          .order("display_order", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error("Failed to load benefits:", error);
          return;
        }

        if (data && data.length > 0) {
          // Sort by display_order to ensure correct card order
          const sortedData = data.sort((a, b) => a.display_order - b.display_order);
          const mapped = sortedData.map(toStudiBenefitCard);
          // Ensure exactly 4 cards, pad with defaults if needed
          const finalCards = mapped.length >= 4
            ? mapped.slice(0, 4)
            : [...mapped, ...defaultStudioBenefitData.cards.slice(mapped.length, 4)];

          setBenefitCards(finalCards);
        }
        // If no data, keep defaults
      } catch (e) {
        console.error("Error loading benefits:", e);
      }
    }

    loadBenefits();
    return () => {
      cancelled = true;
    };
  }, []);

  const icons = [GraduationCap, Sparkles, Compass, TrendingUp];

  if (benefitCards.length === 0) {
    return (
      <Section className="py-10 sm:py-16">
        <Container>
          <SectionTitle
            eyebrow={t.benefits.eyebrow}
            title={t.benefits.title}
            description={t.benefits.description}
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
          eyebrow={t.benefits.eyebrow}
          title={t.benefits.title}
          description={t.benefits.description}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {benefitCards.map((card, index) => {
            const Icon = icons[index % icons.length];
            return (
              <MotionWrapper
                key={card.id}
                className="group rounded-3xl border border-border bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primaryBg/70 text-heading transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-heading">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paragraph">
                  {card.description}
                </p>
              </MotionWrapper>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}