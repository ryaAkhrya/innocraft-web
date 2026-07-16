"use client";

import { Clock3, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { useMemo } from "react";

import { useLanguage } from "@/lib/i18n/language-provider";
import { useMockCmsState } from "@/lib/studio/cms-storage";
import {
  defaultStudioContactData,
  type StudioContactData,
} from "@/lib/studio/mock-contact";

const STORAGE_KEY = "studio.contact.mock";

export function Contact() {
  const { t } = useLanguage();

  const { value: saved } = useMockCmsState<StudioContactData>({
    storageKey: STORAGE_KEY,
    defaultValue: defaultStudioContactData,
  });

  const data = saved.whatsapp ? saved : defaultStudioContactData;

  const waUrl = data.whatsapp
    ? `https://wa.me/${data.whatsapp.replace(/[^0-9]/g, "")}?text=Halo%20INNOCRAFT,%20saya%20ingin%20menjadwalkan%20kunjungan`
    : "";

  const contactCta = useMemo(
    () => ({
      title: "Jadwalkan Kunjungan",
      subtitle:
        "Datang langsung ke kelas INNOCRAFT untuk melihat bagaimana anak belajar teknologi melalui Minecraft. Konsultasi dan kunjungan gratis.",
      whatsappHeading: "Booking via WhatsApp",
      whatsappDescription:
        "Klik tombol di bawah untuk langsung menghubungi tim INNOCRAFT dan menjadwalkan kunjungan.",
      buttonLabel: "Jadwalkan Kunjungan Sekarang",
      whatsappUrl: waUrl,
    }),
    [waUrl],
  );

  return (
    <Section id="contact" className="py-10 sm:py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr]">
          <MotionWrapper className="rounded-[2rem] border border-border bg-white p-8 shadow-soft sm:p-10">
            <SectionTitle
              eyebrow={t.contact.eyebrow}
              title={contactCta.title}
              description={contactCta.subtitle}
            />

            <div className="mt-8">
              <div className="rounded-[1.75rem] border border-border bg-primaryBg/20 p-7 shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-heading" />
                      <h3 className="text-lg font-semibold text-heading">
                        {contactCta.whatsappHeading}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-paragraph">
                      {contactCta.whatsappDescription}
                    </p>
                  </div>

                  <div className="sm:pt-1">
                    {contactCta.whatsappUrl ? (
                      <a
                        href={contactCta.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full border border-buttonBg bg-buttonBg px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-buttonHover sm:w-auto"
                      >
                        {contactCta.buttonLabel}
                      </a>
                    ) : (
                      <span className="inline-flex w-full items-center justify-center rounded-full border border-border bg-white/60 px-6 py-3 text-sm font-semibold text-paragraph shadow-soft sm:w-auto">
                        {contactCta.buttonLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <MotionWrapper className="rounded-[1.75rem] border border-border bg-white p-6 shadow-soft sm:p-7">
              <div className="space-y-4 text-sm text-paragraph">
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-1 h-5 w-5 text-heading" />
                  <div>
                    <p className="font-semibold text-heading">WhatsApp</p>
                    {data.whatsapp ? (
                      <a
                        href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-paragraph hover:text-heading"
                      >
                        {data.whatsapp}
                      </a>
                    ) : (
                      <p className="mt-1 text-paragraph">{t.contact.whatsapp}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-heading" />
                  <div>
                    <p className="font-semibold text-heading">Email</p>
                    {data.email ? (
                      <a
                        href={`mailto:${data.email}`}
                        className="mt-1 block text-paragraph hover:text-heading"
                      >
                        {data.email}
                      </a>
                    ) : (
                      <p className="mt-1 text-paragraph">{t.contact.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Send className="mt-1 h-5 w-5 text-heading" />
                  <div>
                    <p className="font-semibold text-heading">Instagram</p>
                    {data.instagram ? (
                      <a
                        href={data.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-paragraph hover:text-heading"
                      >
                        {t.contact.instagram}
                      </a>
                    ) : (
                      <p className="mt-1 text-paragraph">{t.contact.instagram}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Send className="mt-1 h-5 w-5 text-heading" />
                  <div>
                    <p className="font-semibold text-heading">TikTok</p>
                    <a
                      href="https://tiktok.com"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-paragraph hover:text-heading"
                    >
                      {t.contact.tiktok}
                    </a>
                  </div>
                </div>
              </div>
            </MotionWrapper>

            <MotionWrapper className="rounded-[1.75rem] border border-border bg-cardBg p-6 shadow-soft sm:p-7">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-heading" />
                <div>
                  <p className="font-semibold text-heading">{t.contact.maps}</p>
                  {data.mapsUrl ? (
                    <a
                      href={data.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-paragraph hover:text-heading"
                    >
                      {data.address}
                    </a>
                  ) : (
                    <p className="mt-1 text-paragraph">{data.address || t.contact.address}</p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex items-start gap-3">
                <Clock3 className="mt-1 h-5 w-5 text-heading" />
                <div>
                  <p className="font-semibold text-heading">Business hours</p>
                  <p className="mt-1 text-sm leading-7 text-paragraph">
                    {data.openingHours || t.contact.hours}
                  </p>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </Container>
    </Section>
  );
}