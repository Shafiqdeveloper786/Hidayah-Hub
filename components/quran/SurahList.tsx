"use client";

import { BookMarked, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SURAHS } from "@/data/surahs";
import { cn } from "@/lib/utils";

export function SurahList() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "Meccan" | "Medinan">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SURAHS.filter((surah) => {
      if (filter !== "all" && surah.revelation !== filter) return false;
      if (!q) return true;
      return (
        String(surah.id).includes(q) ||
        surah.transliteration.toLowerCase().includes(q) ||
        surah.english.toLowerCase().includes(q) ||
        surah.name.includes(query.trim())
      );
    });
  }, [query, filter]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <label className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-300"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, number, or meaning…"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-night-800 dark:bg-night-900 dark:text-slate-200 dark:focus:border-gold-500"
          />
        </label>
        <div className="flex gap-2">
          {(["all", "Meccan", "Medinan"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
                filter === value
                  ? "bg-brand-600 text-white shadow-sm dark:bg-gold-500 dark:text-night-950"
                  : "border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700 dark:border-night-800 dark:text-slate-300 dark:hover:border-gold-500/50 dark:hover:text-gold-300"
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">
        {results.length} of {SURAHS.length} Surahs
      </p>

      {results.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 p-12 text-center dark:border-night-800">
          <BookMarked className="mx-auto mb-3 size-8 text-slate-300" aria-hidden />
          <p className="text-slate-500 dark:text-slate-300">No Surahs match “{query}”.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((surah) => (
            <li key={surah.id}>
              <Link
                href={`/quran/${surah.id}`}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5 dark:border-night-800 dark:bg-night-900 dark:hover:border-gold-500/40"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 font-mono text-sm font-bold text-white shadow-sm dark:from-gold-500 dark:to-gold-600 dark:text-night-950">
                  {surah.id}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-serif font-semibold text-slate-900 dark:text-gold-100">
                      {surah.transliteration}
                    </span>
                    <span
                      dir="rtl"
                      lang="ar"
                      className="shrink-0 font-arabic text-lg text-brand-700 dark:text-gold-300"
                    >
                      {surah.name}
                    </span>
                  </span>
                  <span className="mt-0.5 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-300">
                    <span className="truncate">{surah.english}</span>
                    <span className="shrink-0">
                      {surah.ayahs} ayahs · {surah.revelation}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}