"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const BANNERS = [
  {
    id: 1,
    type: "AYAT OF THE DAY",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ",
    english: "And whoever relies upon Allah — then He is sufficient for him. Indeed, Allah will accomplish His purpose.",
    urdu: "جو اللہ پر بھروسہ کرے، تو وہ اس کے لیے کافی ہے۔ بے شک اللہ اپنا کام پورا کر کے رہتا ہے۔",
    reference: "SURAH AT-TALAQ · 65:3",
    cta: "📖 Read Quran",
    ctaHref: "/quran",
    accent: "#BFA059",
    gradFrom: "#1A202C",
    gradTo: "#111823",
  },
  {
    id: 2,
    type: "HADITH OF THE DAY",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    english: "Indeed, deeds are only by intentions, and every person shall have only what they intended.",
    urdu: "بے شک اعمال کا دارومدار نیتوں پر ہے، اور ہر انسان کو وہی ملے گا جس کی اس نے نیت کی۔",
    reference: "SAHIH BUKHARI · 1 / SAHIH MUSLIM · 1907",
    cta: "📚 Explore Hadith",
    ctaHref: "/hadith",
    accent: "#D4AF37",
    gradFrom: "#16222F",
    gradTo: "#0F1722",
  },
  {
    id: 3,
    type: "DU'A OF THE DAY",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    english: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    urdu: "اے ہمارے رب! ہمیں دنیا میں اور آخرت میں بھلائی عطا فرما اور ہمیں آگ کے عذاب سے محفوظ رکھ۔",
    reference: "SURAH AL-BAQARAH · 2:201",
    cta: "🤲 Daily Du'as",
    ctaHref: "/duas",
    accent: "#E2C068",
    gradFrom: "#1E2634",
    gradTo: "#121A26",
  },
  {
    id: 4,
    type: "REFLECTION",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "For indeed, with hardship will be ease. Indeed, with hardship will be ease.",
    urdu: "پس بے شک تکلیف کے ساتھ آسانی ہے۔ بے شک تکلیف کے ساتھ آسانی ضرور ہے۔",
    reference: "SURAH ASH-SHARH · 94:5-6",
    cta: "✨ Reflections",
    ctaHref: "/reflections",
    accent: "#C5A059",
    gradFrom: "#17212D",
    gradTo: "#0D1520",
  },
];

