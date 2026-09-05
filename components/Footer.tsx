"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { CrescentLogo } from "@/components/CrescentLogo";

const COLS = [
  {
    heading: "Quran & Hadith",
    links: [
      { href: "/quran", label: "Al-Quran Al-Kareem" },
      { href: "/hadith", label: "Hadith Collection" },
      { href: "/duas", label: "Du'as & Azkar" },
      { href: "/reflections", label: "Daily Reflections" },
    ],
  },
  {
    heading: "Islamic Tools",
    links: [
      { href: "/prayer-times", label: "Prayer Times" },
      { href: "/zikr", label: "Zikr & Tasbeeh Hub" },
      { href: "/qibla", label: "Qibla Direction" },
      { href: "/more", label: "Five Pillars of Islam" },
    ],
  },
  {
    heading: "Features & Pages",
    links: [
      { href: "/ai-search", label: "Hidayah Search" },
      { href: "/quiz", label: "Islamic Quiz" },
      { href: "/about", label: "About Hidayah Hub" },
      { href: "/donate", label: "Donate 💛" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-[#BFA059] bg-gradient-to-b from-[#1A202C] via-[#121A26] to-[#0A111A] text-slate-300">
      {/* ── Main Section ── */}
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">

          {/* Brand Column */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative flex size-10 items-center justify-center rounded-2xl bg-[#BFA059]/15 border border-[#BFA059]/40 shadow-[0_0_15px_rgba(191,160,89,0.2)]">
                  <CrescentLogo className="size-6 text-[#BFA059]" />
                </div>
                <div>
                  <p className="font-serif text-xl font-bold tracking-tight text-[#BFA059]">Hidayah Hub</p>
                  <p className="text-[10px] font-semibold text-slate-400">ہدایت کا مرکز · Faithful Companion</p>
                </div>
              </div>

              <p className="mt-3 max-w-xs text-xs leading-relaxed text-slate-300">
                A serene digital companion bringing Quran, Hadith, Prayer Times, Search, and Daily Zikr to every Muslim.
              </p>
            </div>

            {/* Bismillah Calligraphy Card */}
            <div className="rounded-2xl border border-[#BFA059]/30 bg-gradient-to-r from-[#BFA059]/15 to-[#BFA059]/5 px-4 py-2.5 shadow-md">
              <p dir="rtl" lang="ar" className="font-arabic text-xl font-bold text-[#BFA059] text-center">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-center text-[10px] text-slate-300 mt-0.5">
                In the name of Allah, Most Gracious, Most Merciful
              </p>
            </div>
          </div>

          {/* Link Columns */}
          {COLS.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#BFA059]">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center text-xs font-medium text-slate-300 transition-all duration-200 hover:text-[#BFA059] hover:translate-x-1"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Islamic Calligraphy Accent Line ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#BFA059]/30 to-transparent" />
          <span className="font-arabic text-lg text-[#BFA059]/80 font-bold">﷽</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#BFA059]/30 to-transparent" />
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-[#BFA059]/15 bg-[#090E17] py-3.5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2.5 px-4 text-center sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-[#BFA059]">Hidayah Hub</span>. All rights reserved.
          </p>

          <p dir="rtl" className="font-arabic text-xs font-semibold text-[#BFA059]">
            ایک چھوٹا سا قدم دینِ اسلام کی خدمت میں
          </p>

          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            Made with <Heart className="size-3.5 fill-[#BFA059] text-[#BFA059]" /> for the Global Ummah
          </p>
        </div>
      </div>
    </footer>
  );
}