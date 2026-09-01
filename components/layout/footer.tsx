"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";

import { useLanguage } from "@/lib/i18n/language-provider";
import { useSettings } from "@/lib/studio/settings-provider";
import { Box } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();
  const settings = useSettings();

  return (
    <footer className="relative bg-heading text-white overflow-hidden">
      {/* V4 Soft ambient lighting */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[300px] w-[800px] bg-skyBlue/10 blur-[120px] rounded-full pointer-events-none" />

      <Container className="relative z-10 py-20 sm:py-28">
        <div className="flex flex-col gap-12 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-16">
          <div>
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm text-softYellow border border-white/10 shadow-soft-sm">
                <Box className="h-7 w-7 stroke-[2.5]" />
              </div>
              <span className="text-3xl font-display font-extrabold tracking-widest text-white uppercase">{settings.websiteName}</span>
            </div>
            <p className="text-lg font-medium text-gray-400 max-w-sm leading-relaxed">
              {settings.footerText || t.footer.text}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-10 gap-y-6">
            {t.footer.links.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            © {new Date().getFullYear()} {settings.websiteName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <div className="h-3 w-3 bg-coral rounded-full shadow-[0_0_12px_rgba(255,127,115,0.4)]" />
            <div className="h-3 w-3 bg-softYellow rounded-full shadow-[0_0_12px_rgba(255,214,107,0.4)]" />
            <div className="h-3 w-3 bg-skyBlue rounded-full shadow-[0_0_12px_rgba(127,184,245,0.4)]" />
            <div className="h-3 w-3 bg-freshGreen rounded-full shadow-[0_0_12px_rgba(139,203,136,0.4)]" />
          </div>
        </div>
      </Container>
    </footer>
  );
}