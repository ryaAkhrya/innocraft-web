"use client";

import { Box, Code, Hexagon, Triangle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Section } from "@/components/ui/section";
import { SectionTitle } from "@/components/ui/section-title";
import { motion } from "framer-motion";

import { useLanguage } from "@/lib/i18n/language-provider";
import { cn } from "@/lib/utils";

export function Opportunities() {
  const { t } = useLanguage();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <Section className="py-20 sm:py-32 bg-websiteBgEnd relative overflow-hidden">
      <Container className="relative z-10">
        <MotionWrapper className="relative">
          {/* Playful offset backing */}
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[3.5rem] border-2 border-white bg-softBlue pointer-events-none shadow-soft-sm" />

          <div className="rounded-[3.5rem] border-4 border-white bg-white p-8 shadow-soft-lg sm:p-12 lg:p-16 relative overflow-hidden z-10">
            {/* Playful blobs inside the card */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-peach/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-softGreen/20 blur-[80px] rounded-full pointer-events-none" />
            
            <SectionTitle 
              eyebrow={t.opportunities.eyebrow} 
              title={t.opportunities.title} 
              description={t.opportunities.description} 
              className="max-w-3xl relative z-10"
              highlightWord="Masa Depan"
              highlightColor="blue"
            />
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4 relative z-10"
            >
              {t.opportunities.items.map((item, i) => {
                const icons = [Box, Code, Triangle, Hexagon];
                const Icon = icons[i % icons.length];
                const blockColors = ["bg-peach", "bg-softBlue", "bg-softGreen", "bg-softYellow"];
                const iconColors = ["text-coral", "text-skyBlue", "text-freshGreen", "text-heading"];
                const blockClass = blockColors[i % blockColors.length];
                const iconClass = iconColors[i % iconColors.length];

                return (
                  <motion.div 
                    key={item.title} 
                    variants={itemVariants}
                    className={cn("group relative rounded-[2.5rem] border-2 border-white p-8 shadow-soft-sm transition-transform duration-500 hover:-translate-y-2 hover:shadow-soft-lg", blockClass)}
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-white/50 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <Icon className={cn("h-7 w-7 stroke-[2.5]", iconClass)} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-heading">{item.title}</h3>
                    <p className="mt-3 text-base font-medium leading-relaxed text-paragraph">{item.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 rounded-[2rem] border-2 border-white bg-softYellow p-6 text-base leading-relaxed text-heading font-medium text-center shadow-soft-sm relative z-10"
            >
              <span className="font-bold text-coral mr-2">✨ Note:</span>
              {t.opportunities.note}
            </motion.div>
          </div>
        </MotionWrapper>
      </Container>
    </Section>
  );
}
