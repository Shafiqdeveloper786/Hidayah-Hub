"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Braces,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSurah, SURAHS } from "@/data/surahs";
import { cn } from "@/lib/utils";

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  page: number;
  juz: number;
}

interface SurahPayload {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
  edition: { identifier: string };
}

const API_URL =
  "https://api.alquran.cloud/v1/surah/{id}/editions/quran-uthmani,en.sahih";

async function fetchSurah(surahId: number): Promise<{
  arabic: SurahPayload;
  english: SurahPayload;
}> {
  const res = await fetch(API_URL.replace("{id}", String(surahId)));
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const json = (await res.json()) as { code: number; data: SurahPayload[] };
  if (json.code !== 200 || !Array.isArray(json.data)) {
    throw new Error("Unexpected API response");
  }
  const arabic = json.data.find((d) => d.edition.identifier === "quran-uthmani");
  const english = json.data.find((d) => d.edition.identifier === "en.sahih");
  if (!arabic || !english) throw new Error("Edition not found");
  return { arabic, english };
}

export function SurahReader({ surahId }: { surahId: number }) {
  const surah = getSurah(surahId);
  const [data, setData] = useState<{ arabic: SurahPayload; english: SurahPayload } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState(28);

  const load = useCallback(async () => {
    if (!surah) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSurah(surah.id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [surah]);

  useEffect(() => {
    setData(null);
    void load();
  }, [load]);

  const prev = useMemo(() => SURAHS.find((s) => s.id === surahId - 1), [surahId]);
  const next = useMemo(() => SURAHS.find((s) => s.id === surahId + 1), [surahId]);

  if (!surah) {
    return (
      <div className="rounded-3xl border border-slate-200 p-12 text-center dark:border-night-800">
        <p className="text-slate-500">This Surah could not be found.</p>
        <Link href="/quran" className="mt-3 inline-block text-brand-700 underline dark:text-gold-400">
          Browse all Surahs
        </Link>
      </div>
    );
  }

  const arabicAyahs = data?.arabic.ayahs ?? [];
  const englishAyahs = data?.english.ayahs ?? [];

  return (
    <div>
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-200/70 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 p-8 text-center text-white shadow-lg dark:border-brand-700">
        <div className="absolute inset-0 pattern-arch opacity-50" aria-hidden />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            {prev ? (
              <Link
                href={`/quran/${prev.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
              >
                <ArrowLeft className="size-3.5" /> {prev.transliteration}
              </Link>
            ) : (
              <span aria-hidden />
            )}
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-200">
              Surah {surah.id} of 114
            </p>
            {next ? (
              <Link
                href={`/quran/${next.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
              >
                {next.transliteration} <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <span aria-hidden />
            )}
          </div>

          <p dir="rtl" lang="ar" className="mt-6 font-arabic text-5xl text-gold-200">
            {surah.name}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold">{surah.transliteration}</h1>
          <p className="mt-1 text-sm text-brand-100/90">
            {surah.english} · {surah.ayahs} ayahs · {surah.revelation}
          </p>
          {surah.id !== 1 && surah.id !== 9 ? (
            <p dir="rtl" lang="ar" className="mt-5 font-arabic text-2xl leading-relaxed text-brand-100/90">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          ) : null}
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-night-800 dark:bg-night-900">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowTranslation((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors",
              showTranslation
                ? "bg-brand-600 text-white dark:bg-gold-500 dark:text-night-950"
                : "border border-slate-200 text-slate-600 dark:border-night-800 dark:text-slate-300"
            )}
          >
            {showTranslation ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            Translation
          </button>
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Braces className="size-3.5" /> Arabic
            <input
              type="range"
              min={18}
              max={44}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="ml-1 w-28 accent-brand-600 dark:accent-gold-500"
              aria-label="Arabic text size"
            />
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {data
            ? `${data.arabic.numberOfAyahs} ayahs · pages ${data.arabic.ayahs[0]?.page ?? "–"}–${
                data.arabic.ayahs[data.arabic.ayahs.length - 1]?.page ?? ""
              }`
            : "Loading…"}
        </p>
      </div>

      {/* Body */}
      {loading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-night-800"
              aria-hidden
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
          <AlertCircle className="mx-auto mb-3 size-8 text-red-400" aria-hidden />
          <p className="font-medium text-red-700 dark:text-red-300">
            Could not load Surah {surah.transliteration}.
          </p>
          <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
          >
            <RefreshCw className="size-3.5" /> Try again
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {arabicAyahs.map((ayah, index) => (
            <article
              key={ayah.number}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-brand-300/70 dark:border-night-800 dark:bg-night-900 dark:hover:border-gold-500/30"
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-600/10 font-mono text-xs font-bold text-brand-700 ring-1 ring-brand-600/20 dark:bg-gold-400/10 dark:text-gold-300 dark:ring-gold-400/20">
                  {ayah.numberInSurah}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-arabic leading-[2.2] text-slate-900 dark:text-gold-50"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {ayah.text}
                  </p>
                  {showTranslation ? (
                    <p className="mt-3 border-t border-dashed border-slate-200 pt-3 text-[15px] leading-relaxed text-slate-600 dark:border-night-700 dark:text-slate-400">
                      {englishAyahs[index]?.text ?? ""}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}

          <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 p-6 text-center text-white dark:from-gold-600 dark:to-gold-700 dark:text-night-950">
            <BookOpen className="mx-auto mb-2 size-6 opacity-80" aria-hidden />
            <p className="text-sm">
              You have read Surah {surah.transliteration} — {surah.ayahs} ayahs.
              May Allah accept it from us and you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}