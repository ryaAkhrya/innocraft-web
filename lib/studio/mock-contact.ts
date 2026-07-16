export type StudioContactData = {
  address: string;
  whatsapp: string;
  email: string;
  mapsUrl: string;
  instagram: string;
  facebook: string;
  openingHours: string; // added for Kontak CMS (backward compatible)
  companyName: string; // added for Kontak CMS (backward compatible)
};

export const defaultStudioContactData: StudioContactData = {
  address: "Jl. Contoh No. 123, Jakarta",
  companyName: "INNOCRAFT",
  whatsapp: "+62 812-0000-0000",
  email: "hello@innocraft.id",
  mapsUrl: "https://maps.google.com",
  instagram: "https://instagram.com/innocraft.id",
  facebook: "https://facebook.com/innocraft.id",
  openingHours: "Senin - Jumat, 09:00 - 17:00",
};


