"use client";

import { cn } from "@/lib/utils";

export function CmsReorderControls({
  onMoveUp,
  onMoveDown,
  disableUp,
  disableDown,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  disableUp: boolean;
  disableDown: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={disableUp}
        onClick={onMoveUp}
        className={cn(
          "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition",
          "hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5",
        )}
      >
        ↑
      </button>
      <button
        type="button"
        disabled={disableDown}
        onClick={onMoveDown}
        className={cn(
          "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition",
          "hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5",
        )}
      >
        ↓
      </button>
    </div>
  );
}

