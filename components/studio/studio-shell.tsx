"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Image as ImageIcon, BookOpen, Star, LayoutGrid, Users, Briefcase, Phone, Settings, HeartHandshake, Code } from "lucide-react";
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "Dashboard", href: "/studio", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Hero", href: "/studio/hero", icon: <HeartHandshake className="h-4 w-4" /> },
      { label: "Addon Dev", href: "/studio/addon-development", icon: <Code className="h-4 w-4" /> },
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
  const activeLabel = navItems.find((x) => x.href === active)?.label ?? "Dashboard";

  // Close drawer on route change (mobile)
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100">
      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0B1020]/95 backdrop-blur lg:hidden",
          "transition-transform duration-200",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFCFC9] to-[#9AE6FF] text-[#0B1020] font-black">
              I
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">INNOCRAFT</p>
              <p className="text-xs text-white/60">Studio</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
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
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-5">
          <SecondaryButton
            onClick={() => {
              clearStudioSessionCookie();
              window.location.href = "/studio/login";
            }}
            className="w-full bg-white/5 text-white border-white/10 hover:bg-white/10"
          >
            Logout
          </SecondaryButton>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-white/10 lg:bg-[#0B1020]/90 lg:backdrop-blur">
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFCFC9] to-[#9AE6FF] text-[#0B1020] font-black">
              I
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">INNOCRAFT</p>
              <p className="text-xs text-white/60">Studio</p>
            </div>
          </div>
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
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-5">
          <SecondaryButton
            onClick={() => {
              clearStudioSessionCookie();
              window.location.href = "/studio/login";
            }}
            className="w-full bg-white/5 text-white border-white/10 hover:bg-white/10"
          >
            Logout
          </SecondaryButton>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header - Mobile optimized */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B1020]/85 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold sm:text-xl">Studio</h1>
                <p className="text-xs text-white/60 sm:text-sm">{activeLabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 sm:px-4 sm:py-2 sm:text-sm md:block">
                {activeLabel}
              </div>
              <Link
                href="/studio/logout"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 sm:px-4 sm:py-2 sm:text-sm"
              >
                Logout
              </Link>
            </div>
          </div>
        </header>

        {/* Main content with responsive padding */}
        <main className="w-full px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-full lg:max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}