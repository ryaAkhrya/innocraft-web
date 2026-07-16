import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/language-provider";
import { SettingsProvider } from "@/lib/studio/settings-provider";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.innocraft.id"),
  title: {
    default: "INNOCRAFT",
    template: "%s | INNOCRAFT",
  },
  description:
    "Premium bilingual experience for parents exploring an offline Minecraft Addon Development class for children.",
  keywords: ["Minecraft", "addon development", "offline class", "children education", "technology learning"],
  openGraph: {
    title: "INNOCRAFT",
    description:
      "Premium bilingual experience for parents exploring an offline Minecraft Addon Development class for children.",
    type: "website",
    locale: "id_ID",
    url: "https://www.innocraft.id",
  },
  twitter: {
    card: "summary_large_image",
    title: "INNOCRAFT",
    description:
      "Premium bilingual experience for parents exploring an offline Minecraft Addon Development class for children.",
  },
  icons: {
    // Replace logo by updating /public/logo.png
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFCFC9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} min-h-screen bg-websiteBg text-paragraph`}>
        <LanguageProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
