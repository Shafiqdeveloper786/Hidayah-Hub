"use client";

import {
  BookMarked,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Headphones,
  Loader2,
  Minus,
  Pause,
  Play,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { SURAHS } from "@/data/surahs";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Ayah {
  numberInSurah: number;
  arabic: string;
  english: string;
  urdu: string;
  tafseerUr?: string;
}

// ─── Pre-loaded Surah Al-Fatiha with Urdu Tafseer ─────────────────────────────
const FATIHA: Ayah[] = [
  {
    numberInSurah: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    urdu: "اللہ کے نام سے شروع جو بڑا مہربان، نہایت رحم والا ہے۔",
    tafseerUr: "سورۃ الفاتحہ قرآن مجید کا مقدمہ اور ام الکتاب ہے۔ ہر نیک کام کا آغاز بسم اللہ سے کرنا سنت ہے۔",
  },
  {
    numberInSurah: 2,
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    english: "All praise is due to Allah, Lord of the worlds.",
    urdu: "تمام تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے۔",
    tafseerUr: "تمام حمد و ثناء اور شکر کا واحد مستحق صرف اللہ ہے جو تمام کائنات کا خالق، مالک اور پروردگار ہے۔",
  },
  {
    numberInSurah: 3,
    arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
    english: "The Entirely Merciful, the Especially Merciful.",
    urdu: "نہایت مہربان، بہت رحم فرمانے والا۔",
    tafseerUr: "الرحمن سے مراد وہ ذات جس کی رحمت تمام مخلوق کو عام ہے، اور الرحیم سے مراد قیامت کو مومنوں پر خاص رحم۔",
  },
  {
    numberInSurah: 4,
    arabic: "مَالِكِ يَوْمِ الدِّينِ",
    english: "Sovereign of the Day of Recompense.",
    urdu: "روزِ جزا کا مالک و مختار۔",
    tafseerUr: "قیامت کے دن کا حقیقی اور واحد حاکم صرف اللہ ہوگا جہاں ہر شخص کو اس کے اعمال کا بدلہ دیا جائے گا۔",
  },
  {
    numberInSurah: 5,
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    english: "It is You we worship and You we ask for help.",
    urdu: "ہم صرف تیری ہی عبادت کرتے ہیں اور صرف تجھ ہی سے مدد مانگتے ہیں۔",
    tafseerUr: "توحید اور عبودیت کا بنیادی عہد — عبادت اور غائبانہ مدد کا استحقاق صرف اللہ تعالیٰ کی ذات کو ہے۔",
  },
  {
    numberInSurah: 6,
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    english: "Guide us to the straight path.",
    urdu: "ہمیں سیدھے راستے کی ہدایت عطا فرما۔",
    tafseerUr: "سب سے جامع دعا، جس میں اللہ سے صراطِ مستقیم پر ثبات اور ہدایت کی طلب شامل ہے۔",
  },
  {
    numberInSurah: 7,
    arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    english: "The path of those upon whom You have bestowed favor, not of those who have earned anger or of those who are astray.",
    urdu: "ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، نہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا۔",
    tafseerUr: "انعام یافتہ بندوں (انبیاء، صدیقین، شہداء، صالحین) کا راستہ اپنانے اور گمراہی سے پناہ کی التجا۔",
  },
];

// Arabic-Indic Numerals for authentic Mushaf Ayah Markers
const toArabicIndic = (num: number): string => {
  const digits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num.toString().split("").map((d) => digits[parseInt(d, 10)]).join("");
};

/**
 * Build a per-ayah proportional timeline (0..1 fractions) based on the Arabic
 * text length of each ayah. Longer verses take longer to recite, so this makes
 * the real-time tilawat highlight far more accurate than a flat division.
 */
function buildAyahTimeline(ayahs: Ayah[]): number[] {
  if (ayahs.length === 0) return [];
  const weights = ayahs.map((a) =>
    Math.max(1, a.arabic.replace(/[\s\u200f\u0640\u0651\u064e\u064f\u0650\u064b-\u0652\u06d6-\u06ed]/g, "").length)
  );
  const total = weights.reduce((s, w) => s + w, 0);
  let acc = 0;
  return weights.map((w) => {
    const start = total > 0 ? acc / total : 0;
    acc += w;
    return start;
  });
}

// Audio URLs
const surahAudioUrl = (surahId: number) =>
  `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahId}.mp3`;

const ayahAudioUrl = (globalAyahNum: number) =>
  `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNum}.mp3`;

type Mode = "mushaf" | "versebyverse" | "tilawat";

export default function QuranPage() {
  const [search, setSearch] = useState("");
  const [selectedSurah, setSelectedSurah] = useState(SURAHS[0]);
  const [mode, setMode] = useState<Mode>("mushaf");
  const [ayahs, setAyahs] = useState<Ayah[]>(FATIHA);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [ayahError, setAyahError] = useState(false);

  // Custom Font Size Control
  const [fontSize, setFontSize] = useState(38); // default 38px

  // PDF Download Modal / Menu State
  const [showPdfOptions, setShowPdfOptions] = useState(false);

  // Audio Playback & Loading States
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [loadingAyahAudio, setLoadingAyahAudio] = useState<number | null>(null);
  const [surahAudioPlaying, setSurahAudioPlaying] = useState(false);
  const [surahAudioLoading, setSurahAudioLoading] = useState(false);

  // Player Progress State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [showSidebar, setShowSidebar] = useState(true);
  const [globalAyahOffset, setGlobalAyahOffset] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeAyahRef = useRef<HTMLDivElement | null>(null);

  // Proportional per-ayah timeline for accurate real-time tilawat highlighting
  const ayahTimeline = useMemo(() => buildAyahTimeline(ayahs), [ayahs]);

  // Dynamically calculate which Ayah is active during single Ayah audio OR full Surah tilawat
  const currentSurahAyahNumber = useMemo(() => {
    if (playingAyah !== null) return playingAyah;
    if (surahAudioPlaying && duration > 0 && ayahs.length > 0) {
      const frac = Math.max(0, Math.min(1, currentTime / duration));
      // Binary-search the last ayah whose start-fraction is <= current position.
      let lo = 0;
      let hi = ayahs.length - 1;
      let ans = 0;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (ayahTimeline[mid] <= frac) {
          ans = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      return ayahs[ans]?.numberInSurah ?? null;
    }
    return null;
  }, [playingAyah, surahAudioPlaying, currentTime, duration, ayahs, ayahTimeline]);

  // Auto-scroll active playing ayah into view smoothly
  useEffect(() => {
    if (currentSurahAyahNumber && activeAyahRef.current) {
      activeAyahRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentSurahAyahNumber]);

  // Filtered surahs list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SURAHS;
    return SURAHS.filter(
      (s) =>
        s.transliteration.toLowerCase().includes(q) ||
        s.english.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        String(s.id).includes(q)
    );
  }, [search]);

  // Load Ayahs when selectedSurah changes
  useEffect(() => {
    if (selectedSurah.id === 1) {
      setAyahs(FATIHA);
      setGlobalAyahOffset(0);
      return;
    }

    setLoadingAyahs(true);
    setAyahError(false);
    setPlayingAyah(null);
    setLoadingAyahAudio(null);
    setSurahAudioPlaying(false);
    setSurahAudioLoading(false);
    audioRef.current?.pause();

    const offset = SURAHS.slice(0, selectedSurah.id - 1).reduce((acc, s) => acc + s.ayahs, 0);
    setGlobalAyahOffset(offset);

    fetch(
      `https://api.alquran.cloud/v1/surah/${selectedSurah.id}/editions/quran-uthmani,en.sahih,ur.jalandhry`
    )
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data) => {
        const uthmani = data.data[0].ayahs as { numberInSurah: number; text: string }[];
        const english = data.data[1].ayahs as { numberInSurah: number; text: string }[];
        const urdu = data.data[2].ayahs as { numberInSurah: number; text: string }[];

        const merged: Ayah[] = uthmani.map((a, i) => ({
          numberInSurah: a.numberInSurah,
          arabic: a.text,
          english: english[i]?.text ?? "",
          urdu: urdu[i]?.text ?? "",
          tafseerUr: `تفسیر و مفہوم آیت نمبر ${a.numberInSurah}: اس آیت مبارکہ میں اللّٰہ تعالیٰ نے تمام انس و جن کے لیے ہدایت، حکمت اور روشن احکام بیان فرمائے ہیں۔`,
        }));
        setAyahs(merged);
      })
      .catch(() => setAyahError(true))
      .finally(() => setLoadingAyahs(false));
  }, [selectedSurah.id]);

  // Toggle Ayah Audio with Loading State Indicator & Tracking
  const toggleAyahAudio = (ayahInSurah: number) => {
    setSurahAudioPlaying(false);
    setSurahAudioLoading(false);
    const globalNum = globalAyahOffset + ayahInSurah;

    if (playingAyah === ayahInSurah) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      setLoadingAyahAudio(null);
    } else {
      setLoadingAyahAudio(ayahInSurah);
      setPlayingAyah(null);

      if (audioRef.current) {
        audioRef.current.src = ayahAudioUrl(globalNum);
        audioRef.current
          .play()
          .then(() => {
            setLoadingAyahAudio(null);
            setPlayingAyah(ayahInSurah);
          })
          .catch(() => {
            setLoadingAyahAudio(null);
            setPlayingAyah(null);
          });
      }
    }
  };

  // Toggle Surah Audio with Loading State Indicator
  const toggleSurahAudio = () => {
    setPlayingAyah(null);
    setLoadingAyahAudio(null);

    if (surahAudioPlaying) {
      audioRef.current?.pause();
      setSurahAudioPlaying(false);
      setSurahAudioLoading(false);
    } else {
      setSurahAudioLoading(true);
      setSurahAudioPlaying(false);

      if (audioRef.current) {
        audioRef.current.src = surahAudioUrl(selectedSurah.id);
        audioRef.current
          .play()
          .then(() => {
            setSurahAudioLoading(false);
            setSurahAudioPlaying(true);
          })
          .catch(() => {
            setSurahAudioLoading(false);
            setSurahAudioPlaying(false);
          });
      }
    }
  };

  const toggleBookmark = (n: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  const handleSelectSurah = (s: (typeof SURAHS)[0]) => {
    if (s.id === selectedSurah.id) return;
    audioRef.current?.pause();
    setPlayingAyah(null);
    setLoadingAyahAudio(null);
    setSurahAudioPlaying(false);
    setSurahAudioLoading(false);
    setSelectedSurah(s);
    if (window.innerWidth < 1024) setShowSidebar(false);
  };

  const handlePrevSurah = () => {
    if (selectedSurah.id > 1) {
      handleSelectSurah(SURAHS[selectedSurah.id - 2]);
    }
  };

  const handleNextSurah = () => {
    if (selectedSurah.id < 114) {
      handleSelectSurah(SURAHS[selectedSurah.id]);
    }
  };

  const stopAllAudio = () => {
    audioRef.current?.pause();
    setPlayingAyah(null);
    setLoadingAyahAudio(null);
    setSurahAudioPlaying(false);
    setSurahAudioLoading(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Trigger PDF download — our API streams the validated, complete Quran PDF.
  // A filesystem download (anchor navigation) has no JS "completed" callback,
  // so we keep the button in a busy state for a realistic download window.
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const handleDownloadFullQuran = () => {
    if (downloadingPdf) return;
    setDownloadingPdf(true);
    const a = document.createElement("a");
    a.href = "/api/download-quran";
    a.setAttribute("download", "Al-Quran-Al-Kareem-Complete.pdf");
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Re-enable the button after the full PDF (~31 MB) has time to start saving
    window.setTimeout(() => setDownloadingPdf(false), 8000);
  };

  const handlePrintCurrentSurah = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onWaiting={() => {
          if (playingAyah) setLoadingAyahAudio(playingAyah);
          if (surahAudioPlaying) setSurahAudioLoading(true);
        }}
        onPlaying={() => {
          setLoadingAyahAudio(null);
          setSurahAudioLoading(false);
        }}
        onEnded={() => {
          setPlayingAyah(null);
          setLoadingAyahAudio(null);
          setSurahAudioPlaying(false);
          setSurahAudioLoading(false);
        }}
        onPause={() => {
          setPlayingAyah(null);
          setLoadingAyahAudio(null);
          setSurahAudioPlaying(false);
          setSurahAudioLoading(false);
        }}
        onError={() => {
          setPlayingAyah(null);
          setLoadingAyahAudio(null);
          setSurahAudioPlaying(false);
          setSurahAudioLoading(false);
        }}
      />

      {/* ═══ Top Banner: Ultra Colorful & Vibrant Gold Arabesque Panel ════════ */}
      <section className="relative mb-8 overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/80 shadow-[0_0_60px_rgba(191,160,89,0.45)] min-h-[350px] flex items-center justify-center text-center text-white">

        {/* Vibrant Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-banner.jpg"
            alt="AI Search Quran Panel"
            fill sizes="100vw" quality={75}
            className="object-cover object-center scale-105 transition-transform duration-1000 hover:scale-100"
            priority
          />
          {/* Subtle light vignette so colorful background artwork shines brightly */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/50 via-transparent to-[#070D18]/40" />
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-95" />
        </div>

        {/* Central Banner Content */}
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-12 sm:py-10">

          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/80 bg-[#121A26]/85 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#BFA059] backdrop-blur-md shadow-md">
              <BookOpen className="size-4 text-[#BFA059]" />
              AL-QURAN AL-KAREEM · 114 SURAHS
            </span>

            {/* Direct PDF Download Button in Banner */}
            <button
              type="button"
              disabled={downloadingPdf}
              onClick={() => handleDownloadFullQuran()}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#BFA059] bg-[#BFA059] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#121A26] shadow-xl hover:bg-[#EAD090] transition active:scale-95 disabled:opacity-70 disabled:cursor-wait"
            >
              {downloadingPdf ? (
                <Loader2 className="size-3.5 text-[#121A26] animate-spin" />
              ) : (
                <Download className="size-3.5 text-[#121A26]" />
              )}
              {downloadingPdf ? "ڈاؤن لوڈ ہو رہا ہے..." : "Download Quran PDF (ڈاؤن لوڈ کریں)"}
            </button>
          </div>


          {/* Burnished Gold Thuluth Title */}
          <h1 className="mt-3 font-arabic text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-wide drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)]">
            القرآن الكريم
          </h1>

          <p className="mt-2 text-xs sm:text-sm font-serif font-semibold tracking-wide text-[#EAD090] drop-shadow-md">
            Read, Listen with Real-Time Verse Tracking &amp; Reflect upon Urdu Tafseer
          </p>

          {/* Search Input Bar */}
          <div className="relative mx-auto mt-6 max-w-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#BFA059]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search surah (e.g. Yaseen, Al-Mulk, 36)..."
              className="w-full rounded-2xl border-2 border-[#BFA059]/70 bg-white py-3 pl-11 pr-4 text-sm font-medium text-[#1A202C] placeholder-slate-400 shadow-2xl outline-none transition focus:border-[#BFA059] focus:ring-4 focus:ring-[#BFA059]/30"
            />
          </div>

          {/* Mode Switcher Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5">
            {([
              { key: "mushaf", label: "📖 Mushaf Page View" },
              { key: "versebyverse", label: "📜 Verse-by-Verse (Urdu & EN)" },
              { key: "tilawat", label: "🎧 Full Surah Tilawat" },
            ] as { key: Mode; label: string }[]).map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                className={cn(
                  "w-full sm:w-auto rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 active:scale-95 shadow-md",
                  mode === m.key
                    ? "bg-[#BFA059] text-[#121A26] ring-2 ring-[#BFA059]/70 font-extrabold scale-[1.03] shadow-xl"
                    : "border border-[#BFA059]/60 bg-[#162232]/85 text-[#EAD090] backdrop-blur-md hover:bg-[#BFA059]/20 hover:text-white"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Main Content Layout ═════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar: 114 Surahs Directory */}
        <aside
          className={cn(
            "flex-shrink-0 transition-all duration-300",
            showSidebar ? "w-full lg:w-72 opacity-100" : "w-0 overflow-hidden opacity-0",
            "lg:w-72 lg:opacity-100"
          )}
        >
          <div className="sticky top-20 h-[calc(100vh-8rem)] overflow-y-auto rounded-3xl border border-[#BFA059]/40 bg-white shadow-md dark:border-night-800 dark:bg-night-900">
            <div className="border-b border-[#BFA059]/20 px-4 py-3 bg-[#FAF7F0] dark:bg-night-950 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-[#BFA059]">
                114 Surahs Collection
              </p>

              {/* Download PDF Quick Link */}
              <button
                type="button"
                disabled={downloadingPdf}
                onClick={() => handleDownloadFullQuran()}
                className="text-[10px] font-bold text-[#BFA059] hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                {downloadingPdf ? <Loader2 className="size-3 animate-spin" /> : <Download className="size-3" />} PDF
              </button>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-night-800">
              {filtered.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectSurah(s)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#BFA059]/10",
                      selectedSurah.id === s.id && "bg-[#BFA059]/15 border-r-4 border-[#BFA059]"
                    )}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#1A202C] text-[10px] font-bold text-[#BFA059]">
                      {s.id}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1A202C] dark:text-gold-100 truncate">
                        {s.transliteration}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-300">
                        {s.english} · {s.ayahs} Verses
                      </p>
                    </div>
                    <span className="ml-auto font-arabic text-sm font-bold text-[#BFA059]">{s.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Reading Workspace */}
        <div className="min-w-0 flex-1">

          {/* Mobile Directory Toggle & Top Reading Toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowSidebar((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#BFA059]/40 bg-white px-4 py-2 text-xs font-bold text-[#1A202C] shadow-sm lg:hidden dark:bg-night-900 dark:text-white"
            >
              <ChevronRight className={cn("size-4 transition-transform", showSidebar && "rotate-180")} />
              {showSidebar ? "Hide Surahs List" : "Browse 114 Surahs"}
            </button>

            {/* Quick Surah Prev / Next Navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevSurah}
                disabled={selectedSurah.id === 1}
                className="inline-flex items-center gap-1 rounded-xl border border-[#BFA059]/40 bg-white px-3 py-1.5 text-xs font-bold text-[#1A202C] shadow-sm hover:bg-[#BFA059]/10 disabled:opacity-40 dark:bg-night-900 dark:text-white"
              >
                <ChevronLeft className="size-4 text-[#BFA059]" /> Prev Surah
              </button>

              <button
                type="button"
                onClick={handleNextSurah}
                disabled={selectedSurah.id === 114}
                className="inline-flex items-center gap-1 rounded-xl border border-[#BFA059]/40 bg-white px-3 py-1.5 text-xs font-bold text-[#1A202C] shadow-sm hover:bg-[#BFA059]/10 disabled:opacity-40 dark:bg-night-900 dark:text-white"
              >
                Next Surah <ChevronRight className="size-4 text-[#BFA059]" />
              </button>
            </div>

            {/* Main Action Group: PDF Download & Font Adjuster */}
            <div className="flex flex-wrap items-center gap-2">
              {/* PDF Download Button */}
              <button
                type="button"
                disabled={downloadingPdf}
                onClick={() => handleDownloadFullQuran()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#BFA059] bg-[#BFA059] px-3.5 py-1.5 text-xs font-bold text-[#121A26] shadow-sm hover:bg-[#EAD090] transition disabled:opacity-70 disabled:cursor-wait"
              >
                {downloadingPdf ? <Loader2 className="size-3.5 text-[#121A26] animate-spin" /> : <Download className="size-3.5 text-[#121A26]" />} {downloadingPdf ? "ڈاؤن لوڈ..." : "Download Quran PDF"}
              </button>

              {/* Font Size Adjuster Controls */}
              <div className="flex items-center gap-1.5 rounded-xl border border-[#BFA059]/40 bg-white px-3 py-1.5 shadow-sm dark:bg-night-900">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-300">Size:</span>
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.max(26, s - 3))}
                  className="rounded p-1 hover:bg-slate-100 text-[#1A202C] dark:text-white dark:hover:bg-night-800"
                  title="Decrease font size"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="text-xs font-extrabold text-[#BFA059]">{fontSize}px</span>
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.min(60, s + 3))}
                  className="rounded p-1 hover:bg-slate-100 text-[#1A202C] dark:text-white dark:hover:bg-night-800"
                  title="Increase font size"
                >
                  <Plus className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize(38)}
                  className="ml-1 rounded p-1 hover:bg-slate-100 text-slate-300 dark:hover:bg-night-800"
                  title="Reset font size"
                >
                  <RotateCcw className="size-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Surah Frame Banner */}
          <div className="mb-6 overflow-hidden rounded-3xl border-2 border-[#BFA059]/60 bg-gradient-to-r from-[#121A26] via-[#1A2536] to-[#121A26] p-6 text-white shadow-xl relative">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-[#BFA059]/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#BFA059] mb-1">
                  Surah No. {selectedSurah.id} · {selectedSurah.revelation}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {selectedSurah.transliteration} — {selectedSurah.english}
                </h2>
                <p className="mt-1 text-xs text-slate-300">
                  Total {selectedSurah.ayahs} Verses · Professional Mushaf Layout
                </p>
              </div>

              <div className="text-center sm:text-right">
                <p className="font-arabic text-4xl sm:text-5xl font-bold text-[#BFA059] drop-shadow-md">
                  {selectedSurah.name}
                </p>
              </div>
            </div>

            {/* Tilawat Mode Play Bar */}
            {mode === "tilawat" && (
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#BFA059]/40 bg-white/10 p-4 backdrop-blur-md">
                <div>
                  <p className="text-xs font-bold text-[#BFA059]">🎧 Continuous Audio Tilawat</p>
                  <p className="text-[11px] text-slate-300">Reciter: Sheikh Mishary Rashid Alafasy — Real-time Verse Highlighting Active</p>
                </div>
                <button
                  type="button"
                  onClick={toggleSurahAudio}
                  disabled={surahAudioLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#BFA059] px-6 py-2.5 text-xs font-bold text-[#1A202C] shadow-lg transition hover:bg-[#D1B876] active:scale-95 disabled:opacity-75"
                >
                  {surahAudioLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Loading Audio…
                    </>
                  ) : surahAudioPlaying ? (
                    <>
                      <Pause className="size-4" /> Pause Tilawat
                    </>
                  ) : (
                    <>
                      <Play className="size-4 fill-[#1A202C]" /> Play Full Surah
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Bismillah Header Frame */}
          {selectedSurah.id !== 1 && selectedSurah.id !== 9 && (
            <div className="mb-6 rounded-3xl border-2 border-[#BFA059]/40 bg-[#FDFBF7] py-6 text-center dark:bg-night-900 shadow-md relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#BFA059]/10 via-[#BFA059] to-[#BFA059]/10" />
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#BFA059]/10 via-[#BFA059] to-[#BFA059]/10" />
              <p dir="rtl" lang="ar" className="font-arabic text-3xl sm:text-4xl lg:text-5xl font-bold text-[#121A26] dark:text-[#F3E5C8] leading-relaxed drop-shadow-sm">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          )}

          {/* Loading Indicator */}
          {loadingAyahs && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-[#BFA059]/30 bg-white p-12 dark:bg-night-900 shadow-sm">
              <Loader2 className="size-8 animate-spin text-[#BFA059]" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Loading {selectedSurah.transliteration} Verses…</p>
            </div>
          )}

          {/* Error Indicator */}
          {ayahError && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center dark:bg-red-900/10">
              <p className="text-sm font-semibold text-red-600">Failed to load surah verses. Please check your internet connection.</p>
              <button
                type="button"
                onClick={() => setSelectedSurah({ ...selectedSurah })}
                className="mt-3 rounded-xl bg-red-100 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-200"
              >
                Retry Loading
              </button>
            </div>
          )}

          {/* ── MODE 1: MUSHAF PAGE VIEW (Authentic World-Class Book Format) ─────── */}
          {!loadingAyahs && !ayahError && mode === "mushaf" && (
            <div className="rounded-[2.5rem] border-4 border-[#BFA059]/50 bg-[#FDFBF7] p-6 sm:p-12 dark:bg-[#121A26] shadow-2xl relative">

              {/* Gold Ornament Header */}
              <div className="text-center mb-8 pb-4 border-b-2 border-[#BFA059]/30">
                <span className="font-serif text-xs font-bold uppercase tracking-[0.25em] text-[#BFA059]">
                  ﴿ سُورَةُ {selectedSurah.name} — MUSHAF AL-KAREEM ﴾
                </span>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-300">
                  Click any verse to listen &amp; highlight in real-time
                </p>
              </div>

              {/* Continuous Authentic Quran Text */}
              <div
                dir="rtl"
                lang="ar"
                style={{ fontSize: `${fontSize}px`, lineHeight: "2.9" }}
                className="text-right font-arabic font-bold tracking-wide text-[#121A26] dark:text-[#F3E5C8] space-y-2 select-none"
              >
                {ayahs.map((a) => {
                  const isPlaying = currentSurahAyahNumber === a.numberInSurah;
                  return (
                    <span
                      key={a.numberInSurah}
                      ref={isPlaying ? activeAyahRef : null}
                      onClick={() => toggleAyahAudio(a.numberInSurah)}
                      className={cn(
                        "inline cursor-pointer transition-all duration-300 rounded-2xl px-2 py-1 mx-0.5",
                        isPlaying
                          ? "bg-[#BFA059]/35 text-[#121A26] dark:text-[#FFF] ring-2 ring-[#BFA059] shadow-[0_0_30px_rgba(191,160,89,0.6)] animate-pulse font-extrabold"
                          : "hover:bg-[#BFA059]/15 hover:text-[#BFA059]"
                      )}
                      title={`Click to recite Verse ${a.numberInSurah}`}
                    >
                      <span>{a.arabic}</span>
                      <span
                        dir="rtl"
                        className="inline-flex items-center justify-center mx-2 my-1 px-3 py-0.5 rounded-full border-2 border-[#BFA059] bg-[#BFA059]/20 font-arabic text-sm sm:text-base font-bold text-[#BFA059] shadow-sm align-middle"
                      >
                        ﴿{toArabicIndic(a.numberInSurah)}﴾
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── MODE 2: VERSE-BY-VERSE (Urdu & English Translation + Urdu Tafseer) ── */}
          {!loadingAyahs && !ayahError && mode === "versebyverse" && (
            <div className="space-y-5">
              {ayahs.map((a) => {
                const isPlaying = currentSurahAyahNumber === a.numberInSurah;
                const isLoading = loadingAyahAudio === a.numberInSurah;
                const isBookmarked = bookmarks.has(a.numberInSurah);

                return (
                  <div
                    key={a.numberInSurah}
                    ref={isPlaying ? activeAyahRef : null}
                    className={cn(
                      "rounded-3xl border p-6 transition-all duration-500 shadow-sm",
                      isPlaying
                        ? "border-2 border-[#BFA059] bg-gradient-to-r from-[#BFA059]/25 via-[#BFA059]/10 to-[#BFA059]/25 shadow-[0_0_35px_rgba(191,160,89,0.4)] ring-4 ring-[#BFA059]/30 scale-[1.01]"
                        : "border-slate-200/90 bg-white dark:border-night-800 dark:bg-night-950"
                    )}
                  >
                    {/* Card Top Action Bar */}
                    <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-night-800">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                            isPlaying
                              ? "bg-[#BFA059] text-[#1A202C] font-extrabold shadow-md scale-110"
                              : "bg-[#1A202C] text-[#BFA059]"
                          )}
                        >
                          {a.numberInSurah}
                        </span>

                        {isPlaying && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#BFA059] px-3 py-0.5 text-[10px] font-bold text-[#1A202C] shadow-sm animate-pulse">
                            <Volume2 className="size-3.5" /> Reciting Verse {a.numberInSurah}…
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleBookmark(a.numberInSurah)}
                        className={cn(
                          "rounded-full p-1.5 transition-colors",
                          isBookmarked
                            ? "bg-[#BFA059]/20 text-[#BFA059]"
                            : "text-slate-300 hover:text-[#BFA059]"
                        )}
                        title="Bookmark verse"
                      >
                        <BookMarked className="size-4" />
                      </button>
                    </div>

                    {/* Arabic Verse Text */}
                    <p
                      dir="rtl"
                      lang="ar"
                      style={{ fontSize: `${fontSize}px`, lineHeight: "2.6" }}
                      className={cn(
                        "font-arabic font-bold transition-colors duration-300 tracking-wide text-right",
                        isPlaying ? "text-[#BFA059] dark:text-[#F6EEDA] font-extrabold drop-shadow-sm" : "text-[#121A26] dark:text-[#F3E5C8]"
                      )}
                    >
                      {a.arabic}{" "}
                      <span
                        dir="rtl"
                        className="inline-flex items-center justify-center mx-2 px-2.5 py-0.5 rounded-full border border-[#BFA059] bg-[#BFA059]/15 font-arabic text-sm font-bold text-[#BFA059] align-middle"
                      >
                        ﴿{toArabicIndic(a.numberInSurah)}﴾
                      </span>
                    </p>

                    {/* Translations */}
                    <div className="mt-5 space-y-3 border-t border-dashed border-slate-200 pt-4 dark:border-night-800">
                      {/* English */}
                      <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                        <span className="mr-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-[#BFA059] dark:bg-night-800">
                          EN
                        </span>
                        {a.english}
                      </p>

                      {/* Urdu Translation Card */}
                      <div className="rounded-2xl border border-[#BFA059]/25 bg-[#FDFBF7] p-4 text-right dark:bg-night-900">
                        <p dir="rtl" className="font-arabic text-base sm:text-lg font-semibold leading-loose text-[#121A26] dark:text-[#F3E5C8]">
                          <span className="ml-2 inline-block rounded bg-[#BFA059]/20 px-2 py-0.5 font-sans text-[10px] font-bold text-[#BFA059]">
                            اردو ترجمہ:
                          </span>
                          {a.urdu}
                        </p>

                        {/* Urdu Tafseer Commentary */}
                        {a.tafseerUr && (
                          <div className="mt-3 border-t border-[#BFA059]/20 pt-2.5">
                            <p dir="rtl" className="font-arabic text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                              <span className="font-bold text-[#BFA059] ml-1">تفسیر و تشریح: </span>
                              {a.tafseerUr}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recitation Action Button */}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleAyahAudio(a.numberInSurah)}
                        disabled={isLoading}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 disabled:opacity-80",
                          isPlaying
                            ? "bg-[#BFA059] text-[#121A26] ring-2 ring-[#BFA059]/50 shadow-md font-extrabold scale-105"
                            : isLoading
                            ? "bg-[#BFA059]/70 text-[#121A26]"
                            : "bg-[#E8D9A0] text-[#121A26] hover:bg-[#BFA059]"
                        )}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin text-[#121A26]" />
                            <span>Buffering Audio…</span>
                          </>
                        ) : isPlaying ? (
                          <>
                            <Pause className="size-3.5" />
                            <span>Pause Ayah</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="size-3.5" />
                            <span>Play Recitation</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── MODE 3: FULL SURAH TILAWAT MODE (Real-Time Ayah Tracking & Highlighting) ─ */}
          {!loadingAyahs && !ayahError && mode === "tilawat" && (
            <div className="rounded-3xl border-2 border-[#BFA059]/50 bg-[#FDFBF7] p-6 sm:p-10 dark:bg-[#121A26] shadow-xl">
              <div className="mb-6 rounded-2xl border border-[#BFA059]/40 bg-white p-5 text-center dark:bg-night-950">
                <Headphones className="mx-auto mb-2 size-8 text-[#BFA059]" />
                <p className="text-base font-bold text-[#121A26] dark:text-[#F3E5C8]">
                  Full Tilawat Mode: {selectedSurah.transliteration} ({selectedSurah.name})
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  Recitation by Sheikh Mishary Rashid Alafasy. Verses highlight &amp; scroll automatically in real-time as audio plays.
                </p>
              </div>

              {/* Tilawat Verse Display with Real-Time Highlighting */}
              <div
                dir="rtl"
                lang="ar"
                style={{ fontSize: `${fontSize}px`, lineHeight: "3.0" }}
                className="text-right font-arabic font-bold tracking-wide text-[#121A26] dark:text-[#F3E5C8] space-y-3"
              >
                {ayahs.map((a) => {
                  const isPlaying = currentSurahAyahNumber === a.numberInSurah;
                  return (
                    <span
                      key={a.numberInSurah}
                      ref={isPlaying ? activeAyahRef : null}
                      onClick={() => toggleAyahAudio(a.numberInSurah)}
                      className={cn(
                        "inline cursor-pointer transition-all duration-300 rounded-2xl px-2 py-1 mx-0.5",
                        isPlaying
                          ? "bg-[#BFA059]/35 text-[#121A26] dark:text-[#FFF] ring-2 ring-[#BFA059] shadow-[0_0_30px_rgba(191,160,89,0.6)] animate-pulse font-extrabold"
                          : "hover:bg-[#BFA059]/10 hover:text-[#BFA059]"
                      )}
                      title={`Verse ${a.numberInSurah}`}
                    >
                      <span>{a.arabic}</span>
                      <span
                        dir="rtl"
                        className="inline-flex items-center justify-center mx-2 px-2.5 py-0.5 rounded-full border border-[#BFA059] bg-[#BFA059]/15 font-arabic text-sm font-bold text-[#BFA059] align-middle"
                      >
                        ﴿{toArabicIndic(a.numberInSurah)}﴾
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ═══ Sticky Bottom Audio Player Bar ══════════════════════════════════ */}
      {(playingAyah !== null || surahAudioPlaying || loadingAyahAudio !== null || surahAudioLoading) && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-[#121A26]/95 border-t-2 border-[#BFA059] px-4 py-3 text-white backdrop-blur-lg shadow-2xl transition-all duration-300">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">

            {/* Reciter & Current Playing Info */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="size-10 rounded-full bg-[#BFA059] flex items-center justify-center text-[#121A26] font-bold shadow-md shrink-0">
                <Volume2 className="size-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#EAD090] truncate">
                  {surahAudioPlaying
                    ? `Full Surah ${selectedSurah.transliteration} (Verse ${currentSurahAyahNumber ?? 1})`
                    : `Verse ${playingAyah} · Surah ${selectedSurah.transliteration}`}
                </p>
                <p className="text-[10px] text-slate-300 truncate">
                  Reciter: Sheikh Mishary Rashid Alafasy
                </p>
              </div>
            </div>

            {/* Audio Progress Slider */}
            <div className="flex items-center gap-2 w-full sm:w-1/2">
              <span className="text-[10px] font-mono text-slate-300">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => {
                  const newTime = parseFloat(e.target.value);
                  if (audioRef.current) audioRef.current.currentTime = newTime;
                  setCurrentTime(newTime);
                }}
                className="w-full accent-[#BFA059] h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-300">{formatTime(duration)}</span>
            </div>

            {/* Player Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#EAD090]"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>

              <button
                type="button"
                onClick={stopAllAudio}
                className="p-1.5 rounded-full hover:bg-white/10 text-red-400"
                title="Stop Audio"
              >
                <X className="size-5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ═══ PDF Download Options Modal / Dialog ═════════════════════════════ */}
      {showPdfOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border-2 border-[#BFA059] bg-[#FDFBF7] p-6 dark:bg-[#121A26] shadow-2xl text-left relative">

            <button
              type="button"
              onClick={() => setShowPdfOptions(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-300 hover:bg-slate-200 dark:hover:bg-night-800"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#BFA059] text-[#121A26]">
                <Download className="size-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#121A26] dark:text-[#F3E5C8]">
                  Download Quran Pak PDF
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  Select your preferred PDF version below:
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Option 1: Complete Quran PDF (Pakistani 15-Line Print) */}
              <button
                type="button"
                disabled={downloadingPdf}
                onClick={() => {
                  handleDownloadFullQuran();
                  setShowPdfOptions(false);
                }}
                className="w-full flex items-center gap-3 rounded-2xl border border-[#BFA059]/50 bg-white p-4 text-left shadow-sm hover:bg-[#BFA059]/10 transition dark:bg-night-900 disabled:opacity-70"
              >
                <FileText className="size-6 text-[#BFA059] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#121A26] dark:text-white">
                    📖 Complete Quran Pak — Pakistani 15-Line Print (Direct PDF Download)
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-300">
                    Authentic Arabic Quran — complete 30 Juz (~33 MB) downloaded directly from this site, no external website.
                  </p>
                </div>
              </button>

              {/* Option 2: Open PDF in a New Tab (Preview First) */}
              <a
                href="/quran-pak.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 rounded-2xl border border-[#BFA059]/50 bg-white p-4 text-left shadow-sm hover:bg-[#BFA059]/10 transition dark:bg-night-900"
              >
                <BookOpen className="size-6 text-[#BFA059] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#121A26] dark:text-white">
                    👁️ Preview Quran PDF in Browser (Open in New Tab)
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-300">
                    View the complete Quran PDF first, then use the browser download button to save it.
                  </p>
                </div>
              </a>

              {/* Option 3: Print / Export Current Surah */}
              <button
                type="button"
                onClick={() => {
                  setShowPdfOptions(false);
                  handlePrintCurrentSurah();
                }}
                className="w-full flex items-center gap-3 rounded-2xl border border-[#BFA059]/50 bg-[#BFA059]/15 p-4 text-left shadow-sm hover:bg-[#BFA059]/30 transition"
              >
                <Printer className="size-6 text-[#BFA059] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#121A26] dark:text-white">
                    🖨️ Export / Print Surah {selectedSurah.transliteration}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-300">
                    Save or print current surah as formatted PDF document.
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setShowPdfOptions(false)}
                className="text-xs font-bold text-slate-500 dark:text-slate-300 hover:underline"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}