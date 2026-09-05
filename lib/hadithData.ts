/**
 * Loader for COMPLETE Hadith books from the free, open fawazahmed0/hadith-api
 * CDN. Each book is loaded as ONE full-book file (Arabic, Urdu, English), then
 * merged by hadith number and cached per session.
 *
 * Works both on the server (SSR/SSG for SEO) and in the browser (client
 * browsing). The in-memory cache lives on `globalThis` so repeated loads and
 * server/client round-trips don't re-download the books.
 */

import type { HadithBook } from "@/data/hadithBooks";

export const HADITH_CDN_BASE =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";

/** Raw hadith item as stored in an edition file. */
export interface FullBookHadith {
  hadithnumber: number;
  arabicnumber?: number;
  text: string;
  grades?: { name: string; grade: string }[];
  reference?: { book: number; hadith: number };
}

export interface FullBookPayload {
  metadata?: { name?: string; sections?: Record<string, string> };
  hadiths?: FullBookHadith[];
}

/** A hadith merged across the English / Arabic / Urdu editions. */
export interface MergedHadith {
  hadithnumber: number;
  arabicnumber?: number;
  english: string;
  urdu?: string;
  arabic?: string;
  grades?: { name: string; grade: string }[];
  reference?: { book: number; hadith: number };
}

export interface HadithDataset {
  bookId: string;
  bookName: string;
  bookArabic: string;
  /** Chapter (book name in the original work) label per section id. */
  sections: Record<string, string>;
  hadiths: MergedHadith[];
  total: number;
  hasUrdu: boolean;
  /** Which language layers have been loaded: "eng", "ara", "urd". */
  loadedStages: Array<"eng" | "ara" | "urd">;
}

export interface LoadBookOptions {
  signal?: AbortSignal;
  /** Pre-loaded English hadiths (e.g. from SSR) so we skip re-downloading English. */
  initialEnglish?: FullBookHadith[];
  /** `"none"` = English only (used by server components for SEO HTML). */
  translations?: "all" | "none";
  /** Request cache mode — "force-cache" lets Next static-gen cache the fetch. */
  cacheMode?: RequestCache;
  /** Called whenever a language layer becomes available. */
  onUpdate?: (dataset: HadithDataset, stage: "eng" | "ara" | "urd") => void;
}

// ─── In-memory cache (shared across the app in a session / process) ─────────
const CACHE_KEY = "__hidayah_hadith_cache__";
type RawBook = {
  eng?: FullBookHadith[];
  ara?: FullBookHadith[];
  urd?: FullBookHadith[];
  sections?: Record<string, string>;
};
type RawCache = Record<string, RawBook>;

function getCache(): RawCache {
  const g = globalThis as unknown as Record<string, RawCache | undefined>;
  if (!g[CACHE_KEY]) g[CACHE_KEY] = {};
  return g[CACHE_KEY] as RawCache;
}

