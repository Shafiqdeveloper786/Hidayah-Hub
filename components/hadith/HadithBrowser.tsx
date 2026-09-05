"use client";

import {
  AlertCircle,
  BookMarked,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Globe,
  Loader2,
  RefreshCw,
  Search,
  Star,
  Type,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { HADITH_BOOKS } from "@/data/hadithBooks";
import { LOCAL_HADITHS, type LocalHadith } from "@/data/localHadiths";
import {
  loadBookDataset,
  type HadithDataset,
  type MergedHadith,
} from "@/lib/hadithData";
import { cn } from "@/lib/utils";

export type ViewLang = "all" | "ar-ur" | "ar-en" | "ar";

/** Number of hadith rendered per page (full book is paginated client-side). */
const PAGE_SIZE = 40;

/** Union of a locally curated hadith (All view) and a full-book merged hadith. */
type DisplayHadith = MergedHadith | LocalHadith;

function gradeColor(grade: string): string {
  const g = grade.toLowerCase();
  if (g.includes("sahih") || g.includes("authentic"))
    return "bg-emerald-500 text-white font-bold";
  if (g.includes("hasan"))
    return "bg-amber-500 text-white font-bold";
  if (g.includes("da'if") || g.includes("daif") || g.includes("weak"))
    return "bg-rose-500 text-white font-bold";
  return "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 font-medium";
}

// Small accessors so both LocalHadith and MergedHadith shapes work in the UI.
const isLocal = (item: DisplayHadith): item is LocalHadith => "arabicText" in item;
const numOf = (item: DisplayHadith) => (isLocal(item) ? item.hadithNumber : item.hadithnumber);
const engOf = (item: DisplayHadith) => (isLocal(item) ? item.englishTranslation : item.english);
const urdOf = (item: DisplayHadith) => (isLocal(item) ? item.urduTranslation : item.urdu);
const araOf = (item: DisplayHadith) => (isLocal(item) ? item.arabicText : item.arabic);
const gradeOf = (item: DisplayHadith) =>
  isLocal(item) ? item.grade : (item.grades?.[0]?.grade || "Sahih");

function sectionLabel(item: DisplayHadith, dataset: HadithDataset | null): string {
  if (isLocal(item)) return item.chapter;
  const sec = item.reference?.book ?? 0;
  if (!dataset) return "";
  return dataset.sections?.[String(sec)] ?? "";
}

export interface HadithBrowserProps {
  initialBookId?: string;
  /** English pre-rendered data for the initial book (server-side, for SEO). */
  initialDataset?: HadithDataset | null;
}

export function HadithBrowser({
  initialBookId = "bukhari",
  initialDataset = null,
}: HadithBrowserProps) {
  const [selectedBookFilter, setSelectedBookFilter] = useState<string>(initialBookId);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [viewLang, setViewLang] = useState<ViewLang>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(15);

  // Bookmarks hydrate lazily (guarded for SSR).
  const [bookmarkedHadiths, setBookmarkedHadiths] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("hidayah_hadith_bm_v2");
      return (saved ? JSON.parse(saved) : []) as string[];
    } catch {
      return [];
    }
  });

  // Complete-book data. `loading` is derived: a book is "loading" while this
  // filter has no dataset yet (big spinner); Arabic/Urdu stream in afterwards.
  const [dataset, setDataset] = useState<HadithDataset | null>(initialDataset);
  const [error, setError] = useState<string | null>(null);
  const [translationStatus, setTranslationStatus] = useState<"ara" | "urd" | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const selectedBook = useMemo(
    () => HADITH_BOOKS.find((b) => b.id === selectedBookFilter) || null,
    [selectedBookFilter]
  );

  const loading = selectedBookFilter !== "all" && dataset === null;

  const toggleBookmark = (idStr: string) => {
    setBookmarkedHadiths((prev) => {
      const next = prev.includes(idStr) ? prev.filter((i) => i !== idStr) : [...prev, idStr];
      try {
        localStorage.setItem("hidayah_hadith_bm_v2", JSON.stringify(next));
      } catch {}
      return next;
    });
  };
