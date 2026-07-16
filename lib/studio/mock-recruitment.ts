export type StudioJob = {
  id: string;
  position: string;
  employmentType: string;
  description: string;
  requirements: string[];

  // Added for Lowongan CMS (backward compatible)
  location: string;
  status: "Open" | "Closed";
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
    },
    {
      id: "j2",
      position: "Minecraft Mentor",
      employmentType: "Contract",
      location: "Remote",
      status: "Closed",
      description: "Membimbing anak mengembangkan addon Minecraft.",
      requirements: ["Paham Minecraft", "Peduli edukasi", "Sabar & komunikatif"],
    },
  ],
};


