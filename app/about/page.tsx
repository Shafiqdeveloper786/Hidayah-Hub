import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Feather,
  Globe2,
  HeartHandshake,
  MoonStar,
  Quote,
  Search,
  ShieldCheck,
  Volume2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Hidayah Hub",
  description:
    "About Hidayah Hub — a serene, accurate, and ad-free digital companion for the Muslim believer: complete Quran PDF, 6 full Hadith books, prayer times with auto-Adhan, AI guidance, Duas, Zikr and Qibla.",
};

const FEATURES = [
  {
    icon: BookOpen,
    title: "The Noble Qur'an",
    desc: "Complete 114 Surahs with clear Arabic scripts, translations, audio recitations, and a direct full Quran PDF download.",
    href: "/quran",
    color: "from-amber-500/20 to-amber-700/10",
  },
  {
    icon: MoonStar,
    title: "Prayer Times & Auto-Adhan",
    desc: "Verified solar geometry calculation for exact Salah schedules, live countdown timers, and authentic Makkah Adhan that plays automatically at prayer time.",
    href: "/prayer-times",
    color: "from-[#BFA059]/20 to-amber-600/10",
  },
  {
    icon: Compass,
    title: "Interactive Qibla Finder",
    desc: "Great-circle bearing calculations to Makkah (21.42° N, 39.82° E) with real-time compass dial orientation.",
    href: "/qibla",
    color: "from-emerald-500/20 to-emerald-700/10",
  },
  {
    icon: ShieldCheck,
    title: "Authentic Hadith Library",
    desc: "Complete Kutub al-Sittah — Sahih al-Bukhari, Sahih Muslim, Sunan, and Jami' collections in full with Arabic, Urdu & English and full citations.",
    href: "/hadith",
    color: "from-blue-500/20 to-blue-700/10",
  },
  {
    icon: HeartHandshake,
    title: "Masnoon Du'as & Azkar",
    desc: "Sunnah supplications categorized for daily moments with English & Urdu translations, bookmarks, and audio speech.",
    href: "/duas",
    color: "from-purple-500/20 to-purple-700/10",
  },
  {
    icon: Search,
    title: "AI Search Guidance",
    desc: "Intelligent search & accurate answers grounded strictly in authentic Quranic and Hadith sources — in English and Urdu.",
    href: "/ai-search",
    color: "from-amber-400/20 to-[#BFA059]/20",
  },
];

