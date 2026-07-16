export function buildRecruitmentWhatsappUrl(position: string) {
  const base = "https://wa.me/6287878791238";

  const message = [
    "Halo INNOCRAFT,",
    "",
    `Saya tertarik dengan posisi: ${position}`,
    "",
    "Apakah lowongan ini masih tersedia?",
  ].join("%0A");

  return `${base}?text=${message}`;
}