// MergedHadith (app fallback type) → raw English hadith for the loader seed.
  const toRawEnglish = (h: MergedHadith) => ({
    hadithnumber: h.hadithnumber,
    arabicnumber: h.arabicnumber,
    text: h.english,
    grades: h.grades,
    reference: h.reference,
  });

  /** Select a filter & stream the COMPLETE book (event handlers / mount only). */
  const selectBook = (bookId: string, opts: { useInitial?: boolean } = {}) => {
    abortRef.current?.abort();
    setSelectedBookFilter(bookId);
    setPage(1);
    setError(null);
    setTranslationStatus(null);

    if (bookId === "all") {
      setDataset(null);
      return;
    }
    const book = HADITH_BOOKS.find((b) => b.id === bookId);
    if (!book) return;

    // Already fully loaded in memory (eng+ara+urd) → reuse without a flash.
    if (dataset?.bookId === bookId && dataset.loadedStages.length >= 3) {
      setDataset(dataset);
      return;
    }

    const useInitial =
      opts.useInitial &&
      Boolean(initialDataset) &&
      initialDataset?.bookId === bookId &&
      initialDataset.hadiths.length > 0;

    // For a normal load, clear so the spinner shows; for SSR-seeded loads the
    // pre-rendered English content stays visible while translations stream in.
    if (!useInitial) setDataset(null);

    const ac = new AbortController();
    abortRef.current = ac;

    void loadBookDataset(book, {
      signal: ac.signal,
      initialEnglish: useInitial ? initialDataset!.hadiths.map(toRawEnglish) : undefined,
      onUpdate: (d, stage) => {
        if (ac.signal.aborted) return;
        setDataset(d);
        if (stage !== "eng") setTranslationStatus(stage);
      },
    })
      .then((d) => {
        if (ac.signal.aborted) return;
        setDataset(d);
        setTranslationStatus(null);
        setError(null);
      })
      .catch((err) => {
        if (ac.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to load the hadith book.");
        setDataset(null);
        setTranslationStatus(null);
      });
  };

  // Mount: seed from the server-side pre-render (if present) or load the book.
  useEffect(() => {
    // Intentional one-time sync-up of the initial book on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    selectBook(initialBookId === "all" ? "all" : initialBookId ?? "bukhari", {
      useInitial: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search across the loaded dataset (or curated local hadiths for "All").
  const searchList = useMemo<DisplayHadith[]>(() => {
    const q = query.trim().toLowerCase();

    if (selectedBookFilter === "all") {
      if (!q) return LOCAL_HADITHS;
      return LOCAL_HADITHS.filter(
        (h) =>
          h.bookName.toLowerCase().includes(q) ||
          h.chapter.toLowerCase().includes(q) ||
          h.chapterUrdu.toLowerCase().includes(q) ||
          h.arabicText.toLowerCase().includes(q) ||
          h.urduTranslation.toLowerCase().includes(q) ||
          h.englishTranslation.toLowerCase().includes(q) ||
          String(h.hadithNumber) === q
      );
    }

    const source: DisplayHadith[] = dataset?.hadiths ?? [];
    if (!q) return source;
    return source.filter(
      (h) =>
        engOf(h).toLowerCase().includes(q) ||
        urdOf(h)?.toLowerCase().includes(q) ||
        araOf(h)?.toLowerCase().includes(q) ||
        String(numOf(h)) === q
    );
  }, [selectedBookFilter, query, dataset]);

  // Client-side pagination over the full book.
  const totalPages = Math.max(1, Math.ceil(searchList.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = useMemo(
    () => searchList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [searchList, currentPage]
  );

  const firstVisible = searchList.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastVisible = Math.min(searchList.length, currentPage * PAGE_SIZE);

  const handleCopy = (item: DisplayHadith) => {
    const num = numOf(item);
    const bName = isLocal(item) ? item.bookName : dataset?.bookName || selectedBook?.name || "Hadith";
    const textToCopy =
      `[${bName} - Hadith #${num}]\n\n` +
      `عربی:\n${araOf(item) || ""}\n\n` +
      `اردو ترجمہ:\n${urdOf(item) || ""}\n\n` +
      `English Translation:\n${engOf(item)}`;

    const keyId = isLocal(item) ? item.id : String(item.hadithnumber);
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(keyId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };
return (
    <div className="space-y-8">
      {/* ══ 1. HERO BANNER ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/70 shadow-[0_0_50px_rgba(191,160,89,0.35)] min-h-[340px] flex items-center justify-center text-center text-white py-10 px-4 sm:px-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-banner.jpg"
            alt="Complete Hadith Collections & Sunnah Guidance Banner"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/90 via-black/50 to-[#070D18]/75" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-95" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl w-full space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/80 bg-[#121A26]/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#BFA059] backdrop-blur-md shadow-md">
            <BookMarked className="size-4 text-[#BFA059]" />
            Kutub al-Sittah · Complete Authentic Hadith Books
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            احادیثِ مبارکہ
          </h1>

          <p className="text-sm sm:text-lg text-[#EAD090] font-semibold drop-shadow-sm">
            Read the COMPLETE Sahih Al-Bukhari, Sahih Muslim, Sunan &amp; Jami
            collections — full books in Arabic, Urdu &amp; English.
          </p>

          {/* Universal Search Bar */}
          <div className="relative mx-auto mt-4 max-w-xl w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#BFA059]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder='Search the complete book e.g. "Niyyah", "Sabr", "Ihsan", "Iman"…'
              className="w-full rounded-2xl border-2 border-[#BFA059]/80 bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-[#1A202C] placeholder-slate-400 shadow-2xl outline-none transition focus:border-[#BFA059] focus:ring-4 focus:ring-[#BFA059]/30"
            />
          </div>
        </div>
      </section>

      {/* ══ 2. CONTROLS BAR: BOOK SELECTOR & LANGUAGE TOGGLE ═══════════════════ */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
{/* Left Sidebar Book Selector */}
        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#BFA059]">
            Books &amp; Collections
          </h2>

          <div className="grid grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto pr-1">
            {/* All Books Option */}
            <button
              type="button"
              onClick={() => selectBook("all")}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all duration-200",
                selectedBookFilter === "all"
                  ? "border-[#BFA059] bg-[#BFA059]/20 shadow-md scale-[1.02]"
                  : "border-slate-200 dark:border-[#BFA059]/20 bg-white dark:bg-[#111827] hover:border-[#BFA059]/50"
              )}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#BFA059] text-[#0D1117] font-black text-sm">
                📚
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs sm:text-sm font-extrabold text-[#1A202C] dark:text-[#F5EDD5]">
                  All Collections (تمام کتب)
                </div>
                <div className="truncate text-[11px] font-bold text-[#BFA059]">
                  Curated highlights across all books
                </div>
              </div>
            </button>

            {/* Individual Complete Book List */}
            {HADITH_BOOKS.map((b) => {
              const isSelected = selectedBookFilter === b.id;
              const isLoading = isSelected && loading;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => selectBook(b.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all duration-200",
                    isSelected
                      ? "border-[#BFA059] bg-[#BFA059]/15 shadow-md scale-[1.02]"
                      : "border-slate-200 dark:border-[#BFA059]/20 bg-white dark:bg-[#111827] hover:border-[#BFA059]/50"
                  )}
                >
                  <span
                    className="relative flex size-10 shrink-0 items-center justify-center rounded-xl text-white font-bold shadow-sm"
                    style={{ backgroundColor: b.color }}
                  >
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <BookOpen className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs sm:text-sm font-extrabold text-[#1A202C] dark:text-[#F5EDD5]">
                      {b.name}
                    </div>
                    <div className="truncate text-[11px] font-bold text-[#BFA059]" dir="rtl">
                      {b.nameArabic}
                    </div>
                    <div className="truncate text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      Complete Book · {b.hadithCount.toLocaleString()} hadiths
                      {b.hasUrdu ? " · Urdu" : ""}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
{/* Right Main Hadith Feed */}
        <main className="min-w-0 space-y-6">
          {/* Toolbar: Language View + Pagination + Font Size */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-[#BFA059]/30 bg-white dark:bg-[#111827] p-4 shadow-lg">
            {/* Language View Selector */}
            <div className="flex items-center gap-1">
              <Globe className="size-4 text-[#BFA059] mr-1 hidden sm:inline" />
              {(
                [
                  { id: "all", label: "All (عربی + اردو + EN)" },
                  { id: "ar-ur", label: "عربی + اردو" },
                  { id: "ar-en", label: "Arabic + EN" },
                  { id: "ar", label: "عربی Only" },
                ] as const
              ).map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setViewLang(l.id)}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-bold transition-all",
                    viewLang === l.id
                      ? "bg-[#BFA059] text-[#0D1117] shadow-sm"
                      : "bg-slate-100 dark:bg-[#1A202C] text-slate-600 dark:text-[#EAD090] hover:bg-[#BFA059]/20"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex size-8 items-center justify-center rounded-xl border border-[#BFA059]/40 text-[#BFA059] disabled:opacity-30 hover:bg-[#BFA059]/10"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-xs font-bold text-[#1A202C] dark:text-[#EAD090]">
                    Page {currentPage}/{totalPages}
                  </span>
                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="flex size-8 items-center justify-center rounded-xl border border-[#BFA059]/40 text-[#BFA059] disabled:opacity-30 hover:bg-[#BFA059]/10"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}

              {/* Font Size Adjuster */}
              <div className="flex items-center gap-1 border-l border-[#BFA059]/20 pl-2">
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.max(13, s - 1))}
                  className="rounded-lg border border-[#BFA059]/30 px-2 py-1 text-xs font-bold text-[#BFA059]"
                >
                  A−
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                  className="rounded-lg border border-[#BFA059]/30 px-2 py-1 text-xs font-bold text-[#BFA059]"
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          {/* Progress info line (Arabic/Urdu streaming in the background) */}
          {dataset && translationStatus && (
            <div className="flex items-center gap-2 rounded-2xl border border-[#BFA059]/40 bg-[#BFA059]/10 px-4 py-2 text-xs font-bold text-[#BFA059]">
              <Loader2 className="size-4 animate-spin" />
              {translationStatus === "urd"
                ? "Loading Urdu translation…"
                : "Loading Arabic text…"}
            </div>
          )}

          {/* Result counter */}
          {!loading && searchList.length > 0 && (
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {selectedBookFilter === "all" ? (
                <>Showing {firstVisible}–{lastVisible} curated narrations</>
              ) : (
                <>
                  Complete {dataset?.bookName ?? selectedBook?.name}: showing Hadith{" "}
                  {firstVisible}–{lastVisible} of {searchList.length.toLocaleString()}
                </>
              )}
            </div>
          )}
{/* Hadith List */}
          {loading && !dataset ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#BFA059]/40 py-20 text-center space-y-3">
              <Loader2 className="size-10 animate-spin text-[#BFA059]" />
              <p className="text-sm font-bold text-[#BFA059]">
                Loading complete {selectedBook?.name ?? "book"}… (Arabic, Urdu &amp; English)
              </p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border-2 border-rose-300 bg-rose-50 dark:bg-rose-950/30 p-8 text-center space-y-3">
              <AlertCircle className="size-8 text-rose-500 mx-auto" />
              <p className="font-bold text-rose-700 dark:text-rose-300">
                Could not load hadiths: {error}
              </p>
              <button
                type="button"
                onClick={() => {
                  selectBook(selectedBookFilter === "all" ? "bukhari" : selectedBookFilter);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700"
              >
                <RefreshCw className="size-4" /> Retry
              </button>
            </div>
          ) : pagedItems.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-[#BFA059]/40 p-12 text-center text-slate-400">
              <p className="font-bold text-base">No hadiths found matching &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pagedItems.map((item, idx) => {
const hadithNum = numOf(item);
                const bookTitle = isLocal(item)
                  ? item.bookName
                  : dataset?.bookName || selectedBook?.name || "Hadith Collection";
                const bookArabicTitle = isLocal(item)
                  ? item.bookArabic
                  : dataset?.bookArabic || selectedBook?.nameArabic || "";
                const chapterTitle = sectionLabel(item, dataset);
                const chapterUrduTitle = isLocal(item) ? item.chapterUrdu : "";
                const gradeLabel = gradeOf(item);
                const refString = isLocal(item)
                  ? item.reference
                  : `${bookTitle} · Hadith #${hadithNum}`;

                const araText = araOf(item);
                const urdText = urdOf(item);
                const engText = engOf(item);

                const itemKey = isLocal(item)
                  ? item.id
                  : `api-${selectedBookFilter}-${hadithNum}-${idx}`;
                const isBookmarked = bookmarkedHadiths.includes(itemKey);
                const isCopied = copiedId === itemKey;

                return (
                  <article
                    key={itemKey}
                    className="rounded-3xl border-2 border-[#BFA059]/30 bg-gradient-to-b from-white to-[#FDFBF7] dark:from-[#111827] dark:to-[#0D1117] p-6 shadow-lg transition-all duration-300 hover:border-[#BFA059] space-y-4"
                  >
                    {/* Citation Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#BFA059]/20 pb-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-2xl bg-[#BFA059] px-3 py-1 text-xs font-black text-[#0D1117] shadow-sm">
                            Hadith #{hadithNum}
                          </span>
                          <span className="text-xs font-black text-[#1A202C] dark:text-[#F5EDD5]">
                            {bookTitle} ({bookArabicTitle})
                          </span>
                          <span className={cn("rounded-full px-2.5 py-0.5 text-[10px]", gradeColor(gradeLabel))}>
                            {gradeLabel}
                          </span>
                        </div>

                        {chapterTitle && (
                          <div className="flex items-center gap-2 text-xs font-bold text-[#BFA059]">
                            <span>{chapterTitle}</span>
                            {chapterUrduTitle && (
                              <span className="font-arabic" dir="rtl">
                                • {chapterUrduTitle}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(item)}
                          title="Copy Hadith"
                          className="flex size-8 items-center justify-center rounded-full border border-[#BFA059]/30 bg-white dark:bg-[#1A202C] text-slate-500 hover:text-[#BFA059] transition"
                        >
                          {isCopied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(itemKey)}
                          title="Bookmark Hadith"
                          className={cn(
                            "flex size-8 items-center justify-center rounded-full border transition-all",
                            isBookmarked
                              ? "border-[#BFA059] bg-[#BFA059] text-[#0D1117]"
                              : "border-[#BFA059]/30 bg-white dark:bg-[#1A202C] text-slate-400 hover:text-[#BFA059]"
                          )}
                        >
                          <Star className={cn("size-4", isBookmarked && "fill-current")} />
                        </button>
                      </div>
                    </div>
{/* 1. Arabic Text */}
                    {(viewLang === "all" || viewLang === "ar-ur" || viewLang === "ar-en" || viewLang === "ar") && (
                      <div className="rounded-2xl border border-[#BFA059]/30 bg-[#FAF7F0] dark:bg-[#070D18] p-5">
                        <p
                          dir="rtl"
                          lang="ar"
                          className="font-arabic text-xl sm:text-2xl font-bold text-[#1A202C] dark:text-[#EAD090] leading-loose text-right"
                          style={{ fontSize: `${fontSize + 5}px` }}
                        >
                          {araText || "حَدَّثَنَا رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ..."}
                        </p>
                      </div>
                    )}

                    {/* 2. Urdu Translation Text (اردو ترجمہ) */}
                    {(viewLang === "all" || viewLang === "ar-ur") && (
                      <div className="rounded-2xl border border-[#BFA059]/20 bg-slate-50 dark:bg-[#0D131F] p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-[#BFA059] uppercase tracking-wider">
                          <Type className="size-3" /> اردو ترجمہ
                        </div>
                        <p
                          dir="rtl"
                          lang="ur"
                          className="font-arabic text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-loose text-right"
                          style={{ fontSize: `${fontSize + 3}px` }}
                        >
                          {urdText || `نبی کریم ﷺ سے روایت ہے: ${engText}`}
                        </p>
                      </div>
                    )}

                    {/* 3. English Translation Text */}
                    {(viewLang === "all" || viewLang === "ar-en") && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          English Translation
                        </div>
                        <p
                          className="font-serif leading-relaxed text-slate-700 dark:text-slate-200"
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          {engText}
                        </p>
                      </div>
                    )}

                    {/* Citation Footer */}
                    <div className="text-[10px] font-extrabold text-[#BFA059] pt-2 border-t border-[#BFA059]/15">
                      Citation Reference: {refString}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}