const VALUES = [
  {
    icon: Feather,
    title: "Spiritual Beauty & Sobriety",
    text: "Designed to evoke the serene, peaceful atmosphere of the Masjid — zero clutter, zero popups, zero intrusive ads.",
  },
  {
    icon: CheckCircle2,
    title: "Absolute Precision & Accuracy",
    text: "Prayer times computed via high-precision astronomical algorithms; Hadith & Quranic texts curated from recognized editions.",
  },
  {
    icon: Globe2,
    title: "Free & Sadaqah Jariyah",
    text: "Hidayah Hub is built as an open gift for the global Ummah. It is 100% free with no paywalls or hidden subscriptions.",
  },
  {
    icon: MoonStar,
    title: "Privacy First Architecture",
    text: "No account creation, no analytics tracking, no selling of user data. Your worship remains private between you and Allah.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Luxury Hero Banner matching /ai-search */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/70 shadow-[0_0_50px_rgba(191,160,89,0.35)] min-h-[320px] flex items-center justify-center text-center text-white py-10 px-4 sm:px-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-banner.jpg"
            alt="About Hidayah Hub Banner"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/80 via-black/40 to-[#070D18]/70" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-95" />
        </div>

        <div className="relative z-10 p-4 sm:p-8 text-center text-white space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/80 bg-[#121A26]/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#BFA059] backdrop-blur-md shadow-md">
            <BookOpen className="size-4 text-[#BFA059]" />
            هداية · Hidayah Digital Sanctuary
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            About <span className="text-[#D1B876]">Hidayah Hub</span>
          </h1>

          <p className="text-xs sm:text-base text-[#EAD090] font-semibold max-w-2xl mx-auto leading-relaxed">
            A peaceful, elegant, and authentic digital companion for every Muslim believer — the complete Qur'an with PDF download, 6 full Hadith books, accurate prayer times with auto-Adhan, Sunnah Du'as, daily Zikr, AI guidance, and Qibla direction.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="rounded-2xl border border-[#BFA059]/40 bg-black/60 px-5 py-2.5 backdrop-blur-md text-xs font-bold text-[#D1B876]">
              📖 114 Quranic Surahs + PDF
            </div>
            <div className="rounded-2xl border border-[#BFA059]/40 bg-black/60 px-5 py-2.5 backdrop-blur-md text-xs font-bold text-[#D1B876]">
              🕌 Auto-Adhan at Prayer Time
            </div>
            <div className="rounded-2xl border border-[#BFA059]/40 bg-black/60 px-5 py-2.5 backdrop-blur-md text-xs font-bold text-[#D1B876]">
              📚 6 Complete Hadith Books (Kutub al-Sittah)
            </div>
            <div className="rounded-2xl border border-[#BFA059]/40 bg-black/60 px-5 py-2.5 backdrop-blur-md text-xs font-bold text-[#D1B876]">
              🤖 Ai-based Islamic Guidance
            </div>
            <Link
              href="/donate"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[#BFA059] bg-[#BFA059]/15 px-5 py-2.5 backdrop-blur-md text-xs font-bold text-[#EAD090] shadow-md transition hover:bg-[#BFA059]/30"
            >
              💛 Support Us · Donate
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement Box */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-[#BFA059]/40 bg-gradient-to-br from-[#FAF7F0] via-[#F5EFE0] to-[#EFE7D0] p-8 sm:p-12 shadow-xl dark:border-night-800 dark:from-night-900 dark:via-night-950 dark:to-night-900">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Quote className="mx-auto size-10 text-[#BFA059]" />
          <p
            dir="rtl"
            className="font-arabic text-2xl sm:text-3xl font-bold leading-loose text-slate-900 dark:text-gold-100"
          >
            وَقُل رَّبِّ زِدْنِي عِلْمًا
          </p>
          <p className="text-sm font-serif italic text-slate-700 dark:text-slate-300">
            “And say: My Lord, increase me in knowledge.” — Surah Taha (20:114)
          </p>
          <div className="h-0.5 w-24 mx-auto bg-[#BFA059]/40 my-4" />
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Hidayah Hub was created out of a deep desire to provide Muslims around the globe with a dignified digital environment. In an era filled with overwhelming notifications and noisy applications, Hidayah Hub serves as a calm sanctuary where you can read the Qur'an, verify Salah times, discover authentic supplications, and connect with sacred knowledge.
          </p>
        </div>
      </div>

      {/* Core Features Grid */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#BFA059]">
            Comprehensive Platform
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-gold-100">
            Everything You Need in One Place
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.title}
                href={f.href}
                className="group relative flex flex-col justify-between rounded-[2rem] border border-[#BFA059]/40 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#BFA059] hover:shadow-2xl dark:bg-night-900"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#BFA059] to-[#8C6F2D] text-black shadow-md">
                      <Icon className="size-6" />
                    </span>
                    <span className="text-xs font-bold text-[#BFA059] opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore →
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-gold-100 group-hover:text-[#BFA059] transition-colors">
                    {f.title}
                  </h3>

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {f.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Core Principles & Values */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#BFA059]">
            Our Foundational Pillars
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-gold-100">
            Principles We Stand By
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {VALUES.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="rounded-[2rem] border border-[#BFA059]/40 bg-white p-6 shadow-md transition-all hover:border-[#BFA059] dark:bg-night-900 space-y-3"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-[#BFA059]/20 text-[#BFA059]">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-gold-100">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {val.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modern Technology Stack Card */}
      <div className="rounded-[2.5rem] border border-[#BFA059]/40 bg-gradient-to-b from-[#1A202C] to-[#0F141C] p-8 text-white shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-700/60 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D1B876]">
              Engineering Excellence
            </span>
            <h3 className="font-serif text-2xl font-bold text-white mt-1">
              Built with Modern Web Technologies
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/40 bg-black/40 px-4 py-1.5 text-xs font-semibold text-[#D1B876]">
            Fast, Reliable &amp; Responsive
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 text-xs text-slate-300">
          <div className="rounded-2xl border border-slate-800 bg-black/40 p-4 space-y-1">
            <p className="font-bold text-[#D1B876]">Next.js 16 (App Router)</p>
            <p className="text-slate-400">Server-side rendering, instant page transitions, and static site generation.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-black/40 p-4 space-y-1">
            <p className="font-bold text-[#D1B876]">TypeScript &amp; Tailwind</p>
            <p className="text-slate-400">Strict type safety, responsive design system, and custom Islamic gold themes.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-black/40 p-4 space-y-1">
            <p className="font-bold text-[#D1B876]">HTML5 Web Audio &amp; GPS</p>
            <p className="text-slate-400">Native browser audio streaming for Makkah Adhan and Geolocation APIs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
