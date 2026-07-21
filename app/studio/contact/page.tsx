"use client";

import { useEffect, useMemo, useState } from "react";

import { StudioShell } from "@/components/studio/studio-shell";
import { CmsSectionShell } from "@/components/studio/cms-section-shell";
import { CmsButtonRow, CmsPrimaryButton } from "@/components/studio/cms-button-row";
import { CmsTextInput, CmsTextarea } from "@/components/studio/cms-form-input";
import { confirmReset } from "@/components/studio/cms-confirm-reset";
import { AlertCircle, CheckCircle } from "lucide-react";

import {
  defaultStudioContactData,
  StudioContactData,
} from "@/lib/studio/mock-contact";

import { supabase } from "@/lib/supabase/client";
import { useSaveFeedback } from "@/lib/studio/cms-save-feedback";

function toContactData(row: {
  company_name: string | null;
  address: string | null;
  whatsapp: string | null;
  email: string | null;
  maps_url: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  opening_hours: string | null;
}): StudioContactData {
  return {
    companyName: row.company_name ?? "",
    address: row.address ?? "",
    whatsapp: row.whatsapp ?? "",
    email: row.email ?? "",
    mapsUrl: row.maps_url ?? "",
    instagram: row.instagram ?? "",
    facebook: row.facebook ?? "",
    tiktok: row.tiktok ?? "",
    openingHours: row.opening_hours ?? "",
  };
}

function fromContactData(data: StudioContactData) {
  return {
    company_name: data.companyName,
    address: data.address,
    whatsapp: data.whatsapp,
    email: data.email,
    maps_url: data.mapsUrl,
    instagram: data.instagram,
    facebook: data.facebook,
    tiktok: data.tiktok,
    opening_hours: data.openingHours,
  };
}

export default function StudioContactPage() {
  const [saved, setSaved] = useState<StudioContactData>(defaultStudioContactData);
  const [draft, setDraft] = useState<StudioContactData>(defaultStudioContactData);
  const [existingId, setExistingId] = useState<string | null>(null);

  const { isSaving, isSuccess, hasError, error, startSaving, saveSuccess, saveError } = useSaveFeedback();

  // Hydration-safe: load from Supabase on mount
  useEffect(() => {
    let cancelled = false;

    async function loadContact() {
      try {
        const { data, error } = await supabase
          .from("contact")
          .select("id, company_name, address, whatsapp, email, maps_url, instagram, facebook, tiktok, opening_hours")
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.error("Failed to load contact:", error.message, error.code, error.details);
          return;
        }

        if (data) {
          const contactData = toContactData(data);
          setSaved(contactData);
          setDraft(contactData);
          setExistingId(data.id);
        }
        // If no data, keep defaults
      } catch (e) {
        console.error("Error loading contact:", e);
      }
    }

    loadContact();
    return () => {
      cancelled = true;
    };
  }, []);

  const isDirty = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(saved);
  }, [draft, saved]);

  function onSave() {
    startSaving();
    void (async () => {
      try {
        const { supabase: client } = await import("@/lib/supabase/client");

        if (existingId) {
          // Update existing row
          const { error: updateError } = await client
            .from("contact")
            .update(fromContactData(draft))
            .eq("id", existingId);

          if (updateError) {
            console.error("Failed to update contact:", updateError.message, updateError.code, updateError.details);
            saveError(updateError.message);
            return;
          }
        } else {
          // Insert new row
          const { data: insertedData, error: insertError } = await client
            .from("contact")
            .insert(fromContactData(draft))
            .select("id");

          if (insertError) {
            console.error("Failed to insert contact:", insertError.message, insertError.code, insertError.details);
            saveError(insertError.message);
            return;
          }
          if (insertedData && insertedData[0]) {
            setExistingId(insertedData[0].id);
          }
        }

        setSaved(draft);
        saveSuccess();
      } catch (e) {
        console.error("Error saving contact:", e);
        saveError("Failed to save contact");
      }
    })();
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

              <CmsTextInput
                label="TikTok"
                value={draft.tiktok}
                onChange={(v) => setDraft((d) => ({ ...d, tiktok: v }))}
                placeholder="https://tiktok.com/..."
              />

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
                isLoading={isSaving}
                onClick={onSave}
              >
                Save Changes
              </CmsPrimaryButton>

              <CmsPrimaryButton
                variant="ghost"
                disabled={!isDirty}
                isLoading={isSaving}
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
                  <p className="text-xs font-semibold text-white/60">TikTok</p>
                  <p className="mt-2 break-words text-xs text-white/75">
                    {draft.tiktok || "(Add TikTok)"}
                  </p>
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