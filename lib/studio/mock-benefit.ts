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

