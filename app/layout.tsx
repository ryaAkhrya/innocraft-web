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
      <head>
      </head>
      <body className={`${inter.variable} ${poppins.variable} min-h-screen bg-breathing text-paragraph transition-colors duration-300`}>
        {/* Global Decorative Container - Prevents any overflow */}
        <div className="fixed inset-0 z-[-10] pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Decorative background elements */}
          <div className="decoration-blob decoration-blob--peach" />
          <div className="decoration-blob decoration-blob--lavender" />
          <div className="decoration-blob decoration-blob--blue" />

          {/* Depth / atmospheric fog layers */}
          <div className="decoration-depth decoration-depth--top" />
          <div className="decoration-depth decoration-depth--mid" />
          <div className="decoration-depth decoration-depth--bottom" />

          {/* Translucent 3D cubes */}
          <div className="decoration-cube decoration-cube--1">
            <div className="cube-face" />
            <div className="cube-face" />
          </div>
          <div className="decoration-cube decoration-cube--2">
            <div className="cube-face" />
            <div className="cube-face" />
          </div>
          <div className="decoration-cube decoration-cube--3">
            <div className="cube-face" />
            <div className="cube-face" />
          </div>
          <div className="decoration-cube decoration-cube--4">
            <div className="cube-face" />
            <div className="cube-face" />
          </div>

          {/* Large floating blocks behind hero */}
          <div className="decoration-block-large decoration-block-large--1" />
          <div className="decoration-block-large decoration-block-large--2" />
          <div className="decoration-block-large decoration-block-large--3" />
          <div className="decoration-block-large decoration-block-large--4" />

          {/* Small floating blocks */}
          <div className="decoration-block decoration-block--1" />
          <div className="decoration-block decoration-block--2" />
          <div className="decoration-block decoration-block--3" />
          <div className="decoration-block decoration-block--4" />

          {/* Geometric shapes */}
          <div className="decoration-geometric decoration-geometric--diamond" />
          <div className="decoration-geometric decoration-geometric--plus" />
          <div className="decoration-geometric decoration-geometric--lshape" />
          <div className="decoration-geometric decoration-geometric--ring" />

          {/* Floating voxels (blok.png) */}
          <div className="decoration-voxel decoration-voxel--1" />
          <div className="decoration-voxel decoration-voxel--2" />
          <div className="decoration-voxel decoration-voxel--3" />
          <div className="decoration-voxel decoration-voxel--4" />
          <div className="decoration-voxel decoration-voxel--5" />
          <div className="decoration-voxel decoration-voxel--6" />
          <div className="decoration-voxel decoration-voxel--7" />
          <div className="decoration-voxel decoration-voxel--8" />
          <div className="decoration-voxel decoration-voxel--9" />
          <div className="decoration-voxel decoration-voxel--10" />

          {/* Sparkles */}
          <div className="decoration-sparkle decoration-sparkle--1" />
          <div className="decoration-sparkle decoration-sparkle--2" />
          <div className="decoration-sparkle decoration-sparkle--3" />
          <div className="decoration-sparkle decoration-sparkle--4" />
          <div className="decoration-sparkle decoration-sparkle--5" />
        </div>

        <div className="relative z-10">
          <LanguageProvider>
            <SettingsProvider>{children}</SettingsProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
