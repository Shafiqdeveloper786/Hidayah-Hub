import { Construction } from "lucide-react";
import Link from "next/link";

interface PlaceholderPageProps {
  title: string;
  description: string;
  badge?: string;
}

/**
 * Lightweight "in progress" page used for modules that are landing soon
 * (Reflections, Daily Quiz, Donation portal, …).
 */
export function PlaceholderPage({
  title,
  description,
  badge = "Coming Soon",
}: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm shadow-brand-950/5 dark:border-night-800 dark:bg-night-900">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(24rem 14rem at 50% 0%, color-mix(in srgb, var(--color-gold-500) 10%, transparent), transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative">
          <span className="mx-auto inline-flex size-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-800 to-brand-950 text-gold-300 shadow-lg shadow-brand-950/20">
            <Construction className="size-8" aria-hidden />
          </span>
          <span className="mt-5 inline-block rounded-full bg-gold-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700 dark:text-gold-300">
            {badge}
          </span>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-brand-950 dark:text-gold-50">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {description}
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-brand-950 shadow-sm transition-all hover:bg-gold-400 active:scale-95 dark:text-night-950"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}