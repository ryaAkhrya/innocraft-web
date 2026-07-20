"use client";

import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { recruitmentJobsMock } from "./recruitment-mock-data";
import type { RecruitmentJob, RecruitmentModalPayload } from "./recruitment-types";
import { RecruitmentModal } from "./recruitment-modal";

import {
  defaultStudioRecruitmentData,
  type StudioJob,
} from "@/lib/studio/mock-recruitment";

import { supabase } from "@/lib/supabase/client";


function toRecruitmentJob(row: {
  id: string;
  title: string | null;
  employment_type: string | null;
  location: string | null;
  status: string | null;
  description: string | null;
  requirements: string[] | null;
}): StudioJob {
  return {
    id: String(row.id),
    position: row.title ?? "",
    employmentType: row.employment_type ?? "",
    location: row.location ?? "",
    status: row.status === "Closed" ? "Closed" : "Open",
    description: row.description ?? "",
    requirements: row.requirements ?? [],
  };
}

function StatusBadge({ status }: { status: RecruitmentJob["status"] }) {
  const isOpen = status === "open";

  return (
    <span
      className={
        "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] " +
        (isOpen
          ? "border-border bg-primaryBg/30 text-heading"
          : "border-border bg-white/60 text-paragraph")
      }
    >
      {isOpen ? "Open" : "Closed"}
    </span>
  );
}

function RecruitmentCard({
  job,
  onView,
}: Readonly<{ job: RecruitmentJob; onView: (job: RecruitmentJob) => void }>) {
  return (
    <MotionWrapper className="group rounded-[2rem] border border-border bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-heading">{job.position}</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={job.status} />
            <span className="text-sm font-medium text-paragraph">{job.employmentType}</span>
            <span className="text-sm font-medium text-paragraph">•</span>
            <span className="text-sm font-medium text-paragraph">{job.location}</span>
          </div>
        </div>

        <div className="hidden rounded-full border border-border bg-websiteBg px-3 py-2 text-xs font-semibold text-heading/70 sm:block">
          INNOCRAFT
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-paragraph">{job.shortDescription}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          className="rounded-full border border-buttonBg bg-buttonBg px-5 py-3 text-sm font-semibold text-white transition hover:bg-buttonHover"
          onClick={() => onView(job)}
        >
          Lihat Detail
        </button>
      </div>
    </MotionWrapper>
  );
}

function cmsStatusToRecruitment(cmsStatus: string): RecruitmentJob["status"] {
  return cmsStatus.toLowerCase() === "open" ? "open" : "closed";
}

function cmsJobToRecruitmentJob(cms: StudioJob, index: number): RecruitmentJob {
  const mock = recruitmentJobsMock[index] ?? recruitmentJobsMock[0];
  return {
    id: cms.id,
    position: cms.position,
    employmentType: cms.employmentType as RecruitmentJob["employmentType"],
    location: cms.location as RecruitmentJob["location"],
    shortDescription: cms.description,
    status: cmsStatusToRecruitment(cms.status),
    jobDescription: mock.jobDescription,
    requirements: cms.requirements,
    benefits: mock.benefits,
    workLocation: mock.workLocation,
  };
}

export function RecruitmentSection() {
  // Hydration-safe: render default on first pass
  const [cmsJobs, setCmsJobs] = useState<StudioJob[]>(
    defaultStudioRecruitmentData.jobs
  );

  const jobs = useMemo<RecruitmentJob[]>(() => {
    return cmsJobs.map((cms, idx) => cmsJobToRecruitmentJob(cms, idx));
  }, [cmsJobs]);

  const [selected, setSelected] = useState<RecruitmentJob | null>(null);
  const [open, setOpen] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    let cancelled = false;

    async function loadRecruitment() {
      try {
        const { data, error } = await supabase
          .from("recruitment")
          .select("id, title, employment_type, location, status, description, requirements, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error("Failed to load recruitment:", error);
          return;
        }

        if (data && data.length > 0) {
          setCmsJobs(data.map(toRecruitmentJob));
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

  const payload: RecruitmentModalPayload | null = selected ? { job: selected } : null;

  return (
    <Section className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          eyebrow="Open Recruitment"
          title="Bergabung Bersama Tim INNOCRAFT"
          description="Kami mencari mentor dan individu kreatif yang ingin membantu anak-anak belajar teknologi melalui pengalaman yang menyenangkan."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {jobs.map((job) => (
            <RecruitmentCard
              key={job.id}
              job={job}
              onView={(j) => {
                setSelected(j);
                setOpen(true);
              }}
            />
          ))}
        </div>

        <RecruitmentModal
          payload={payload}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        />
      </Container>
    </Section>
  );
}