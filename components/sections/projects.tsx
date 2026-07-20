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

  return (
    <Section id="projects" className="py-10 sm:py-16">
      <Container>
        <SectionTitle
          eyebrow="Proyek"
          title={t.projects.title}
          description={t.projects.description}
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2 items-stretch">
          {projects.map((item) => {
            const externalUrl =
              item.projectUrl && item.projectUrl.trim().length > 0
                ? item.projectUrl
                : null;

            return (
              <MotionWrapper
                key={item.id}
                className="group flex flex-col h-full rounded-[2rem] border border-border bg-white p-6 shadow-soft"
              >
                <div className="rounded-[1.5rem] border border-border overflow-hidden">
                  <div className="aspect-video w-full bg-gradient-to-br from-primaryBg/60 via-white to-white">
                    {item.imageUrl && item.imageUrl.trim().length > 0 ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                </div>
                <div className="mt-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-heading">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-paragraph">
                    {item.description}
                  </p>
                </div>
                <div className="mt-auto self-start">
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
                    <PrimaryButton asChild>
                      <span className="inline-flex items-center opacity-50 cursor-not-allowed">
                        {item.ctaText || "Lihat Proyek"}
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