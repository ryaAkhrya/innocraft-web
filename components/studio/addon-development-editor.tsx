"use client";

import { useEffect, useMemo, useState } from "react";
import {
  StudioAddonDevelopmentData,
  defaultStudioAddonDevelopmentData,
} from "@/lib/studio/mock-addon-development";
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

export function AddonDevelopmentEditor({
  initialData,
}: {
  initialData?: StudioAddonDevelopmentData;
}) {
  const base = useMemo(
    () => initialData ?? defaultStudioAddonDevelopmentData,
    [initialData],
  );
  const [draft, setDraft] = useState<StudioAddonDevelopmentData>(base);
  const [saved, setSaved] = useState<StudioAddonDevelopmentData>(base);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const [rowId, setRowId] = useState<string | null>(null);
  const { isSaving, isSuccess, hasError, error, startSaving, saveSuccess, saveError } = useSaveFeedback();

  // Hydration-safe: load from Supabase on mount; insert default if empty
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const { supabase } = await import("@/lib/supabase/client");

        const { data, error } = await supabase
          .from("addon_development")
          .select("id, title, description, video_url, thumbnail_url")
          .limit(1);

        if (cancelled) return;

        if (error) {
          setSaved(base);
          setDraft(base);
          return;
        }

        if (!data || data.length === 0) {
          const { data: inserted, error: insertError } = await supabase
            .from("addon_development")
            .insert({
              title: base.title,
              description: base.description,
              video_url: base.videoUrl,
              thumbnail_url: base.thumbnailUrl,
            })
            .select("id, title, description, video_url, thumbnail_url")
            .limit(1);

          if (cancelled) return;

          if (insertError || !inserted || inserted.length === 0) {
            setSaved(base);
            setDraft(base);
            return;
          }

          const row = inserted[0];
          setRowId(String(row.id));
          const mapped: StudioAddonDevelopmentData = {
            title: row.title ?? base.title,
            description: row.description ?? base.description,
            videoUrl: row.video_url ?? base.videoUrl,
            thumbnailUrl: row.thumbnail_url ?? base.thumbnailUrl,
          };
          setSaved(mapped);
          setDraft(mapped);

          return;
        }

        const row = data[0];
        setRowId(String(row.id));
        const mapped: StudioAddonDevelopmentData = {
          title: row.title ?? base.title,
          description: row.description ?? base.description,
          videoUrl: row.video_url ?? base.videoUrl,
          thumbnailUrl: row.thumbnail_url ?? base.thumbnailUrl,
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

    loadData();
    return () => {
      cancelled = true;
    };
  }, [base]);

  function reset() {
    const ok = confirmReset("Reset changes for Addon Development?");
    if (!ok) return;
    setDraft(saved);
  }

  function save() {
    setSaved(draft);
    startSaving();

    void (async () => {
      try {
        if (!rowId) {
          const { supabase } = await import("@/lib/supabase/client");
          const { data: inserted } = await supabase
            .from("addon_development")
            .insert({
              title: draft.title,
              description: draft.description,
              video_url: draft.videoUrl,
              thumbnail_url: draft.thumbnailUrl,
            })
            .select("id")
            .limit(1);

          const newId = inserted?.[0]?.id;
          if (!newId) {
            saveError("Failed to create addon development row");
            return;
          }
          setRowId(String(newId));

          const { error } = await (await import("@/lib/supabase/client")).supabase
            .from("addon_development")
            .update({
              title: draft.title,
              description: draft.description,
              video_url: draft.videoUrl,
              thumbnail_url: draft.thumbnailUrl,
            })
            .eq("id", newId);

          if (error) {
            saveError(error.message);
          } else {
            saveSuccess();
          }

          return;
        }

        const { supabase } = await import("@/lib/supabase/client");
        const { error } = await supabase
          .from("addon_development")
          .update({
            title: draft.title,
            description: draft.description,
            video_url: draft.videoUrl,
            thumbnail_url: draft.thumbnailUrl,
          })
          .eq("id", rowId);

        if (error) {
          saveError(error.message);
        } else {
          saveSuccess();
        }
      } catch {
        saveError("Failed to save addon development");
      }
    })();
  }

  return (
    <CmsSectionShell
      title="Addon Development CMS"
      subtitle="Manage Addon Development section content with live preview."
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
              placeholder="Judul section addon development"
            />

            <CmsTextarea
              label="Description"
              value={draft.description}
              onChange={(v) => setDraft((d) => ({ ...d, description: v }))}
              rows={6}
              placeholder="Deskripsi section addon development"
            />

            <CmsFileUpload
              label="Video"
              value={draft.videoUrl}
              onChange={(v) => setDraft((d) => ({ ...d, videoUrl: v }))}
              bucket="sections"
              accept="video/mp4,video/webm,video/quicktime"
              isVideo
            />

            <CmsFileUpload
              label="Thumbnail Image"
              value={draft.thumbnailUrl}
              onChange={(v) => setDraft((d) => ({ ...d, thumbnailUrl: v }))}
              bucket="sections"
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
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020]/30">
              <div className="aspect-[16/9] w-full bg-[#0B1020]/40">
                {draft.videoUrl ? (
                  <video
                    key={draft.videoUrl}
                    src={draft.videoUrl}
                    className="h-full w-full object-cover"
                    controls
                    muted
                    playsInline
                    poster={draft.thumbnailUrl || undefined}
                  />
                ) : draft.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={draft.thumbnailUrl}
                    alt={draft.title || "Addon development thumbnail"}
                    className="h-full w-full object-cover opacity-90"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-4">
                    <p className="text-center text-xs text-white/50">
                      No video or thumbnail uploaded yet
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold tracking-tight text-white">
                  {draft.title || "(No title)"}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  {draft.description || "(No description)"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CmsSectionShell>
  );
}