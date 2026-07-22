"use client";

import { useEffect, useMemo, useState } from "react";
import { StudioTentangData, defaultStudioTentangData } from "@/lib/studio/mock-tentang";
import {
  CmsPrimaryButton,
  CmsButtonRow,
} from "@/components/studio/cms-button-row";
import {
  CmsTextInput,
  CmsTextarea,
} from "@/components/studio/cms-form-input";
import { CmsFileUpload } from "@/components/studio/cms-file-uploader";
import { CmsSectionShell } from "@/components/studio/cms-section-shell";
import { confirmReset } from "@/components/studio/cms-confirm-reset";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useSaveFeedback } from "@/lib/studio/cms-save-feedback";

export function StudioAboutEditor({
  initialData,
}: {
  initialData?: StudioTentangData;
}) {
  const base = useMemo(() => initialData ?? defaultStudioTentangData, [initialData]);
  const [draft, setDraft] = useState<StudioTentangData>(base);
  const [saved, setSaved] = useState<StudioTentangData>(base);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const [aboutRowId, setAboutRowId] = useState<string | null>(null);
  const { isSaving, isSuccess, hasError, error, startSaving, saveSuccess, saveError } = useSaveFeedback();

  // Hydration-safe: first render uses default mock data.
  // After mount, load about from Supabase; insert default if empty.
  useEffect(() => {
    let cancelled = false;

    async function loadAbout() {
      try {
        const { supabase } = await import("@/lib/supabase/client");

        const { data, error } = await supabase
          .from("about")
          .select("id, title, subtitle, description, image_url")
          .limit(1);

        if (cancelled) return;

        if (error) {
          setSaved(base);
          setDraft(base);
          return;
        }

        if (!data || data.length === 0) {
          const { data: inserted, error: insertError } = await supabase
            .from("about")
            .insert({
              title: base.title,
              subtitle: base.subtitle,
              description: base.description,
              image_url: base.imageUrl,
            })
            .select("id, title, subtitle, description, image_url")
            .limit(1);

          if (cancelled) return;

          if (insertError || !inserted || inserted.length === 0) {
            setSaved(base);
            setDraft(base);
            return;
          }

          const row = inserted[0];
          setAboutRowId(String(row.id));
          setSaved({
            title: row.title ?? base.title,
            subtitle: row.subtitle ?? base.subtitle,
            description: row.description ?? base.description,
            imageUrl: row.image_url ?? base.imageUrl,
          });
          setDraft({
            title: row.title ?? base.title,
            subtitle: row.subtitle ?? base.subtitle,
            description: row.description ?? base.description,
            imageUrl: row.image_url ?? base.imageUrl,
          });

          return;
        }

        const row = data[0];
        setAboutRowId(String(row.id));
        const mapped: StudioTentangData = {
          title: row.title ?? base.title,
          subtitle: row.subtitle ?? base.subtitle,
          description: row.description ?? base.description,
          imageUrl: row.image_url ?? base.imageUrl,
        };

        setSaved(mapped);
        setDraft(mapped);
      } catch {
        if (!cancelled) {
          setSaved(base);
          setDraft(base);
        }
      }
    }

    loadAbout();
    return () => {
      cancelled = true;
    };
  }, [base]);

  function reset() {
    setDraft(saved);
  }

  function save() {
    // Keep existing preview behavior: update local state immediately.
    setSaved(draft);
    startSaving();

    // Persist to Supabase (single-row behavior via aboutRowId + UPDATE).
    void (async () => {
      try {
        if (!aboutRowId) {
          // Fallback: re-create row if we couldn't load id for some reason.
          const { supabase } = await import("@/lib/supabase/client");
          const { data: inserted } = await supabase
            .from("about")
            .insert({
              title: draft.title,
              subtitle: draft.subtitle,
              description: draft.description,
              image_url: draft.imageUrl,
            })
            .select("id")
            .limit(1);

          const newId = inserted?.[0]?.id;

          if (!newId) {
            saveError("Failed to create about row");
            return;
          }
          setAboutRowId(String(newId));

          await (await import("@/lib/supabase/client")).supabase
            .from("about")
            .update({
              title: draft.title,
              subtitle: draft.subtitle,
              description: draft.description,
              image_url: draft.imageUrl,
            })
            .eq("id", newId);

          saveSuccess();
          return;
        }

        const { supabase } = await import("@/lib/supabase/client");
        await supabase
          .from("about")
          .update({
            title: draft.title,
            subtitle: draft.subtitle,
            description: draft.description,
            image_url: draft.imageUrl,
          })
          .eq("id", aboutRowId);
        saveSuccess();
      } catch {
        saveError("Failed to save about");
      }
    })();
  }

  return (
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

            <CmsFileUpload
              label="About Image"
              value={draft.imageUrl}
              onChange={(v) => setDraft((d) => ({ ...d, imageUrl: v }))}
              bucket="about"
              accept="image/*"
            />
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
            <h2 className="text-lg font-semibold text-white">
              Live Preview
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Preview styled for the public section.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#0B1020]/30">
              <div className="aspect-[16/9] w-full bg-[#0B1020]/40">
                {draft.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={draft.imageUrl}
                    alt="Tentang"
                    className="h-full w-full object-cover opacity-90"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-4">
                    <p className="text-center text-xs text-white/50">No image selected</p>
                  </div>
                )}
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
  );
}