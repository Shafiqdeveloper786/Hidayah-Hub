"use client";

import {
  Bookmark,
  Check,
  Copy,
  HeartHandshake,
  Pause,
  Quote,
  Search,
  Volume2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { DUAS, DUA_CATEGORIES, type Dua } from "@/data/duas";
import { cn } from "@/lib/utils";

export default function DuasPage() {
  const [category, setCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingDuaId, setPlayingDuaId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [langView, setLangView] = useState<"both" | "en" | "ur">("both");

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hidayah_dua_bookmarks");
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((bId) => bId !== id)
        : [...prev, id];
      try {
        localStorage.setItem("hidayah_dua_bookmarks", JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const filtered = useMemo(() => {
    return DUAS.filter((dua) => {
      // Category filter
      if (category === "Saved ⭐") {
        if (!bookmarks.includes(dua.id)) return false;
      } else if (category !== "All" && dua.category !== category) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        dua.title.toLowerCase().includes(q) ||
        dua.arabic.includes(q) ||
        dua.transliteration.toLowerCase().includes(q) ||
        dua.translation.toLowerCase().includes(q) ||
        dua.urduTranslation.includes(q) ||
        dua.reference.toLowerCase().includes(q)
      );
    });
  }, [category, searchQuery, bookmarks]);

  const toggleAudio = (dua: Dua) => {
    if (playingDuaId === dua.id) {
      window.speechSynthesis?.cancel();
      setPlayingDuaId(null);
    } else {
      window.speechSynthesis?.cancel();
      const utterance = new SpeechSynthesisUtterance(dua.translation);
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingDuaId(null);
      utterance.onerror = () => setPlayingDuaId(null);
      window.speechSynthesis?.speak(utterance);
      setPlayingDuaId(dua.id);
    }
  };

  const copyDua = (dua: Dua) => {
    const textToCopy = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\nEnglish: ${dua.translation}\n\nاردو ترجمہ: ${dua.urduTranslation}\n\nReference: ${dua.reference}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Banner styled after /ai-search */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/70 shadow-[0_0_50px_rgba(191,160,89,0.35)] min-h-[350px] flex items-center justify-center text-center text-white py-10 px-4 sm:px-8">
        {/* Vibrant Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-banner.jpg"
            alt="Masnoon Duas Banner"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/80 via-black/40 to-[#070D18]/70" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-95" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-14 text-center text-white space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/50 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D1B876] backdrop-blur-md shadow-inner">
            <HeartHandshake className="size-4 text-[#BFA059] animate-pulse" />
            Ad'iyah &amp; Sunnah Supplications
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
            Masnoon <span className="text-[#D1B876]">Du'as</span> &amp; Azkar
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Authentic supplications from the Holy Qur'an and Sunnah for every moment of your daily life with clear Arabic, transliteration, English &amp; Urdu translations.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#BFA059]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, Arabic, English or Urdu..."
              className="w-full rounded-2xl border border-[#BFA059]/50 bg-black/50 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-400 backdrop-blur-md focus:border-[#D1B876] focus:outline-none focus:ring-2 focus:ring-[#D1B876]/40 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Translation View Filter & Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="text-xs text-slate-400 font-medium">View Mode:</span>
            <div className="inline-flex rounded-xl border border-[#BFA059]/40 bg-black/40 p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setLangView("both")}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                  langView === "both"
                    ? "bg-[#BFA059] text-black shadow-md"
                    : "text-slate-300 hover:text-white"
                )}
              >
                Both (EN &amp; UR)
              </button>
              <button
                type="button"
                onClick={() => setLangView("en")}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                  langView === "en"
                    ? "bg-[#BFA059] text-black shadow-md"
                    : "text-slate-300 hover:text-white"
                )}
              >
                English Only
              </button>
              <button
                type="button"
                onClick={() => setLangView("ur")}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                  langView === "ur"
                    ? "bg-[#BFA059] text-black shadow-md"
                    : "text-slate-300 hover:text-white"
                )}
              >
                اردو Only
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setCategory("All")}
          className={cn(
            "rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95",
            category === "All"
              ? "bg-[#BFA059] text-black shadow-md ring-2 ring-[#BFA059]"
              : "border border-[#BFA059]/30 bg-white text-slate-700 hover:bg-[#BFA059]/10 dark:bg-night-900 dark:text-slate-300"
          )}
        >
          All ({DUAS.length})
        </button>

        <button
          type="button"
          onClick={() => setCategory("Saved ⭐")}
          className={cn(
            "rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5",
            category === "Saved ⭐"
              ? "bg-[#BFA059] text-black shadow-md ring-2 ring-[#BFA059]"
              : "border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
          )}
        >
          <Bookmark className="size-3.5 fill-current" />
          Bookmarks ({bookmarks.length})
        </button>

        {DUA_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95",
              category === c
                ? "bg-[#BFA059] text-black shadow-md ring-2 ring-[#BFA059]"
                : "border border-[#BFA059]/30 bg-white text-slate-700 hover:bg-[#BFA059]/10 dark:bg-night-900 dark:text-slate-300"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Duas Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[2.5rem] border border-[#BFA059]/30 bg-white/50 p-12 text-center backdrop-blur-sm dark:bg-night-900/50">
          <Quote className="mx-auto size-12 text-[#BFA059]/40 mb-3" />
          <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-slate-200">
            No supplications found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search query or selecting a different category filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((dua) => {
            const isPlaying = playingDuaId === dua.id;
            const isCopied = copiedId === dua.id;
            const isBookmarked = bookmarks.includes(dua.id);

            return (
              <article
                key={dua.id}
                className="group relative flex flex-col justify-between rounded-[2rem] border border-[#BFA059]/40 bg-gradient-to-b from-[#FAF7F0] to-[#F5EFE0] p-6 shadow-lg transition-all duration-300 hover:border-[#BFA059] hover:shadow-2xl dark:border-night-800 dark:from-night-900 dark:to-night-950"
              >
                <div className="space-y-4">
                  {/* Card Header: Title & Bookmark */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block rounded-full bg-[#BFA059]/20 px-3 py-1 text-[11px] font-bold text-[#8C6F2D] dark:text-[#D1B876] mb-1.5">
                        {dua.category}
                      </span>
                      <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-gold-100 group-hover:text-[#BFA059] transition-colors">
                        {dua.title}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(dua.id)}
                      title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                      className={cn(
                        "rounded-full p-2.5 transition-all active:scale-90",
                        isBookmarked
                          ? "bg-[#BFA059] text-black shadow-md"
                          : "bg-black/5 dark:bg-white/10 text-slate-400 hover:text-[#BFA059]"
                      )}
                    >
                      <Bookmark className={cn("size-4", isBookmarked && "fill-current")} />
                    </button>
                  </div>

                  {/* Arabic Text Display Box */}
                  <div className="relative overflow-hidden rounded-2xl border border-[#BFA059]/40 bg-white p-5 text-right shadow-inner dark:bg-night-950">
                    <p
                      dir="rtl"
                      lang="ar"
                      className="font-arabic text-2xl sm:text-3xl font-bold leading-[2.3] text-slate-900 dark:text-gold-50 tracking-wide"
                    >
                      {dua.arabic}
                    </p>
                  </div>

                  {/* Transliteration */}
                  <p className="text-xs italic leading-relaxed text-slate-600 dark:text-slate-400 bg-white/40 dark:bg-black/20 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                    <span className="font-semibold not-italic text-[#BFA059] mr-1">Transliteration:</span>
                    {dua.transliteration}
                  </p>

                  {/* English Translation */}
                  {(langView === "both" || langView === "en") && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#BFA059] block mb-0.5">
                          English Translation
                        </span>
                        {dua.translation}
                      </p>
                    </div>
                  )}

                  {/* Urdu Translation */}
                  {(langView === "both" || langView === "ur") && (
                    <div className="rounded-xl border border-[#BFA059]/30 bg-white/70 p-3.5 text-right dark:bg-night-950/70">
                      <span className="text-xs font-bold text-[#BFA059] block mb-1">
                        اردو ترجمہ
                      </span>
                      <p
                        dir="rtl"
                        className="font-arabic text-base font-semibold text-slate-900 leading-loose dark:text-gold-200"
                      >
                        {dua.urduTranslation}
                      </p>
                    </div>
                  )}

                  {/* Optional Note */}
                  {dua.note && (
                    <div className="flex items-start gap-2 rounded-xl bg-[#BFA059]/15 p-3 text-xs font-medium text-slate-800 dark:text-slate-200 border border-[#BFA059]/30">
                      <span>ℹ️ {dua.note}</span>
                    </div>
                  )}
                </div>

                {/* Footer: Source Reference & Action Buttons */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#BFA059]/20 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Quote className="size-3.5 text-[#BFA059]" />
                    {dua.reference}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Audio Listen */}
                    <button
                      type="button"
                      onClick={() => toggleAudio(dua)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 shadow-sm",
                        isPlaying
                          ? "bg-[#BFA059] text-black ring-2 ring-[#BFA059] animate-pulse"
                          : "bg-[#D1B876] text-black hover:bg-[#BFA059]"
                      )}
                    >
                      {isPlaying ? <Pause className="size-3.5" /> : <Volume2 className="size-3.5" />}
                      <span>{isPlaying ? "Pause" : "Listen"}</span>
                    </button>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => copyDua(dua)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#BFA059]/60 bg-white px-4 py-2 text-xs font-bold text-slate-800 transition-all hover:bg-[#BFA059]/10 active:scale-95 dark:bg-night-950 dark:text-gold-200"
                    >
                      {isCopied ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5 text-[#BFA059]" />
                      )}
                      <span>{isCopied ? "Copied ✓" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}