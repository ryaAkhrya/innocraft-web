import type { RecruitmentJob } from "./recruitment-types";

export const recruitmentJobsMock: RecruitmentJob[] = [
  {
    id: "mentor-minecraft",
    position: "Mentor Minecraft",
    employmentType: "Full-time",
    location: "Jakarta",
    shortDescription:
      "Membimbing anak-anak dalam pembelajaran addon Minecraft dengan pendekatan yang sabar dan terstruktur.",
    status: "open",

    jobDescription:
      "Anda akan menjadi mentor utama yang membantu anak memahami konsep dasar Minecraft dan mengubah ide kreatif mereka menjadi proyek yang dapat dipelajari. Fokus kami adalah proses—membangun cara berpikir, kolaborasi, dan pemecahan masalah.",

    requirements: [
      "Memiliki pengalaman bermain/berkarya dengan Minecraft (mod/addon) atau kemampuan belajar yang cepat.",
      "Komunikasi yang ramah untuk anak usia 8–16 tahun.",
      "Mampu menyusun aktivitas belajar yang jelas dan menyenangkan.",
    ],

    benefits: [
      "Lingkungan kerja yang hangat dan profesional.",
      "Panduan kurikulum dan materi mentor.",
      "Kesempatan pengembangan skill mengajar & konten.",
    ],

    workLocation: "Jakarta (offline)",
  },
  {
    id: "mentor-programming",
    position: "Mentor Programming",
    employmentType: "Part-time",
    location: "Bandung",
    shortDescription:
      "Mendampingi anak memahami logika pemrograman melalui tantangan bertahap yang mudah dipraktikkan.",
    status: "open",

    jobDescription:
      "Anda akan membantu anak membangun fondasi berpikir logis dan kemampuan memecahkan masalah dengan pengalaman belajar bertahap. Kami mencari mentor yang dapat membuat konsep terasa sederhana, dan tetap menjaga rasa ingin tahu anak.",

    requirements: [
      "Memahami konsep dasar programming (algoritma, variabel, logika).",
      "Mampu mengubah materi teknis menjadi kegiatan yang engaging.",
      "Terbiasa membimbing diskusi kelompok dan memberi feedback.",
    ],

    benefits: [
      "Jam kerja fleksibel (part-time).",
      "Materi ajar dan template aktivitas dari tim.",
      "Kesempatan kolaborasi pembuatan course & challenge.",
    ],

    workLocation: "Bandung (offline)",
  },
  {
    id: "content-creator",
    position: "Content Creator",
    employmentType: "Contract",
    location: "Remote",
    shortDescription:
      "Membantu menyampaikan nilai INNOCRAFT lewat konten yang informatif, hangat, dan konsisten.",
    status: "open",

    jobDescription:
      "Anda akan membuat ide konten dan mengeksekusi materi untuk kebutuhan branding dan edukasi. Konten kami menekankan pembelajaran yang ramah orang tua dan efektif untuk anak. Fokus pada kualitas visual, storytelling, dan konsistensi.",

    requirements: [
      "Berpengalaman membuat konten (reels, carousel, script, atau artikel).",
      "Memahami audiens orang tua dan mampu menulis dengan bahasa yang jelas.",
      "Mampu bekerja dengan kalender konten dan revisi cepat.",
    ],

    benefits: [
      "Kerja remote yang fleksibel.",
      "Brief dan referensi dari tim.",
      "Kesempatan menjadi bagian dari pengembangan kurikulum lewat konten.",
    ],

    workLocation: "Remote",
  },
  {
    id: "social-media-specialist",
    position: "Social Media Specialist",
    employmentType: "Internship",
    location: "Yogyakarta",
    shortDescription:
      "Mengelola komunitas dan komunikasi sosial media untuk mendukung program rekrutmen & kelas.",
    status: "open",

    jobDescription:
      "Anda akan membantu tim mengelola interaksi, merapikan kalender posting, dan mendukung kampanye sederhana. Kami mencari pribadi yang responsif, rapi, dan nyaman berkolaborasi.",

    requirements: [
      "Terbiasa menggunakan platform sosial media utama.",
      "Komunikasi yang sopan dan cepat tanggap.",
      "Bisa menulis caption singkat yang jelas dan menarik.",
    ],

    benefits: [
      "Program internship dengan mentoring.",
      "Exposure ke workflow kampanye edukasi.",
      "Portofolio untuk pengembangan karier.",
    ],

    workLocation: "Yogyakarta (hybrid)",
  },
];

