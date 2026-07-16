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
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
          >
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

