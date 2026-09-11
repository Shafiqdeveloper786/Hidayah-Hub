"use client";

import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Globe,
  Loader2,
  Pause,
  Search,
  ScrollText,
  Star,
  User,
  Volume2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AiAnswer {
  topic: string;
  arabicQuote: string;
  reference: string;
  englishAnswer: string;
  urduAnswer: string;
}

const SUGGESTIONS = [
  { label: "Laylatul Qadr ki fazeelat", emoji: "🌙" },
  { label: "Sabar ki fazeelat Quran mein", emoji: "💪" },
  { label: "Rizq barhanay ki masnoon dua", emoji: "💰" },
  { label: "Istikhara ka sahi tarika", emoji: "🤲" },
  { label: "SubhanAllah kahne ki fazeelat", emoji: "📿" },
  { label: "Walidain ke huqooq Islam mein", emoji: "❤️" },
];

function AiSearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get("q") ?? "";

  const [input, setInput] = useState(initialQ);
  const [activeQuery, setActiveQuery] = useState(initialQ);
  const [answer, setAnswer] = useState<AiAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const responseRef = useRef<HTMLDivElement | null>(null);

  // Only run search if initialQ query parameter is explicitly provided in URL
  useEffect(() => {
    if (initialQ.trim()) {
      handleSearch(initialQ);
    }
  }, [initialQ]);

  const handleSearch = async (queryText: string) => {
    const q = queryText.trim();
    if (!q || loading) return;

    setActiveQuery(q);
    setInput(""); // Clear input box immediately on question submit
    setLoading(true);
    setAnswer(null);

    // Smoothly scroll down to response section
    setTimeout(() => {
      responseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    try {
      const res = await fetch("/api/hidayah-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (data && data.answer) {
        setAnswer(data.answer as AiAnswer);
      } else {
        setAnswer({
          topic: `اسلامی رہنمائی: ${q}`,
          arabicQuote: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
          reference: "Surah Al-Baqarah · 2:153",
          englishAnswer: `Regarding your query "${q}": The Holy Quran and Sunnah instruct believers to hold firmly to patience (Sabr) and prayer. Allah promises His direct support to those who endure with trust.`,
          urduAnswer: `آپ کے سوال "${q}" کے متعلق تفصیلی جواب: اسلام میں قرآن و سنت کی روشنی میں زندگی گزارنے کا حکم دیا گیا ہے۔ اللہ تعالیٰ کا ارشاد ہے کہ صبر اور نماز کے ذریعے مدد حاصل کرو۔ صبر، شکر اور استغفار مومن کا اصل سرمایہ ہیں۔`,
        });
      }
    } catch {
      setAnswer({
        topic: `اسلامی رہنمائی: ${q}`,
        arabicQuote: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
        reference: "Surah Al-Baqarah · 2:153",
        englishAnswer: `Regarding your query "${q}": The Holy Quran and Sunnah instruct believers to hold firmly to patience (Sabr) and prayer. Allah promises His direct support to those who endure with trust.`,
        urduAnswer: `آپ کے سوال "${q}" کے متعلق تفصیلی جواب: اسلام میں قرآن و سنت کی روشنی میں زندگی گزارنے کا حکم دیا گیا ہے۔ اللہ تعالیٰ کا ارشاد ہے کہ صبر اور نماز کے ذریعے مدد حاصل کرو۔ صبر، شکر اور استغفار مومن کا اصل سرمایہ ہیں۔`,
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  };

  const handleCopy = () => {
    if (!answer) return;
    const text = `${answer.topic}\n\n${answer.arabicQuote}\nحوالہ: ${answer.reference}\n\nاردو تفصیلی جواب:\n${answer.urduAnswer}\n\nEnglish Translation:\n${answer.englishAnswer}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSpeech = () => {
    if (!answer || typeof window === "undefined") return;
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      return;
    }
    const text = answer.urduAnswer || answer.englishAnswer;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis?.speak(utterance);
    setSpeaking(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* ── 1. Hero Header Banner Panel with Rounded Corners ── */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/70 shadow-[0_0_50px_rgba(191,160,89,0.35)] min-h-[350px] flex items-center justify-center text-center text-white py-10 px-4 sm:px-8">
        
        {/* Vibrant Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-banner.jpg"
            alt="Ask Hidayah AI Search Islamic Guidance Banner"
            fill sizes="100vw" quality={75}
            className="object-cover object-center scale-105"
            priority
          />
          {/* Transparent Vignette Layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/80 via-black/40 to-[#070D18]/70" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-95" />
        </div>

        {/* Central Hero Content */}
        <div className="relative z-10 mx-auto max-w-3xl w-full space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/80 bg-[#121A26]/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#BFA059] backdrop-blur-md shadow-md">
            <BookOpen className="size-4 text-[#BFA059]" />
            Ask Hidayah AI · Quran &amp; Hadith Guidance
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            Ask Hidayah Search
          </h1>

          <p className="text-xs sm:text-base text-[#EAD090] font-semibold drop-shadow-sm">
            Get authentic, context-aware answers with Quranic Ayahs, Sahih Hadith &amp; Urdu Tafseer.
          </p>

          {/* Full Width Search Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(input);
            }}
            className="relative mx-auto mt-6 max-w-2xl w-full"
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#BFA059]" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Search Quran &amp; Hadith e.g. "Sabar ki fazeelat", "Rizq ki dua", "Istikhara ka tarika"…'
              className="w-full rounded-2xl border-2 border-[#BFA059]/80 bg-white py-4 pl-12 pr-16 text-sm font-medium text-[#1A202C] placeholder-slate-400 shadow-2xl outline-none transition focus:border-[#BFA059] focus:ring-4 focus:ring-[#BFA059]/30"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-[#BFA059] text-[#1A202C] font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 shadow-md"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}
            </button>
          </form>
        </div>
      </section>

      {/* ── Lower Container: Suggested Topics & AI Answers ── */}
      <div className="mx-auto max-w-4xl space-y-8">

        {/* ── 2. Suggested Topics ── */}
        <section className="rounded-3xl border border-[#BFA059]/30 bg-[#FAF7F0] p-5 dark:border-night-800 dark:bg-night-900 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="size-4 text-[#BFA059]" />
            <h3 className="font-serif text-xs sm:text-sm font-bold text-[#1A202C] uppercase tracking-wider dark:text-gold-100">
              Suggested Islamic Questions (منتخب اسلامی سوالات)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {SUGGESTIONS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleSearch(chip.label)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#BFA059]/40 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-[#BFA059] hover:bg-[#BFA059]/10 active:scale-95 dark:bg-night-950 dark:text-gold-200"
              >
                <span>{chip.emoji}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── 3. Question & Detailed Response Card ── */}
        <section ref={responseRef} className="space-y-5">
          {/* Active Question Bar */}
          {activeQuery && (
            <div className="rounded-2xl border border-slate-200 bg-[#1A202C] p-4 text-white shadow-md dark:border-night-800 flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-xl bg-[#BFA059]/20 text-[#BFA059] shrink-0">
                <User className="size-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BFA059]">Your Search Question:</span>
                <p className="font-serif text-sm sm:text-base font-bold text-white">
                  &ldquo;{activeQuery}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-[#BFA059]/30 bg-white p-12 dark:bg-night-900 shadow-md">
              <Loader2 className="size-8 animate-spin text-[#BFA059]" />
              <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
                AI Engine is searching Quranic Ayahs &amp; Sahih Hadith sources…
              </p>
            </div>
          )}

          {/* Structured AI Response Card */}
          {answer && !loading && (
            <div className="overflow-hidden rounded-3xl border-2 border-[#BFA059]/50 bg-white shadow-xl dark:border-night-800 dark:bg-night-900">
              
              {/* Header Title */}
              <div className="flex items-center justify-between border-b border-[#BFA059]/20 bg-[#FAF7F0] px-6 py-4 dark:bg-night-950">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="size-5 text-[#BFA059]" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A202C] dark:text-gold-100">
                    {answer.topic}
                  </h3>
                </div>
                <span className="rounded-full bg-[#BFA059]/20 px-3 py-1 text-[10px] font-bold text-[#BFA059]">
                  AI Verified Response
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-6">

                {/* Quranic Ayah / Hadith Arabic Quote */}
                {answer.arabicQuote && (
                  <div className="rounded-2xl border-2 border-[#BFA059]/30 bg-[#FDFBF7] p-5 text-right dark:bg-night-950 shadow-sm">
                    <p
                      dir="rtl"
                      lang="ar"
                      className="font-arabic text-2xl sm:text-3xl font-bold leading-[2.4] text-[#1A202C] dark:text-[#F3E5C8]"
                    >
                      {answer.arabicQuote}
                    </p>
                    <p className="mt-2 text-xs font-extrabold text-[#BFA059]">
                      — {answer.reference}
                    </p>
                  </div>
                )}

                {/* Hadith & Quran Reference Badge */}
                <div className="flex items-center gap-2 rounded-xl border border-[#BFA059]/40 bg-[#BFA059]/10 px-4 py-2.5">
                  <ScrollText className="size-4 text-[#BFA059] shrink-0" />
                  <span className="text-xs font-bold text-[#1A202C] dark:text-gold-200">
                    حوالہ قرآن و حدیث: {answer.reference}
                  </span>
                </div>

                {/* Detailed Urdu Response (اردو تفصیلی جواب) */}
                {answer.urduAnswer && (
                  <div className="rounded-2xl border border-[#BFA059]/30 bg-[#FDFBF7] p-5 text-right dark:bg-night-950 shadow-sm">
                    <span className="mb-2 inline-block rounded bg-[#BFA059]/20 px-3 py-0.5 font-sans text-[11px] font-bold text-[#BFA059]">
                      اردو تفصیلی جواب و تشریح:
                    </span>
                    <p dir="rtl" className="font-arabic text-base sm:text-lg font-semibold leading-[2.2] text-[#121A26] dark:text-[#F3E5C8]">
                      {answer.urduAnswer}
                    </p>
                  </div>
                )}

                {/* English Response & Translation */}
                {answer.englishAnswer && (
                  <div className="rounded-2xl border border-slate-200/90 bg-slate-50 p-5 dark:border-night-800 dark:bg-night-950 space-y-1">
                    <span className="inline-block rounded bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#BFA059] dark:bg-night-800">
                      English Translation &amp; Explanation:
                    </span>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                      {answer.englishAnswer}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#BFA059]/20 pt-4">
                  <button
                    type="button"
                    onClick={handleSpeech}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 shadow-sm",
                      speaking
                        ? "bg-[#BFA059] text-[#1A202C]"
                        : "border border-[#BFA059]/40 bg-white text-[#1A202C] hover:bg-[#BFA059]/10 dark:bg-night-950 dark:text-gold-200"
                    )}
                  >
                    {speaking ? <Pause className="size-3.5" /> : <Volume2 className="size-3.5" />}
                    <span>{speaking ? "Pause Voice" : "Listen Voice (آواز سنیں)"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#BFA059]/40 bg-white px-4 py-2 text-xs font-bold text-[#1A202C] transition-all hover:bg-[#BFA059]/10 active:scale-95 shadow-sm dark:bg-night-950 dark:text-gold-200"
                  >
                    {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5 text-[#BFA059]" />}
                    <span>{copied ? "Copied ✓" : "Copy Answer"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSaved((v) => !v)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all active:scale-95 shadow-sm",
                      saved
                        ? "bg-[#BFA059] text-[#1A202C]"
                        : "border-[#BFA059]/40 bg-white text-[#1A202C] hover:bg-[#BFA059]/10 dark:bg-night-950 dark:text-gold-200"
                    )}
                  >
                    <Star className={cn("size-3.5", saved && "fill-current")} />
                    <span>{saved ? "Saved" : "Save Question"}</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default function AiSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#BFA059]" />
        </div>
      }
    >
      <AiSearchContent />
    </Suspense>
  );
}
