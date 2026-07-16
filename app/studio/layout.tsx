import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio | INNOCRAFT",
};

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

