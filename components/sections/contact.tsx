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

  const waUrl = "https://wa.me/6287878791238?text=Halo%20INNOCRAFT,%20saya%20ingin%20menjadwalkan%20kunjungan";

  return (
    <Section id="contact" className="py-12 sm:py-24 bg-white relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-accentSage/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <MotionWrapper className="relative flex flex-col justify-between h-full rounded-[2.5rem] border-4 border-heading bg-[#FAF9F8] p-8 sm:p-12 shadow-[12px_12px_0_rgba(15,23,42,1)]">
            <div>
              <SectionTitle
                eyebrow={t.contact.eyebrow}
                title="Hubungi kami untuk pertanyaan, kunjungan, atau informasi kelas."
                description={t.contact.description}
              />

              <div className="mt-12 space-y-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white border-2 border-heading shadow-[4px_4px_0_rgba(15,23,42,1)]">
                    <MessageCircle className="h-8 w-8 text-heading" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-heading">Booking via WhatsApp</h3>
                    <p className="mt-2 text-base text-paragraph">Klik tombol di bawah untuk langsung menghubungi tim INNOCRAFT.</p>
                  </div>
                </div>

                <div className="pt-4">
                  {waUrl ? (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border-2 border-heading bg-[#25D366] px-8 py-4 text-base font-bold text-white shadow-[0_6px_0_rgba(21,128,61,1)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(21,128,61,1)] active:translate-y-[6px] active:shadow-none"
                    >
                      Jadwalkan Kunjungan Sekarang
                    </a>
                  ) : (
                    <span className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border-2 border-heading bg-gray-200 px-8 py-4 text-base font-bold text-gray-500 shadow-[0_6px_0_rgba(15,23,42,0.2)] cursor-not-allowed">
                      Jadwalkan Kunjungan Sekarang
                    </span>
                  )}
                </div>
              </div>
            </div>
          </MotionWrapper>

          <div className="grid gap-6">
            <MotionWrapper className="rounded-[2rem] border-2 border-border bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="mb-6 font-bold text-heading text-lg uppercase tracking-wider">Social Media & Email</h3>
              <div className="space-y-4 text-sm text-paragraph font-medium">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">WhatsApp</p>
                    {contactData.whatsapp ? (
                      <a href={`https://wa.me/${contactData.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="text-heading hover:text-primaryBg transition-colors">
                        {contactData.whatsapp}
                      </a>
                    ) : <p>{t.contact.whatsapp}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email</p>
                    {contactData.email ? (
                      <a href={`mailto:${contactData.email}`} className="text-heading hover:text-primaryBg transition-colors">
                        {contactData.email}
                      </a>
                    ) : <p>{t.contact.email}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-700">
                    <Send className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Instagram</p>
                    {contactData.instagram ? (
                      <a href={contactData.instagram} target="_blank" rel="noreferrer" className="text-heading hover:text-primaryBg transition-colors">
                        {contactData.instagram}
                      </a>
                    ) : <p>{t.contact.instagram}</p>}
                  </div>
                </div>
              </div>
            </MotionWrapper>

            <MotionWrapper className="rounded-[2rem] border-2 border-border bg-primaryBg/5 p-6 sm:p-8 shadow-sm">
              <h3 className="mb-6 font-bold text-heading text-lg uppercase tracking-wider">Lokasi & Waktu</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-border shadow-sm text-heading">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t.contact.maps}</p>
                    {contactData.mapsUrl ? (
                      <a href={contactData.mapsUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-heading hover:text-primaryBg transition-colors">
                        {contactData.address}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-heading">{contactData.address || t.contact.address}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-border shadow-sm text-heading">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Business Hours</p>
                    <p className="text-sm font-semibold text-heading">
                      {contactData.openingHours || t.contact.hours}
                    </p>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </Container>
    </Section>
  );
}