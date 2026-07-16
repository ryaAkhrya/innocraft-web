"use client";

import { cn } from "@/lib/utils";

export function CmsButtonRow({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <div className={cn("mt-8 grid gap-3 sm:grid-cols-2", className)}>{children}</div>;
}

export function CmsPrimaryButton({
  children,
  onClick,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "solid" | "ghost";
}) {
  const v = variant ?? "solid";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition",
        v === "solid"
          ? "bg-[#FFCFC9] text-[#0B1020] hover:bg-[#FFCFC9]/90 disabled:opacity-60"
          : "border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-60",
      )}
    >
      {children}
    </button>
  );
}

