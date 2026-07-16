import Link from "next/link";
import { cn } from "@/lib/utils";
import { HeartHandshake, BookOpen, Star, LayoutGrid, ImageIcon, Users, Briefcase, Phone, Settings } from "lucide-react";

const ActionButton = ({
  title,
  href,
  icon,
}: {
  title: string;
  href: string;
  icon: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white",
        "hover:bg-white/8 hover:border-white/15 transition",
      )}
    >
      {icon}
      {title}
    </Link>
  );
};

export function StudioQuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <ActionButton title="Hero" href="/studio/hero" icon={<HeartHandshake className="h-4 w-4" />} />
      <ActionButton title="Tentang" href="/studio/tentang" icon={<BookOpen className="h-4 w-4" />} />
      <ActionButton title="Benefit" href="/studio/benefit" icon={<Star className="h-4 w-4" />} />
      <ActionButton title="Program" href="/studio/program" icon={<LayoutGrid className="h-4 w-4" />} />
      <ActionButton title="Galeri" href="/studio/gallery" icon={<ImageIcon className="h-4 w-4" />} />
      <ActionButton title="Mentor" href="/studio/mentor" icon={<Users className="h-4 w-4" />} />
      <ActionButton title="Lowongan" href="/studio/recruitment" icon={<Briefcase className="h-4 w-4" />} />
      <ActionButton title="Kontak" href="/studio/contact" icon={<Phone className="h-4 w-4" />} />
      <ActionButton title="Pengaturan" href="/studio/settings" icon={<Settings className="h-4 w-4" />} />
    </div>
  );
}