export type StudioBenefitCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type StudioBenefitData = {
  badge: string;
  title: string;
  subtitle: string;
  cards: StudioBenefitCard[];
};

/**
 * Generate a unique ID for a new benefit card.
 * Uses crypto.randomUUID when available, otherwise falls back to a
 * timestamp + random string.
 */
export function createBenefitId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (crypto as any).randomUUID() as string;
  }
  return `b_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

/**
 * Create a new empty benefit card with sensible defaults.
 */
export function createEmptyBenefitCard(): StudioBenefitCard {
  return {
    id: createBenefitId(),
    icon: "⭐",
    title: "",
    description: "",
  };
}

/**
 * Normalize a benefit card from arbitrary input (e.g. Supabase row or draft).
 */
export function normalizeBenefitCard(input: Partial<StudioBenefitCard> | Record<string, unknown>): StudioBenefitCard {
  return {
    id: String(input?.id ?? createBenefitId()),
    icon: String(input?.icon ?? "⭐"),
    title: String(input?.title ?? ""),
    description: String(input?.description ?? ""),
  };
}

export const defaultStudioBenefitData: StudioBenefitData = {
  badge: "BENEFIT",
  title: "Kenapa INNOCRAFT?",
  subtitle:
    "Program disusun untuk membantu anak berkembang lewat pengalaman belajar yang menyenangkan.",
  cards: [
    {
      id: "b1",
      icon: "🧠",
      title: "Belajar dengan cara bermain",
      description: "Anak memahami konsep addon lewat contoh langsung di Minecraft.",
    },
    {
      id: "b2",
      icon: "🧩",
      title: "Struktur materi yang rapi",
      description: "Rangkuman pembelajaran dibuat jelas dan bertahap.",
    },
    {
      id: "b3",
      icon: "🤝",
      title: "Kolaborasi & mentoring",
      description: "Dibimbing mentor agar tetap fokus dan berkembang.",
    },
    {
      id: "b4",
      icon: "🎯",
      title: "Tujuan skill yang terukur",
      description: "Setiap sesi membawa progres dan output yang nyata.",
    },
  ],
};