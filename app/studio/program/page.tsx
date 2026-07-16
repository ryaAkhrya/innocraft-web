"use client";

import { useEffect, useMemo, useState } from "react";
import { StudioShell } from "@/components/studio/studio-shell";
import { CmsSectionShell } from "@/components/studio/cms-section-shell";
import {
  CmsPrimaryButton,
  CmsButtonRow,
} from "@/components/studio/cms-button-row";
import {
  CmsTextInput,
  CmsTextarea,
  CmsUrlHint,
} from "@/components/studio/cms-form-input";
import { CmsReorderControls } from "@/components/studio/cms-reorder";
import { confirmReset } from "@/components/studio/cms-confirm-reset";
import {
  defaultStudioProgramData,
  StudioProgramData,
} from "@/lib/studio/mock-program";
import { useMockCmsState } from "@/lib/studio/cms-storage";

type Program = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ageRange: string;
  duration: string;
  category: string;
  ctaText: string;
  projectUrl: string;
};

const STORAGE_KEY = "studio.program.mock";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (crypto as any).randomUUID() as string;
  }
  return `p_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function normalizeProgram(input: Program | any): Program {
  return {
    id: String(input?.id ?? createId()),
    title: String(input?.title ?? ""),
    subtitle: String(input?.subtitle ?? ""),
    description: String(input?.description ?? ""),
    imageUrl: String(input?.imageUrl ?? input?.thumbnail ?? ""),
    ageRange: String(input?.ageRange ?? ""),
    duration: String(input?.duration ?? ""),
    category: String(input?.category ?? ""),
    ctaText: String(input?.ctaText ?? ""),
    projectUrl: String(input?.projectUrl ?? ""),
  };
}

function parsePrograms(data: StudioProgramData | any): Program[] {
  const programs = (data?.programs ?? []) as any[];
  return programs.map((p) => normalizeProgram(p));
}

export default function StudioProgramPage() {
  const { value: saved, save } = useMockCmsState<StudioProgramData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioProgramData,
  });

  const [draft, setDraft] = useState<Program[]>(() =>
    parsePrograms(defaultStudioProgramData),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Hydration-safe: keep draft in sync once loaded.
  useEffect(() => {
    const next = parsePrograms(saved);
    setDraft(next);
    if (!selectedId && next.length > 0) setSelectedId(next[0].id);
  }, [saved]);

  const selectedProgram = useMemo(() => {
    return draft.find((p) => p.id === selectedId) ?? null;
  }, [draft, selectedId]);

  const isDirty = useMemo(() => {
    const a = JSON.stringify(draft);
    const b = JSON.stringify(parsePrograms(saved));
    return a !== b;
  }, [draft, saved]);

  function onSave() {
    // Persist in the shape expected by mock-program.ts (programs[])
    const payload: StudioProgramData = {
      programs: draft.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        // map our required fields onto existing schema loosely
        // (title/subtitle/etc. are extra, but TS will still allow via normalization)
        features: [] as any,
        ctaText: p.ctaText,
        subtitle: p.subtitle,
        imageUrl: p.imageUrl,
        ageRange: p.ageRange,
        duration: p.duration,
        category: p.category,
        projectUrl: p.projectUrl,
      })) as any,
    };

    save(payload);
  }

  function onReset() {
    const ok = confirmReset("Reset changes for Program?");
    if (!ok) return;
    setDraft(parsePrograms(saved));
    setSelectedId(null);
  }

  function onAddProgram() {
    const next: Program = {
      id: createId(),
      title: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      ageRange: "",
      duration: "",
      category: "",
      ctaText: "",
      projectUrl: "",
    };
    setDraft((d) => {
      const n = [...d, next];
      return n;
    });
    setSelectedId(next.id);
  }

  function onDeleteProgram(id: string) {
    const ok = confirmReset("Are you sure you want to delete this Program?");
    if (!ok) return;

    setDraft((d) => {
      const idx = d.findIndex((x) => x.id === id);
      const next = d.filter((x) => x.id !== id);
      const nextSelected =
        idx > 0 ? next[idx - 1]?.id : next[idx]?.id ?? next[0]?.id ?? null;
      setSelectedId(nextSelected);
      return next;
    });
  }

  function moveItem(from: number, to: number) {
    setDraft((d) => {
      if (to < 0 || to >= d.length) return d;
      const next = [...d];
      const [spliced] = next.splice(from, 1);
      next.splice(to, 0, spliced);
      return next;
    });
  }

  const selectedIndex = selectedId
    ? draft.findIndex((p) => p.id === selectedId)
    : -1;

  return (
    <StudioShell>
      <CmsSectionShell
        title="Projects CMS"
        subtitle="Manage dynamic list of projects with live preview."
      >
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: List */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">Program List</h3>
                  <p className="mt-1 text-sm text-white/60">
                    {draft.length} programs
                  </p>
                </div>

                <CmsPrimaryButton variant="solid" onClick={onAddProgram}>
                  + Add Program
                </CmsPrimaryButton>
              </div>

              <div className="mt-5 space-y-3">
                {draft.length === 0 ? (
                  <p className="text-sm text-white/60">No programs yet.</p>
                ) : null}

                {draft.map((p, idx) => {
                  const active = p.id === selectedId;
                  return (
                    <div
                      key={p.id}
                      className={
                        active
                          ? "rounded-2xl border border-[#FFCFC9]/40 bg-[#FFCFC9]/10 p-4"
                          : "rounded-2xl border border-white/10 bg-white/5 p-4"
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedId(p.id)}
                          className="text-left"
                        >
                          <p className="text-sm font-semibold text-white">
                            {p.title || `Program ${idx + 1}`}
                          </p>
                          {p.category ? (
                            <p className="mt-1 text-xs text-white/60">
                              {p.category}
                            </p>
                          ) : null}
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteProgram(p.id)}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <CmsReorderControls
                          onMoveUp={() => moveItem(idx, idx - 1)}
                          onMoveDown={() => moveItem(idx, idx + 1)}
                          disableUp={idx === 0}
                          disableDown={idx === draft.length - 1}
                        />

                        <button
                          type="button"
                          onClick={() => setSelectedId(p.id)}
                          className="ml-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Editor */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white">Program Editor</h3>
                  <p className="mt-1 text-sm text-white/60">
                    {selectedProgram
                      ? `Editing: ${selectedProgram.title || "(untitled)"}`
                      : "Select a program to edit"}
                  </p>
                </div>

                <div className="hidden sm:block">
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

              {selectedProgram ? (
                <div className="mt-6 space-y-5">
                  <CmsTextInput
                    label="Title"
                    value={selectedProgram.title}
                    onChange={(v) =>
                      setDraft((d) =>
                        d.map((x) =>
                          x.id === selectedProgram.id
                            ? { ...x, title: v }
                            : x,
                        ),
                      )
                    }
                    placeholder="Program title"
                  />

                  <CmsTextInput
                    label="Subtitle"
                    value={selectedProgram.subtitle}
                    onChange={(v) =>
                      setDraft((d) =>
                        d.map((x) =>
                          x.id === selectedProgram.id
                            ? { ...x, subtitle: v }
                            : x,
                        ),
                      )
                    }
                    placeholder="Program subtitle"
                  />

                  <CmsTextarea
                    label="Description"
                    value={selectedProgram.description}
                    onChange={(v) =>
                      setDraft((d) =>
                        d.map((x) =>
                          x.id === selectedProgram.id
                            ? { ...x, description: v }
                            : x,
                        ),
                      )
                    }
                    placeholder="Program description"
                    rows={6}
                  />

                  <CmsTextInput
                    label="Thumbnail / Image URL"
                    value={selectedProgram.imageUrl}
                    onChange={(v) =>
                      setDraft((d) =>
                        d.map((x) =>
                          x.id === selectedProgram.id
                            ? { ...x, imageUrl: v }
                            : x,
                        ),
                      )
                    }
                    placeholder="/gallery/program.jpg"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <CmsTextInput
                      label="Age Range"
                      value={selectedProgram.ageRange}
                      onChange={(v) =>
                        setDraft((d) =>
                          d.map((x) =>
                            x.id === selectedProgram.id
                              ? { ...x, ageRange: v }
                              : x,
                          ),
                        )
                      }
                      placeholder="e.g. 7-12" 
                    />
                    <CmsTextInput
                      label="Duration"
                      value={selectedProgram.duration}
                      onChange={(v) =>
                        setDraft((d) =>
                          d.map((x) =>
                            x.id === selectedProgram.id
                              ? { ...x, duration: v }
                              : x,
                          ),
                        )
                      }
                      placeholder="e.g. 4 weeks"
                    />
                  </div>

                  <CmsTextInput
                    label="Category"
                    value={selectedProgram.category}
                    onChange={(v) =>
                      setDraft((d) =>
                        d.map((x) =>
                          x.id === selectedProgram.id
                            ? { ...x, category: v }
                            : x,
                        ),
                      )
                    }
                    placeholder="Minecraft Addon / Roblox / etc"
                  />

                  <CmsTextInput
                    label="Project URL"
                    value={selectedProgram.projectUrl}
                    onChange={(v) =>
                      setDraft((d) =>
                        d.map((x) =>
                          x.id === selectedProgram.id
                            ? { ...x, projectUrl: v }
                            : x,
                        ),
                      )
                    }
                    placeholder="https://example.com/my-project"
                  />

                  <CmsTextInput
                    label="CTA Text"
                    value={selectedProgram.ctaText}
                    onChange={(v) =>
                      setDraft((d) =>
                        d.map((x) =>
                          x.id === selectedProgram.id
                            ? { ...x, ctaText: v }
                            : x,
                        ),
                      )
                    }
                    placeholder="e.g. Lihat Proyek"
                  />

                  <div className="rounded-3xl border border-white/10 bg-[#0B1020]/30 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="w-full sm:max-w-[220px]">
                        <div className="aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020]/40">
                          {selectedProgram.imageUrl && selectedProgram.imageUrl.trim() !== "" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={selectedProgram.imageUrl}
                              alt={selectedProgram.title || "Program thumbnail"}
                              className="h-full w-full object-cover opacity-90"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center p-4">
                              <p className="text-center text-xs text-white/50">
                                No thumbnail yet
                              </p>
                            </div>
                          )}
                        </div>
                      </div>


                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#FFCFC9]">
                          {selectedProgram.category || "Category"}
                        </p>
                        <h4 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                          {selectedProgram.title || "Program Title"}
                        </h4>
                        {selectedProgram.subtitle ? (
                          <p className="mt-2 text-sm text-white/65">
                            {selectedProgram.subtitle}
                          </p>
                        ) : null}

                        <p className="mt-3 text-sm leading-relaxed text-white/65">
                          {selectedProgram.description || "Program description"}
                        </p>

                        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                          <button className="rounded-full bg-[#FFCFC9] px-5 py-3 text-sm font-semibold text-[#0B1020] hover:bg-[#FFCFC9]/90">
                            {selectedProgram.ctaText || "CTA"}
                          </button>
                          <div className="text-xs text-white/55">
                            {selectedProgram.ageRange || "Age range"} • {selectedProgram.duration || "Duration"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:hidden">
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

                  <CmsUrlHint hint={`Reorder controls appear in the Program list. You can edit/delete per item.`} />

                  {selectedIndex >= 0 ? (
                    <div className="text-xs text-white/50">
                      Position: {selectedIndex + 1} / {draft.length}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border border-white/10 bg-[#0B1020]/30 p-6">
                  <p className="text-sm text-white/60">
                    Select a program from the left to edit.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CmsSectionShell>
    </StudioShell>
  );
}


