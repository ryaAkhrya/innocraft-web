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
    <Section id="projects" className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          eyebrow="Proyek"
          title={t.projects.title}
          description={t.projects.description}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {projects.map((item) => {
            const externalUrl =
              item.projectUrl && item.projectUrl.trim().length > 0
                ? item.projectUrl
                : null;

            return (
              <MotionWrapper
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-soft transition-all duration-300 hover:shadow-lg"
              >
                <div className="aspect-video overflow-hidden">
                  {item.imageUrl && item.imageUrl.trim().length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
<img
  src={item.imageUrl}
  alt={item.title}
  className="h-full w-full rounded-t-3xl object-cover transition-transform duration-500 group-hover:scale-105"
  loading="lazy"
/>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-t-3xl border-b border-border bg-gradient-to-br from-primaryBg/50 to-white">
                      <span className="text-sm font-medium text-paragraph/60">
                        No image available
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-grow flex-col p-6">
                  <h3 className="text-xl font-semibold text-heading">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-grow text-sm leading-relaxed text-paragraph">
                    {item.description}
                  </p>
                  {item.ageRange && (
                    <div className="mt-4 text-xs text-paragraph/70">
                      {item.ageRange} • {item.duration}
                    </div>
                  )}
                </div>
                <div className="p-6 pt-0">
                  {externalUrl ? (
                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PrimaryButton asChild>
                        <span className="inline-flex items-center">
                          {item.ctaText || "Lihat Proyek"}
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </span>
                      </PrimaryButton>
                    </a>
                  ) : (
                    <PrimaryButton asChild disabled>
                      <span className="inline-flex items-center opacity-60">
                        {item.ctaText || "Lihat Proyek"}
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </span>
                    </PrimaryButton>
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