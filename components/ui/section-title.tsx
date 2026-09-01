import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? (
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="h-1.5 w-1.5 bg-primaryBg" />
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-heading/70">{eyebrow}</p>
        </div>
      ) : null}
      <h2 className="mt-1 text-3xl font-bold tracking-tight text-heading sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">{title}</h2>
      {description ? <p className="mt-5 text-lg leading-relaxed text-paragraph">{description}</p> : null}
    </div>
  );
}
