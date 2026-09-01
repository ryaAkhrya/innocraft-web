"use client";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

export function CurriculumSection() {
  return (
    <Section id="curriculum" className="py-20 sm:py-32 relative bg-websiteBg/85 overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-softBlue/40 rounded-full blur-[120px] pointer-events-none" />
      
      <Container className="relative z-10">
        <MotionWrapper>
          <div className="mb-16 flex justify-center text-center">
            <SectionTitle 
              title="Program yang kami miliki" 
              eyebrow="Curriculum" 
              className="text-center mx-auto"
              highlightWord="Program"
              highlightColor="blue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Card 1: Young Innovator */}
            <div className="group relative h-full">
              {/* V4 playful offset block */}
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 sm:translate-x-3 sm:translate-y-3 rounded-[2rem] sm:rounded-[3rem] bg-freshGreen border-2 border-white pointer-events-none shadow-color-green rotate-1" />
              
              <div className="relative h-full flex flex-col rounded-[2rem] sm:rounded-[3rem] bg-white dark:bg-slate-800 p-6 sm:p-12 border-4 border-white shadow-soft-lg transition-transform duration-500 sm:hover:-translate-y-2 z-10 overflow-hidden">
                <div className="mb-10 relative z-10">
                  <div className="inline-block bg-softGreen px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-[#101B35] dark:text-[#101B35] mb-6 border-2 border-white shadow-sm">
                    Foundational Program
                  </div>
                  <h3 className="text-3xl font-display font-extrabold text-heading mb-4">
                    Young Innovator
                  </h3>
                  <p className="text-paragraph text-lg font-medium leading-relaxed">
                    Mulai petualangan belajarmu dari nol! Program ini didesain khusus agar anak terbiasa menggunakan komputer dengan percaya diri dan aman.
                  </p>
                </div>

                <div className="flex flex-col gap-6 relative z-10">
                  {[
                    "Bermain dan bereksplorasi di dunia Minecraft yang aman dan terarah.",
                    "Berkreasi membuat desain 3D lalu mewujudkannya di dalam game!",
                    "Mengenal coding dan logika animasi dengan cara yang seru.",
                    "Bebas berimajinasi untuk memodifikasi dunia game.",
                    "Belajar memamerkan karya secara digital dan positif."
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-5 items-start group/item">
                      <div className="flex-shrink-0 text-3xl font-black text-freshGreen transition-transform group-hover/item:scale-110 font-display mt-0.5">
                        0{idx + 1}
                      </div>
                      <p className="text-heading/90 font-medium leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Professional Purpose */}
            <div className="group relative h-full mt-4 md:mt-0">
              {/* V4 playful offset block */}
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 sm:translate-x-3 sm:translate-y-3 rounded-[2rem] sm:rounded-[3rem] bg-skyBlue border-2 border-white pointer-events-none shadow-color-blue -rotate-1" />
              
              <div className="relative h-full flex flex-col rounded-[2rem] sm:rounded-[3rem] bg-white dark:bg-slate-800 p-6 sm:p-12 border-4 border-white shadow-soft-lg transition-transform duration-500 sm:hover:-translate-y-2 z-10 overflow-hidden">

                <div className="mb-10 relative z-10">
                  <div className="inline-block bg-softBlue px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-[#101B35] dark:text-[#101B35] mb-6 border-2 border-white shadow-sm">
                    Advanced Program
                  </div>
                  <h3 className="text-3xl font-display font-extrabold text-heading mb-2">
                    Professional Purpose
                  </h3>
                  <p className="text-sm font-bold text-skyBlue mb-5">
                    *Wajib menyelesaikan Young Innovator
                  </p>
                  <p className="text-paragraph text-lg font-medium leading-relaxed">
                    Langkah selanjutnya untuk mengasah bakat spesifik anak Anda menjadi fondasi keahlian profesional di masa depan.
                  </p>
                </div>
                
                <div className="flex flex-col gap-8 relative z-10 mt-auto">
                  {[
                    {
                      title: "Designer",
                      desc: "Belajar mendesain karakter (pixel art), animasi, efek visual dan suara yang memukau."
                    },
                    {
                      title: "Programmer",
                      desc: "Menyelami logika pemrograman, Script API, dan dasar JavaScript."
                    },
                    {
                      title: "Media Master",
                      desc: "Kreativitas edit video kekinian dan praktik membangun website sederhana."
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-5 items-start group/item">
                      <div className="flex-shrink-0 text-3xl font-black text-skyBlue transition-transform group-hover/item:scale-110 font-display mt-0.5">
                        0{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-heading text-lg">{item.title}</h4>
                        <p className="text-paragraph font-medium text-sm mt-1.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}
