"use client";

import { ChevronDown, Clock, Compass, Heart, Info, Menu, ScrollText, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CrescentLogo } from "@/components/CrescentLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/quran", label: "Quran" },
  { href: "/ai", label: "AI Search" },
  { href: "/zikr", label: "Zikr" },
  { href: "/reflections", label: "Reflections" },
];

const MORE_LINKS = [
  { href: "/prayer-times", label: "Prayer Times", icon: Clock },
  { href: "/hadith", label: "Hadith", icon: ScrollText },
  { href: "/duas", label: "Du'as", icon: Heart },
  { href: "/qibla", label: "Qibla", icon: Compass },
  { href: "/about", label: "About", icon: Info },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-cream/85 backdrop-blur-lg dark:border-night-800 dark:bg-night-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Hidayah Hub — Home"
        >
          <CrescentLogo className="size-9 transition-transform duration-300 group-hover:rotate-12" />
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-lg font-semibold tracking-tight text-brand-950 dark:text-gold-50">
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

          {/* More + dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-brand-900 dark:text-slate-300 dark:hover:text-gold-200"
            >
              More
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  moreOpen && "rotate-180"
                )}
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
                    <link.icon className="size-4 text-gold-500" aria-hidden />
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/donate"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#BFA059] to-[#D4AF37] px-4 py-2 text-sm font-bold text-[#1A202C] shadow-md shadow-[#BFA059]/20 transition-all hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <Heart className="size-4 fill-[#1A202C] text-[#1A202C]" />
            Donate 💛
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-gold-400 hover:text-gold-600 lg:hidden dark:border-night-800 dark:bg-night-900 dark:text-slate-300"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="border-t border-slate-200/70 bg-cream/95 px-4 pb-4 pt-2 backdrop-blur-lg lg:hidden dark:border-night-800 dark:bg-night-950/95"
          aria-label="Mobile"
        >
          <ul className="flex flex-col">
            {[...PRIMARY_LINKS, ...MORE_LINKS].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-gold-500/10 text-gold-700 dark:text-gold-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-night-800"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}