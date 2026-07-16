import { cn } from "@/lib/utils";

export function CmsTextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white/80">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "mt-2 w-full rounded-2xl border border-white/10 bg-[#0B1020]/40 px-4 py-3",
          "text-sm text-white placeholder:text-white/30 outline-none",
          "focus:ring-2 focus:ring-primary/60",
        )}
      />
    </label>
  );
}

export function CmsTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white/80">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "mt-2 w-full resize-none rounded-2xl border border-white/10 bg-[#0B1020]/40 px-4 py-3",
          "text-sm text-white placeholder:text-white/30 outline-none",
          "focus:ring-2 focus:ring-primary/60",
        )}
      />
    </label>
  );
}

export function CmsUrlHint({ hint }: { hint: string }) {
  return <p className="mt-2 text-xs text-white/50">{hint}</p>;
}

