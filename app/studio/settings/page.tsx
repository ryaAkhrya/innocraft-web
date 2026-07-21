"use client";

import { useEffect, useMemo, useState } from "react";

import { StudioShell } from "@/components/studio/studio-shell";
import { CmsSectionShell } from "@/components/studio/cms-section-shell";
import { CmsButtonRow, CmsPrimaryButton } from "@/components/studio/cms-button-row";
import { CmsTextInput, CmsTextarea } from "@/components/studio/cms-form-input";
import { confirmReset } from "@/components/studio/cms-confirm-reset";
import { AlertCircle, CheckCircle } from "lucide-react";

import {
  defaultStudioSettingsData,
  StudioSettingsData,
} from "@/lib/studio/mock-settings";

import { supabase } from "@/lib/supabase/client";
import { useSaveFeedback } from "@/lib/studio/cms-save-feedback";

function toSettingsData(row: {
  website_name: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  footer_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
}): StudioSettingsData {
  return {
    websiteName: row.website_name ?? "",
    logoUrl: row.logo_url ?? "",
    faviconUrl: row.favicon_url ?? "",
    footerText: row.footer_text ?? "",
    seoTitle: row.seo_title ?? "",
    seoDescription: row.seo_description ?? "",
    instagramUrl: row.instagram ?? "",
    facebookUrl: row.facebook ?? "",
    tiktokUrl: row.tiktok ?? "",
  };
}

function fromSettingsData(data: StudioSettingsData) {
  return {
    website_name: data.websiteName,
    logo_url: data.logoUrl,
    favicon_url: data.faviconUrl,
    footer_text: data.footerText,
    seo_title: data.seoTitle,
    seo_description: data.seoDescription,
    instagram: data.instagramUrl,
    facebook: data.facebookUrl,
    tiktok: data.tiktokUrl,
  };
}

function safeTrim(s: string | null | undefined) {
  return (s ?? "").trim();
}