export function HeroBannerCarousel() {
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);

  const goTo = (idx: number) => {
    if (idx === active) return;
    setFade(false);
    setTimeout(() => {
      setActive(idx);
      setFade(true);
    }, 220);
  };

  const prev = () => goTo((active - 1 + BANNERS.length) % BANNERS.length);
  const next = () => goTo((active + 1) % BANNERS.length);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setActive((a) => (a + 1) % BANNERS.length);
        setFade(true);
      }, 220);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const b = BANNERS[active];

  return (
    <div
      className="relative w-full overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/70 shadow-[0_0_50px_rgba(191,160,89,0.35)] transition-colors duration-700 select-none"
      style={{
        height: "440px",
        minHeight: "440px",
        maxHeight: "440px",
      }}
    >
      {/* AI Search Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/ai-banner.jpg"
          alt="Home Hero Banner Background"
          fill
          className="object-cover object-center scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/85 via-black/60 to-[#070D18]/75" />
      </div>
      {/* Background Decorative Gold Lighting */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${b.accent} 0%, transparent 70%)` }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-70" />

      {/* Main Layout Container */}
      <div className="relative z-10 flex h-full items-center justify-between px-6 sm:px-10 lg:px-14 py-6">

        {/* LEFT IMAGE: Roza Pak Medina (Larger & Prominent) */}
        <div className="hidden lg:flex flex-col items-center shrink-0 w-[210px]">
          <div className="group relative w-[210px] h-[270px] overflow-hidden rounded-t-[7rem] rounded-b-3xl border-2 border-[#BFA059] shadow-[0_0_35px_rgba(191,160,89,0.45)] transition-all duration-500 hover:scale-105 hover:border-gold-300">
            <Image
              src="/roza-pak.jpg"
              alt="Roza Pak Medina"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-3 inset-x-0 text-center">
              <span className="inline-block rounded-full bg-black/80 px-3.5 py-1 font-serif text-xs font-bold text-[#BFA059] backdrop-blur-md border border-[#BFA059]/50 shadow-md">
                روضہِ رسول ﷺ
              </span>
            </div>
          </div>
        </div>

        {/* CENTER TEXT CONTENT */}
        <div
          className={cn(
            "flex flex-1 flex-col items-center justify-center text-center transition-all duration-300 px-2 sm:px-8 h-full max-w-2xl mx-auto",
            fade ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          {/* Mobile Floating Image Badges (Larger) */}
          <div className="flex lg:hidden items-center justify-center gap-3.5 mb-2.5">
            <div className="relative size-14 overflow-hidden rounded-t-full rounded-b-lg border-2 border-[#BFA059] shadow-lg">
              <Image src="/roza-pak.jpg" alt="Roza Pak" fill className="object-cover" />
            </div>
            <span
              className="inline-flex items-center gap-1 rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] shadow-md"
              style={{
                border: `1px solid ${b.accent}80`,
                color: b.accent,
                background: "rgba(26, 32, 44, 0.9)",
              }}
            >
              ✦ {b.type} ✦
            </span>
            <div className="relative size-14 overflow-hidden rounded-t-full rounded-b-lg border-2 border-[#BFA059] shadow-lg">
              <Image src="/kaaba.jpg" alt="Kaaba Mecca" fill className="object-cover" />
            </div>
          </div>

          {/* Desktop Badge Header */}
          <span
            className="hidden lg:inline-flex items-center gap-1.5 rounded-full px-4.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] mb-3 shadow-md backdrop-blur-md"
            style={{
              border: `1px solid ${b.accent}80`,
              color: b.accent,
              background: "rgba(26, 32, 44, 0.85)",
            }}
          >
            <Moon className="size-3.5 text-[#BFA059]" /> {b.type}
          </span>

          {/* Arabic Calligraphy */}
          <p
            dir="rtl"
            lang="ar"
            className="w-full font-arabic leading-[2.1] text-white"
            style={{
              fontSize: "clamp(1.45rem, 2.8vw, 2.2rem)",
              fontWeight: 700,
              textShadow: "0 4px 20px rgba(0,0,0,0.8)",
            }}
          >
            {b.arabic}
          </p>

          {/* Muted Gold Divider */}
          <div
            className="my-3 h-px w-32 rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${b.accent}, transparent)` }}
          />

          {/* English Translation */}
          <p className="max-w-lg text-xs sm:text-sm font-medium leading-relaxed text-slate-200 line-clamp-2">
            &ldquo;{b.english}&rdquo;
          </p>

          {/* Urdu Translation */}
          <p
            dir="rtl"
            className="mt-1.5 max-w-lg font-arabic text-sm sm:text-base font-semibold leading-loose line-clamp-2"
            style={{ color: b.accent, textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}
          >
            &ldquo;{b.urdu}&rdquo;
          </p>

          {/* Reference Source */}
          <p className="mt-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            ({b.reference})
          </p>

          {/* Call-To-Action Button */}
          <a
            href={b.ctaHref}
            className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-2.5 text-xs sm:text-sm font-bold text-[#1A202C] shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(191,160,89,0.6)] active:scale-95"
            style={{ background: b.accent }}
          >
            {b.cta} →
          </a>
        </div>

        {/* RIGHT IMAGE: Kaaba Mecca (Larger & Prominent) */}
        <div className="hidden lg:flex flex-col items-center shrink-0 w-[210px]">
          <div className="group relative w-[210px] h-[270px] overflow-hidden rounded-t-[7rem] rounded-b-3xl border-2 border-[#BFA059] shadow-[0_0_35px_rgba(191,160,89,0.45)] transition-all duration-500 hover:scale-105 hover:border-gold-300">
            <Image
              src="/kaaba.jpg"
              alt="Kaaba Mecca"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-3 inset-x-0 text-center">
              <span className="inline-block rounded-full bg-black/80 px-3.5 py-1 font-serif text-xs font-bold text-[#BFA059] backdrop-blur-md border border-[#BFA059]/50 shadow-md">
                مکہ مکرمہ 🕋
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Navigation Arrow — Left */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-5 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-[#BFA059]/40 transition hover:bg-black/80 hover:scale-110"
      >
        <ChevronLeft className="size-5 text-[#BFA059]" />
      </button>

      {/* Navigation Arrow — Right */}
      <button
        type="button"
        onClick={next}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-5 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-[#BFA059]/40 transition hover:bg-black/80 hover:scale-110"
      >
        <ChevronRight className="size-5 text-[#BFA059]" />
      </button>

      {/* Slider Pagination Dots */}
      <div className="absolute bottom-3.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: i === active ? "30px" : "8px",
              height: "7px",
              background: i === active ? b.accent : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
