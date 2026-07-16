"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, BookOpen, Star, LayoutGrid, Users, Briefcase, Phone, Settings, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { SecondaryButton } from "@/components/ui/button";
import { clearStudioSessionCookie } from "@/lib/studio/mock-auth";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export function StudioShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "Dashboard", href: "/studio", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Hero", href: "/studio/hero", icon: <HeartHandshake className="h-4 w-4" /> },
      { label: "Tentang", href: "/studio/tentang", icon: <BookOpen className="h-4 w-4" /> },
      { label: "Benefit", href: "/studio/benefit", icon: <Star className="h-4 w-4" /> },
      { label: "Program", href: "/studio/program", icon: <LayoutGrid className="h-4 w-4" /> },
      { label: "Galeri", href: "/studio/gallery", icon: <ImageIcon className="h-4 w-4" /> },
      { label: "Mentor", href: "/studio/mentor", icon: <Users className="h-4 w-4" /> },
      { label: "Lowongan", href: "/studio/recruitment", icon: <Briefcase className="h-4 w-4" /> },
      { label: "Kontak", href: "/studio/contact", icon: <Phone className="h-4 w-4" /> },
      { label: "Pengaturan", href: "/studio/settings", icon: <Settings className="h-4 w-4" /> },
    ],
    [],
  );

  function currentHref() {
    // Normalize to section path.
    // `/studio/hero/something` should still highlight `/studio/hero`.
    if (!pathname) return "/studio";
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length <= 1) return "/studio";
    return `/${parts[0]}/${parts[1] ?? ""}`.replace(/\/$/, "");
  }

  const active = currentHref();

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100">
      <div className="mx-auto flex max-w-[1400px]">
        <aside
          className={cn(
            "fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-white/10 bg-[#0B1020]/90 backdrop-blur",
            "w-64",
            isCollapsed && "w-20",
          )}
        >
          <div className="flex items-center justify-between px-4 py-5">
            <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}> 
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFCFC9] to-[#9AE6FF] text-[#0B1020] font-black">
                I
              </div>
              {!isCollapsed ? (
                <div className="leading-tight">
                  <p className="text-sm font-semibold">INNOCRAFT</p>
                  <p className="text-xs text-white/60">Studio</p>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setIsCollapsed((v) => !v)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10"
              aria-label="Toggle sidebar"
            >
              <span className="text-xs">{isCollapsed ? ">" : "<"}</span>
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
            {navItems.map((item) => {
              const isActive = active === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                    "border border-transparent",
                    isActive
                      ? "bg-white/10 text-white border-white/15"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                    isCollapsed && "justify-center px-0",
                  )}
                >
                  {item.icon}
                  {!isCollapsed ? <span>{item.label}</span> : null}
                </Link>
              );
            })}
          </nav>

          <div className={cn("px-4 pb-5", isCollapsed && "px-0")}> 
            <SecondaryButton
              onClick={() => {
                clearStudioSessionCookie();
                window.location.href = "/studio/login";
              }}
              className={cn(
                "w-full bg-white/5 text-white border-white/10 hover:bg-white/10",
                isCollapsed && "px-0",
              )}
            >
              {!isCollapsed ? "Logout" : "Out"}
            </SecondaryButton>
          </div>
        </aside>

        <div className={cn("ml-64 w-full", isCollapsed && "ml-20")}>
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B1020]/85 backdrop-blur">
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <h1 className="text-xl font-semibold">Studio</h1>
                <p className="text-sm text-white/60">{navItems.find((x) => x.href === active)?.label ?? "Dashboard"}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                  {navItems.find((x) => x.href === active)?.label ?? "Dashboard"}
                </div>
                <Link
                  href="/studio/logout"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  Logout
                </Link>
              </div>
            </div>
          </header>

          <main className="px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