export default function StudioSettingsPage() {
  const [saved, setSaved] = useState<StudioSettingsData>(defaultStudioSettingsData);
  const [draft, setDraft] = useState<StudioSettingsData>(defaultStudioSettingsData);
  const [existingId, setExistingId] = useState<string | null>(null);

  const { isSaving, isSuccess, hasError, error, startSaving, saveSuccess, saveError } = useSaveFeedback();

  // Hydration-safe: load from Supabase on mount
  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("id, website_name, logo_url, favicon_url, footer_text, seo_title, seo_description, instagram, facebook, tiktok")
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.error("Failed to load settings:", error.message, error.code, error.details);
          return;
        }

        if (data) {
          const settingsData = toSettingsData(data);
          setSaved(settingsData);
          setDraft(settingsData);
          setExistingId(data.id);
        }
        // If no data, keep defaults
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }

    loadSettings();
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
            .from("settings")
            .update(fromSettingsData(draft))
            .eq("id", existingId);

          if (updateError) {
            console.error("Failed to update settings:", updateError.message, updateError.code, updateError.details);
            saveError(updateError.message);
            return;
          }
        } else {
          // Insert new row
          const { data: insertedData, error: insertError } = await client
            .from("settings")
            .insert(fromSettingsData(draft))
            .select("id");

          if (insertError) {
            console.error("Failed to insert settings:", insertError.message, insertError.code, insertError.details);
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
        console.error("Error saving settings:", e);
        saveError("Failed to save settings");
      }
    })();
  }

  function onReset() {
    const ok = confirmReset("Reset changes for Settings?");
    if (!ok) return;
    setDraft(saved);
  }

  const faviconPresent = !!safeTrim(draft.faviconUrl);
  const logoPresent = !!safeTrim(draft.logoUrl);

  return (
    <StudioShell>
      <CmsSectionShell
        title="Settings CMS"
        subtitle="Manage website + SEO + social links with live preview."
      >
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Editor */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Editor</h2>
                <p className="mt-1 text-sm text-white/60">
                  Update settings and see changes instantly.
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
                  label="Website Name"
                  value={draft.websiteName}
                  onChange={(v) => setDraft((d) => ({ ...d, websiteName: v }))}
                  placeholder="INNOCRAFT"
                />

                <CmsTextInput
                  label="Logo URL"
                  value={draft.logoUrl}
                  onChange={(v) => setDraft((d) => ({ ...d, logoUrl: v }))}
                  placeholder="/logo.png"
                />

                <CmsTextInput
                  label="Favicon URL"
                  value={draft.faviconUrl}
                  onChange={(v) => setDraft((d) => ({ ...d, faviconUrl: v }))}
                  placeholder="/logo.png"
                />

                <CmsTextarea
                  label="Footer Text"
                  value={draft.footerText}
                  onChange={(v) => setDraft((d) => ({ ...d, footerText: v }))}
                  rows={4}
                  placeholder="© INNOCRAFT. All rights reserved."
                />
              </div>

              <div className="mt-8 space-y-5">
                <h3 className="text-sm font-semibold text-white/80">
                  SEO
                </h3>

                <CmsTextInput
                  label="SEO Title"
                  value={draft.seoTitle}
                  onChange={(v) => setDraft((d) => ({ ...d, seoTitle: v }))}
                  placeholder="INNOCRAFT - Studio Addon Minecraft"
                />

                <CmsTextarea
                  label="SEO Description"
                  value={draft.seoDescription}
                  onChange={(v) =>
                    setDraft((d) => ({ ...d, seoDescription: v }))
                  }
                  rows={4}
                  placeholder="Belajar dan membuat addon Minecraft bersama mentor."
                />
              </div>

              <div className="mt-8 space-y-5">
                <h3 className="text-sm font-semibold text-white/80">
                  Social Links
                </h3>

                <div className="space-y-5">
                  <CmsTextInput
                    label="Instagram URL"
                    value={draft.instagramUrl}
                    onChange={(v) =>
                      setDraft((d) => ({ ...d, instagramUrl: v }))
                    }
                    placeholder="https://instagram.com/innocraft.id"
                  />

                  <CmsTextInput
                    label="Facebook URL"
                    value={draft.facebookUrl}
                    onChange={(v) =>
                      setDraft((d) => ({ ...d, facebookUrl: v }))
                    }
                    placeholder="https://facebook.com/innocraft.id"
                  />

                  <CmsTextInput
                    label="TikTok URL"
                    value={draft.tiktokUrl}
                    onChange={(v) =>
                      setDraft((d) => ({ ...d, tiktokUrl: v }))
                    }
                    placeholder="https://tiktok.com"
                  />
                </div>
              </div>

              <div className="mt-10">
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
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Live Preview
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  Preview values like the public website would consume.
                </p>
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-[#0B1020]/30 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white/60">Brand</p>
                    <p className="mt-1 text-lg font-semibold text-[#FFCFC9]">
                      {draft.websiteName || "(Website name)"}
                    </p>
                    <p className="mt-2 text-sm text-white/70">
                      Logo: {logoPresent ? "Set" : "Missing"}
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      Favicon: {faviconPresent ? "Set" : "Missing"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-white/60">SEO Title</p>
                    <p className="mt-2 break-words text-sm font-semibold text-white/80">
                      {draft.seoTitle || "(SEO title)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/60">SEO Desc</p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-white/70">
                      {draft.seoDescription || "(SEO description)"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold text-white/60">Footer</p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-white/70">
                    {draft.footerText || "(Footer text)"}
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold text-white/60">
                      Instagram
                    </p>
                    <p className="mt-2 break-words text-xs text-white/70">
                      {draft.instagramUrl || "(Not set)"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold text-white/60">
                      Facebook
                    </p>
                    <p className="mt-2 break-words text-xs text-white/70">
                      {draft.facebookUrl || "(Not set)"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold text-white/60">
                      TikTok
                    </p>
                    <p className="mt-2 break-words text-xs text-white/70">
                      {draft.tiktokUrl || "(Not set)"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CmsSectionShell>
    </StudioShell>
  );
}