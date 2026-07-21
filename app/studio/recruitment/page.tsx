"use client";

import { useEffect, useMemo, useState } from "react";

import { StudioShell } from "@/components/studio/studio-shell";
import { CmsSectionShell } from "@/components/studio/cms-section-shell";
import {
  CmsButtonRow,
  CmsPrimaryButton,
} from "@/components/studio/cms-button-row";
import { CmsTextInput, CmsTextarea } from "@/components/studio/cms-form-input";
import { CmsReorderControls } from "@/components/studio/cms-reorder";
import { CmsItemEditModal } from "@/components/studio/cms-item-edit-modal";
import { confirmReset } from "@/components/studio/cms-confirm-reset";

import {
  defaultStudioRecruitmentData,
  StudioJob,
  StudioRecruitmentData,
} from "@/lib/studio/mock-recruitment";

import { supabase } from "@/lib/supabase/client";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (crypto as any).randomUUID() as string;
  }
  return `r_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function safeTrim(s: string | null | undefined) {
  return (s ?? "").trim();
}

function toRecruitmentJob(row: {
  id: string;
  title: string | null;
  employment_type: string | null;
  location: string | null;
  status: string | null;
  description: string | null;
  requirements: string[] | null;
  job_description: string | null;
  benefits: string[] | null;
  work_location: string | null;
  display_order: number | null;
}): StudioJob {
  return {
    id: String(row.id),
    position: row.title ?? "",
    employmentType: row.employment_type ?? "",
    location: row.location ?? "",
    status: row.status === "Closed" ? "Closed" : "Open",
    description: row.description ?? "",
    requirements: row.requirements ?? [],
    jobDescription: row.job_description ?? "",
    benefits: row.benefits ?? [],
    workLocation: row.work_location ?? "",
  };
}

function normalizeJob(input: StudioJob | any): StudioJob {
  return {
    id: String(input?.id ?? createId()),
    position: String(input?.position ?? ""),
    employmentType: String(input?.employmentType ?? ""),
    location: String(input?.location ?? ""),
    status: input?.status === "Closed" ? "Closed" : "Open",
    description: String(input?.description ?? ""),
    requirements: Array.isArray(input?.requirements)
      ? input.requirements.map((x: any) => String(x ?? "")).filter(Boolean)
      : [],
    jobDescription: String(input?.jobDescription ?? ""),
    benefits: Array.isArray(input?.benefits)
      ? input.benefits.map((x: any) => String(x ?? "")).filter(Boolean)
      : [],
    workLocation: String(input?.workLocation ?? ""),
  };
}

function normalizeData(input: StudioRecruitmentData | any): StudioRecruitmentData {
  const jobs = Array.isArray(input?.jobs) ? input.jobs : [];
  return {
    jobs: jobs.map((j: any) => normalizeJob(j)),
  };
}

function getSelectedIndex(items: StudioJob[], selectedId: string | null) {
  if (!selectedId) return -1;
  return items.findIndex((x) => x.id === selectedId);
}

export default function StudioRecruitmentPage() {
  const [saved, setSaved] = useState<StudioRecruitmentData>(defaultStudioRecruitmentData);
  const [draft, setDraft] = useState<StudioRecruitmentData>(() =>
    normalizeData(defaultStudioRecruitmentData)
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Hydration-safe: load from Supabase on mount
  useEffect(() => {
    let cancelled = false;

    async function loadRecruitment() {
      try {
        const { data, error } = await supabase
              .from("recruitment")
              .select("id, title, employment_type, location, status, description, requirements, job_description, benefits, work_location, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error("Failed to load recruitment jobs:", error);
          return;
        }

        if (data && data.length > 0) {
          const jobs = data.map(toRecruitmentJob);
          setSaved({ jobs });
          setDraft({ jobs: jobs.map((j) => ({ ...j })) });
          if (!selectedId && jobs.length > 0) setSelectedId(jobs[0].id);
        }
        // If no data, keep defaults
      } catch (e) {
        console.error("Error loading recruitment:", e);
      }
    }

    loadRecruitment();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep draft in sync with saved
  useEffect(() => {
    if (draft.jobs.length === 0 && saved.jobs.length > 0) {
      setDraft({ jobs: saved.jobs.map((j) => ({ ...j })) });
    }
  }, [saved, draft]);

  // Keep selection valid
  useEffect(() => {
    if (!selectedId) return;
    const exists = draft.jobs.some((j) => j.id === selectedId);
    if (!exists) setSelectedId(null);
  }, [draft.jobs, selectedId]);

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return draft.jobs.find((j) => j.id === selectedId) ?? null;
  }, [draft.jobs, selectedId]);

  const isDirty = useMemo(() => {
    const a = JSON.stringify(draft);
    const b = JSON.stringify(saved);
    return a !== b;
  }, [draft, saved]);

  function onSave() {
    void (async () => {
      try {
        const { supabase: client } = await import("@/lib/supabase/client");

        // Fetch existing job IDs
        const { data: existingRecords } = await client
          .from("recruitment")
          .select("id, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        const existingIds = new Set(existingRecords?.map((r) => r.id) ?? []);

        // Determine which IDs to delete: rows in Supabase but removed from draft
        const currentIds = new Set(draft.jobs.map((j) => j.id));
        const idsToDelete = existingRecords?.filter((r) => !currentIds.has(r.id)) ?? [];

        if (idsToDelete.length > 0) {
          console.log(`Deleting ${idsToDelete.length} removed job(s) from Supabase...`);
          for (const record of idsToDelete) {
            const { error: deleteError } = await client
              .from("recruitment")
              .delete()
              .eq("id", record.id);

            if (deleteError) {
              console.error(`Failed to delete job ${record.id}:`, deleteError);
            }
          }
        }

        // Working copy to track UUID updates from inserts
        const updatedDraft = [...draft.jobs];
        let newSelectedId = selectedId;

        // Update or insert each job
        for (let i = 0; i < updatedDraft.length; i++) {
          const job = updatedDraft[i];
          const originalId = job.id;

          if (!existingIds.has(job.id)) {
            // New job - insert and get UUID
            const { data: insertedData, error: insertError } = await client
              .from("recruitment")
              .insert({
                title: job.position,
                employment_type: job.employmentType,
                location: job.location,
                status: job.status,
                description: job.description,
                requirements: job.requirements,
                job_description: job.jobDescription,
                benefits: job.benefits,
                work_location: job.workLocation,
                display_order: i,
                is_active: true,
              })
              .select("id");

            if (insertError) {
              console.error(`Failed to insert job ${i + 1}:`, insertError);
            } else if (insertedData && insertedData[0]) {
              updatedDraft[i] = { ...updatedDraft[i], id: insertedData[0].id };
              if (originalId === selectedId) {
                newSelectedId = insertedData[0].id;
              }
            }
          } else {
            // Existing UUID - update
            const { error: updateError } = await client
              .from("recruitment")
              .update({
                title: job.position,
                employment_type: job.employmentType,
                location: job.location,
                status: job.status,
                description: job.description,
                requirements: job.requirements,
                job_description: job.jobDescription,
                benefits: job.benefits,
                work_location: job.workLocation,
                display_order: i,
                is_active: true,
              })
              .eq("id", job.id);

            if (updateError) {
              console.error(`Failed to update job ${job.id}:`, updateError);
            }
          }
        }

        // Sync both states with the updated IDs
        setSaved({ jobs: updatedDraft.map((j) => ({ ...j })) });
        setDraft({ jobs: updatedDraft });
        setSelectedId(newSelectedId);
      } catch (e) {
        console.error("Error saving recruitment:", e);
      }
    })();
  }

  function onReset() {
    const ok = confirmReset("Reset changes for Recruitment?");
    if (!ok) return;
    setDraft({ jobs: saved.jobs.map((j) => ({ ...j })) });
    setSelectedId(null);
    setIsEditorOpen(false);
  }

  function openNewEditor() {
    const next: StudioJob = {
      id: createId(),
      position: "",
      employmentType: "",
      location: "",
      status: "Open",
      description: "",
      requirements: [],
      jobDescription: "",
      benefits: [],
      workLocation: "",
    };

    setDraft((d) => ({ ...d, jobs: [...d.jobs, next] }));
    setSelectedId(next.id);
    setIsEditorOpen(true);
  }

  function openEditEditor(id: string) {
    setSelectedId(id);
    setIsEditorOpen(true);
  }

  function updateSelected(patch: Partial<StudioJob>) {
    if (!selectedItem) return;

    setDraft((d) => ({
      ...d,
      jobs: d.jobs.map((j) =>
        j.id === selectedItem.id ? { ...j, ...patch } : j,
      ),
    }));
  }

  function onDelete(id: string) {
    const ok = confirmReset("Are you sure you want to delete this job listing?");
    if (!ok) return;

    setDraft((d) => {
      const idx = d.jobs.findIndex((x) => x.id === id);
      const nextJobs = d.jobs.filter((x) => x.id !== id);

      const nextSelected = (() => {
        if (!nextJobs.length) return null;
        if (id !== selectedId) return selectedId;
        if (idx > 0) return nextJobs[idx - 1]?.id ?? nextJobs[0].id;
        return nextJobs[0].id;
      })();

      setSelectedId(nextSelected);
      setIsEditorOpen(false);

      return { ...d, jobs: nextJobs };
    });
  }

  function moveItem(from: number, to: number) {
    setDraft((d) => {
      if (to < 0 || to >= d.jobs.length) return d;
      const next = [...d.jobs];
      const [spliced] = next.splice(from, 1);
      next.splice(to, 0, spliced);
      return { ...d, jobs: next };
    });
  }

  function closeModal() {
    setIsEditorOpen(false);
  }

  const selectedIndex = getSelectedIndex(draft.jobs, selectedId);

  return (
    <StudioShell>
      <CmsSectionShell
        title="Recruitment CMS"
        subtitle="Manage multiple job listings (add/edit/delete/reorder) with live preview."
      >
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: List */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">Job Listings</h3>
                  <p className="mt-1 text-sm text-white/60">
                    {draft.jobs.length} jobs
                  </p>
                </div>

                <CmsPrimaryButton variant="solid" onClick={openNewEditor}>
                  + Add Job
                </CmsPrimaryButton>
              </div>

              <div className="mt-5 space-y-3">
                {draft.jobs.length === 0 ? (
                  <p className="text-sm text-white/60">No jobs yet.</p>
                ) : null}

                {draft.jobs.map((j, idx) => {
                  const active = j.id === selectedId;
                  const title = safeTrim(j.position) ? j.position : `Job ${idx + 1}`;
                  return (
                    <div
                      key={j.id}
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
                            setSelectedId(j.id);
                            setIsEditorOpen(true);
                          }}
                          className="text-left"
                        >
                          <p className="text-sm font-semibold text-white">{title}</p>
                          <p className="mt-1 text-xs text-white/60">
                            {safeTrim(j.location)
                              ? j.location
                              : safeTrim(j.employmentType)
                                ? j.employmentType
                                : "No details"}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(j.id)}
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
                          disableDown={idx === draft.jobs.length - 1}
                        />

                        <button
                          type="button"
                          onClick={() => openEditEditor(j.id)}
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
                  Position: {selectedIndex + 1} / {draft.jobs.length}
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
                    Recruitment Live Preview
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    Save to persist; preview updates based on your current draft.
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
                  {draft.jobs.map((j) => {
                    const statusColor = j.status === "Open" ? "#B7F7C3" : "#FFB4B4";
                    const positionTitle = safeTrim(j.position) ? j.position : "Untitled";
                    return (
                      <div
                        key={j.id}
                        className="rounded-3xl border border-white/10 bg-[#0B1020]/30 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-[#FFCFC9]">
                            {positionTitle}
                          </p>
                          <span
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold"
                            style={{ color: statusColor }}
                          >
                            {j.status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                          {(safeTrim(j.employmentType) || safeTrim(j.location)) &&
                            `${safeTrim(j.employmentType) ? j.employmentType : ""}${
                              safeTrim(j.employmentType) && safeTrim(j.location)
                                ? " • "
                                : ""
                            }${safeTrim(j.location) ? j.location : ""}`}
                          {!safeTrim(j.employmentType) && !safeTrim(j.location)
                            ? "(Add employment type & location)"
                            : null}
                        </p>

                        <p className="mt-3 text-sm leading-relaxed text-white/65">
                          {safeTrim(j.description)
                            ? j.description
                            : "(Add description)"}
                        </p>

                        <div className="mt-3">
                          <p className="mb-2 text-xs font-medium text-white/60">
                            Requirements
                          </p>
                          {j.requirements.length ? (
                            <ul className="space-y-1">
                              {j.requirements.slice(0, 4).map((r, idx) => (
                                <li
                                  key={`${j.id}_req_${idx}`}
                                  className="text-xs text-white/65"
                                >
                                  • {r}
                                </li>
                              ))}
                              {j.requirements.length > 4 ? (
                                <li className="text-xs text-white/50">
                                  +{j.requirements.length - 4} more
                                </li>
                              ) : null}
                            </ul>
                          ) : (
                            <p className="text-xs text-white/50">
                              (Add requirements)
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {draft.jobs.length === 0 ? (
                  <div className="mt-6 rounded-3xl border border-white/10 bg-[#0B1020]/30 p-6">
                    <p className="text-sm text-white/60">
                      Add job listings to see the live preview.
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
          title={selectedItem ? "Edit Job" : "Add Job"}
          isOpen={isEditorOpen}
          onClose={closeModal}
        >
          {selectedItem ? (
            <div className="space-y-5">
              <CmsTextInput
                label="Position"
                value={selectedItem.position}
                onChange={(v) => updateSelected({ position: v })}
                placeholder="e.g. Program Coordinator"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <CmsTextInput
                  label="Employment Type"
                  value={selectedItem.employmentType}
                  onChange={(v) => updateSelected({ employmentType: v })}
                  placeholder="e.g. Part-time"
                />
                <CmsTextInput
                  label="Location"
                  value={selectedItem.location}
                  onChange={(v) => updateSelected({ location: v })}
                  placeholder="e.g. Jakarta"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-white/80">Status</span>
                  <select
                    value={selectedItem.status}
                    onChange={(e) =>
                      updateSelected({
                        status: e.target.value === "Closed" ? "Closed" : "Open",
                      })
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0B1020]/40 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-primary/60"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </label>

                <CmsTextInput
                  label="Requirements (comma separated)"
                  value={selectedItem.requirements.join(", ")}
                  onChange={(v) =>
                    updateSelected({
                      requirements: v
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Komunikasi baik, Organisasi rapi"
                />
              </div>

              <CmsTextarea
                label="Description"
                value={selectedItem.description}
                onChange={(v) => updateSelected({ description: v })}
                placeholder="Job description"
                rows={6}
              />

              <CmsTextarea
                label="Job Description (detail modal)"
                value={selectedItem.jobDescription}
                onChange={(v) => updateSelected({ jobDescription: v })}
                placeholder="Detailed job description shown in modal"
                rows={6}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <CmsTextInput
                  label="Work Location (detail modal)"
                  value={selectedItem.workLocation}
                  onChange={(v) => updateSelected({ workLocation: v })}
                  placeholder="e.g. Jakarta (offline)"
                />

                <CmsTextInput
                  label="Benefits (comma separated)"
                  value={selectedItem.benefits.join(", ")}
                  onChange={(v) =>
                    updateSelected({
                      benefits: v
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Asuransi, Transport, Sertifikat"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/60">No job selected.</p>
          )}
        </CmsItemEditModal>
      </CmsSectionShell>
    </StudioShell>
  );
}