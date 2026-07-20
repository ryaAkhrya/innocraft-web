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

import {
  defaultStudioGalleryData,
  StudioGalleryData,
  StudioGalleryItem,
} from "@/lib/studio/mock-gallery";

import { supabase } from "@/lib/supabase/client";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (crypto as any).randomUUID() as string;
  }
  return `g_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}


function toGalleryItem(row: {
  id: string;
  image_url: string | null;
  title: string | null;
  description: string | null;
}): StudioGalleryItem {
  return {
    id: String(row.id),
    imageUrl: row.image_url ?? "",
    title: row.title ?? "",
    description: row.description ?? "",
  };
}

function normalizeItem(input: StudioGalleryItem | any): StudioGalleryItem {
  return {
    id: String(input?.id ?? createId()),
    imageUrl: String(input?.imageUrl ?? ""),
    title: String(input?.title ?? ""),
    description: String(input?.description ?? ""),
  };
}

function normalizeData(input: StudioGalleryData | any): StudioGalleryData {
  const items = Array.isArray(input?.items) ? input.items : [];
  return {
    items: items.map((x: any) => normalizeItem(x)),
  };
}

export default function StudioGalleryPage() {
  const [saved, setSaved] = useState<StudioGalleryData>(defaultStudioGalleryData);
  const [draft, setDraft] = useState<StudioGalleryData>(() =>
    normalizeData(defaultStudioGalleryData)
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Hydration-safe: load from Supabase on mount
  useEffect(() => {
    let cancelled = false;

    async function loadGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("id, image_url, title, description, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error("Failed to load gallery items:", error);
          return;
        }

        if (data && data.length > 0) {
          const items = data.map(toGalleryItem);
          setSaved({ items });
          setDraft({ items: items.map((i) => ({ ...i })) });
          if (!selectedId && items.length > 0) setSelectedId(items[0].id);
        }
        // If no data, keep defaults
      } catch (e) {
        console.error("Error loading gallery:", e);
      }
    }

    loadGallery();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep draft in sync with saved
  useEffect(() => {
    if (draft.items.length === 0 && saved.items.length > 0) {
      setDraft({ items: saved.items.map((i) => ({ ...i })) });
    }
  }, [saved, draft]);

  // Keep selection stable after load
  useEffect(() => {
    if (selectedId) {
      const exists = draft.items.some((i) => i.id === selectedId);
      if (!exists) setSelectedId(null);
    }
  }, [draft.items, selectedId]);

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return draft.items.find((i) => i.id === selectedId) ?? null;
  }, [draft.items, selectedId]);

  const isDirty = useMemo(() => {
    const a = JSON.stringify(draft);
    const b = JSON.stringify(saved);
    return a !== b;
  }, [draft, saved]);

  function onSave() {
    void (async () => {
      try {
        const { supabase: client } = await import("@/lib/supabase/client");

        // Fetch existing gallery IDs
        const { data: existingRecords } = await client
          .from("gallery")
          .select("id, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        const existingIds = new Set(existingRecords?.map((r) => r.id) ?? []);

        // Determine which IDs to delete: rows in Supabase but removed from draft
        const currentIds = new Set(draft.items.map((i) => i.id));
        const idsToDelete = existingRecords?.filter((r) => !currentIds.has(r.id)) ?? [];

        if (idsToDelete.length > 0) {
          console.log(`Deleting ${idsToDelete.length} removed gallery item(s) from Supabase...`);
          for (const record of idsToDelete) {
            const { error: deleteError } = await client
              .from("gallery")
              .delete()
              .eq("id", record.id);

            if (deleteError) {
              console.error(`Failed to delete gallery item ${record.id}:`, deleteError);
            }
          }
        }

        // Working copy to track UUID updates from inserts
        const updatedDraft = [...draft.items];
        let newSelectedId = selectedId;

        // Update or insert each gallery item
        for (let i = 0; i < updatedDraft.length; i++) {
          const item = updatedDraft[i];
          const originalId = item.id;

          if (!existingIds.has(item.id)) {
            // New item - insert and get UUID
            const { data: insertedData, error: insertError } = await client
              .from("gallery")
              .insert({
                image_url: item.imageUrl,
                title: item.title,
                description: item.description,
                display_order: i,
                is_active: true,
              })
              .select("id");

            if (insertError) {
              console.error(`Failed to insert gallery item ${i + 1}:`, insertError);
            } else if (insertedData && insertedData[0]) {
              updatedDraft[i] = { ...updatedDraft[i], id: insertedData[0].id };
              if (originalId === selectedId) {
                newSelectedId = insertedData[0].id;
              }
            }
          } else {
            // Existing UUID - update
            const { error: updateError } = await client
              .from("gallery")
              .update({
                image_url: item.imageUrl,
                title: item.title,
                description: item.description,
                display_order: i,
                is_active: true,
              })
              .eq("id", item.id);

            if (updateError) {
              console.error(`Failed to update gallery item ${item.id}:`, updateError);
            }
          }
        }

        // Sync both states with the updated IDs
        setSaved({ items: updatedDraft.map((i) => ({ ...i })) });
        setDraft({ items: updatedDraft });
        setSelectedId(newSelectedId);
      } catch (e) {
        console.error("Error saving gallery:", e);
      }
    })();
  }

  function onReset() {
    const ok = confirmReset("Reset changes for Gallery?");
    if (!ok) return;
    setDraft({ items: saved.items.map((i) => ({ ...i })) });
    setSelectedId(null);
    setIsEditorOpen(false);
  }

  function openNewEditor() {
    const next: StudioGalleryItem = {
      id: createId(),
      imageUrl: "",
      title: "",
      description: "",
    };
    setDraft((d) => ({ ...d, items: [...d.items, next] }));
    setSelectedId(next.id);
    setIsEditorOpen(true);
  }

  function openEditEditor(id: string) {
    setSelectedId(id);
    setIsEditorOpen(true);
  }

  function updateSelected(patch: Partial<StudioGalleryItem>) {
    if (!selectedItem) return;
    setDraft((d) => ({
      ...d,
      items: d.items.map((it) =>
        it.id === selectedItem.id ? { ...it, ...patch } : it,
      ),
    }));
  }

  function onDelete(id: string) {
    const ok = confirmReset("Are you sure you want to delete this gallery item?");
    if (!ok) return;

    setDraft((d) => {
      const idx = d.items.findIndex((x) => x.id === id);
      const nextItems = d.items.filter((x) => x.id !== id);
      const nextSelected = (() => {
        if (!nextItems.length) return null;
        if (id !== selectedId) return selectedId;
        if (idx > 0) return nextItems[idx - 1]?.id ?? nextItems[0].id;
        return nextItems[0].id;
      })();

      setSelectedId(nextSelected);
      setIsEditorOpen(false);

      return { ...d, items: nextItems };
    });
  }

  function moveItem(from: number, to: number) {
    setDraft((d) => {
      if (to < 0 || to >= d.items.length) return d;
      const next = [...d.items];
      const [spliced] = next.splice(from, 1);
      next.splice(to, 0, spliced);
      return { ...d, items: next };
    });
  }

  function closeModal() {
    setIsEditorOpen(false);
  }

  function previewImageOrPlaceholder(imageUrl: string, title: string) {
    const clean = imageUrl?.trim() ?? "";
    if (!clean) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-[#0B1020]/30">
          <p className="text-center text-xs text-white/50">No image URL</p>
        </div>
      );
    }

    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={clean}
        alt={title || "Gallery image"}
        className="h-full w-full rounded-3xl border border-white/10 object-cover"
      />
    );
  }

  return (
    <StudioShell>
      <CmsSectionShell
        title="Gallery CMS"
        subtitle="Manage multiple gallery items (add/edit/delete/reorder) with live preview."
      >
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: List */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Gallery Items
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    {draft.items.length} items
                  </p>
                </div>

                <CmsPrimaryButton variant="solid" onClick={openNewEditor}>
                  + Add Item
                </CmsPrimaryButton>
              </div>

              <div className="mt-5 space-y-3">
                {draft.items.length === 0 ? (
                  <p className="text-sm text-white/60">No items yet.</p>
                ) : null}

                {draft.items.map((it, idx) => {
                  const active = it.id === selectedId;
                  return (
                    <div
                      key={it.id}
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
                            setSelectedId(it.id);
                            setIsEditorOpen(true);
                          }}
                          className="text-left"
                        >
                          <p className="text-sm font-semibold text-white">
                            {it.title?.trim() ? it.title : `Item ${idx + 1}`}
                          </p>
                          <p className="mt-1 text-xs text-white/60">
                            {it.imageUrl?.trim() ? "Has image" : "No image"}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(it.id)}
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
                          disableDown={idx === draft.items.length - 1}
                        />

                        <button
                          type="button"
                          onClick={() => openEditEditor(it.id)}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
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

          {/* Right: Live Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Gallery Live Preview
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
                  {draft.items.map((it) => {
                    const hasImg = !!it.imageUrl?.trim();
                    return (
                      <div
                        key={it.id}
                        className="rounded-3xl border border-white/10 bg-[#0B1020]/30 p-4"
                      >
                        <div className="aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                          {previewImageOrPlaceholder(
                            it.imageUrl,
                            it.title,
                          )}
                        </div>

                        <div className="mt-4">
                          <p className="text-sm font-semibold text-[#FFCFC9]">
                            {it.title?.trim() ? it.title : "Untitled"}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-white/65">
                            {it.description?.trim() ? it.description :
                              hasImg
                                ? "(No description)"
                                : "(Add image & description)"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {draft.items.length === 0 ? (
                  <div className="mt-6 rounded-3xl border border-white/10 bg-[#0B1020]/30 p-6">
                    <p className="text-sm text-white/60">
                      Add gallery items to see the live preview.
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
          title={selectedItem?.title?.trim() ? "Edit Gallery Item" : "Add Gallery Item"}
          isOpen={isEditorOpen}
          onClose={closeModal}
        >
          {selectedItem ? (
            <div className="space-y-5">
              <CmsTextInput
                label="Image URL"
                value={selectedItem.imageUrl}
                onChange={(v) => updateSelected({ imageUrl: v })}
                placeholder="/gallery/my-image.jpg"
              />

              <CmsTextInput
                label="Title"
                value={selectedItem.title}
                onChange={(v) => updateSelected({ title: v })}
                placeholder="Gallery item title"
              />

              <CmsTextarea
                label="Description"
                value={selectedItem.description}
                onChange={(v) => updateSelected({ description: v })}
                placeholder="Short description"
                rows={6}
              />

              <div>
                <p className="mb-2 text-xs font-medium text-white/60">
                  Image preview
                </p>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020]/30">
                  {selectedItem.imageUrl?.trim() ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedItem.imageUrl.trim()}
                      alt={selectedItem.title || "Gallery preview"}
                      className="h-56 w-full object-cover opacity-90"
                    />
                  ) : (
                    <div className="flex h-56 w-full items-center justify-center p-4">
                      <p className="text-center text-xs text-white/50">
                        No image URL provided.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/60">No item selected.</p>
          )}
        </CmsItemEditModal>
      </CmsSectionShell>
    </StudioShell>
  );
}