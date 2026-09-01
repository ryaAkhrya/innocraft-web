"use client";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className}>
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.757 6.162 6.162 6.162 3.405 0 6.162-2.757 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
  </svg>
);

import { useLanguage } from "@/lib/i18n/language-provider";
import {
  defaultStudioMentorData,
  type StudioMentor,
} from "@/lib/studio/mock-mentor";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";


function toMentor(row: {
  id: string;
  photo_url: string | null;
  name: string | null;
  position: string | null;
  description: string | null;
  instagram_url?: string | null;
  whatsapp_url?: string | null;
}) {
  return {
    id: String(row.id),
    photoUrl: row.photo_url ?? "",
    name: row.name ?? "",
    position: row.position ?? "",
    description: row.description ?? "",
    instagramUrl: row.instagram_url ?? "",
    whatsappUrl: row.whatsapp_url ?? "",
  };
}

export function Mentor() {
  const { t } = useLanguage();

  // Hydration-safe: render default on first pass
  const [mentors, setMentors] = useState<StudioMentor[]>(defaultStudioMentorData.mentors);

  useEffect(() => {
    let cancelled = false;

    async function loadMentors() {
      try {
        const { data, error } = await supabase
          .from("mentors")
          .select("id, photo_url, name, position, description, display_order, instagram_url, whatsapp_url")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error("Failed to load mentor:", error);
          return;
        }

        if (data && data.length > 0) {
          setMentors(data.map(toMentor));
        }
        // Keep defaults if no data
      } catch (e) {
        console.error("Error loading mentor:", e);
      }
    }

    loadMentors();
    return () => {
      cancelled = true;
    };
  }, []);

  // Single mentor: larger premium card
  if (mentors.length === 1) {
    const mentor = mentors[0];
    return (
      <Section className="py-20 sm:py-32 bg-websiteBg relative overflow-hidden">
        <Container>
          <MotionWrapper className="relative mx-auto max-w-5xl">
            {/* V4 Playful Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-peach/30 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="rounded-[3.5rem] border-4 border-white bg-white p-8 sm:p-12 lg:p-16 shadow-soft-lg z-10 relative overflow-hidden transition-transform hover:-translate-y-2 duration-500">
              
              <div className="text-center lg:text-left mb-12 relative z-10">
                <SectionTitle
                  eyebrow={t.mentor.eyebrow}
                  title={t.mentor.title}
                  description={t.mentor.description}
                  highlightWord="pengalaman"
                  highlightColor="blue"
                />
              </div>
              
              <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16 relative z-10">
                <MotionWrapper className="relative">
                  {/* Photo playful offset backing */}
                  <div className="absolute inset-0 rounded-[3rem] bg-softYellow border-2 border-white translate-x-3 translate-y-4 pointer-events-none shadow-color-peach rotate-2" />
                  
                  <div className="relative overflow-hidden rounded-[3rem] border-4 border-white bg-white shadow-soft-sm transition-transform duration-500 hover:-translate-y-2 p-2">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-websiteBgEnd">
                      {mentor?.photoUrl?.trim() ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mentor.photoUrl}
                          alt={mentor.name}
                          className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-websiteBgEnd">
                          <span className="text-sm font-medium text-heading/50">Tidak ada foto</span>
                        </div>
                      )}
                    </div>
                  </div>
                </MotionWrapper>
                <div className="text-center lg:text-left">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-2xl border-2 border-white bg-white px-5 py-2.5 shadow-soft-sm">
                    <span className="h-3 w-3 rounded-full bg-freshGreen shadow-color-green" />
                    <span className="text-xs font-bold uppercase tracking-widest text-heading">{t.mentor.eyebrow}</span>
                  </div>
                  <h3 className="text-4xl font-display font-extrabold text-heading sm:text-5xl">
                    {mentor?.name || "Untitled"}
                  </h3>
                  <p className="mt-4 text-xl font-bold text-skyBlue">
                    {mentor?.position || "No position"}
                  </p>
                  {mentor?.description && (
                    <p className="mt-6 text-lg font-medium leading-relaxed text-paragraph">
                      {mentor.description}
                    </p>
                  )}
                  {(mentor?.instagramUrl || mentor?.whatsappUrl) && (
                    <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
                      {mentor.instagramUrl && (
                        <a href={mentor.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white bg-peach text-heading shadow-soft hover:-translate-y-1 hover:shadow-color-peach hover:bg-coral hover:text-white transition-all">
                          <InstagramIcon className="w-6 h-6" />
                        </a>
                      )}
                      {mentor.whatsappUrl && (
                        <a href={mentor.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white bg-softGreen text-heading shadow-soft hover:-translate-y-1 hover:shadow-color-green hover:bg-freshGreen hover:text-white transition-all">
                          <WhatsappIcon className="w-6 h-6" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </MotionWrapper>
        </Container>
      </Section>
    );
  }

  // Two or more mentors: responsive grid
  return (
    <Section className="py-20 sm:py-32 bg-websiteBg">
      <Container>
        <div className="text-center mb-16">
          <SectionTitle
            eyebrow={t.mentor.eyebrow}
            title={t.mentor.title}
            description={t.mentor.description}
            className="mx-auto"
            highlightWord="pengalaman"
            highlightColor="blue"
          />
        </div>
        
        {mentors.length === 0 ? (
          <div className="mt-8 text-center">
            <div className="rounded-[3rem] border-4 border-white bg-white p-8 shadow-soft-lg max-w-md mx-auto">
              <p className="text-lg font-medium text-paragraph">
                Mentor profiles coming soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor, i) => {
              const bgColors = ["bg-peach", "bg-softGreen", "bg-softYellow", "bg-softBlue"];
              const offsetColor = bgColors[i % bgColors.length];
              
              return (
              <MotionWrapper
                key={mentor.id}
                className="group relative h-full"
              >
                {/* V4 playful offset backing */}
                <div className={`absolute inset-0 rounded-[3rem] border-2 border-white ${offsetColor} translate-x-3 translate-y-3 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4 pointer-events-none shadow-soft-sm`} />
                
                <div className="h-full flex flex-col overflow-hidden rounded-[3rem] border-4 border-white bg-white p-4 shadow-soft-lg transition-transform duration-500 hover:-translate-y-2 z-10 relative">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-websiteBgEnd">
                    {mentor.photoUrl?.trim() ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mentor.photoUrl}
                        alt={mentor.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm font-medium text-heading/50">Tidak ada foto</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 px-4 py-6 text-center">
                    <h3 className="text-2xl font-display font-bold text-heading">{mentor.name || "Untitled"}</h3>
                    <p className="mt-2 text-sm font-bold text-skyBlue uppercase tracking-widest">
                      {mentor.position || "No position"}
                    </p>
                    {mentor.description && (
                      <p className="mt-5 text-sm font-medium leading-relaxed text-paragraph line-clamp-3">
                        {mentor.description}
                      </p>
                    )}
                    {(mentor.instagramUrl || mentor.whatsappUrl) && (
                      <div className="mt-auto pt-6 flex gap-3 justify-center">
                        {mentor.instagramUrl && (
                          <a href={mentor.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-white bg-peach text-heading shadow-soft hover:-translate-y-1 hover:shadow-color-peach hover:bg-coral hover:text-white transition-all">
                            <InstagramIcon className="w-5 h-5" />
                          </a>
                        )}
                        {mentor.whatsappUrl && (
                          <a href={mentor.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-white bg-softGreen text-heading shadow-soft hover:-translate-y-1 hover:shadow-color-green hover:bg-freshGreen hover:text-white transition-all">
                            <WhatsappIcon className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </MotionWrapper>
            )})}
          </div>
        )}
      </Container>
    </Section>
  );
}