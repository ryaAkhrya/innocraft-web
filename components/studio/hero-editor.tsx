"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { StudioHeroData } from "@/lib/studio/mock-hero";
import { defaultStudioHeroData } from "@/lib/studio/mock-hero";
import { cn } from "@/lib/utils";
import { CmsFileUpload } from "@/components/studio/cms-file-uploader";

function FieldCard({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Label({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className="text-sm font-medium text-white/80">{children}</p>;
}

function TextInput(props: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder={props.placeholder}
      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0B1020]/40 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-primary/60"
    />
  );
}

function PrimaryButton({
  children,
  onClick,
  variant = "solid",
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition",
        variant === "solid"
          ? "bg-[#FFCFC9] text-[#0B1020] hover:bg-[#FFCFC9]/90 disabled:opacity-60"
          : "border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-60",
      )}
    >
      {children}
    </button>
  );
}

function VideoPreviewCard({ heroVideoUrl }: { heroVideoUrl: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="aspect-[16/9] w-full bg-[#0B1020]/40">
        <motion.video
          key={heroVideoUrl}
          src={heroVideoUrl}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        />
      </div>
      <div className="px-4 py-3">
        <p className="text-xs text-white/60">Video Preview</p>
      </div>
    </div>
  );
}

export function StudioHeroEditor({
  initialData,
}: {
  initialData?: StudioHeroData;
}) {
  const base = useMemo(() => initialData ?? defaultStudioHeroData, [initialData]);
  const [draft, setDraft] = useState<StudioHeroData>(base);
  const [saved, setSaved] = useState<StudioHeroData>(base);
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const [heroRowId, setHeroRowId] = useState<string | null>(null);

  // Hydration-safe: first render uses default mock data.
  // After mount, load hero from Supabase; insert default if empty.
  useEffect(() => {
    let cancelled = false;

    async function loadHero() {
      try {
        const { supabase } = await import("@/lib/supabase/client");

        const { data, error } = await supabase
          .from("hero")
          .select("id, badge, title, subtitle, primary_button_text, secondary_button_text, hero_video_url")
          .limit(1);

        if (cancelled) return;

        if (error) {
          setSaved(base);
          setDraft(base);
          return;
        }

        if (!data || data.length === 0) {
          const { data: inserted, error: insertError } = await supabase
            .from("hero")
            .insert({
              badge: base.badge,
              title: base.title,
              subtitle: base.subtitle,
              primary_button_text: base.primaryButtonText,
              primary_button_url: "",
              secondary_button_text: base.secondaryButtonText,
              secondary_button_url: "",
              hero_video_url: base.heroVideoUrl,
            })
            .select("id, badge, title, subtitle, primary_button_text, secondary_button_text, hero_video_url")
            .limit(1);

          if (cancelled) return;

          if (insertError || !inserted || inserted.length === 0) {
            setSaved(base);
            setDraft(base);
            return;
          }

          const row = inserted[0];
          setHeroRowId(String(row.id));
          setSaved({
            badge: row.badge ?? base.badge,
            title: row.title ?? base.title,
            subtitle: row.subtitle ?? base.subtitle,
            primaryButtonText:
              row.primary_button_text ?? base.primaryButtonText,
            secondaryButtonText:
              row.secondary_button_text ?? base.secondaryButtonText,
            heroVideoUrl: row.hero_video_url ?? base.heroVideoUrl,
          });
          setDraft({
            badge: row.badge ?? base.badge,
            title: row.title ?? base.title,
            subtitle: row.subtitle ?? base.subtitle,
            primaryButtonText:
              row.primary_button_text ?? base.primaryButtonText,
            secondaryButtonText:
              row.secondary_button_text ?? base.secondaryButtonText,
            heroVideoUrl: row.hero_video_url ?? base.heroVideoUrl,
          });

          return;
        }

        const row = data[0];
        setHeroRowId(String(row.id));
        const mapped: StudioHeroData = {
          badge: row.badge ?? base.badge,
          title: row.title ?? base.title,
          subtitle: row.subtitle ?? base.subtitle,
          primaryButtonText:
            row.primary_button_text ?? base.primaryButtonText,
          secondaryButtonText:
            row.secondary_button_text ?? base.secondaryButtonText,
          heroVideoUrl: row.hero_video_url ?? base.heroVideoUrl,
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

    loadHero();
    return () => {
      cancelled = true;
    };
  }, [base]);


  function reset() {
    setDraft(saved);
  }

  function save() {
    // Capture current draft values immediately to avoid closure stale value issue
    const valuesToSave = { ...draft };
    
    console.log('[Hero Editor Debug] Save clicked - draft.heroVideoUrl:', draft.heroVideoUrl);
    console.log('[Hero Editor Debug] Save clicked - valuesToSave:', valuesToSave);
    
    // Keep existing preview behavior: update local state immediately.
    setSaved(valuesToSave);

    // Persist to Supabase (single-row behavior via heroRowId + UPDATE).
    void (async () => {
      try {
        console.log('[Hero Editor Debug] Async save - heroRowId:', heroRowId);
        if (!heroRowId) {
          // Fallback: re-create row if we couldn't load id for some reason.
          const { supabase } = await import("@/lib/supabase/client");
          const { data: inserted } = await supabase
            .from("hero")
            .insert({
              badge: valuesToSave.badge,
              title: valuesToSave.title,
              subtitle: valuesToSave.subtitle,
              primary_button_text: valuesToSave.primaryButtonText,
              primary_button_url: "",
              secondary_button_text: valuesToSave.secondaryButtonText,
              secondary_button_url: "",
              hero_video_url: valuesToSave.heroVideoUrl,
            })
            .select("id")
            .limit(1);

          const newId = inserted?.[0]?.id;

          if (!newId) return;
          setHeroRowId(String(newId));

          await (await import("@/lib/supabase/client")).supabase
            .from("hero")
            .update({
              badge: valuesToSave.badge,
              title: valuesToSave.title,
              subtitle: valuesToSave.subtitle,
              primary_button_text: valuesToSave.primaryButtonText,
              primary_button_url: "",
              secondary_button_text: valuesToSave.secondaryButtonText,
              secondary_button_url: "",
              hero_video_url: valuesToSave.heroVideoUrl,
            })
            .eq("id", newId);

          return;
        }

        const { supabase } = await import("@/lib/supabase/client");
        const updatePayload = {
          badge: valuesToSave.badge,
          title: valuesToSave.title,
          subtitle: valuesToSave.subtitle,
          primary_button_text: valuesToSave.primaryButtonText,
          primary_button_url: "",
          secondary_button_text: valuesToSave.secondaryButtonText,
          secondary_button_url: "",
          hero_video_url: valuesToSave.heroVideoUrl,
        };
        console.log('[Hero Editor Debug] Update payload:', updatePayload);
        const { data, error } = await supabase
          .from("hero")
          .update(updatePayload)
          .eq("id", heroRowId)
          .select("id, hero_video_url");

        console.log('[Hero Editor Debug] Supabase response:', { data, error });
        if (error) {
          console.error('Hero save error:', error.message);
        }
      } catch (err) {
        console.error('Hero save error:', err);
      }
    })();
  }


  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Form */}
      <FieldCard>
        <div>
          <h2 className="text-xl font-semibold text-white">Hero CMS Editor</h2>
          <p className="mt-1 text-sm text-white/60">
            Update content and preview changes instantly.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <Label>Hero Badge</Label>
            <TextInput
              value={draft.badge}
              onChange={(v) => setDraft((d) => ({ ...d, badge: v }))}
              placeholder="Badge text"
            />
          </div>

          <div>
            <Label>Hero Title</Label>
            <TextInput
              value={draft.title}
              onChange={(v) => setDraft((d) => ({ ...d, title: v }))}
              placeholder="Hero headline"
            />
          </div>

          <div>
            <Label>Hero Subtitle</Label>
            <TextInput
              value={draft.subtitle}
              onChange={(v) => setDraft((d) => ({ ...d, subtitle: v }))}
              placeholder="Hero sub headline"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Primary Button Text</Label>
              <TextInput
                value={draft.primaryButtonText}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, primaryButtonText: v }))
                }
                placeholder="Primary CTA"
              />
            </div>

            <div>
              <Label>Secondary Button Text</Label>
              <TextInput
                value={draft.secondaryButtonText}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, secondaryButtonText: v }))
                }
                placeholder="Secondary CTA"
              />
            </div>
          </div>

          <div>
            <Label>Hero Video URL</Label>
            <CmsFileUpload
              label=""
              value={draft.heroVideoUrl}
              onChange={(v) => setDraft((d) => ({ ...d, heroVideoUrl: v }))}
              bucket="hero"
              accept="video/mp4,video/webm,video/quicktime"
              isVideo
            />
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <PrimaryButton
            variant="solid"
            disabled={!isDirty}
            onClick={save}
          >
            Save Changes
          </PrimaryButton>
          <PrimaryButton
            variant="ghost"
            disabled={!isDirty}
            onClick={reset}
          >
            Reset Changes
          </PrimaryButton>
        </div>
      </FieldCard>

      {/* Right: Live Preview */}
      <FieldCard className="p-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Live Preview</h2>
          <p className="mt-1 text-sm text-white/60">
            Preview styled like the public Hero.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#0B1020]/30 p-6">
            <div className="text-sm font-semibold text-[#FFCFC9]">{draft.badge}</div>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {draft.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              {draft.subtitle}
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="rounded-full bg-[#FFCFC9] px-5 py-3 text-sm font-semibold text-[#0B1020] hover:bg-[#FFCFC9]/90">
                {draft.primaryButtonText}
              </button>
              <button className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10">
                {draft.secondaryButtonText}
              </button>
            </div>
          </div>

          <VideoPreviewCard heroVideoUrl={draft.heroVideoUrl} />
        </div>
      </FieldCard>
    </div>
  );
}