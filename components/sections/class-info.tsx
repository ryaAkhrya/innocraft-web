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
    <Section className="py-12 sm:py-24 relative overflow-hidden bg-websiteBg">
      <Container className="relative">
        <MotionWrapper className="relative overflow-hidden rounded-[2.5rem] border-2 border-border bg-white p-8 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-12">
          {/* Decorative geometry */}
          <div className="absolute top-0 right-0 h-32 w-32 bg-accentLavender/20" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />

          <SectionTitle
            eyebrow={t.classInfo.eyebrow}
            title={t.classInfo.title}
            description={t.classInfo.description}
            className="mb-10 max-w-2xl"
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-between rounded-[2rem] border-2 border-border bg-[#FAF9F8] p-8 shadow-sm">
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border-2 border-border shadow-sm text-primaryBg">
                    <CalendarDays className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-heading/50 mb-1">Jadwal</h4>
                    <p className="font-semibold text-heading">{t.classInfo.schedule}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border-2 border-border shadow-sm text-accentDigitalBlue">
                    <Clock3 className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-heading/50 mb-1">Durasi</h4>
                    <p className="font-semibold text-heading">{t.classInfo.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border-2 border-border shadow-sm text-accentEnergy">
                    <Sparkles className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-heading/50 mb-1">Usia</h4>
                    <p className="font-semibold text-heading">{t.classInfo.age}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border-2 border-border shadow-sm text-accentSage">
                    <MapPin className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-heading/50 mb-1">Lokasi</h4>
                    <p className="font-semibold text-heading">{t.classInfo.note}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 overflow-hidden rounded-[1.5rem] border-2 border-border bg-white shadow-sm transition-transform hover:-translate-y-1 duration-300">
                <div className="flex h-[180px] w-full items-center justify-center bg-gray-100 sm:h-[220px]">
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
                <div className="border-t-2 border-border p-5 bg-white">
                  <h4 className="font-bold text-heading">{t.classInfo.locationName || "Innocraft: Kursus Minecraft Berbasis Coding"}</h4>
                  <a
                    href="https://maps.app.goo.gl/Z5thHsW3zbN3dyGp9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-primaryBg hover:opacity-80 transition-opacity"
                  >
                    {t.classInfo.openInMaps || "Buka di Google Maps"} <span className="text-lg leading-none">→</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-[2rem] border-2 border-border bg-primaryBg/10 p-8 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 blur-[40px] rounded-full" />
              <div className="relative z-10">
                <h3 className="text-2xl font-extrabold text-heading">
                  {t.classInfo.eyebrow}
                </h3>
                <ul className="mt-8 space-y-4">
                  {(facilities.length > 0 ? facilities : t.classInfo.facilities).map((facility) => (
                    <li
                      key={facility}
                      className="inline-flex w-full items-center gap-3 rounded-xl border-2 border-white bg-white/80 px-5 py-3.5 text-base font-semibold text-heading shadow-sm transition-all hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="h-2 w-2 shrink-0 bg-primaryBg" />
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}