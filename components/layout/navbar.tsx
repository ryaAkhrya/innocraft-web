"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X, Sun, Moon } from "lucide-react";
import { PrimaryButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useSettings } from "@/lib/studio/settings-provider";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { t } = useLanguage();
  const settings = useSettings();

  const waUrl = "https://wa.me/6287878791238?text=Halo%20INNOCRAFT,%20saya%20ingin%20menjadwalkan%20kunjungan";

  const navItems = [
    { href: "#home", label: t.nav.home },
    { href: "#about", label: t.nav.about },
    { href: "#projects", label: t.nav.projects },
    { href: "#gallery", label: t.nav.gallery },
    { href: "#contact", label: t.nav.contact },
  ];

  const logoUrl = settings.logoUrl && settings.logoUrl.trim().length > 0
    ? settings.logoUrl
    : "/logo.png";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-xl shadow-soft border-b border-border" : "bg-transparent py-4",
      )}
    >
      <Container className={cn("transition-all duration-300", isScrolled ? "py-3" : "py-4 sm:py-5")}>
        <div className={cn("mx-auto flex max-w-5xl items-center justify-between bg-white px-5 py-3 transition-all duration-300", isScrolled ? "rounded-none bg-transparent" : "rounded-3xl border-2 border-border shadow-soft-sm")}>
          <Link href="/#home" className="flex items-center gap-3 transition-transform hover:-translate-y-0.5 active:translate-y-0" aria-label={`${settings.websiteName} home`}>
            <Image src={logoUrl} alt={`${settings.websiteName} logo`} width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="text-sm font-extrabold uppercase tracking-[0.25em] text-heading">{settings.websiteName}</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="relative text-sm font-bold text-heading/70 uppercase tracking-widest transition-colors hover:text-coral group">
                {item.label}
                <span className="absolute -bottom-2 left-0 h-1 w-0 rounded-full bg-coral transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-border p-2.5 text-heading hover:bg-websiteBg hover:text-coral transition-all"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <PrimaryButton asChild>
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                {t.nav.cta}
                <ArrowRight className="ml-2 h-4 w-4 stroke-[3]" />
              </a>
            </PrimaryButton>
          </div>

          <button
            type="button"
            className="rounded-2xl border-2 border-border p-2 text-heading lg:hidden hover:bg-websiteBg hover:border-coral hover:text-coral transition-all"
            onClick={() => setIsOpen((value) => !value)}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            {isOpen ? <X className="h-5 w-5 stroke-[2.5]" /> : <Menu className="h-5 w-5 stroke-[2.5]" />}
          </button>
        </div>

        {isOpen ? (
          <div className="absolute left-5 right-5 top-[calc(100%+0.5rem)] rounded-[2rem] border-2 border-border bg-white p-5 shadow-soft-xl lg:hidden">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-widest text-heading transition-colors hover:bg-peach/30 hover:text-coral"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col items-center gap-3">
              <button
                onClick={() => { toggleTheme(); setIsOpen(false); }}
                className="flex items-center justify-center rounded-xl border-2 border-border p-3 text-heading hover:bg-websiteBg transition-all w-full font-bold uppercase tracking-widest text-sm"
              >
                {theme === "dark" ? (
                  <><Sun className="mr-2 h-5 w-5" /> Mode Terang</>
                ) : (
                  <><Moon className="mr-2 h-5 w-5" /> Mode Gelap</>
                )}
              </button>
              <PrimaryButton asChild className="w-full">
                <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                  {t.nav.cta}
                  <ArrowRight className="ml-2 h-4 w-4 stroke-[3]" />
                </a>
              </PrimaryButton>
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}