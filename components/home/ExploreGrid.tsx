import { Award, BookOpen, Compass, Zap } from "lucide-react";
import Link from "next/link";

interface ExploreCard {
  href: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
}

const CARDS: ExploreCard[] = [
  {
    href: "/quran",
    title: "Digital Quran",
    description: "Read & Listen Full Quran",
    icon: BookOpen,
  },
  {
    href: "/zikr",
    title: "Daily Zikr",
    description: "Tasbeeh Counter & Streaks",
    icon: Award,
  },
  {
    href: "/qibla",
    title: "Qibla Finder",
    description: "Accurate Qibla Direction",
    icon: Compass,
  },
  {
    href: "/quiz",
    title: "Daily Quiz",
    description: "Test Your Islamic Knowledge",
    icon: Zap,
  },
];

export function ExploreGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map(({ href, title, description, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="group flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-400 hover:shadow-md dark:border-night-800 dark:bg-night-900"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 transition-colors group-hover:bg-gold-500 group-hover:text-brand-950 dark:text-gold-400">
            <Icon className="size-5" aria-hidden />
          </div>

          <div className="flex flex-col">
            <h3 className="font-serif text-base font-bold text-brand-950 dark:text-gold-100">
              {title}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}