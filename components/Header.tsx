"use client";

import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Feather,
  Hand,
  Heart,
  Home,
  Info,
  Menu,
  ScrollText,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CrescentLogo } from "@/components/CrescentLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
  /** Lucide icon shown in the mobile drawer. */
  icon?: React.ComponentType<{ className?: string }>;
}

const PRIMARY_LINKS: NavLink[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/quran", label: "Quran", icon: BookOpen },
  { href: "/ai", label: "AI Search", icon: Sparkles },
  { href: "/zikr", label: "Zikr", icon: Hand },
  { href: "/reflections", label: "Reflections", icon: Feather },
];

const MORE_LINKS: NavLink[] = [
  { href: "/prayer-times", label: "Prayer Times", icon: Clock },
  { href: "/hadith", label: "Hadith", icon: ScrollText },
  { href: "/duas", label: "Du'as", icon: Heart },
  { href: "/qibla", label: "Qibla", icon: Compass },
  { href: "/about", label: "About", icon: Info },
];

/** A single drawer row (mobile menu) with icon box + active indicator. */
function DrawerLink({
  link,
  active,
  onNavigate,
}: {
  link: NavLink;
  active: boolean;
  onNavigate: () => void;
}) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={cn(
        "group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98]",
        active
          ? "bg-gold-500/15 text-gold-800 dark:text-gold-200"
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-night-800"
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
          active
            ? "border-gold-500 bg-gold-500/25 text-gold-600"
            : "border-slate-200 bg-white text-slate-500 dark:border-night-800 dark:bg-night-950 dark:text-slate-300"
        )}
      >
        {Icon ? <Icon className="size-4.5" aria-hidden /> : null}
      </span>
      <span className="min-w-0 flex-1 truncate text-left text-[15px] font-semibold leading-snug text-slate-800 dark:text-slate-100">
        {link.label}
      </span>
      {active ? (
        <span
          className="size-1.5 shrink-0 rounded-full bg-[#BFA059] shadow-[0_0_6px_rgba(191,160,89,0.8)]"
          aria-label="Current page"
        />
      ) : (
        <ChevronRight className="size-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" />
      )}
    </Link>
  );
}
export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer & desktop dropdown on page change.
  useEffect(() => {
    // react-hooks rule would flag this, but closing on navigation is expected.
    /* eslint-disable react-hooks/set-state-in-effect */
    setMenuOpen(false);
    setMoreOpen(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  // Close desktop "More" dropdown on outside click.
  useEffect(() => {
    if (!moreOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [moreOpen]);

  // Lock body scroll + support Escape-to-close while the drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-cream/95 dark:border-night-800 dark:bg-night-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2.5 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5"
          aria-label="Hidayah Hub — Home"
        >
          <CrescentLogo className="size-9 shrink-0 transition-transform duration-300 group-hover:rotate-12" />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-serif text-lg font-semibold tracking-tight text-brand-950 dark:text-gold-50">
              Hidayah Hub
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold-600 dark:text-gold-400">
              هداية · Guidance
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-brand-900 dark:text-gold-200"
                  : "text-slate-600 hover:text-brand-900 dark:text-slate-300 dark:hover:text-gold-200"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-gold-500 transition-opacity",
                  isActive(link.href) ? "opacity-100" : "opacity-0"
                )}
                aria-hidden
              />
            </Link>
          ))}
{/* More dropdown (desktop) */}
          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
              aria-label="More pages"
              className="ml-0.5 flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors text-slate-600 hover:text-brand-900 dark:text-slate-300 dark:hover:text-gold-200"
            >
              More
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  moreOpen && "rotate-180"
                )}
                aria-hidden
              />
            </button>
            {moreOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-brand-950/5 dark:border-night-800 dark:bg-night-900"
              >
                {MORE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "bg-gold-500/10 text-gold-700 dark:text-gold-300"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-night-800"
                    )}
                  >
                    {link.icon ? <link.icon className="size-4 text-gold-500" aria-hidden /> : null}
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/donate"
            aria-label="Donate"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#BFA059] to-[#D4AF37] px-2.5 text-sm font-bold text-[#1A202C] shadow-md shadow-[#BFA059]/20 transition-all hover:scale-105 hover:shadow-lg active:scale-95 sm:px-4"
          >
            <Heart className="size-4 fill-[#1A202C] text-[#1A202C]" aria-hidden />
            <span className="hidden min-[480px]:inline">Donate 💛</span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-gold-400 hover:text-gold-600 lg:hidden dark:border-night-800 dark:bg-night-900 dark:text-slate-300"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>
</header>
{/* ══ MOBILE DRAWER (slide-over from the right) ═══════════════════════ */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          menuOpen ? "visible" : "invisible pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-slate-900/55 backdrop-blur-sm dark:bg-night-950/70",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
          style={{ transition: "opacity 0.3s ease" }}
        />

        {/* Drawer panel */}
        <div
          className={cn(
            "absolute right-0 top-0 z-10 h-full w-[85%] max-w-sm overflow-y-auto overscroll-contain border-l border-slate-200 bg-cream shadow-2xl dark:border-night-800 dark:bg-night-900",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
          style={{ transition: "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer header */}
          <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-slate-200/70 px-4 py-3 backdrop-blur-md dark:border-night-800">
            <div className="flex min-w-0 items-center gap-2.5">
              <CrescentLogo className="size-8 shrink-0" />
              <div className="min-w-0 leading-tight">
                <p className="truncate font-serif text-base font-bold text-brand-950 dark:text-gold-50">
                  Hidayah Hub
                </p>
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">
                  هداية · Guidance
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-gold-400 hover:text-gold-600 dark:border-night-800 dark:bg-night-950 dark:text-slate-300"
            >
              <X className="size-4.5" aria-hidden />
            </button>
          </div>

          {/* Drawer body */}
          <div className="space-y-6 px-4 pb-4 pt-4">
            {/* Main section */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#BFA059]">
                Main
              </p>
              <ul className="mt-2 space-y-1">
                {PRIMARY_LINKS.map((link) => (
                  <li key={link.href}>
                    <DrawerLink
                      link={link}
                      active={isActive(link.href)}
                      onNavigate={() => setMenuOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore section */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#BFA059]">
                Explore
              </p>
              <ul className="mt-2 space-y-1">
                {MORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <DrawerLink
                      link={link}
                      active={isActive(link.href)}
                      onNavigate={() => setMenuOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Donate CTA */}
            <Link
              href="/donate"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#BFA059] to-[#D4AF37] px-5 py-3.5 text-sm font-bold text-[#1A202C] shadow-lg shadow-[#BFA059]/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Heart className="size-4.5 fill-[#1A202C] text-[#1A202C]" aria-hidden />
              Donate &amp; Support Hidayah Hub
            </Link>

            <p
              dir="rtl"
              lang="ar"
              className="pt-1 text-center font-arabic text-lg font-bold text-[#BFA059]"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        </div>
      </div>
    </>
  );
}