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
} from "@/components/studio/cms-form-input";
import { confirmReset } from "@/components/studio/cms-confirm-reset";
import { CmsReorderControls } from "@/components/studio/cms-reorder";
import { CmsItemEditModal } from "@/components/studio/cms-item-edit-modal";
import { CmsFileUpload } from "@/components/studio/cms-file-uploader";

import {
  defaultStudioMentorData,
  StudioMentor,
  StudioMentorData,
} from "@/lib/studio/mock-mentor";

import { supabase } from "@/lib/supabase/client";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (crypto as any).randomUUID() as string;
  }
  return `m_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}


function toMentor(row: {
  id: string;
  photo_url: string | null;
  name: string | null;
  position: string | null;
  description: string | null;
}): StudioMentor {
  return {
    id: String(row.id),
    photoUrl: row.photo_url ?? "",
    name: row.name ?? "",
    position: row.position ?? "",
    description: row.description ?? "",
  };
}

function normalizeItem(input: StudioMentor | any): StudioMentor {
  return {
    id: String(input?.id ?? createId()),
    photoUrl: String(input?.photoUrl ?? ""),
    name: String(input?.name ?? ""),
    position: String(input?.position ?? ""),
    description: String(input?.description ?? ""),
  };
}

function normalizeData(input: StudioMentorData | any): StudioMentorData {
  const mentors = Array.isArray(input?.mentors) ? input.mentors : [];
  return {
    mentors: mentors.map((x: any) => normalizeItem(x)),
  };
}

function safeTrim(s: string | null | undefined) {
  return (s ?? "").trim();
}

function getSelectedIndex(items: StudioMentor[], selectedId: string | null) {
  if (!selectedId) return -1;
  return items.findIndex((x) => x.id === selectedId);
}

export default function StudioMentorPage() {
  const [saved, setSaved] = useState<StudioMentorData>(defaultStudioMentorData);
  const [draft, setDraft] = useState<StudioMentorData>(() =>
    normalizeData(defaultStudioMentorData)
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Hydration-safe: load from Supabase on mount
  useEffect(() => {
    let cancelled = false;

    async function loadMentors() {
      try {
        const { data, error } = await supabase
          .from("mentors")
          .select("id, photo_url, name, position, description, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error("Failed to load mentors:", error);
          return;
        }

        if (data && data.length > 0) {
          const mentors = data.map(toMentor);
          setSaved({ mentors });
          setDraft({ mentors: mentors.map((m) => ({ ...m })) });
          if (!selectedId && mentors.length > 0) setSelectedId(mentors[0].id);
        }
        // If no data, keep defaults
      } catch (e) {
        console.error("Error loading mentors:", e);
      }
    }

    loadMentors();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep draft in sync with saved
  useEffect(() => {
    if (draft.mentors.length === 0 && saved.mentors.length > 0) {
      setDraft({ mentors: saved.mentors.map((m) => ({ ...m })) });
    }
  }, [saved, draft]);

  // Keep selection valid
  useEffect(() => {
    if (!selectedId) return;
    const exists = draft.mentors.some((m) => m.id === selectedId);
    if (!exists) setSelectedId(null);
  }, [draft.mentors, selectedId]);

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return draft.mentors.find((m) => m.id === selectedId) ?? null;
  }, [draft.mentors, selectedId]);

  const isDirty = useMemo(() => {
    const a = JSON.stringify(draft);
    const b = JSON.stringify(saved);
    return a !== b;
  }, [draft, saved]);

  function onSave() {
    // Capture current state immediately to avoid stale closure
    const currentDraft = draft.mentors;
    
    console.log('[Mentor Debug] Save clicked - draft count:', currentDraft.length);
    
    void (async () => {
      try {
        const { supabase: client } = await import("@/lib/supabase/client");

        // Fetch existing mentor IDs
        const { data: existingRecords, error: fetchError } = await client
          .from("mentors")
          .select("id, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (fetchError) {
          console.error('Mentor save - failed to fetch existing:', fetchError.message);
          return;
        }

        const existingIds = new Set(existingRecords?.map((r) => r.id) ?? []);

        // Determine which IDs to delete: rows in Supabase but removed from draft
        const currentIds = new Set(currentDraft.map((m) => m.id));
        const idsToDelete = existingRecords?.filter((r) => !currentIds.has(r.id)) ?? [];

        if (idsToDelete.length > 0) {
          console.log(`[Mentor Debug] Deleting ${idsToDelete.length} mentor(s) from Supabase...`);
          for (const record of idsToDelete) {
            const { error: deleteError } = await client
              .from("mentors")
              .delete()
              .eq("id", record.id);

            if (deleteError) {
              console.error(`Failed to delete mentor ${record.id}:`, deleteError);
            }
          }
        }

        // Working copy to track UUID updates from inserts
        const updatedDraft = [...currentDraft];
        let newSelectedId = selectedId;

        // Update or insert each mentor
        for (let i = 0; i < updatedDraft.length; i++) {
          const mentor = updatedDraft[i];
          const originalId = mentor.id;

          if (!existingIds.has(mentor.id)) {
            // New mentor - insert and get UUID
            const { data: insertedData, error: insertError } = await client
              .from("mentors")
              .insert({
                photo_url: mentor.photoUrl,
                name: mentor.name,
                position: mentor.position,
                description: mentor.description,
                display_order: i,
                is_active: true,
              })
              .select("id");

            console.log('[Mentor Debug] Insert response for mentor', i, { data: insertedData, error: insertError });

            if (insertError) {
              console.error(`Failed to insert mentor ${i + 1}:`, insertError);
            } else if (insertedData && insertedData[0]) {
              updatedDraft[i] = { ...updatedDraft[i], id: insertedData[0].id };
              if (originalId === selectedId) {
                newSelectedId = insertedData[0].id;
              }
            }
          } else {
            // Existing UUID - update
            const { error: updateError } = await client
              .from("mentors")
              .update({
                photo_url: mentor.photoUrl,
                name: mentor.name,
                position: mentor.position,
                description: mentor.description,
                display_order: i,
                is_active: true,
              })
              .eq("id", mentor.id);

            console.log('[Mentor Debug] Update response for mentor', mentor.id, { error: updateError });

            if (updateError) {
              console.error(`Failed to update mentor ${mentor.id}:`, updateError);
            }
          }
        }

        // Sync both states with the updated IDs
        setSaved({ mentors: updatedDraft.map((m) => ({ ...m })) });
        setDraft({ mentors: updatedDraft });
        setSelectedId(newSelectedId);
      } catch (e) {
        console.error("Error saving mentors:", e);
      }
    })();
  }

  function onReset() {
    const ok = confirmReset("Reset changes for Mentor?");
    if (!ok) return;
    setDraft({ mentors: saved.mentors.map((m) => ({ ...m })) });
    setSelectedId(null);
    setIsEditorOpen(false);
  }

  function openNewEditor() {
    const next: StudioMentor = {
      id: createId(),
      photoUrl: "",
      name: "",
      position: "",
      description: "",
    };

    setDraft((d) => ({ ...d, mentors: [...d.mentors, next] }));
    setSelectedId(next.id);
    setIsEditorOpen(true);
  }

  function openEditEditor(id: string) {
    setSelectedId(id);
    setIsEditorOpen(true);
  }

  function updateSelected(patch: Partial<StudioMentor>) {
    if (!selectedItem) return;
    
    console.log('[Mentor Debug] updateSelected called with patch:', patch);

    setDraft((d) => {
      const nextDraft = {
        ...d,
        mentors: d.mentors.map((m) =>
          m.id === selectedItem.id ? { ...m, ...patch } : m,
        ),
      };
      console.log('[Mentor Debug] Draft updated for item', selectedItem.id, 'new photoUrl:', nextDraft.mentors.find(m => m.id === selectedItem.id)?.photoUrl);
      return nextDraft;
    });
  }

  function onDelete(id: string) {
    const ok = confirmReset("Are you sure you want to delete this mentor?");
    if (!ok) return;

    setDraft((d) => {
      const idx = d.mentors.findIndex((x) => x.id === id);
      const nextMentors = d.mentors.filter((x) => x.id !== id);

      const nextSelected = (() => {
        if (!nextMentors.length) return null;
        if (id !== selectedId) return selectedId;
        // choose previous, else first
        if (idx > 0) return nextMentors[idx - 1]?.id ?? nextMentors[0].id;
        return nextMentors[0].id;
      })();

      setSelectedId(nextSelected);
      setIsEditorOpen(false);

      return { ...d, mentors: nextMentors };
    });
  }

  function moveItem(from: number, to: number) {
    setDraft((d) => {
      if (to < 0 || to >= d.mentors.length) return d;
      const next = [...d.mentors];
      const [spliced] = next.splice(from, 1);
      next.splice(to, 0, spliced);
      return { ...d, mentors: next };
    });
  }

  function closeModal() {
    setIsEditorOpen(false);
  }

  function renderPhotoOrPlaceholder(photoUrl: string, name: string) {
    const clean = safeTrim(photoUrl);
    if (!clean) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-[#0B1020]/30">
          <p className="text-center text-xs text-white/50">No photo URL</p>
        </div>
      );
    }

    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={clean}
        alt={name || "Mentor photo"}
        className="h-full w-full rounded-3xl border border-white/10 object-cover"
      />
    );
  }

  const selectedIndex = getSelectedIndex(draft.mentors, selectedId);

  return (
    <StudioShell>
      <CmsSectionShell
        title="Mentor CMS"
        subtitle="Manage multiple mentor profiles (add/edit/delete/reorder) with live preview."
      >
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: List */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Mentor List
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    {draft.mentors.length} mentors
                  </p>
                </div>

                <CmsPrimaryButton variant="solid" onClick={openNewEditor}>
                  + Add Mentor
                </CmsPrimaryButton>
              </div>

              <div className="mt-5 space-y-3">
                {draft.mentors.length === 0 ? (
                  <p className="text-sm text-white/60">No mentors yet.</p>
                ) : null}

                {draft.mentors.map((m, idx) => {
                  const active = m.id === selectedId;
                  return (
                    <div
                      key={m.id}
                      className={
                        active
                          ? "rounded-2xl border border-[#FFCFC9]/40 bg-[#FFCFC9]/10 p-4"
                          : "rounded-2xl border border-white/10 bg-white/5 p-4"
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(m.id);
                            setIsEditorOpen(true);
                          }}
                          className="text-left"
                        >
                          <p className="text-sm font-semibold text-white">
                            {safeTrim(m.name) ? m.name : `Mentor ${idx + 1}`}
                          </p>
                          <p className="mt-1 text-xs text-white/60">
                            {safeTrim(m.position)
                              ? m.position
                              : "No position"}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(m.id)}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <CmsReorderControls
                          onMoveUp={() => moveItem(idx, idx - 1)}
                          onMoveDown={() => moveItem(idx, idx + 1)}
                          disableUp={idx === 0}
                          disableDown={idx === draft.mentors.length - 1}
                        />

                        <button
                          type="button"
                          onClick={() => openEditEditor(m.id)}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedIndex >= 0 ? (
                <p className="mt-4 text-xs text-white/50">
                  Position: {selectedIndex + 1} / {draft.mentors.length}
                </p>
              ) : null}
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Mentor Live Preview
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    Changes apply instantly after you save.
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

              <div className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {draft.mentors.map((m) => {
                    const hasPhoto = !!safeTrim(m.photoUrl);
                    return (
                      <div
                        key={m.id}
                        className="rounded-3xl border border-white/10 bg-[#0B1020]/30 p-4"
                      >
                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                          <div className="aspect-[4/3] w-full">
                            {renderPhotoOrPlaceholder(m.photoUrl, m.name)}
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm font-semibold text-[#FFCFC9]">
                            {safeTrim(m.name) ? m.name : "Untitled"}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-white/65">
                            {safeTrim(m.position)
                              ? m.position
                              : hasPhoto
                                ? "(No position)"
                                : "(Add photo & position)"}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-white/65">
                            {safeTrim(m.description)
                              ? m.description
                              : hasPhoto
                                ? "(No description)"
                                : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {draft.mentors.length === 0 ? (
                  <div className="mt-6 rounded-3xl border border-white/10 bg-[#0B1020]/30 p-6">
                    <p className="text-sm text-white/60">
                      Add mentor profiles to see the live preview.
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 sm:hidden">
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
        </div>

        <CmsItemEditModal
          title={selectedItem ? "Edit Mentor" : "Add Mentor"}
          isOpen={isEditorOpen}
          onClose={closeModal}
        >
          {selectedItem ? (
            <div className="space-y-5">
              <CmsFileUpload
                label="Photo"
                value={selectedItem.photoUrl}
                onChange={(v) => updateSelected({ photoUrl: v })}
                bucket="mentors"
                accept="image/*"
              />

              <CmsTextInput
                label="Name"
                value={selectedItem.name}
                onChange={(v) => updateSelected({ name: v })}
                placeholder="Mentor name"
              />

              <CmsTextInput
                label="Position"
                value={selectedItem.position}
                onChange={(v) => updateSelected({ position: v })}
                placeholder="e.g. Mentor Lead"
              />

              <CmsTextarea
                label="Description"
                value={selectedItem.description}
                onChange={(v) => updateSelected({ description: v })}
                placeholder="Short description"
                rows={6}
              />
            </div>
          ) : (
            <p className="text-sm text-white/60">No mentor selected.</p>
          )}
        </CmsItemEditModal>
      </CmsSectionShell>
    </StudioShell>
  );
}