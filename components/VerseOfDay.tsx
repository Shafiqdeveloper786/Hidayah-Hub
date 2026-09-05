import { Quote } from "lucide-react";
import Link from "next/link";
import { getVerseOfTheDay } from "@/data/verses";

export function VerseOfDay() {
  const verse = getVerseOfTheDay();
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-gold-200/80 bg-gradient-to-br from-gold-50 via-white to-brand-50 p-6 dark:border-gold-500/20 dark:from-night-800 dark:via-night-900 dark:to-night-950 shadow-sm">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">
            Ayah of the Day
          </p>
          <Quote className="size-5 text-gold-400" aria-hidden />
        </div>
        <blockquote className="mt-5 text-right">
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-2xl leading-[2.1] text-slate-900 dark:text-gold-100"
          >
            {verse.arabic}
          </p>
          <p className="mt-4 h-[2px] w-12 bg-gold-400/60" />
          <p className="mt-4 text-left text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
            {verse.translation}
          </p>
        </blockquote>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm">
        <Link
          href={`/quran/${verse.reference.split(" ")[1]?.split(":")[0] ?? "1"}`}
          className="inline-flex items-center gap-1.5 font-medium text-brand-700 transition-colors hover:text-brand-600 dark:text-gold-400 dark:hover:text-gold-300"
        >
          <span className="rounded-full bg-brand-600/10 px-3 py-1 ring-1 ring-brand-600/30 dark:bg-gold-400/10 dark:ring-gold-400/30">
            {verse.reference}
          </span>
        </Link>
      </div>
    </div>
  );
}