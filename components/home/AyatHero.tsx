"use client";

import { BookOpen, Headphones, Pause, Play, X } from "lucide-react";
import { useRef, useState } from "react";
import { KaabaIllustration } from "@/components/KaabaIllustration";
import { getVerseOfTheDay } from "@/data/verses";
import { cn } from "@/lib/utils";

export function AyatHero() {
  const verse = getVerseOfTheDay();
  const [playing, setPlaying] = useState(false);
  const [showTafseer, setShowTafseer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch((err) => {
          console.error("Audio playback error:", err);
          setPlaying(false);
        });
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#BFA059]/40 bg-[#FAF7F0] p-6 shadow-md shadow-brand-950/5 sm:p-10 dark:border-night-800 dark:bg-night-900">
      {/* Hidden Audio Tag */}
      <audio
        ref={audioRef}
        src={verse.audioUrl}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        preload="metadata"
      />

      <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        {/* Left / Main Verse Content */}
        <div className="flex flex-col items-center text-center">
          {/* Top Kicker Badge */}
          <div className="inline-flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#BFA059] dark:text-gold-400">
              ✦ AYAT OF THE DAY ✦
            </span>
          </div>

          {/* Arabic Verse */}
          <blockquote className="mt-5 w-full max-w-3xl space-y-3">
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-relaxed text-[#1A202C] dark:text-gold-50"
            >
              {verse.arabic}
            </p>

            {/* English Translation */}
            <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200">
              "{verse.translation}"
            </p>

            {/* Urdu Translation */}
            <p dir="rtl" className="font-arabic text-lg sm:text-xl font-semibold text-[#BFA059] dark:text-gold-300">
              “{verse.urduTranslation}”
            </p>

            {/* Surah Reference */}
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
              ({verse.reference})
            </p>
          </blockquote>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={toggleAudio}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all active:scale-95",
                playing
                  ? "bg-[#BFA059] text-[#1A202C] shadow-md ring-2 ring-[#BFA059]"
                  : "bg-[#D1B876] text-[#1A202C] hover:bg-[#BFA059]"
              )}
            >
              {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              <span>{playing ? "Playing Audio…" : "Listen Audio"}</span>
              <Headphones className="size-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setShowTafseer(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/50 bg-white px-5 py-2.5 text-xs font-bold text-[#1A202C] shadow-sm transition-all hover:bg-gold-500/10 active:scale-95 dark:bg-night-950 dark:text-gold-200"
            >
              <BookOpen className="size-3.5 text-[#BFA059]" />
              <span>Tafseer</span>
              <span className="text-xs">📚</span>
            </button>
          </div>
        </div>

        {/* Right Side Illustration */}
        <div className="hidden items-center justify-center lg:flex">
          <KaabaIllustration className="h-auto w-56 lg:w-64" />
        </div>
      </div>

      {/* Tafseer Modal */}
      {showTafseer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A202C]/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#BFA059]/40 bg-[#FAF7F0] p-6 shadow-2xl dark:border-night-800 dark:bg-night-900">
            <div className="flex items-center justify-between border-b border-[#BFA059]/30 pb-4 dark:border-night-800">
              <div className="flex items-center gap-2 text-[#1A202C] dark:text-gold-100">
                <BookOpen className="size-5 text-[#BFA059]" />
                <h3 className="font-serif text-lg font-bold">
                  Tafseer · {verse.reference}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTafseer(false)}
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-night-800"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#BFA059]">
                  English Tafseer & Commentary
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {verse.tafseerEnglish}
                </p>
              </div>

              <div className="h-px bg-[#BFA059]/20 dark:bg-night-800" />

              <div>
                <h4 className="text-right text-xs font-bold uppercase tracking-wider text-[#BFA059]">
                  تفسیرِ قرآن (اردو)
                </h4>
                <p dir="rtl" className="mt-2 font-arabic text-base leading-loose text-slate-800 dark:text-slate-200">
                  {verse.tafseerUrdu}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTafseer(false)}
                className="rounded-xl bg-[#1A202C] px-5 py-2 text-xs font-bold text-white hover:bg-brand-950 dark:bg-[#BFA059] dark:text-[#1A202C]"
              >
                Close Tafseer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}