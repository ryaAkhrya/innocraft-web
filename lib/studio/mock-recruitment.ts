export type StudioJob = {
  id: string;
  position: string;
  employmentType: string;
  description: string;
  requirements: string[];

  // Added for Lowongan CMS (backward compatible)
  location: string;
  status: "Open" | "Closed";

  // Full CMS-driven detail modal fields
  jobDescription: string;
  benefits: string[];
  workLocation: string;
};

export type StudioRecruitmentData = {
  jobs: StudioJob[];
};

export const defaultStudioRecruitmentData: StudioRecruitmentData = {
  jobs: [
    {
      id: "j1",
      position: "Program Coordinator",
      employmentType: "Part-time",
      location: "Jakarta",
      status: "Open",
      description: "Mengatur jadwal, kebutuhan kelas, dan komunikasi peserta.",
      requirements: ["Komunikasi baik", "Organisasi rapi", "Mampu koordinasi"],
      jobDescription: "Anda akan mengelola jadwal kelas, berkomunikasi dengan orang tua peserta, dan memastikan kebutuhan operasional program berjalan lancar.",
      benefits: ["Lingkungan kerja yang hangat", "Jam kerja fleksibel", "Pengalaman organisasi event edukasi"],
      workLocation: "Jakarta (offline)",
    },
    {
      id: "j2",
      position: "Minecraft Mentor",
      employmentType: "Contract",
      location: "Remote",
      status: "Closed",
      description: "Membimbing anak mengembangkan addon Minecraft.",
      requirements: ["Paham Minecraft", "Peduli edukasi", "Sabar & komunikatif"],
      jobDescription: "Anda akan menjadi mentor yang membimbing anak-anak dalam memahami konsep addon Minecraft dan membantu mereka mewujudkan ide kreatif menjadi proyek nyata.",
      benefits: ["Materi ajar tersedia", "Komunitas mentor", "Sertifikat pengalaman"],
      workLocation: "Remote",
    },
  ],
};