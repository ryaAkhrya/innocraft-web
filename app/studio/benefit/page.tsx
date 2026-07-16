"use client";

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
import { useMockCmsState } from "@/lib/studio/cms-storage";

export default function StudioBenefitPage() {
  const STORAGE_KEY = "studio.benefit.mock";

  const { value: saved, save } = useMockCmsState<StudioBenefitData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioBenefitData,
  });

  const [draft, setDraft] = useState<StudioBenefitData>(defaultStudioBenefitData);

  useEffect(() => {
    setDraft(saved);
  }, [saved]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  function onSave() {
    save(draft);
  }

  function onReset() {
    const ok = confirmReset("Reset changes for Benefit?");
    if (!ok) return;
    setDraft(saved);
  }

  function updateCard(index: number, patch: Partial<StudioBenefitCard>) {
    setDraft((d) => ({
      ...d,
      cards: d.cards.map((c, i) => (i === index ? { ...c, ...patch } : c)),
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
                <h3 className="text-sm font-semibold text-white/80">Benefits (4)</h3>

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
                        label="Icon name"
                        value={card.icon}
                        onChange={(v) => updateCard(idx, { icon: v })}
                        placeholder="🧠"
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
                  onClick={onSave}
                >
                  Save Changes
                </CmsPrimaryButton>
                <CmsPrimaryButton
                  variant="ghost"
                  disabled={!isDirty}
                  onClick={onReset}
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
                    {draft.cards.map((card) => (
                      <div
                        key={card.id}
                        className="rounded-3xl border border-white/10 bg-white/5 p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="rounded-2xl border border-white/10 bg-[#0B1020]/20 p-3 text-white/90">
                            {card.icon}
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
                </div>
              </div>
            </div>
          </div>
        </CmsSectionShell>
      </div>
    </StudioShell>
  );
}


