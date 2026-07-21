"use client";

import { useMemo, useState } from "react";

// Generic modal is intentionally minimal (no external deps).
// Used to keep editor code small.

export function CmsItemEditModal({
  title,
  isOpen,
  onClose,
  children,
}: Readonly<{
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: only render after mount when used with conditionals.
  // (Still SSR-friendly; first render is consistent.)
  useMemo(() => {
    setMounted(true);
  }, []);


  if (!isOpen || !mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex h-full w-full flex-col sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3 sm:gap-4 flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-white sm:text-lg">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10 sm:px-3 sm:py-2 sm:text-sm"
          >
            Close
          </button>
        </div>
        <div className="mt-4 flex-1 overflow-y-auto">
          <div className="sm:max-h-none h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}