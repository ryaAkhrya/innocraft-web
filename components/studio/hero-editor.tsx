"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { StudioHeroData } from "@/lib/studio/mock-hero";
import { defaultStudioHeroData } from "@/lib/studio/mock-hero";
import { cn } from "@/lib/utils";

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

function VideoInput(props: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0B1020]/40 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-primary/60"
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

  // Mock persistence (client-only)
  const STORAGE_KEY = "studio.hero.mock";

  // Prevent hydration mismatch: first render uses default mock data.
  // After mount, we load localStorage and then update state.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as StudioHeroData;
      setSaved(parsed);
      setDraft(parsed);
    } catch {
      // ignore
    }
  }, []);


  function reset() {
    setDraft(saved);
  }

  function save() {
    setSaved(draft);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
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
            <VideoInput
              value={draft.heroVideoUrl}
              onChange={(v) => setDraft((d) => ({ ...d, heroVideoUrl: v }))}
            />
            <p className="mt-2 text-xs text-white/50">
              Example: <span className="text-white/70">/hero-video.mp4</span>
            </p>
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

