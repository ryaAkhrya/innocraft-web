"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

export function MotionWrapper({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.45, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}