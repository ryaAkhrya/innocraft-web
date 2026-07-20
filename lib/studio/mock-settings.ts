export type StudioSettingsData = {
  websiteName: string;
  logoUrl: string;
  footerText: string;

  // Added for Pengaturan CMS (backward compatible)
  faviconUrl: string;
  seoTitle: string;
  seoDescription: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
};

export const defaultStudioSettingsData: StudioSettingsData = {
  websiteName: "INNOCRAFT",
  logoUrl: "/logo.png",
  faviconUrl: "/logo.png",
  footerText: "© INNOCRAFT. All rights reserved.",
  seoTitle: "INNOCRAFT - Studio Addon Minecraft",
  seoDescription:
    "Belajar dan membuat addon Minecraft bersama mentor. Program edukasi yang menyenangkan.",
  instagramUrl: "https://instagram.com/innocraft.id",
  facebookUrl: "https://facebook.com/innocraft.id",
  tiktokUrl: "https://tiktok.com",
};