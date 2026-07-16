"use client";

import { useEffect, useMemo, useState } from "react";

import { StudioShell } from "@/components/studio/studio-shell";
import { CmsSectionShell } from "@/components/studio/cms-section-shell";
import { CmsButtonRow, CmsPrimaryButton } from "@/components/studio/cms-button-row";
import { CmsTextInput, CmsTextarea } from "@/components/studio/cms-form-input";
import { confirmReset } from "@/components/studio/cms-confirm-reset";

import {
  defaultStudioContactData,
  StudioContactData,
} from "@/lib/studio/mock-contact";
import { useMockCmsState } from "@/lib/studio/cms-storage";

const STORAGE_KEY = "studio.contact.mock";

export default function StudioContactPage() {
  const { value: saved, save } = useMockCmsState<StudioContactData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioContactData,
  });

  const [draft, setDraft] = useState<StudioContactData>(defaultStudioContactData);

  useEffect(() => {
    setDraft(saved);
  }, [saved]);

  const isDirty = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(saved);
  }, [draft, saved]);

  function onSave() {
    save(draft);
  }

  function onReset() {
    const ok = confirmReset("Reset changes for Contact?");
    if (!ok) return;
    setDraft(saved);
  }

  return (
    <StudioShell>
      <CmsSectionShell
        title="Contact CMS"
        subtitle="Edit contact details with live preview."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editor */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Editor</h2>
              <p className="mt-1 text-sm text-white/60">
                Update fields and see changes instantly.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <CmsTextInput
                label="Company Name"
                value={draft.companyName}
                onChange={(v) => setDraft((d) => ({ ...d, companyName: v }))}
                placeholder="INNOCRAFT"
              />

              <CmsTextInput
                label="Address"
                value={draft.address}
                onChange={(v) => setDraft((d) => ({ ...d, address: v }))}
                placeholder="Jl. Contoh No. 123, Jakarta"
              />

              <CmsTextInput
                label="WhatsApp"
                value={draft.whatsapp}
                onChange={(v) => setDraft((d) => ({ ...d, whatsapp: v }))}
                placeholder="+62 ..."
              />

              <CmsTextInput
                label="Email"
                value={draft.email}
                onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
                placeholder="hello@innocraft.id"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <CmsTextInput
                  label="Instagram"
                  value={draft.instagram}
                  onChange={(v) => setDraft((d) => ({ ...d, instagram: v }))}
                  placeholder="https://instagram.com/..."
                />

                <CmsTextInput
                  label="Facebook"
                  value={draft.facebook}
                  onChange={(v) => setDraft((d) => ({ ...d, facebook: v }))}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <CmsTextarea
                label="Opening Hours"
                value={draft.openingHours}
                onChange={(v) => setDraft((d) => ({ ...d, openingHours: v }))}
                rows={4}
                placeholder="Senin - Jumat, 09:00 - 17:00"
              />

              <CmsTextInput
                label="Maps URL"
                value={draft.mapsUrl}
                onChange={(v) => setDraft((d) => ({ ...d, mapsUrl: v }))}
                placeholder="https://maps.google.com"
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
              <h2 className="text-lg font-semibold text-white">Live Preview</h2>
              <p className="mt-1 text-sm text-white/60">
                Preview styled for the public Contact section.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-[#0B1020]/30 p-6">
                <p className="text-sm font-semibold text-[#FFCFC9]">
                  {draft.companyName || "(Company)"}
                </p>

                <p className="mt-3 text-sm text-white/70">
                  <span className="text-white/90">Address: </span>
                  {draft.address || "(Add address)"}
                </p>

                <p className="mt-2 text-sm text-white/70">
                  <span className="text-white/90">WhatsApp: </span>
                  {draft.whatsapp || "(Add WhatsApp)"}
                </p>

                <p className="mt-2 text-sm text-white/70">
                  <span className="text-white/90">Email: </span>
                  {draft.email || "(Add email)"}
                </p>

                <p className="mt-4 text-sm font-semibold text-white">Opening Hours</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-white/70">
                  {draft.openingHours || "(Add opening hours)"}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold text-white/60">Instagram</p>
                    <p className="mt-2 break-words text-xs text-white/75">
                      {draft.instagram || "(Add Instagram)"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold text-white/60">Facebook</p>
                    <p className="mt-2 break-words text-xs text-white/75">
                      {draft.facebook || "(Add Facebook)"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold text-white/60">Maps URL</p>
                  <p className="mt-2 break-words text-xs text-white/75">
                    {draft.mapsUrl || "(Add maps URL)"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CmsSectionShell>
    </StudioShell>
  );
}

