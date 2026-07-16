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
  defaultStudioTentangData,
  StudioTentangData,
} from "@/lib/studio/mock-tentang";
import { useMockCmsState } from "@/lib/studio/cms-storage";

export default function StudioTentangPage() {
  const STORAGE_KEY = "studio.tentang.mock";

  const { value: saved, save } = useMockCmsState<StudioTentangData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioTentangData,
  });

  const [draft, setDraft] = useState<StudioTentangData>(defaultStudioTentangData);

  // Keep draft in sync with loaded saved content.
  // Avoid hydration mismatch: saved itself is hydration-safe, but we still only set state on client.
  useEffect(() => {
    setDraft(saved);
  }, [saved]);


  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  function onSave() {
    save(draft);
  }

  function onReset() {
    const ok = confirmReset("Reset changes for Tentang?");
    if (!ok) return;
    setDraft(saved);
  }

  return (
    <StudioShell>
      <div className="relative">
        <CmsSectionShell
          title="Tentang CMS Editor"
          subtitle="Edit About section content with live preview."
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
                  label="Title"
                  value={draft.title}
                  onChange={(v) => setDraft((d) => ({ ...d, title: v }))}
                  placeholder="Tentang INNOCRAFT"
                />

                <CmsTextInput
                  label="Subtitle"
                  value={draft.subtitle}
                  onChange={(v) => setDraft((d) => ({ ...d, subtitle: v }))}
                  placeholder="Offline Minecraft Addon Development"
                />

                <CmsTextarea
                  label="Description"
                  value={draft.description}
                  onChange={(v) =>
                    setDraft((d) => ({ ...d, description: v }))
                  }
                  rows={6}
                  placeholder="About description"
                />

                <CmsTextInput
                  label="Image URL"
                  value={draft.imageUrl}
                  onChange={(v) => setDraft((d) => ({ ...d, imageUrl: v }))}
                  placeholder="/gallery/hero-1.jpg"
                />
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
                <h2 className="text-lg font-semibold text-white">
                  Live Preview
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  Preview styled for the public section.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020]/30">
                  <div className="aspect-[16/9] w-full bg-[#0B1020]/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={draft.imageUrl}
                      alt="Tentang"
                      className="h-full w-full object-cover opacity-90"
                    />
                  </div>

                  <div className="p-6">
                    <div className="text-sm font-semibold text-[#FFCFC9]">
                      {draft.subtitle}
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                      {draft.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">
                      {draft.description}
                    </p>
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


