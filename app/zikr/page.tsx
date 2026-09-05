"use client";

import {
  Award,
  Check,
  Copy,
  Flame,
  Globe,
  Hand,
  Heart,
  Moon,
  RotateCcw,
  Sparkles,
  Star,
  Sun,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ── Zikr Data ────────────────────────────────────────────────────────────────
const ZIKR_OPTIONS = [
  { id: "subhanallah",    latin: "SubhanAllah",       arabic: "سُبْحَانَ اللَّهِ",              meaning: "Glory be to Allah",                    urdu: "اللہ پاک ہے",                                defaultTarget: 33,  color: "#60A5FA", glow: "rgba(96,165,250,0.4)"  },
  { id: "alhamdulillah", latin: "Alhamdulillah",      arabic: "الْحَمْدُ لِلَّهِ",               meaning: "All praise is due to Allah",           urdu: "تمام تعریفیں اللہ کے لیے",                    defaultTarget: 33,  color: "#F59E0B", glow: "rgba(245,158,11,0.4)"  },
  { id: "allahuakbar",   latin: "Allahu Akbar",        arabic: "اللَّهُ أَكْبَرُ",                meaning: "Allah is the Greatest",                urdu: "اللہ سب سے بڑا ہے",                           defaultTarget: 34,  color: "#34D399", glow: "rgba(52,211,153,0.4)"  },
  { id: "darood",        latin: "Darood Sharif",       arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", meaning: "Blessings upon Prophet Muhammad ﷺ",    urdu: "اے اللہ! محمد ﷺ پر درود بھیج",               defaultTarget: 100, color: "#C084FC", glow: "rgba(192,132,252,0.4)" },
  { id: "astaghfirullah",latin: "Astaghfirullah",      arabic: "أَسْتَغْفِرُ اللَّهَ",             meaning: "I seek forgiveness from Allah",        urdu: "میں اللہ سے معافی مانگتا ہوں",                defaultTarget: 100, color: "#FB923C", glow: "rgba(251,146,60,0.4)"  },
  { id: "la-ilaha",      latin: "La Ilaha Illallah",   arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",        meaning: "There is no god but Allah",            urdu: "اللہ کے سوا کوئی معبود نہیں",                  defaultTarget: 100, color: "#22D3EE", glow: "rgba(34,211,238,0.4)"  },
];

const MORNING_AZKAR = [
  { arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",                         english: "We have reached the morning and the whole Kingdom belongs to Allah, and all praise is for Allah.", urdu: "ہم نے صبح کی اور تمام بادشاہی اللہ کے لیے ہے اور تمام تعریفیں اللہ کے لیے ہیں۔",      count: "1×" },
  { arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ",          english: "O Ever-Living, O Sustainer — by Your mercy I seek help. Rectify all my affairs.",               urdu: "اے زندہ اور قائم رہنے والے، تیری رحمت کے وسیلے سے مدد مانگتا ہوں۔ میرے تمام معاملات درست فرما۔", count: "3×" },
  { arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", english: "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die and to You is the resurrection.", urdu: "اے اللہ! تیرے نام سے صبح کی، تیرے نام سے شام کریں گے، تیرے ساتھ جیتے اور مریں گے اور تیری طرف اٹھنا ہے۔", count: "1×" },
];

const EVENING_AZKAR = [
  { arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",                           english: "We have reached the evening and the whole Kingdom belongs to Allah, and all praise is for Allah.", urdu: "ہم نے شام کی اور تمام بادشاہی اللہ کے لیے ہے اور تمام تعریفیں اللہ کے لیے ہیں۔",      count: "1×" },
  { arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",                         english: "I seek refuge in the Perfect Words of Allah from the evil of what He has created.",               urdu: "میں اللہ کے مکمل کلمات کی پناہ مانگتا ہوں اس کی تمام مخلوق کے شر سے۔",                 count: "3×" },
  { arabic: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ",   english: "O Allah, I have reached the evening calling You and the bearers of Your Throne to witness.",      urdu: "اے اللہ! میں نے شام کی، تجھے اور تیرے عرش کے اٹھانے والوں اور فرشتوں کو گواہ بناتا ہوں۔", count: "4×" },
];

// ── Storage ──────────────────────────────────────────────────────────────────
const STORE_KEY = "hidayah_zikr_v3";
interface StoreData {
  totalToday: number;
  totalAllTime: number;
  completedSets: number;
  lastDate: string;
  streak: number;
  lastStreakDate: string;
}
const todayStr = () => new Date().toISOString().slice(0, 10);

function loadStore(): StoreData {
  const def: StoreData = { totalToday: 0, totalAllTime: 0, completedSets: 0, lastDate: todayStr(), streak: 0, lastStreakDate: "" };
  if (typeof window === "undefined") return def;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return def;
    const data: StoreData = JSON.parse(raw);
    if (data.lastDate !== todayStr()) return { ...data, totalToday: 0, completedSets: 0, lastDate: todayStr() };
    return data;
  } catch { return def; }
}
function saveStore(d: StoreData) { try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch {} }

// ── Main Component ────────────────────────────────────────────────────────────
export default function ZikrPage() {
  const [selectedZikr, setSelectedZikr] = useState(ZIKR_OPTIONS[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ripple, setRipple] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [milestone, setMilestone] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeAzkar, setActiveAzkar] = useState<"morning" | "evening">("morning");
  // Use safe SSR defaults — load real data only after mount to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [store, setStore] = useState<StoreData>({ totalToday: 0, totalAllTime: 0, completedSets: 0, lastDate: "", streak: 0, lastStreakDate: "" });
  const milestoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setStore(loadStore());
    setMounted(true);
  }, []);

  const playTick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(700, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.07);
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.1);
    } catch {}
  }, [soundEnabled]);

  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      [523, 659, 784, 1047].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.09, ctx.currentTime + i * 0.13);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.13 + 0.25);
        o.connect(g); g.connect(ctx.destination);
        o.start(ctx.currentTime + i * 0.13); o.stop(ctx.currentTime + i * 0.13 + 0.3);
      });
    } catch {}
  }, [soundEnabled]);

  const handleTap = useCallback(() => {
    playTick();
    if (navigator.vibrate) navigator.vibrate(16);
    setRipple(true); setPulsing(true);
    setTimeout(() => setRipple(false), 500);
    setTimeout(() => setPulsing(false), 200);

    const next = count + 1;
    const setDone = next >= target;

    if (setDone) { playChime(); setMilestone(true); if (milestoneTimer.current) clearTimeout(milestoneTimer.current); milestoneTimer.current = setTimeout(() => setMilestone(false), 2800); }

    setStore(prev => {
      let streak = prev.streak;
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);
      if (prev.lastStreakDate === yStr) streak = prev.streak + 1;
      else if (!prev.lastStreakDate || prev.lastStreakDate < yStr) streak = 1;
      const updated: StoreData = { totalToday: prev.totalToday + 1, totalAllTime: prev.totalAllTime + 1, completedSets: prev.completedSets + (setDone ? 1 : 0), lastDate: todayStr(), streak, lastStreakDate: todayStr() };
      saveStore(updated); return updated;
    });
    setCount(setDone ? 0 : next);
  }, [count, target, playTick, playChime]);

  const selectZikr = (z: typeof ZIKR_OPTIONS[0]) => { setSelectedZikr(z); setTarget(z.defaultTarget); setCount(0); };
  const resetCount = () => setCount(0);
  const resetAll = () => { const d = { totalToday: 0, totalAllTime: 0, completedSets: 0, lastDate: todayStr(), streak: 0, lastStreakDate: "" }; setStore(d); saveStore(d); setCount(0); };
  const copyText = (text: string, key: string) => { navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(null), 2000); }); };

  const pct = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0;
  const azkarList = activeAzkar === "morning" ? MORNING_AZKAR : EVENING_AZKAR;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-7">

      {/* ── Banner — exact same style as AI Search page ── */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/70 shadow-[0_0_50px_rgba(191,160,89,0.35)] min-h-[350px] flex items-center justify-center text-center text-white py-10 px-4 sm:px-8">

        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image src="/ai-banner.jpg" alt="Zikr & Tasbeeh Banner" fill className="object-cover object-center scale-105" priority />
          {/* Overlay — same as AI search */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/80 via-black/40 to-[#070D18]/70" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-95" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-3xl w-full space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/80 bg-[#121A26]/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#BFA059] backdrop-blur-md shadow-md">
            <Sparkles className="size-4 text-[#BFA059]" />
            Digital Tasbeeh &amp; Remembrance
          </div>

          <h1 className="font-arabic text-5xl sm:text-6xl font-extrabold text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-tight">
            الذِّكْرُ وَالتَّسْبِيحُ
          </h1>

          <p className="text-xs sm:text-base text-[#EAD090] font-semibold drop-shadow-sm">
            &ldquo;Verily, in the remembrance of Allah do hearts find rest.&rdquo;
          </p>
          <p className="text-[11px] text-[#BFA059]/80">— Al-Quran 13:28</p>

          {/* Live stats strip — only shown after mount to prevent hydration mismatch */}
          {mounted && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {[
                { label: "Today",     val: store.totalToday },
                { label: "Sets Done", val: store.completedSets },
                { label: "🔥 Streak", val: `${store.streak}d` },
                { label: "All\u2011Time",  val: store.totalAllTime.toLocaleString() },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-[#BFA059]/40 bg-[#121A26]/80 backdrop-blur-md px-3 py-2 text-center">
                  <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#BFA059]/70">{s.label}</div>
                  <div className="font-mono text-sm font-black text-[#EAD090]">{String(s.val)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="space-y-6">

        {/* ── Zikr Selector ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#BFA059]/20 bg-white dark:bg-[#111827] p-4 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#BFA059]/60 mb-3 text-center">Choose Your Zikr</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {ZIKR_OPTIONS.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => selectZikr(z)}
                style={selectedZikr.id === z.id ? { background: z.color, boxShadow: `0 4px 20px ${z.glow}` } : {}}
                className={cn(
                  "rounded-full px-4 py-2 text-[11px] sm:text-xs font-bold transition-all duration-200 active:scale-95",
                  selectedZikr.id === z.id
                    ? "text-white scale-105 ring-2 ring-white/30"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#BFA059]/40 dark:bg-[#1A202C] dark:text-[#EAD090] dark:border-[#BFA059]/20"
                )}
              >
                {z.latin}
              </button>
            ))}
          </div>
        </div>

        {/* ── Counter + Azkar: 2-col on large screens ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* LEFT: Counter Workspace (3/5 width) */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-3xl border border-[#BFA059]/25 bg-white dark:bg-[#111827] shadow-xl">

              {/* Milestone overlay */}
              {milestone && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-3xl bg-black/70 backdrop-blur-sm">
                  <Star className="size-14 text-[#BFA059] fill-[#BFA059] animate-bounce mb-2" />
                  <p className="text-2xl font-extrabold text-[#EAD090]">MashAllah! 🎉</p>
                  <p className="text-sm text-white/70 mt-1">Set of {target} {selectedZikr.latin} complete!</p>
                </div>
              )}

              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#FAF7F0] dark:bg-[#0D1117] border-b border-[#BFA059]/15">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#BFA059]">
                  <Award className="size-4" />
                  <span>Sets: {store.completedSets}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(v => !v)}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-[#BFA059]/20 bg-white dark:bg-[#1A202C] px-3 py-1.5 text-[11px] font-semibold transition hover:bg-slate-50"
                  >
                    {soundEnabled ? <Volume2 className="size-3.5 text-[#BFA059]" /> : <VolumeX className="size-3.5 text-slate-400" />}
                    <span className="text-slate-600 dark:text-[#EAD090]">{soundEnabled ? "Sound On" : "Muted"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetCount}
                    className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-500/30 px-3 py-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 transition hover:bg-amber-100"
                  >
                    <RotateCcw className="size-3.5" /> Reset
                  </button>
                </div>
              </div>

              {/* Arabic calligraphy display */}
              <div className="pt-6 pb-3 px-6 text-center space-y-1">
                <p dir="rtl" lang="ar"
                  className="font-arabic font-bold text-[#1A202C] dark:text-[#F5EDD5] leading-loose transition-all duration-300"
                  style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}>
                  {selectedZikr.arabic}
                </p>
                <p className="text-sm font-extrabold uppercase tracking-widest" style={{ color: selectedZikr.color }}>
                  {selectedZikr.latin}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  &ldquo;{selectedZikr.meaning}&rdquo; · {selectedZikr.urdu}
                </p>
              </div>

              {/* BIG TAP BUTTON */}
              <div className="flex justify-center py-6 px-4">
                <div className="relative">
                  {/* Ambient glow */}
                  <div className="absolute inset-0 rounded-full blur-3xl opacity-30 transition-opacity" style={{ background: selectedZikr.glow }} />
                  {/* Ripple */}
                  {ripple && (
                    <span className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ background: selectedZikr.color }} />
                  )}
                  <button
                    type="button"
                    onClick={handleTap}
                    className="relative flex size-48 sm:size-56 lg:size-52 xl:size-60 items-center justify-center rounded-full transition-all duration-100 active:scale-90 select-none touch-manipulation"
                    style={{
                      background: `radial-gradient(circle at 38% 32%, ${selectedZikr.color}28, #060D1A 68%)`,
                      border: `2.5px solid ${selectedZikr.color}50`,
                      boxShadow: `0 0 50px ${selectedZikr.glow}, 0 20px 60px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.6)`,
                    }}
                    aria-label="Tap to count Zikr"
                  >
                    <span className="absolute inset-5 rounded-full border opacity-20" style={{ borderColor: selectedZikr.color }} />
                    <div className="flex flex-col items-center gap-1 select-none">
                      <Hand className="size-6" style={{ color: selectedZikr.color }} />
                      <span
                        className={cn("font-mono font-black tabular-nums leading-none transition-transform duration-100", pulsing ? "scale-125" : "scale-100")}
                        style={{ fontSize: "clamp(2.8rem, 8vw, 4rem)", color: selectedZikr.color }}
                      >
                        {count}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">/ {target}</span>
                      <span className="text-[9px] text-slate-500 mt-0.5">Tap to count</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="px-6 pb-4 space-y-1.5">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#1A202C]">
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${pct}%`, background: selectedZikr.color }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>{pct}% complete</span>
                  <span>{target - count} remaining</span>
                </div>
              </div>

              {/* Target selector */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 px-5 py-4 border-t border-[#BFA059]/10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mr-1">Target:</span>
                {[11, 33, 34, 100, 313, 500, 1000].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setTarget(t); setCount(0); }}
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-bold transition-all active:scale-95",
                      target === t
                        ? "text-white shadow-md"
                        : "border border-slate-200 dark:border-[#BFA059]/20 bg-white dark:bg-[#1A202C] text-slate-600 dark:text-[#EAD090] hover:bg-slate-50"
                    )}
                    style={target === t ? { background: selectedZikr.color } : {}}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Stats Tracker (2/5 width) */}
          <div className="lg:col-span-2 space-y-4">

            {/* Stats Card */}
            <div className="rounded-3xl border border-[#BFA059]/20 bg-white dark:bg-[#111827] shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-900/20">
                    <Flame className="size-5 text-orange-500 fill-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#1A202C] dark:text-[#EAD090]">Daily Streak</p>
                    <p className="text-[10px] text-slate-500">
                      {store.streak > 0 ? `${store.streak}-day streak 🔥` : "Start today!"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetAll}
                  className="text-[10px] font-bold text-red-400 hover:text-red-600 border border-red-200/60 rounded-full px-2.5 py-1 transition dark:border-red-500/30"
                >
                  Reset All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Today",     val: store.totalToday,                icon: Zap,   color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-900/20"   },
                  { label: "Sets",      val: store.completedSets,             icon: Award, color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-900/20" },
                  { label: "Streak",    val: `${store.streak}d`,              icon: Flame, color: "text-orange-500",  bg: "bg-orange-50 dark:bg-orange-900/20" },
                  { label: "All‑Time",  val: store.totalAllTime.toLocaleString(), icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className={cn("rounded-2xl border border-slate-100 dark:border-[#BFA059]/10 p-3 text-center", s.bg)}>
                      <Icon className={cn("size-4 mx-auto mb-1", s.color)} />
                      <div className="font-mono text-base font-extrabold text-[#1A202C] dark:text-[#EAD090]">{s.val}</div>
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Virtues card */}
            <div className="rounded-3xl border border-[#BFA059]/20 bg-gradient-to-br from-[#1A202C] to-[#060D1A] p-5 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="size-4 text-[#BFA059] fill-[#BFA059]" />
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#BFA059]">Virtues of Zikr</p>
              </div>
              <div className="space-y-3 text-[11px] text-slate-300 leading-relaxed">
                {[
                  { e: "✨", t: "SubhanAllah, Alhamdulillah & AllahuAkbar each count as a tree planted in Jannah." },
                  { e: "💚", t: "After Salah: 33+33+34 — sins forgiven even if they are like the foam of the sea." },
                  { e: "📿", t: "\"Keep your tongue moist with the remembrance of Allah.\" — Tirmidhi" },
                ].map((v) => (
                  <div key={v.t} className="flex items-start gap-2 rounded-xl bg-white/5 border border-white/5 p-2.5">
                    <span className="text-sm shrink-0">{v.e}</span>
                    <p>{v.t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Morning & Evening Azkar ────────────────────────────────────── */}
        <div className="rounded-3xl border border-[#BFA059]/20 bg-white dark:bg-[#111827] shadow-md overflow-hidden">

          {/* Tab header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#BFA059]/15 bg-[#FAF7F0] dark:bg-[#0D1117]">
            <div className="flex items-center gap-2">
              <span className="text-lg">📿</span>
              <h2 className="text-sm font-extrabold text-[#1A202C] dark:text-[#EAD090] uppercase tracking-wider">
                Morning &amp; Evening Azkar
              </h2>
            </div>
            <div className="flex rounded-xl border border-[#BFA059]/30 overflow-hidden shadow-sm">
              {(["morning", "evening"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveAzkar(tab)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all",
                    activeAzkar === tab
                      ? "bg-[#BFA059] text-[#1A202C]"
                      : "bg-white dark:bg-[#1A202C] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#252f3e]"
                  )}
                >
                  {tab === "morning" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                  {tab === "morning" ? "Morning" : "Evening"}
                </button>
              ))}
            </div>
          </div>

          {/* Azkar list */}
          <div className="divide-y divide-[#BFA059]/10">
            {azkarList.map((item, idx) => {
              const key = `${activeAzkar}-${idx}`;
              return (
                <div key={key} className="p-5 sm:p-6 space-y-3 hover:bg-[#FAF7F0]/50 dark:hover:bg-[#0D1117]/40 transition-colors">
                  {/* Arabic row */}
                  <div className="flex items-start justify-between gap-4">
                    <p dir="rtl" lang="ar"
                      className="font-arabic text-xl sm:text-2xl font-bold text-[#1A202C] dark:text-[#F5EDD5] leading-loose flex-1 text-right">
                      {item.arabic}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0 pt-2">
                      <span className="rounded-full bg-[#BFA059] px-2.5 py-0.5 text-[10px] font-extrabold text-[#1A202C] whitespace-nowrap">
                        {item.count}
                      </span>
                      <button
                        type="button"
                        title="Copy Arabic"
                        onClick={() => copyText(item.arabic, key)}
                        className="flex size-7 items-center justify-center rounded-full border border-slate-200 dark:border-[#BFA059]/20 bg-white dark:bg-[#1A202C] hover:bg-slate-50 transition"
                      >
                        {copied === key
                          ? <Check className="size-3.5 text-emerald-500" />
                          : <Copy className="size-3.5 text-slate-400" />}
                      </button>
                    </div>
                  </div>

                  {/* Translations */}
                  <div className="rounded-xl bg-[#F8F6F0] dark:bg-[#0D1117] border border-[#BFA059]/10 px-4 py-3 space-y-1.5">
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                      🌐 <span className="font-semibold">English:</span> {item.english}
                    </p>
                    <p dir="rtl" className="font-arabic text-[11px] font-semibold text-[#BFA059] text-right leading-relaxed">
                      اردو: {item.urdu}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>{/* end max-w-5xl */}
    </div>
  );
}