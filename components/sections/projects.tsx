"use client";

import { ArrowUpRight } from "lucide-react";
import { PrimaryButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";
import { useMockCmsState } from "@/lib/studio/cms-storage";
import {
  defaultStudioProgramData,
  type StudioProgramData,
} from "@/lib/studio/mock-program";

const STORAGE_KEY = "studio.program.mock";

export function Projects() {
  const { t } = useLanguage();

  const { value: saved } = useMockCmsState<StudioProgramData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioProgramData,
  });

  const projects = saved.programs.length > 0 ? saved.programs : defaultStudioProgramData.programs;

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