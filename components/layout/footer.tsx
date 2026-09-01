"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";

import { useLanguage } from "@/lib/i18n/language-provider";
import { useSettings } from "@/lib/studio/settings-provider";

export function Footer() {
  const { t } = useLanguage();
  const settings = useSettings();

  const logoUrl = settings.logoUrl && settings.logoUrl.trim().length > 0
    ? settings.logoUrl
    : "/logo.png";

  return (
    <footer className="relative bg-websiteBg/85 text-heading border-t border-border overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-softBlue/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      
      <Container className="relative z-10 py-10 sm:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4">
            <Link href="/#home" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-soft-sm border-2 border-white">
                <Image src={logoUrl} alt={`${settings.websiteName} logo`} width={28} height={28} className="h-7 w-7 object-contain" />
              </div>
              <span className="text-2xl font-display font-extrabold tracking-widest text-heading uppercase">{settings.websiteName}</span>
            </Link>
            <p className="text-sm font-medium text-paragraph max-w-xs leading-relaxed">
              {settings.footerText || t.footer.text}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {t.footer.links.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm font-bold uppercase tracking-widest text-paragraph transition-colors hover:text-coral">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-paragraph/60 uppercase tracking-widest">
            © {new Date().getFullYear()} {settings.websiteName}. All rights reserved.
          </p>
          <div className="flex gap-3">
            <div className="h-2.5 w-2.5 bg-coral rounded-full shadow-[0_0_8px_rgba(255,127,115,0.4)]" />
            <div className="h-2.5 w-2.5 bg-softYellow rounded-full shadow-[0_0_8px_rgba(255,214,107,0.4)]" />
            <div className="h-2.5 w-2.5 bg-skyBlue rounded-full shadow-[0_0_8px_rgba(127,184,245,0.4)]" />
            <div className="h-2.5 w-2.5 bg-freshGreen rounded-full shadow-[0_0_8px_rgba(139,203,136,0.4)]" />
          </div>
        </div>
      </Container>
    </footer>
  );
}