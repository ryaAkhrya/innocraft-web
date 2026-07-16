"use client";

import { useEffect, useMemo, useState } from "react";

import { StudioShell } from "@/components/studio/studio-shell";
import { CmsSectionShell } from "@/components/studio/cms-section-shell";
import { CmsButtonRow, CmsPrimaryButton } from "@/components/studio/cms-button-row";
import { CmsTextInput, CmsTextarea } from "@/components/studio/cms-form-input";
import { confirmReset } from "@/components/studio/cms-confirm-reset";

import {
  defaultStudioSettingsData,
  StudioSettingsData,
} from "@/lib/studio/mock-settings";
import { useMockCmsState } from "@/lib/studio/cms-storage";

const STORAGE_KEY = "studio.settings.mock";

function safeTrim(s: string | null | undefined) {
  return (s ?? "").trim();
}

export default function StudioSettingsPage() {
  const { value: saved, save } = useMockCmsState<StudioSettingsData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioSettingsData,
  });

  const [draft, setDraft] = useState<StudioSettingsData>(
    defaultStudioSettingsData,
  );

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

              <div className="mt-6 space-y-5">
                <CmsTextInput
                  label="Website Name"
                  value={draft.websiteName}
                  onChange={(v) => setDraft((d) => ({ ...d, websiteName: v }))}
                  placeholder="INNOCRAFT"
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <CmsTextInput
                    label="Primary Color"
                    value={draft.primaryColor}
                    onChange={(v) =>
                      setDraft((d) => ({ ...d, primaryColor: v }))
                    }
                    placeholder="#FFCFC9"
                  />
                  <CmsTextInput
                    label="Secondary Color"
                    value={draft.secondaryColor}
                    onChange={(v) =>
                      setDraft((d) => ({ ...d, secondaryColor: v }))
                    }
                    placeholder="#9AE6FF"
                  />
                </div>

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
                    label="YouTube URL"
                    value={draft.youtubeUrl}
                    onChange={(v) =>
                      setDraft((d) => ({ ...d, youtubeUrl: v }))
                    }
                    placeholder="https://youtube.com/@innocraft"
                  />
                </div>
              </div>

              <div className="mt-10">
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

                  <div className="w-full sm:w-40">
                    <p className="text-xs font-semibold text-white/60">Theme</p>
                    <div className="mt-3 flex gap-3">
                      <div
                        className="h-10 w-10 rounded-xl border border-white/10"
                        style={{ backgroundColor: draft.primaryColor }}
                      />
                      <div
                        className="h-10 w-10 rounded-xl border border-white/10"
                        style={{ backgroundColor: draft.secondaryColor }}
                      />
                    </div>
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
                      YouTube
                    </p>
                    <p className="mt-2 break-words text-xs text-white/70">
                      {draft.youtubeUrl || "(Not set)"}
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

