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
    <footer className="relative border-t-4 border-heading bg-heading text-white overflow-hidden">
      {/* Bedrock / Deep Earth Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[800px] bg-accentEnergy/20 blur-[100px] rounded-[100%]" />

      <Container className="relative z-10 py-12 sm:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accentEnergy text-white shadow-[0_4px_0_rgba(153,27,27,1)]">
                <Box className="h-6 w-6 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-display font-black tracking-tight text-white uppercase italic">Innocraft</span>
            </div>
            <p className="text-sm font-medium text-gray-400 max-w-sm">
              {settings.footerText || t.footer.text}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {t.footer.links.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm font-bold uppercase tracking-wider text-gray-300 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t-2 border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            © {new Date().getFullYear()} Innocraft. All rights reserved.
          </p>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-1.5 w-4 rounded-full bg-white/10" />
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}