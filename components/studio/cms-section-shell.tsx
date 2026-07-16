"use client";

import { cn } from "@/lib/utils";

export function CmsSectionShell({
  title,
  subtitle,
  children,
}: Readonly<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-6",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
      )}
    >
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

