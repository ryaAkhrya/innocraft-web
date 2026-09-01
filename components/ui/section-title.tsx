"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  highlightWord?: string;
  highlightColor?: "peach" | "coral" | "green" | "blue" | "yellow" | "lavender";
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  className,
  highlightWord,
  highlightColor = "peach",
}: SectionTitleProps) {
  const colorMap = {
    peach: "bg-peach text-heading",
    coral: "bg-coral text-white",
    green: "bg-freshGreen text-heading",
    blue: "bg-skyBlue text-heading",
    yellow: "bg-softYellow text-heading",
    lavender: "bg-lavender text-heading",
  };

  const renderTitle = () => {
    if (!highlightWord || !title.includes(highlightWord)) return title;

    const parts = title.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className="relative inline-block sm:whitespace-nowrap px-3 mx-1">
          <span className="relative z-10">{highlightWord}</span>
          <motion.span
            initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
            whileInView={{ scale: 1, opacity: 1, rotate: -2 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={cn(
              "absolute inset-0 -z-10 rounded-2xl shadow-soft-sm",
              colorMap[highlightColor]
            )}
          />
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={cn("max-w-4xl", className)}>
      {eyebrow ? (
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="h-3 w-3 rounded-full bg-coral animate-pulse" />
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-heading/70">{eyebrow}</p>
        </div>
      ) : null}
      <h2 className="text-4xl sm:text-[2.5rem] md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-heading leading-[1.15] max-w-3xl">
        {renderTitle()}
      </h2>
      {description ? (
        <p className="mt-8 text-lg sm:text-xl leading-relaxed text-paragraph max-w-2xl font-medium">
          {description}
        </p>
      ) : null}
    </div>
  );
}
