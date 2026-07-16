export type StudioSettingsData = {
  websiteName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  footerText: string;

  // Added for Pengaturan CMS (backward compatible)
  faviconUrl: string;
  seoTitle: string;
  seoDescription: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
};

export const defaultStudioSettingsData: StudioSettingsData = {
  websiteName: "INNOCRAFT",
  logoUrl: "/logo.png",
  faviconUrl: "/logo.png",
  primaryColor: "#FFCFC9",
  secondaryColor: "#9AE6FF",
  footerText: "© INNOCRAFT. All rights reserved.",
  seoTitle: "INNOCRAFT - Studio Addon Minecraft",
  seoDescription:
    "Belajar dan membuat addon Minecraft bersama mentor. Program edukasi yang menyenangkan.",
  instagramUrl: "https://instagram.com/innocraft.id",
  facebookUrl: "https://facebook.com/innocraft.id",
  youtubeUrl: "https://youtube.com/@innocraft",
};


