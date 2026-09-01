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
      <Section id="projects" className="py-20 sm:py-32">
        <Container>
          <SectionTitle
            eyebrow="Proyek"
            title={t.projects.title}
            description={t.projects.description}
          />
          <div className="mt-8 text-center">
            <div className="rounded-[3rem] border-4 border-white bg-white p-8 shadow-soft-lg">
              <p className="text-base font-medium text-paragraph">
                Projects coming soon.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="projects" className="py-20 sm:py-32 bg-websiteBgEnd/85 relative overflow-hidden">
      {/* Playful scattered blobs */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-peach/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-softBlue/30 rounded-full blur-[100px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="mb-16">
          <SectionTitle
            eyebrow="Proyek"
            title={t.projects.title}
            description={t.projects.description}
            highlightWord="proses"
            highlightColor="peach"
          />
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {projects.map((item, index) => {
            const externalUrl =
              item.projectUrl && item.projectUrl.trim().length > 0
                ? item.projectUrl
                : null;

            // V4 Playful Solid Color Variants
            const cardColors = [
              "bg-peach", 
              "bg-softBlue", 
              "bg-softYellow", 
              "bg-softGreen" 
            ];
            const badgeColors = [
              "bg-white text-coral border-2 border-white",
              "bg-white text-skyBlue border-2 border-white",
              "bg-white text-heading border-2 border-white",
              "bg-white text-freshGreen border-2 border-white"
            ];
            
            const cardBg = cardColors[index % cardColors.length];
            const badgeBg = badgeColors[index % badgeColors.length];

            return (
              <MotionWrapper
                key={item.id}
                className="group relative"
              >
                {/* V4 offset playful shadow block */}
                <div className={`absolute inset-0 translate-x-1.5 translate-y-1.5 sm:translate-x-3 sm:translate-y-3 rounded-[2rem] sm:rounded-[3rem] border-2 border-white ${cardBg} pointer-events-none transition-transform duration-500 sm:group-hover:translate-x-4 sm:group-hover:translate-y-4`} />

                <div className="relative flex flex-col overflow-hidden rounded-[2rem] sm:rounded-[3rem] border-4 border-white bg-white dark:bg-slate-800 transition-transform duration-500 sm:hover:-translate-y-2 z-10 h-full shadow-soft-sm">
                  <div className={`aspect-[4/3] sm:aspect-video overflow-hidden border-b-4 border-white relative ${cardBg}`}>
                    {item.imageUrl && item.imageUrl.trim().length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm font-medium text-heading/50">
                          Tidak ada gambar
                        </span>
                      </div>
                    )}
                    {/* Category Badge */}
                    {item.category && (
                      <div className={`absolute top-6 left-6 z-10 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-sm ${badgeBg}`}>
                        {item.category}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-grow flex-col p-6 sm:p-10 bg-white dark:bg-slate-800">
                    <h3 className="text-3xl font-display font-extrabold text-heading">
                      {item.title}
                    </h3>
                    {item.ageRange && (
                      <div className="mt-4 text-sm font-bold tracking-widest uppercase text-skyBlue">
                        {item.ageRange} • {item.duration}
                      </div>
                    )}
                    <p className="mt-5 flex-grow text-lg font-medium leading-relaxed text-paragraph">
                      {item.description}
                    </p>
                  </div>
                  <div className="p-6 sm:p-10 pt-0 bg-white dark:bg-slate-800">
                    {externalUrl ? (
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border-2 border-white ${cardBg} px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#101B35] dark:text-[#101B35] transition-all hover:brightness-105 shadow-soft-sm hover:-translate-y-1 hover:shadow-soft`}
                      >
                        {item.ctaText || "Lihat Proyek"}
                        <ArrowUpRight className="ml-3 h-5 w-5" />
                      </a>
                    ) : (
                      <button disabled className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border-2 border-border/50 bg-websiteBgEnd dark:bg-slate-700 px-8 py-4 text-sm font-bold uppercase tracking-widest text-heading/30 cursor-not-allowed">
                        {item.ctaText || "Lihat Proyek"}
                        <ArrowUpRight className="ml-3 h-5 w-5 opacity-50" />
                      </button>
                    )}
                  </div>
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}