async function fetchJson<T>(url: string, opts: Pick<LoadBookOptions, "signal" | "cacheMode">): Promise<T> {
  const res = await fetch(url, { signal: opts.signal, cache: opts.cacheMode ?? "default" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return (await res.json()) as T;
}

function mergeDataset(book: HadithBook, raw: RawBook): HadithDataset {
  const byNum = new Map<number, MergedHadith>();

  for (const h of raw.eng ?? []) {
    byNum.set(h.hadithnumber, {
      hadithnumber: h.hadithnumber,
      arabicnumber: h.arabicnumber,
      english: h.text,
      grades: h.grades,
      reference: h.reference,
    });
  }

  for (const h of raw.ara ?? []) {
    const existing = byNum.get(h.hadithnumber);
    if (existing) {
      existing.arabic = h.text;
    } else {
      byNum.set(h.hadithnumber, {
        hadithnumber: h.hadithnumber,
        arabicnumber: h.arabicnumber,
        english: h.text,
        arabic: h.text,
        grades: h.grades,
        reference: h.reference,
      });
    }
  }

  for (const h of raw.urd ?? []) {
    const existing = byNum.get(h.hadithnumber);
    if (existing) {
      existing.urdu = h.text;
    } else {
      byNum.set(h.hadithnumber, {
        hadithnumber: h.hadithnumber,
        arabicnumber: h.arabicnumber,
        english: h.text,
        urdu: h.text,
        grades: h.grades,
        reference: h.reference,
      });
    }
  }

  const hadiths = [...byNum.values()].sort((a, b) => a.hadithnumber - b.hadithnumber);
  const loadedStages: Array<"eng" | "ara" | "urd"> = [];
  if (raw.eng?.length) loadedStages.push("eng");
  if (raw.ara?.length) loadedStages.push("ara");
  if (raw.urd?.length) loadedStages.push("urd");

  return {
    bookId: book.id,
    bookName: book.name,
    bookArabic: book.nameArabic,
    sections: raw.sections ?? {},
    hadiths,
    total: hadiths.length,
    hasUrdu: book.hasUrdu,
    loadedStages,
  };
}
/**
 * Loads a complete hadith book (English immediately; Arabic + Urdu in the
 * background). Resolves with the fully-merged dataset.
 */
export async function loadBookDataset(
  book: HadithBook,
  opts: LoadBookOptions = {}
): Promise<HadithDataset> {
  const cache = getCache();
  const raw = (cache[book.id] ??= {});
  const signal = opts.signal;
  const withTranslations = opts.translations !== "none";

  // 1. English (index + primary text) — shows instantly
  if (!raw.eng) {
    if (opts.initialEnglish?.length) {
      raw.eng = opts.initialEnglish;
    } else if (!signal?.aborted) {
      const payload = await fetchJson<FullBookPayload>(
        `${HADITH_CDN_BASE}/${book.edition}.min.json`,
        { signal, cacheMode: opts.cacheMode }
      );
      if (payload.metadata?.sections) raw.sections = payload.metadata.sections;
      raw.eng = payload.hadiths ?? [];
      if (!raw.eng.length) throw new Error(`No hadith found for ${book.name}`);
    }
  }
  if (opts.onUpdate && !signal?.aborted) opts.onUpdate(mergeDataset(book, raw), "eng");

  // 2. Arabic + Urdu translations (best-effort, in parallel)
  if (withTranslations && !signal?.aborted) {
    const slug = book.edition.replace(/^eng-/, "");
    const tasks: Promise<void>[] = [];

    if (!raw.ara) {
      tasks.push(
        fetchJson<FullBookPayload>(`${HADITH_CDN_BASE}/ara-${slug}.min.json`, {
          signal,
          cacheMode: opts.cacheMode,
        })
          .then((payload) => {
            raw.ara = payload.hadiths ?? [];
            if (payload.metadata?.sections) raw.sections = payload.metadata.sections;
            if (opts.onUpdate && !signal?.aborted) opts.onUpdate(mergeDataset(book, raw), "ara");
          })
          .catch(() => {
            raw.ara = raw.ara ?? [];
            if (opts.onUpdate && !signal?.aborted) opts.onUpdate(mergeDataset(book, raw), "ara");
          })
      );
    }

    if (book.hasUrdu && !raw.urd) {
      tasks.push(
        fetchJson<FullBookPayload>(`${HADITH_CDN_BASE}/urd-${slug}.min.json`, {
          signal,
          cacheMode: opts.cacheMode,
        })
          .then((payload) => {
            raw.urd = payload.hadiths ?? [];
            if (opts.onUpdate && !signal?.aborted) opts.onUpdate(mergeDataset(book, raw), "urd");
          })
          .catch(() => {
            raw.urd = raw.urd ?? [];
            if (opts.onUpdate && !signal?.aborted) opts.onUpdate(mergeDataset(book, raw), "urd");
          })
      );
    }

    await Promise.all(tasks);
  }

  cache[book.id] = raw;
  return mergeDataset(book, raw);
}