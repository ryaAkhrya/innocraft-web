"use client";

import { useEffect, useMemo, useState } from "react";

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
import { CmsReorderControls } from "@/components/studio/cms-reorder";
import { confirmReset } from "@/components/studio/cms-confirm-reset";
import { AlertCircle, CheckCircle, Plus, Trash2 } from "lucide-react";

import {
  createEmptyBenefitCard,
  defaultStudioBenefitData,
  normalizeBenefitCard,
  StudioBenefitCard,
  StudioBenefitData,
} from "@/lib/studio/mock-benefit";

import { supabase } from "@/lib/supabase/client";
import { useSaveFeedback } from "@/lib/studio/cms-save-feedback";


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
  return normalizeBenefitCard({
    id: String(row.id),
    icon: row.icon ?? "⭐",
    title: row.title ?? "",
    description: row.description ?? "",
  });
}

// ---- Component -------------------------------------------------------------

export default function StudioBenefitPage() {
  const [draft, setDraft] = useState<StudioBenefitData>(() => ({
    ...defaultStudioBenefitData,
    cards: defaultStudioBenefitData.cards.map((c) => ({ ...c })),
  }));
  const [saved, setSaved] = useState<StudioBenefitData>(() => ({
    ...defaultStudioBenefitData,
    cards: defaultStudioBenefitData.cards.map((c) => ({ ...c })),
  }));

  // Track the benefit_section row id (single-row table) for UPDATE operations.
  const [sectionRowId, setSectionRowId] = useState<string | null>(null);

  const { isSaving, isSuccess, hasError, error, startSaving, saveSuccess, saveError } = useSaveFeedback();

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(saved),
    [draft, saved],
  );

  // ---- Load from Supabase on mount -----------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadBenefits() {
      try {
        // 1) Load section-level data (badge, title, subtitle) from benefit_section.
        //    This is a single-row table. If empty, insert the default row.
        const { data: sectionRows, error: sectionError } = await supabase
          .from("benefit_section")
          .select("id, badge, title, subtitle")
          .limit(1);

        if (cancelled) return;

        let sectionData: { badge: string; title: string; subtitle: string; id: string };

        if (sectionError) {
          console.error("Failed to load benefit_section:", sectionError);
          sectionData = {
            id: "",
            badge: defaultStudioBenefitData.badge,
            title: defaultStudioBenefitData.title,
            subtitle: defaultStudioBenefitData.subtitle,
          };
        } else if (!sectionRows || sectionRows.length === 0) {
          // Insert default section row
          const { data: inserted, error: insertError } = await supabase
            .from("benefit_section")
            .insert({
              badge: defaultStudioBenefitData.badge,
              title: defaultStudioBenefitData.title,
              subtitle: defaultStudioBenefitData.subtitle,
            })
            .select("id, badge, title, subtitle")
            .limit(1);

          if (cancelled) return;

          if (insertError || !inserted || inserted.length === 0) {
            sectionData = {
              id: "",
              badge: defaultStudioBenefitData.badge,
              title: defaultStudioBenefitData.title,
              subtitle: defaultStudioBenefitData.subtitle,
            };
          } else {
            const row = inserted[0] as BenefitSectionRow;
            sectionData = {
              id: String(row.id),
              badge: row.badge ?? defaultStudioBenefitData.badge,
              title: row.title ?? defaultStudioBenefitData.title,
              subtitle: row.subtitle ?? defaultStudioBenefitData.subtitle,
            };
          }
        } else {
          const row = sectionRows[0] as BenefitSectionRow;
          sectionData = {
            id: String(row.id),
            badge: row.badge ?? defaultStudioBenefitData.badge,
            title: row.title ?? defaultStudioBenefitData.title,
            subtitle: row.subtitle ?? defaultStudioBenefitData.subtitle,
          };
        }

        setSectionRowId(sectionData.id || null);

        // 2) Load benefit cards from benefits table (dynamic, all active rows).
        const { data: cardRows, error: cardsError } = await supabase
          .from("benefits")
          .select("id, icon, title, description, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (cancelled) return;

        let cards: StudioBenefitCard[];

        if (cardsError) {
          console.error("Failed to load benefit cards:", cardsError);
          cards = defaultStudioBenefitData.cards.map((c) => ({ ...c }));
        } else if (!cardRows || cardRows.length === 0) {
          cards = defaultStudioBenefitData.cards.map((c) => ({ ...c }));
        } else {
          const sorted = (cardRows as BenefitRow[]).sort(
            (a, b) => a.display_order - b.display_order,
          );
          cards = sorted.map(toBenefitCard);
        }

        const loaded: StudioBenefitData = {
          badge: sectionData.badge,
          title: sectionData.title,
          subtitle: sectionData.subtitle,
          cards,
        };

        setSaved(loaded);
        setDraft({
          ...loaded,
          cards: loaded.cards.map((c) => ({ ...c })),
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

  // ---- Mutations ------------------------------------------------------------

  function reset() {
    const ok = confirmReset("Reset changes for Benefit?");
    if (!ok) return;
    setDraft({
      ...saved,
      cards: saved.cards.map((c) => ({ ...c })),
    });
  }

  function updateCard(index: number, patch: Partial<StudioBenefitCard>) {
    setDraft((d) => ({
      ...d,
      cards: d.cards.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    }));
  }

  function addCard() {
    setDraft((d) => ({
      ...d,
      cards: [...d.cards, createEmptyBenefitCard()],
    }));
  }

  function removeCard(index: number) {
    const ok = confirmReset("Are you sure you want to delete this benefit card?");
    if (!ok) return;
    setDraft((d) => ({
      ...d,
      cards: d.cards.filter((_, i) => i !== index),
    }));
  }

  function moveCard(from: number, to: number) {
    setDraft((d) => {
      if (to < 0 || to >= d.cards.length) return d;
      const next = [...d.cards];
      const [spliced] = next.splice(from, 1);
      next.splice(to, 0, spliced);
      return { ...d, cards: next };
    });
  }

  async function save() {
    startSaving();

    try {
      // ---- 1) Persist section-level data (badge, title, subtitle) ----
      const sectionPayload = {
        badge: draft.badge,
        title: draft.title,
        subtitle: draft.subtitle,
      };

      if (sectionRowId) {
        const { error: updateError } = await supabase
          .from("benefit_section")
          .update(sectionPayload)
          .eq("id", sectionRowId);

        if (updateError) {
          console.error("Failed to update benefit_section:", updateError);
          saveError(updateError.message);
          return;
        }
      } else {
        // Fallback: insert if we somehow don't have a row id.
        const { data: inserted, error: insertError } = await supabase
          .from("benefit_section")
          .insert(sectionPayload)
          .select("id")
          .limit(1);

        if (insertError) {
          console.error("Failed to insert benefit_section:", insertError);
          saveError(insertError.message);
          return;
        }

        if (inserted && inserted[0]) {
          setSectionRowId(String(inserted[0].id));
        }
      }

      // ---- 2) Persist benefit cards (insert / update / delete) ----

      // Fetch existing active rows
      const { data: existingRecords, error: fetchError } = await supabase
        .from("benefits")
        .select("id, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (fetchError) {
        console.error("Failed to fetch existing benefit cards:", fetchError);
        saveError(fetchError.message);
        return;
      }

      const existingIds = new Set(
        (existingRecords ?? []).map((r) => String(r.id)),
      );
      const currentIds = new Set(draft.cards.map((c) => c.id));

      // Delete rows that exist in DB but are no longer in draft
      const idsToDelete = (existingRecords ?? []).filter(
        (r) => !currentIds.has(String(r.id)),
      );

      for (const record of idsToDelete) {
        const { error: deleteError } = await supabase
          .from("benefits")
          .delete()
          .eq("id", record.id);

        if (deleteError) {
          console.error(`Failed to delete benefit card ${record.id}:`, deleteError);
        }
      }

      // Track UUID updates from inserts
      const updatedCards = [...draft.cards];
      let hasAnyError = false;

      for (let i = 0; i < updatedCards.length; i++) {
        const card = updatedCards[i];
        const cardPayload = {
          icon: card.icon,
          title: card.title,
          description: card.description,
          display_order: i,
          is_active: true,
        };

        if (existingIds.has(card.id)) {
          // Update existing record
          const { error: updateError } = await supabase
            .from("benefits")
            .update(cardPayload)
            .eq("id", card.id);

          if (updateError) {
            console.error(`Failed to update benefit card ${card.id}:`, updateError);
            hasAnyError = true;
          }
        } else {
          // Insert new record and capture the generated UUID
          const { data: inserted, error: insertError } = await supabase
            .from("benefits")
            .insert(cardPayload)
            .select("id");

          if (insertError) {
            console.error(`Failed to insert benefit card ${i + 1}:`, insertError);
            hasAnyError = true;
          } else if (inserted && inserted[0]) {
            updatedCards[i] = { ...card, id: String(inserted[0].id) };
          }
        }
      }

      // ---- 3) Sync local state ----
      const finalData: StudioBenefitData = {
        badge: draft.badge,
        title: draft.title,
        subtitle: draft.subtitle,
        cards: updatedCards,
      };

      setSaved(finalData);
      setDraft({
        ...finalData,
        cards: finalData.cards.map((c) => ({ ...c })),
      });

      if (hasAnyError) {
        saveError("Some cards failed to save");
      } else {
        saveSuccess();
      }
    } catch (e) {
      console.error("Error saving benefits:", e);
      saveError("Failed to save benefits");
    }
  }

  // ---- Render ---------------------------------------------------------------

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

              {hasError && (
                <div className="mt-4 flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {isSuccess && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  Changes saved!
                </div>
              )}

              {/* Section-level fields */}
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

              {/* Benefit Cards */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold text-white/80">
                    Benefits ({draft.cards.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addCard}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#FFCFC9] px-4 py-2 text-sm font-semibold text-[#0B1020] transition hover:bg-[#FFCFC9]/90"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Card
                  </button>
                </div>

                {draft.cards.length === 0 && (
                  <p className="text-sm text-white/60">
                    No benefit cards yet. Click "Tambah Card" to add one.
                  </p>
                )}

                {draft.cards.map((card, idx) => (
                  <div
                    key={card.id}
                    className="rounded-3xl border border-white/10 bg-[#0B1020]/20 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-white">
                        Card {idx + 1}
                      </p>
                      <div className="flex items-center gap-2">
                        <CmsReorderControls
                          onMoveUp={() => moveCard(idx, idx - 1)}
                          onMoveDown={() => moveCard(idx, idx + 1)}
                          disableUp={idx === 0}
                          disableDown={idx === draft.cards.length - 1}
                        />
                        <button
                          type="button"
                          onClick={() => removeCard(idx)}
                          className="inline-flex items-center gap-1 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/20"
                          aria-label="Hapus Card"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Hapus
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4">
                      <CmsTextInput
                        label="Icon (emoji / text)"
                        value={card.icon}
                        onChange={(v) => updateCard(idx, { icon: v })}
                        placeholder="🚀"
                      />

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
                  isLoading={isSaving}
                  onClick={save}
                >
                  Save Changes
                </CmsPrimaryButton>
                <CmsPrimaryButton
                  variant="ghost"
                  disabled={!isDirty}
                  isLoading={isSaving}
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
                  <div className="text-sm font-semibold text-[#FFCFC9]">
                    {draft.badge}
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    {draft.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    {draft.subtitle}
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {draft.cards.map((card) => (
                      <div
                        key={card.id}
                        className="rounded-3xl border border-white/10 bg-white/5 p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0B1020]/20 text-2xl">
                            <span aria-hidden="true">{card.icon || "⭐"}</span>
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
                    ))}
                  </div>

                  {draft.cards.length === 0 && (
                    <p className="mt-6 text-center text-sm text-white/50">
                      No benefit cards to preview.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CmsSectionShell>
      </div>
    </StudioShell>
  );
}