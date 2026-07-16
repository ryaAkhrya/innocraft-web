"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";

import { useLanguage } from "@/lib/i18n/language-provider";
import { useSettings } from "@/lib/studio/settings-provider";

export function Footer() {
  const { t } = useLanguage();
  const settings = useSettings();

  return (
    <footer className="border-t border-border bg-white/70">
      <Container className="flex flex-col gap-4 py-8 text-sm text-paragraph sm:flex-row sm:items-center sm:justify-between">
        <p>{settings.footerText || t.footer.text}</p>
        <div className="flex flex-wrap gap-4">
          {t.footer.links.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-heading">
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}