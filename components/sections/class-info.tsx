"use client";

import { CalendarDays, Clock3, MapPin, Sparkles } from "lucide-react";
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

export function ClassInfo() {
  const { t } = useLanguage();

  const { value: saved } = useMockCmsState<StudioProgramData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioProgramData,
  });

  // Collect all features from all programs as the facilities list
  const facilities = saved.programs.flatMap((p) => p.features);

  return (
    <Section className="py-20 sm:py-32 relative overflow-hidden bg-websiteBg/85">
      <Container className="relative">
        <MotionWrapper className="relative">
          <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 sm:translate-x-3 sm:translate-y-3 rounded-[2rem] sm:rounded-[3.5rem] border-2 border-white bg-peach pointer-events-none shadow-soft-sm" />
          
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3.5rem] border-4 border-white bg-white dark:bg-slate-800 p-6 shadow-soft-lg sm:p-12 lg:p-16 z-10">
            {/* Playful blob inside container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-softYellow/30 blur-[80px] rounded-full pointer-events-none" />
            
            <SectionTitle
              eyebrow={t.classInfo.eyebrow}
              title={t.classInfo.title}
              description={t.classInfo.description}
              className="mb-16 max-w-2xl relative z-10"
              highlightWord="Fasilitas"
              highlightColor="green"
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch relative z-10">
              <div className="flex flex-col justify-between rounded-[2rem] sm:rounded-[3rem] bg-softGreen border-2 border-white p-6 sm:p-10 shadow-soft-sm transition-transform duration-500 sm:hover:-translate-y-2">
                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-white/50 shadow-sm text-freshGreen transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <CalendarDays className="h-7 w-7 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#101B35]/70 dark:text-[#101B35]/70 mb-1.5">Jadwal</h4>
                      <p className="text-xl font-display font-bold text-[#101B35] dark:text-[#101B35]">{t.classInfo.schedule}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-white/50 shadow-sm text-freshGreen transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <Clock3 className="h-7 w-7 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#101B35]/70 dark:text-[#101B35]/70 mb-1.5">Durasi</h4>
                      <p className="text-xl font-display font-bold text-[#101B35] dark:text-[#101B35]">{t.classInfo.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-white/50 shadow-sm text-freshGreen transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <Sparkles className="h-7 w-7 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#101B35]/70 dark:text-[#101B35]/70 mb-1.5">Usia</h4>
                      <p className="text-xl font-display font-bold text-[#101B35] dark:text-[#101B35]">{t.classInfo.age}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border border-white/50 shadow-sm text-freshGreen transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <MapPin className="h-7 w-7 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#101B35]/70 dark:text-[#101B35]/70 mb-1.5">Lokasi</h4>
                      <p className="text-xl font-display font-bold text-[#101B35] dark:text-[#101B35]">{t.classInfo.note}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border-2 border-white bg-white shadow-soft-sm transition-transform sm:hover:-translate-y-1 hover:shadow-soft duration-500">
                  <div className="flex aspect-video w-full items-center justify-center bg-gray-50">
                    <iframe
                      title="Lokasi Innocraft"
                      src="https://maps.google.com/maps?q=Innocraft%20Kursus%20Minecraft%20Berbasis%20Coding&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="border-t-2 border-white p-6 bg-white dark:bg-slate-800">
                    <h4 className="text-lg font-display font-bold text-heading">{t.classInfo.locationName || "Innocraft: Kursus Minecraft Berbasis Coding"}</h4>
                    <a
                      href="https://maps.app.goo.gl/Z5thHsW3zbN3dyGp9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-freshGreen hover:text-heading transition-colors"
                    >
                      {t.classInfo.openInMaps || "Buka di Google Maps"} <span className="text-lg leading-none">→</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col rounded-[2rem] sm:rounded-[3rem] bg-softBlue border-2 border-white p-6 sm:p-10 shadow-soft-sm relative overflow-hidden transition-transform duration-500 sm:hover:-translate-y-2">
                <div className="relative z-10">
                  <h3 className="text-3xl font-display font-extrabold text-[#101B35] dark:text-[#101B35]">
                    {t.classInfo.eyebrow}
                  </h3>
                  <ul className="mt-10 space-y-4">
                    {(facilities.length > 0 ? facilities : t.classInfo.facilities).map((facility) => (
                      <li
                        key={facility}
                        className="inline-flex w-full items-center gap-4 rounded-[1.5rem] sm:rounded-2xl border-2 border-white bg-white dark:bg-slate-800 px-6 py-4 text-lg font-medium text-heading shadow-soft-sm transition-transform duration-500 sm:hover:-translate-y-1 hover:shadow-soft"
                      >
                        <div className="h-3 w-3 shrink-0 rounded-full bg-skyBlue shadow-color-blue" />
                        {facility}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}