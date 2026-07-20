"use client";

import { Compass, GraduationCap, Sparkles, TrendingUp } from "lucide-react";

import { useEffect, useState } from "react";

import { StudioShell } from "@/components/studio/studio-shell";
import { CmsSectionShell } from "@/components/studio/cms-section-shell";
import {
  CmsPrimaryButton,
  CmsButtonRow,
} from "@/components/studio/cms-button-row";
import {
  CmsTextInput,
  CmsTextarea,
} from "@/components/studio/cms-form-input";
import { confirmReset } from "@/components/studio/cms-confirm-reset";

import {
  defaultStudioBenefitData,
  StudioBenefitCard,
  StudioBenefitData,
} from "@/lib/studio/mock-benefit";

import { supabase } from "@/lib/supabase/client";


function toStudiBenefitCard(row: {
  id: string;
  icon: string | null;
  title: string | null;
  description: string | null;
  display_order: number;
}): StudioBenefitCard {
  return {
    id: String(row.id),
    icon: "🧠",
    title: row.title ?? "",
    description: row.description ?? "",
  };
}


export default function StudioBenefitPage() {
  const [draft, setDraft] = useState<StudioBenefitData>({
    ...defaultStudioBenefitData,
    cards: defaultStudioBenefitData.cards.map((c) => ({ ...c })),
  });
  const [saved, setSaved] = useState<StudioBenefitData>({
    ...defaultStudioBenefitData,
    cards: defaultStudioBenefitData.cards.map((c) => ({ ...c })),
  });

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  // Hardcoded icons for preview (same as public Benefits)
  const icons = [GraduationCap, Sparkles, Compass, TrendingUp];

  // Hydration-safe: first render uses default mock data.
  // After mount, load benefits from Supabase.
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
          const mappedCards = sortedData.map(toStudiBenefitCard);

          // Ensure exactly 4 cards, pad with defaults if needed
          const finalCards = mappedCards.length >= 4
            ? mappedCards.slice(0, 4)
            : [...mappedCards, ...defaultStudioBenefitData.cards.slice(mappedCards.length, 4)];

          setSaved(prev => ({
            ...prev,
            cards: finalCards,
          }));
          setDraft(prev => ({
            ...prev,
            cards: finalCards,
          }));
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

  function reset() {
    const ok = confirmReset("Reset changes for Benefit?");
    if (!ok) return;
    setDraft({
      ...saved,
      cards: saved.cards.map((c) => ({ ...c })),
    });
  }

  async function save() {
    // Persist to Supabase - update/insert each card.
    void (async () => {
      try {
        const { supabase: client } = await import("@/lib/supabase/client");

        // First, fetch existing records at positions 0-3
        const { data: existingRecords, error: fetchError } = await client
          .from("benefits")
          .select("id, display_order")
          .in("display_order", [0, 1, 2, 3])
          .order("display_order", { ascending: true });

        if (fetchError) {
          console.error("Failed to fetch existing records:", fetchError);
          return;
        }

        // Create a map of display_order to id for quick lookup
        const orderToId = new Map<number, string>();
        existingRecords?.forEach(record => {
          orderToId.set(record.display_order, record.id);
        });

        // Update each card - either update existing or insert new
        for (let i = 0; i < draft.cards.length; i++) {
          const card = draft.cards[i];
          const existingId = orderToId.get(i);

          if (existingId) {
            // Update existing record
            const { error: updateError } = await client
              .from("benefits")
              .update({
                icon: "🧠",
                title: card.title,
                description: card.description,
                display_order: i,
                is_active: true,
              })
              .eq("id", existingId);

            if (updateError) {
              console.error(`Failed to update card ${i + 1} (id: ${existingId}):`, updateError);
            }
          } else {
            // No record at this position - insert new
            const { error: insertError } = await client
              .from("benefits")
              .insert({
                icon: "🧠",
                title: card.title,
                description: card.description,
                display_order: i,
                is_active: true,
              });

            if (insertError) {
              console.error(`Failed to insert card ${i + 1}:`, insertError);
            }
          }
        }

        // Update local state with saved values
        setSaved(prev => ({
          ...prev,
          cards: [...draft.cards],
        }));
      } catch (e) {
        console.error("Error saving benefits:", e);
      }
    })();
  }

  function updateCard(index: number, patch: Partial<StudioBenefitCard>) {
    // Ignore icon changes
    const { icon, ...rest } = patch;
    setDraft((d) => ({
      ...d,
      cards: d.cards.map((c, i) => (i === index ? { ...c, ...rest } : c)),
    }));
  }

  return (
    <StudioShell>
      <div className="relative">
        <CmsSectionShell
          title="Benefit CMS Editor"
          subtitle="Edit badge, titles, and benefit cards with instant preview."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Form */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Editor</h2>
                <p className="mt-1 text-sm text-white/60">
                  Update content and see changes instantly.
                </p>
              </div>

              <div className="mt-6 space-y-5">
                <CmsTextInput
                  label="Section Badge"
                  value={draft.badge}
                  onChange={(v) => setDraft((d) => ({ ...d, badge: v }))}
                  placeholder="BENEFIT"
                />

                <CmsTextInput
                  label="Section Title"
                  value={draft.title}
                  onChange={(v) => setDraft((d) => ({ ...d, title: v }))}
                  placeholder="Kenapa INNOCRAFT?"
                />

                <CmsTextarea
                  label="Section Subtitle"
                  value={draft.subtitle}
                  onChange={(v) => setDraft((d) => ({ ...d, subtitle: v }))}
                  rows={4}
                  placeholder="Short subtitle"
                />
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-sm font-semibold text-white/80">Benefits ({draft.cards.length})</h3>

                {draft.cards.map((card, idx) => (
                  <div
                    key={card.id}
                    className="rounded-3xl border border-white/10 bg-[#0B1020]/20 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-white">Card {idx + 1}</p>
                      <p className="text-xs text-white/50">ID: {card.id}</p>
                    </div>

                    <div className="mt-4 grid gap-4">
                      <CmsTextInput
                        label="Title"
                        value={card.title}
                        onChange={(v) => updateCard(idx, { title: v })}
                        placeholder="Card title"
                      />

                      <CmsTextarea
                        label="Description"
                        value={card.description}
                        onChange={(v) => updateCard(idx, { description: v })}
                        rows={4}
                        placeholder="Card description"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <CmsButtonRow>
                <CmsPrimaryButton
                  variant="solid"
                  disabled={!isDirty}
                  onClick={save}
                >
                  Save Changes
                </CmsPrimaryButton>
                <CmsPrimaryButton
                  variant="ghost"
                  disabled={!isDirty}
                  onClick={reset}
                >
                  Reset Changes
                </CmsPrimaryButton>
              </CmsButtonRow>
            </div>

            {/* Live Preview */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Live Preview</h2>
                <p className="mt-1 text-sm text-white/60">
                  Preview styled like the public Benefit section.
                </p>
              </div>

              <div className="mt-6">
                <div className="rounded-3xl border border-white/10 bg-[#0B1020]/30 p-6">
                  <div className="text-sm font-semibold text-[#FFCFC9]">{draft.badge}</div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    {draft.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    {draft.subtitle}
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {draft.cards.map((card, cardIdx) => {
                      const Icon = icons[cardIdx % icons.length];
                      return (
                        <div
                          key={card.id}
                          className="rounded-3xl border border-white/10 bg-white/5 p-5"
                        >
                          <div className="flex items-start gap-4">
                            <div className="rounded-2xl border border-white/10 bg-[#0B1020]/20 p-3 text-white/90">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white">
                                {card.title}
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-white/60">
                                {card.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CmsSectionShell>
      </div>
    </StudioShell>
  );
}