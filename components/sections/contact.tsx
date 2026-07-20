"use client";

import { Clock3, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

import { useLanguage } from "@/lib/i18n/language-provider";

import {
  defaultStudioContactData,
  type StudioContactData,
} from "@/lib/studio/mock-contact";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";


function toContactData(row: {
  company_name: string | null;
  address: string | null;
  whatsapp: string | null;
  email: string | null;
  maps_url: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  opening_hours: string | null;
}): StudioContactData {
  return {
    companyName: row.company_name ?? "",
    address: row.address ?? "",
    whatsapp: row.whatsapp ?? "",
    email: row.email ?? "",
    mapsUrl: row.maps_url ?? "",
    instagram: row.instagram ?? "",
    facebook: row.facebook ?? "",
    tiktok: row.tiktok ?? "",
    openingHours: row.opening_hours ?? "",
  };
}

export function Contact() {
  const { t } = useLanguage();

  // Hydration-safe: render default on first pass
  const [contactData, setContactData] = useState<StudioContactData>(
    defaultStudioContactData
  );

  useEffect(() => {
    let cancelled = false;

    async function loadContact() {
      try {
        const { data, error } = await supabase
          .from("contact")
          .select("id, company_name, address, whatsapp, email, maps_url, instagram, facebook, tiktok, opening_hours")
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.error("Failed to load contact:", error.message, error.code, error.details);
          return;
        }

        if (data) {
          setContactData(toContactData(data));
        }
        // If no data, keep defaults
      } catch (e) {
        console.error("Error loading contact:", e);
      }
    }

    loadContact();
    return () => {
      cancelled = true;
    };
  }, []);

  const waUrl = contactData.whatsapp
    ? `https://wa.me/${contactData.whatsapp.replace(/[^0-9]/g, "")}?text=Halo%20INNOCRAFT,%20saya%20ingin%20menjadwalkan%20kunjungan`
    : "";

  return (
    <Section id="contact" className="py-10 sm:py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr]">
          <MotionWrapper className="rounded-[2rem] border border-border bg-white p-8 shadow-soft sm:p-10">
            <SectionTitle
              eyebrow={t.contact.eyebrow}
              title="Hubungi kami untuk pertanyaan, kunjungan, atau informasi kelas."
              description={t.contact.description}
            />

            <div className="mt-8">
              <div className="rounded-[1.75rem] border border-border bg-primaryBg/20 p-7 shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-heading" />
                      <h3 className="text-lg font-semibold text-heading">
                        Booking via WhatsApp
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-paragraph">
                      Klik tombol di bawah untuk langsung menghubungi tim INNOCRAFT dan menjadwalkan kunjungan.
                    </p>
                  </div>

                  <div className="sm:pt-1">
                    {waUrl ? (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full border border-buttonBg bg-buttonBg px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-buttonHover sm:w-auto"
                      >
                        Jadwalkan Kunjungan Sekarang
                      </a>
                    ) : (
                      <span className="inline-flex w-full items-center justify-center rounded-full border border-border bg-white/60 px-6 py-3 text-sm font-semibold text-paragraph shadow-soft sm:w-auto">
                        Jadwalkan Kunjungan Sekarang
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
                    {contactData.whatsapp ? (
                      <a
                        href={`https://wa.me/${contactData.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-paragraph hover:text-heading"
                      >
                        {contactData.whatsapp}
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
                    {contactData.email ? (
                      <a
                        href={`mailto:${contactData.email}`}
                        className="mt-1 block text-paragraph hover:text-heading"
                      >
                        {contactData.email}
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
                    {contactData.instagram ? (
                      <a
                        href={contactData.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-paragraph hover:text-heading"
                      >
                        {contactData.instagram}
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
                    {contactData.tiktok ? (
                      <a
                        href={contactData.tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-paragraph hover:text-heading"
                      >
                        {contactData.tiktok}
                      </a>
                    ) : (
                      <p className="mt-1 text-paragraph">{t.contact.tiktok}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Send className="mt-1 h-5 w-5 text-heading" />
                  <div>
                    <p className="font-semibold text-heading">Facebook</p>
                    {contactData.facebook ? (
                      <a
                        href={contactData.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-paragraph hover:text-heading"
                      >
                        {contactData.facebook}
                      </a>
                    ) : (
                      <p className="mt-1 text-paragraph">
                        {"https://facebook.com/innocraft.id"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </MotionWrapper>

            <MotionWrapper className="rounded-[1.75rem] border border-border bg-cardBg p-6 shadow-soft sm:p-7">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-heading" />
                <div>
                  <p className="font-semibold text-heading">{t.contact.maps}</p>
                  {contactData.mapsUrl ? (
                    <a
                      href={contactData.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-paragraph hover:text-heading"
                    >
                      {contactData.address}
                    </a>
                  ) : (
                    <p className="mt-1 text-paragraph">{contactData.address || t.contact.address}</p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex items-start gap-3">
                <Clock3 className="mt-1 h-5 w-5 text-heading" />
                <div>
                  <p className="font-semibold text-heading">Business hours</p>
                  <p className="mt-1 text-sm leading-7 text-paragraph">
                    {contactData.openingHours || t.contact.hours}
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