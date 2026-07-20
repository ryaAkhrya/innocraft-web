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
  StudioProgramEntry,
} from "@/lib/studio/mock-program";

import { supabase } from "@/lib/supabase/client";


function toProgramEntry(row: {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  age_range: string | null;
  duration: string | null;
  category: string | null;
  project_url: string | null;
  cta_text: string | null;
}): StudioProgramEntry {
  return {
    id: String(row.id),
    title: row.title ?? "",
    description: row.description ?? "",
    features: [], // Not in DB schema, initialize empty
    subtitle: "", // Not in DB schema
    ctaText: row.cta_text ?? "",
    imageUrl: row.image_url ?? "",
    ageRange: row.age_range ?? "",
    duration: row.duration ?? "",
    category: row.category ?? "",
    projectUrl: row.project_url ?? "",
  };
}


export default function StudioProgramPage() {
  const [saved, setSaved] = useState<StudioProgramData>(defaultStudioProgramData);
  const [draft, setDraft] = useState<StudioProgramEntry[]>(() =>
    defaultStudioProgramData.programs.map((p) => ({ ...p })),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Hydration-safe: load from Supabase on mount
  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("id, title, description, image_url, age_range, duration, category, project_url, cta_text, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error("Failed to load projects:", error);
          return;
        }

        if (data && data.length > 0) {
          const programs = data.map(toProgramEntry);
          setSaved({ programs });
          setDraft(programs.map((p) => ({ ...p })));
          if (!selectedId && programs.length > 0) setSelectedId(programs[0].id);
        }
        // If no data, keep defaults
      } catch (e) {
        console.error("Error loading projects:", e);
      }
    }

    loadProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep draft in sync with saved
  useEffect(() => {
    if (draft.length === 0 && saved.programs.length > 0) {
      setDraft(saved.programs.map((p) => ({ ...p })));
    }
  }, [saved, draft]);

  const selectedProgram = useMemo(() => {
    return draft.find((p) => p.id === selectedId) ?? null;
  }, [draft, selectedId]);

  const isDirty = useMemo(() => {
    const a = JSON.stringify(draft);
    const b = JSON.stringify(saved.programs);
    return a !== b;
  }, [draft, saved]);

  const selectedIndex = selectedId
    ? draft.findIndex((p) => p.id === selectedId)
    : -1;

   function onSave() {
    void (async () => {
      try {
        const { supabase: client } = await import("@/lib/supabase/client");

        // Fetch existing project IDs
        const { data: existingRecords } = await client
          .from("projects")
          .select("id, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        const existingIds = new Set(existingRecords?.map((r) => r.id) ?? []);

        // Determine which IDs to delete: rows in Supabase but removed from draft
        const currentIds = new Set(draft.map((p) => p.id));
        const idsToDelete = existingRecords?.filter((r) => !currentIds.has(r.id)) ?? [];

        if (idsToDelete.length > 0) {
          console.log(`Deleting ${idsToDelete.length} removed project(s) from Supabase...`);
          for (const record of idsToDelete) {
            const { error: deleteError } = await client
              .from("projects")
              .delete()
              .eq("id", record.id);

            if (deleteError) {
              console.error(`Failed to delete project ${record.id}:`, deleteError);
            }
          }
        }

        // Working copy to track UUID updates from inserts
        const updatedDraft = [...draft];
        let newSelectedId = selectedId;

        // Update or insert each project
        for (let i = 0; i < updatedDraft.length; i++) {
          const program = updatedDraft[i];
          const originalId = program.id;

          if (program.id.startsWith("p") && !existingIds.has(program.id)) {
            // Legacy ID - insert new record (let Supabase generate UUID)
            const { data: insertedData, error: insertError } = await client
              .from("projects")
              .insert({
                title: program.title,
                description: program.description,
                image_url: program.imageUrl,
                age_range: program.ageRange,
                duration: program.duration,
                category: program.category,
                project_url: program.projectUrl,
                cta_text: program.ctaText,
                display_order: i,
                is_active: true,
              })
              .select("id");

            if (insertError) {
              console.error(`Failed to insert program ${i + 1}:`, insertError);
            } else if (insertedData && insertedData[0]) {
              // Update working copy to use the Supabase-generated UUID
              updatedDraft[i] = { ...updatedDraft[i], id: insertedData[0].id };
              // Also update selectedId if this was the selected project
              if (originalId === selectedId) {
                newSelectedId = insertedData[0].id;
              }
            }
          } else {
            // UUID or existing ID - update
            const { error: updateError } = await client
              .from("projects")
              .update({
                title: program.title,
                description: program.description,
                image_url: program.imageUrl,
                age_range: program.ageRange,
                duration: program.duration,
                category: program.category,
                project_url: program.projectUrl,
                cta_text: program.ctaText,
                display_order: i,
                is_active: true,
              })
              .eq("id", program.id);

            if (updateError) {
              console.error(`Failed to update program ${program.id}:`, updateError);
            }
          }
        }

        // Sync both states with the updated IDs
        setSaved({ programs: updatedDraft.map((p) => ({ ...p })) });
        setDraft(updatedDraft);
        setSelectedId(newSelectedId);
      } catch (e) {
        console.error("Error saving projects:", e);
      }
    })();
  }

  function onReset() {
    const ok = confirmReset("Reset changes for Program?");
    if (!ok) return;
    setDraft(saved.programs.map((p) => ({ ...p })));
    setSelectedId(null);
  }

  function onAddProgram() {
    const nextId = `p_${crypto.randomUUID?.() ?? Date.now()}`;
    const next: StudioProgramEntry = {
      id: nextId,
      title: "",
      description: "",
      features: [],
      ctaText: "",
      subtitle: "",
      imageUrl: "",
      ageRange: "",
      duration: "",
      category: "",
      projectUrl: "",
    };
    setDraft((d) => [...d, next]);
    setSelectedId(nextId);
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
                          x.id === selectedProgram.id ? { ...x, title: v } : x,
                        ),
                      )
                    }
                    placeholder="Program title"
                  />

                  <CmsTextInput
                    label="Subtitle"
                    value={selectedProgram.subtitle ?? ""}
                    onChange={(v) =>
                      setDraft((d) =>
                        d.map((x) =>
                          x.id === selectedProgram.id ? { ...x, subtitle: v } : x,
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
                          x.id === selectedProgram.id ? { ...x, description: v } : x,
                        ),
                      )
                    }
                    placeholder="Program description"
                    rows={6}
                  />

                  <CmsTextInput
                    label="Thumbnail / Image URL"
                    value={selectedProgram.imageUrl ?? ""}
                    onChange={(v) =>
                      setDraft((d) =>
                        d.map((x) =>
                          x.id === selectedProgram.id ? { ...x, imageUrl: v } : x,
                        ),
                      )
                    }
                    placeholder="/gallery/program.jpg"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <CmsTextInput
                      label="Age Range"
                      value={selectedProgram.ageRange ?? ""}
                      onChange={(v) =>
                        setDraft((d) =>
                          d.map((x) =>
                            x.id === selectedProgram.id ? { ...x, ageRange: v } : x,
                          ),
                        )
                      }
                      placeholder="e.g. 7-12"
                    />
                    <CmsTextInput
                      label="Duration"
                      value={selectedProgram.duration ?? ""}
                      onChange={(v) =>
                        setDraft((d) =>
                          d.map((x) =>
                            x.id === selectedProgram.id ? { ...x, duration: v } : x,
                          ),
                        )
                      }
                      placeholder="e.g. 4 weeks"
                    />
                  </div>

                  <CmsTextInput
                    label="Category"
                    value={selectedProgram.category ?? ""}
                    onChange={(v) =>
                      setDraft((d) =>
                        d.map((x) =>
                          x.id === selectedProgram.id ? { ...x, category: v } : x,
                        ),
                      )
                    }
                    placeholder="Minecraft Addon / Roblox / etc"
                  />

                  <CmsTextInput
                    label="Project URL"
                    value={selectedProgram.projectUrl ?? ""}
                    onChange={(v) =>
                      setDraft((d) =>
                        d.map((x) =>
                          x.id === selectedProgram.id ? { ...x, projectUrl: v } : x,
                        ),
                      )
                    }
                    placeholder="https://example.com/my-project"
                  />

                  <CmsTextInput
                    label="CTA Text"
                    value={selectedProgram.ctaText ?? ""}
                    onChange={(v) =>
                      setDraft((d) =>
                        d.map((x) =>
                          x.id === selectedProgram.id ? { ...x, ctaText: v } : x,
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