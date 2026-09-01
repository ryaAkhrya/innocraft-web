"use client";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";

export function CurriculumSection() {
  return (
    <Section id="curriculum" className="py-12 sm:py-20 relative bg-websiteBg">
      <Container>
        <MotionWrapper>
          <div className="mb-12 flex justify-center text-center">
            <SectionTitle 
              title="Program yang kami miliki" 
              eyebrow="Curriculum" 
              className="text-center mx-auto" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Card 1: Young Innovator */}
            <div className="group flex flex-col relative rounded-[2rem] bg-accentSage/30 p-8 sm:p-10 border-2 border-accentSage transition-transform duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 h-16 w-16 bg-accentSage" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
              
              <div className="mb-6">
                <div className="inline-block bg-white border border-accentSage px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-[#4A5D23] mb-4 shadow-sm">
                  Foundational Program
                </div>
                <h3 className="text-3xl font-extrabold text-heading mb-3">
                  Young Innovator!
                </h3>
                <p className="text-paragraph text-lg leading-relaxed">
                  Mulai petualangan belajarmu dari nol! Program ini didesain khusus agar anak terbiasa menggunakan komputer dengan percaya diri dan aman.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  "Bermain dan bereksplorasi di dunia Minecraft yang aman dan terarah.",
                  "Berkreasi membuat desain 3D lalu mewujudkannya di dalam game!",
                  "Mengenal coding dan logika animasi dengan cara yang seru.",
                  "Bebas berimajinasi untuk memodifikasi dunia game.",
                  "Belajar memamerkan karya secara digital dan positif."
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-white/60 p-4 rounded-xl border border-white">
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-accentSage flex items-center justify-center text-sm font-bold text-[#4A5D23]">
                      0{idx + 1}
                    </div>
                    <p className="text-paragraph leading-relaxed mt-1.5">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Professional Purpose */}
            <div className="group flex flex-col relative rounded-[2rem] bg-accentDigitalBlue/40 p-8 sm:p-10 border-2 border-accentDigitalBlue transition-transform duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 h-16 w-16 bg-accentDigitalBlue" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />

              <div className="mb-6">
                <div className="inline-block bg-white border border-accentDigitalBlue px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-[#1E3A8A] mb-4 shadow-sm">
                  Advanced Program
                </div>
                <h3 className="text-3xl font-extrabold text-heading mb-1">
                  Professional Purpose
                </h3>
                <p className="text-sm italic text-[#1E3A8A]/70 mb-4 font-medium">
                  *Wajib menyelesaikan program Young Innovator terlebih dahulu.
                </p>
                <p className="text-paragraph text-lg leading-relaxed">
                  Langkah selanjutnya untuk mengasah bakat spesifik anak Anda menjadi fondasi keahlian profesional di masa depan.
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
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
                  <div key={idx} className="flex gap-4 items-start bg-white/60 p-4 rounded-xl border border-white">
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-accentDigitalBlue flex items-center justify-center text-sm font-bold text-[#1E3A8A]">
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-heading">{item.title}</h4>
                      <p className="text-paragraph text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}
