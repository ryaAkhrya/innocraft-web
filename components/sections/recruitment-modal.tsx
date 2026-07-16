"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RecruitmentJob, RecruitmentModalPayload } from "./recruitment-types";
import { buildRecruitmentWhatsappUrl } from "./recruitment-whatsapp";


function TitleBlock({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-heading">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-paragraph">{subtitle}</p>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 list-disc pl-5 text-sm leading-7 text-paragraph">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function RecruitmentModal({
  payload,
  open,
  onClose,
}: Readonly<{
  payload: RecruitmentModalPayload | null;
  open: boolean;
  onClose: () => void;
}>) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !payload) return null;

  const job: RecruitmentJob = payload.job;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-heading/20"
        aria-label="Close modal"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative w-[92vw] max-w-3xl rounded-[2rem] border border-border bg-white/95 shadow-[0_30px_120px_-60px_rgba(15,23,42,0.35)]",
          "backdrop-blur",
        )}
      >
        <div className="flex items-start justify-between gap-4 p-6 sm:p-8">
          <TitleBlock
            title={job.position}
            subtitle={`${job.employmentType} • ${job.location}`}
          />

          <button
            type="button"
            className="rounded-full border border-border bg-white/70 p-2 text-heading transition hover:bg-primaryBg/20"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-7 sm:px-8 sm:pb-8">
          <div className="rounded-[1.5rem] border border-border bg-websiteBg p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-heading/70">
              Job Description
            </div>
            <p className="mt-3 text-sm leading-7 text-paragraph">{job.jobDescription}</p>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border bg-white p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-heading/70">
                Requirements
              </div>
              <List items={job.requirements} />
            </div>

            <div className="rounded-[1.5rem] border border-border bg-white p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-heading/70">
                Benefits
              </div>
              <List items={job.benefits} />
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-border bg-white p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-heading/70">
              Work Location
            </div>
            <p className="mt-3 text-sm leading-7 text-paragraph">{job.workLocation}</p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <a
                href={buildRecruitmentWhatsappUrl(job.position)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full border border-buttonBg bg-buttonBg px-6 py-3 text-sm font-semibold text-white transition hover:bg-buttonHover sm:w-auto"
              >
                Hubungi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

