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
    <Section id="contact" className="py-20 sm:py-32 bg-websiteBg relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-softGreen/30 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <MotionWrapper className="relative flex flex-col justify-between h-full group">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[3.5rem] bg-softGreen border-2 border-white pointer-events-none shadow-soft-sm transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />
            <div className="relative z-10 flex flex-col justify-between h-full rounded-[3.5rem] border-4 border-white bg-white p-8 sm:p-12 shadow-soft-lg overflow-hidden transition-transform duration-500 group-hover:-translate-y-2 bg-gradient-to-br from-white to-softGreen/20">
              <div className="relative z-10">
                <SectionTitle
                  eyebrow={t.contact.eyebrow}
                  title="Hubungi kami untuk pertanyaan, kunjungan, atau informasi kelas."
                  description={t.contact.description}
                  highlightWord="kunjungan"
                  highlightColor="green"
                />

                <div className="mt-16 space-y-10">
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] border-2 border-white shadow-soft-sm">
                      <MessageCircle className="h-10 w-10 text-white stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold text-heading">Booking via WhatsApp</h3>
                      <p className="mt-3 text-lg font-medium text-paragraph">Klik tombol di bawah untuk langsung menghubungi tim INNOCRAFT.</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    {waUrl ? (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border-2 border-white bg-[#25D366] px-10 py-5 text-sm font-bold uppercase tracking-widest text-white shadow-soft-lg transition-all hover:-translate-y-1 hover:shadow-soft-xl hover:brightness-110 active:translate-y-0"
                      >
                        Jadwalkan Kunjungan
                      </a>
                    ) : (
                      <span className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border-2 border-border bg-gray-100 px-10 py-5 text-sm font-bold uppercase tracking-widest text-gray-400 cursor-not-allowed">
                        Jadwalkan Kunjungan
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>

          <div className="grid gap-8">
            <MotionWrapper className="relative group">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[3rem] bg-softBlue border-2 border-white pointer-events-none shadow-soft-sm transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />
              <div className="relative rounded-[3rem] border-4 border-white bg-white p-8 sm:p-10 shadow-soft-lg transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="mb-8 font-display font-extrabold text-heading text-xl uppercase tracking-widest">Social Media & Email</h3>
                <div className="space-y-6 text-base text-heading font-medium">
                  <div className="flex items-center gap-6 p-4 rounded-3xl hover:bg-softGreen/30 transition-colors group/item">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border-2 border-white shadow-sm text-[#25D366] group-hover/item:-translate-y-1 group-hover/item:scale-110 group-hover/item:-rotate-6 transition-transform duration-500">
                      <MessageCircle className="h-7 w-7 stroke-[2.5]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-heading/50 uppercase tracking-widest mb-1.5">WhatsApp</p>
                      {contactData.whatsapp ? (
                        <a href={`https://wa.me/${contactData.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="text-lg font-display font-bold hover:text-freshGreen transition-colors">
                          {contactData.whatsapp}
                        </a>
                      ) : <p className="text-lg font-display font-bold">{t.contact.whatsapp}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-4 rounded-3xl hover:bg-softBlue/30 transition-colors group/item">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border-2 border-white shadow-sm text-skyBlue group-hover/item:-translate-y-1 group-hover/item:scale-110 group-hover/item:-rotate-6 transition-transform duration-500">
                      <Mail className="h-7 w-7 stroke-[2.5]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-heading/50 uppercase tracking-widest mb-1.5">Email</p>
                      {contactData.email ? (
                        <a href={`mailto:${contactData.email}`} className="text-lg font-display font-bold hover:text-skyBlue transition-colors">
                          {contactData.email}
                        </a>
                      ) : <p className="text-lg font-display font-bold">{t.contact.email}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-4 rounded-3xl hover:bg-peach/30 transition-colors group/item">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border-2 border-white shadow-sm text-coral group-hover/item:-translate-y-1 group-hover/item:scale-110 group-hover/item:-rotate-6 transition-transform duration-500">
                      <Send className="h-7 w-7 stroke-[2.5]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-heading/50 uppercase tracking-widest mb-1.5">Instagram</p>
                      {contactData.instagram ? (
                        <a href={contactData.instagram} target="_blank" rel="noreferrer" className="text-lg font-display font-bold hover:text-coral transition-colors">
                          {contactData.instagram}
                        </a>
                      ) : <p className="text-lg font-display font-bold">{t.contact.instagram}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </MotionWrapper>

            <MotionWrapper className="relative group">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[3rem] bg-softYellow border-2 border-white pointer-events-none shadow-soft-sm transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />
              <div className="relative rounded-[3rem] border-4 border-white bg-white p-8 sm:p-10 shadow-soft-lg transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="mb-8 font-display font-extrabold text-heading text-xl uppercase tracking-widest">Lokasi & Waktu</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-6 group/item">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border-2 border-white shadow-sm text-heading group-hover/item:-translate-y-1 group-hover/item:scale-110 group-hover/item:-rotate-6 transition-transform duration-500">
                      <MapPin className="h-7 w-7 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-heading/50 uppercase tracking-widest mb-2">{t.contact.maps}</p>
                      {contactData.mapsUrl ? (
                        <a href={contactData.mapsUrl} target="_blank" rel="noreferrer" className="text-base font-medium text-heading hover:text-coral transition-colors leading-relaxed block">
                          {contactData.address}
                        </a>
                      ) : (
                        <p className="text-base font-medium text-heading leading-relaxed">{contactData.address || t.contact.address}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-6 group/item">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white border-2 border-white shadow-sm text-heading group-hover/item:-translate-y-1 group-hover/item:scale-110 group-hover/item:-rotate-6 transition-transform duration-500">
                      <Clock3 className="h-7 w-7 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-heading/50 uppercase tracking-widest mb-2">Business Hours</p>
                      <p className="text-base font-medium text-heading">
                        {contactData.openingHours || t.contact.hours}
                      </p>
                    </div>
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