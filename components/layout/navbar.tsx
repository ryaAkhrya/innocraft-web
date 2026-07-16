"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { PrimaryButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useSettings } from "@/lib/studio/settings-provider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { t } = useLanguage();
  const settings = useSettings();

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
        isScrolled ? "bg-white/80 shadow-sm backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <Container className="py-4 sm:py-5">
        <div className="flex items-center justify-between rounded-full border border-border bg-white/75 px-3 py-3 shadow-soft backdrop-blur">
          <Link href="/#home" className="flex items-center gap-2" aria-label={`${settings.websiteName} home`}>
            <Image src={logoUrl} alt={`${settings.websiteName} logo`} width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-heading">{settings.websiteName}</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-paragraph transition hover:text-heading">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <PrimaryButton asChild>
              <Link href="#contact">
                {t.nav.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </PrimaryButton>
          </div>

          <button
            type="button"
            className="rounded-full border border-border p-2 text-heading lg:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen ? (
          <div className="mt-3 rounded-[1.5rem] border border-border bg-white/90 p-4 shadow-soft lg:hidden">
            <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-3 py-2 text-sm font-medium text-paragraph transition hover:bg-primaryBg/20 hover:text-heading"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PrimaryButton asChild>
                <Link href="#contact" onClick={() => setIsOpen(false)}>
                  {t.nav.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </PrimaryButton>
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}