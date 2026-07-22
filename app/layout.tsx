import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/language-provider";
import { SettingsProvider } from "@/lib/studio/settings-provider";
import "@/styles/globals.css";

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
  authors: [{ name: "INNOCRAFT Team" }],
  openGraph: {
    title: "INNOCRAFT",
    description:
      "Premium bilingual experience for parents exploring an offline Minecraft Addon Development class for children.",
    type: "website",
    locale: "id_ID",
    url: "https://www.innocraft.id",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "INNOCRAFT",
    description:
      "Premium bilingual experience for parents exploring an offline Minecraft Addon Development class for children.",
    images: ["/logo.png"],
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
      <body className={`${inter.variable} ${poppins.variable} min-h-screen bg-breathing text-paragraph`}>
        {/* Decorative background elements */}
        <div className="decoration-blob decoration-blob--peach" aria-hidden="true" />
        <div className="decoration-blob decoration-blob--lavender" aria-hidden="true" />
        <div className="decoration-blob decoration-blob--blue" aria-hidden="true" />

        {/* Depth / atmospheric fog layers */}
        <div className="decoration-depth decoration-depth--top" aria-hidden="true" />
        <div className="decoration-depth decoration-depth--mid" aria-hidden="true" />
        <div className="decoration-depth decoration-depth--bottom" aria-hidden="true" />

        {/* Translucent 3D cubes */}
        <div className="decoration-cube decoration-cube--1" aria-hidden="true">
          <div className="cube-face" />
          <div className="cube-face" />
        </div>
        <div className="decoration-cube decoration-cube--2" aria-hidden="true">
          <div className="cube-face" />
          <div className="cube-face" />
        </div>
        <div className="decoration-cube decoration-cube--3" aria-hidden="true">
          <div className="cube-face" />
          <div className="cube-face" />
        </div>
        <div className="decoration-cube decoration-cube--4" aria-hidden="true">
          <div className="cube-face" />
          <div className="cube-face" />
        </div>

        {/* Large floating blocks behind hero */}
        <div className="decoration-block-large decoration-block-large--1" aria-hidden="true" />
        <div className="decoration-block-large decoration-block-large--2" aria-hidden="true" />
        <div className="decoration-block-large decoration-block-large--3" aria-hidden="true" />
        <div className="decoration-block-large decoration-block-large--4" aria-hidden="true" />

        {/* Small floating blocks */}
        <div className="decoration-block decoration-block--1" aria-hidden="true" />
        <div className="decoration-block decoration-block--2" aria-hidden="true" />
        <div className="decoration-block decoration-block--3" aria-hidden="true" />
        <div className="decoration-block decoration-block--4" aria-hidden="true" />

        {/* Geometric shapes */}
        <div className="decoration-geometric decoration-geometric--diamond" aria-hidden="true" />
        <div className="decoration-geometric decoration-geometric--plus" aria-hidden="true" />
        <div className="decoration-geometric decoration-geometric--lshape" aria-hidden="true" />
        <div className="decoration-geometric decoration-geometric--ring" aria-hidden="true" />

        {/* Pixel terrain atmosphere */}
        <div className="decoration-terrain decoration-terrain--row1" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
        </div>
        <div className="decoration-terrain decoration-terrain--row2" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span />
        </div>
        <div className="decoration-terrain decoration-terrain--row3" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
          <span /><span />
        </div>

        {/* Sparkles */}
        <div className="decoration-sparkle decoration-sparkle--1" aria-hidden="true" />
        <div className="decoration-sparkle decoration-sparkle--2" aria-hidden="true" />
        <div className="decoration-sparkle decoration-sparkle--3" aria-hidden="true" />
        <div className="decoration-sparkle decoration-sparkle--4" aria-hidden="true" />
        <div className="decoration-sparkle decoration-sparkle--5" aria-hidden="true" />

        <div className="relative z-10">
          <LanguageProvider>
            <SettingsProvider>{children}</SettingsProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
