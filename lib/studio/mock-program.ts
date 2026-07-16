export type StudioProgramFeature = string;

export type StudioProgramEntry = {
  id: string;
  title: string;
  description: string;
  features: StudioProgramFeature[];
  ctaText: string;
  subtitle?: string;
  imageUrl?: string;
  projectUrl?: string;
};

export type StudioProgramData = {
  programs: StudioProgramEntry[];
};

export const defaultStudioProgramData: StudioProgramData = {
  programs: [
    {
      id: "p1",
      title: "Program Dasar Addon Development",
      description:
        "Belajar fondasi addon Minecraft: komponen, alur kerja, dan membuat konten sederhana.",
      features: [
        "Materi step-by-step",
        "Latihan langsung di sesi",
        "Output yang bisa dibawa pulang",
      ],
      ctaText: "Daftar Program",
    },
    {
      id: "p2",
      title: "Program Proyek: Buat Addon Karya Sendiri",
      description:
        "Implementasikan ide menjadi addon lengkap dengan bimbingan mentor.",
      features: ["Project studio", "Mentoring terjadwal", "Review & improvement"],
      ctaText: "Mulai Proyek",
    },
  ],
};

