"use client";

import { ArrowUpRight } from "lucide-react";
import { PrimaryButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";
import {
  defaultStudioProgramData,
  StudioProgramData,
  StudioProgramEntry,
} from "@/lib/studio/mock-program";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";


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
    features: [],
    ctaText: row.cta_text ?? "",
    subtitle: "",
    imageUrl: row.image_url ?? "",
    projectUrl: row.project_url ?? "",
    ageRange: row.age_range ?? "",
    duration: row.duration ?? "",
    category: row.category ?? "",
  };
}

export function Projects() {
  const { t } = useLanguage();

  // Hydration-safe: render default on first pass
  const [projects, setProjects] = useState<StudioProgramEntry[]>(
    defaultStudioProgramData.programs,
  );

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
          setProjects(data.map(toProgramEntry));
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

  if (projects.length === 0) {
    return (
      <Section id="projects" className="py-10 sm:py-16">
        <Container>
          <SectionTitle
            eyebrow="Proyek"
            title={t.projects.title}
            description={t.projects.description}
          />
          <div className="mt-8 text-center">
            <div className="rounded-3xl border border-border bg-white p-8 shadow-soft">
              <p className="text-base text-paragraph">
                Projects coming soon.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="projects" className="py-12 sm:py-24 bg-[#FAF9F8]">
      <Container>
        <div className="mb-12">
          <SectionTitle
            eyebrow="Proyek"
            title={t.projects.title}
            description={t.projects.description}
          />
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {projects.map((item, index) => {
            const externalUrl =
              item.projectUrl && item.projectUrl.trim().length > 0
                ? item.projectUrl
                : null;

            // Alternate colors for the offset shadow
            const shadows = [
              "shadow-[8px_8px_0_rgba(146,64,14,1)]", // Energy (Orange/Brown)
              "shadow-[8px_8px_0_rgba(30,58,138,1)]", // Blue
              "shadow-[8px_8px_0_rgba(74,93,35,1)]",  // Sage (Green)
              "shadow-[8px_8px_0_rgba(107,33,168,1)]" // Lavender (Purple)
            ];
            const shadow = shadows[index % shadows.length];

            return (
              <MotionWrapper
                key={item.id}
                className={`group flex flex-col overflow-hidden rounded-[2rem] border-4 border-heading bg-white transition-all duration-300 hover:-translate-y-2 hover:translate-x-1 ${shadow}`}
              >
                <div className="aspect-[4/3] sm:aspect-video overflow-hidden border-b-4 border-heading relative">
                  <div className="absolute inset-0 bg-heading/5 z-10 transition-opacity group-hover:opacity-0" />
                  {item.imageUrl && item.imageUrl.trim().length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-100">
                      <span className="text-sm font-medium text-paragraph/60">
                        No image available
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-grow flex-col p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-heading">
                    {item.title}
                  </h3>
                  {item.ageRange && (
                    <div className="mt-2 text-sm font-bold tracking-widest uppercase text-heading/50">
                      {item.ageRange} • {item.duration}
                    </div>
                  )}
                  <p className="mt-4 flex-grow text-base leading-relaxed text-paragraph">
                    {item.description}
                  </p>
                </div>
                <div className="p-6 sm:p-8 pt-0 mt-4">
                  {externalUrl ? (
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border-2 border-heading bg-white px-6 py-3.5 text-sm font-bold text-heading transition-all hover:bg-primaryBg hover:shadow-[0_4px_0_rgba(15,23,42,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none"
                    >
                      {item.ctaText || "Lihat Proyek"}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  ) : (
                    <button disabled className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border-2 border-border bg-gray-50 px-6 py-3.5 text-sm font-bold text-paragraph/50 cursor-not-allowed">
                      {item.ctaText || "Lihat Proyek"}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </button>
                  )}
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}