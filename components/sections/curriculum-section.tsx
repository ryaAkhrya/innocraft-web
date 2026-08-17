"use client";

import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";

export function CurriculumSection() {
  return (
    <Section id="curriculum" className="pt-0 pb-12 sm:pb-20">
      <Container>
        <MotionWrapper>
          <div className="mb-12 flex justify-center text-center">
            <h2 className="inline-block bg-white px-8 py-3 rounded-2xl shadow-sm border border-gray-100 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Program yang kami miliki
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col relative rounded-[2rem] bg-white p-8 sm:p-10 border border-gray-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-heading mb-3">
                Program Young Innovator!
              </h3>
              <p className="text-paragraph text-base leading-relaxed mb-6">
                Mulai petualangan belajarmu dari nol! Program ini didesain khusus agar anak terbiasa menggunakan komputer dengan percaya diri dan aman.
              </p>
              <ul className="flex flex-col gap-3 text-paragraph text-base">
                <li className="flex items-start">
                  <span className="mr-3 text-primaryBg mt-1">•</span>
                  <span>Bermain dan bereksplorasi di dunia Minecraft yang aman dan terarah.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primaryBg mt-1">•</span>
                  <span>Berkreasi membuat desain 3D lalu mewujudkannya di dalam game!</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primaryBg mt-1">•</span>
                  <span>Mengenal coding dan logika animasi dengan cara yang seru dan menyenangkan.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primaryBg mt-1">•</span>
                  <span>Bebas berimajinasi untuk memodifikasi dunia game sesuai kreativitas anak.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-primaryBg mt-1">•</span>
                  <span>Belajar memamerkan karya secara digital dan mengenal dasar dunia online yang positif.</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col relative rounded-[2rem] bg-white p-8 sm:p-10 border border-gray-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-heading mb-1">
                Program Professional Purpose
              </h3>
              <p className="text-sm italic text-paragraph/80 mb-4">
                *Wajib menyelesaikan program Young Innovator terlebih dahulu.
              </p>
              <p className="text-paragraph text-base leading-relaxed mb-6">
                Langkah selanjutnya untuk mengasah bakat spesifik anak Anda. Kami membantu mengarahkan minat mereka menjadi fondasi keahlian profesional di masa depan.
              </p>
              
              <div className="flex flex-col gap-5 text-paragraph text-base">
                <div>
                  <h4 className="font-semibold text-heading mb-1">1. Designer</h4>
                  <p>Belajar mendesain karakter (pixel art), membuat animasi yang hidup, hingga meracik efek visual dan suara yang memukau.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-heading mb-1">2. Programmer</h4>
                  <p>Menyelami dunia logika pemrograman yang lebih menantang, bereksperimen dengan Script API, dan menguasai dasar bahasa pemrograman JavaScript.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-heading mb-1">3. Media Master</h4>
                  <p>Mengasah kreativitas mengedit video kekinian dengan CapCut serta praktik membangun website sederhana buatan sendiri.</p>
                </div>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}
