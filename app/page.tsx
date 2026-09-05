import { AiSearchBar } from "@/components/home/AiSearchBar";
import { HeroBannerCarousel } from "@/components/home/HeroBannerCarousel";
import { ExploreGrid } from "@/components/home/ExploreGrid";
import { PrayerWidget } from "@/components/home/PrayerWidget";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Hero — Rotating Banners (Ayat / Hadith / Dua / Wisdom) */}
      <section>
        <HeroBannerCarousel />
      </section>

      {/* 2. Split Grid — Prayer Times & Ask Hidayah AI */}
      <section className="grid gap-6 lg:grid-cols-2">
        <PrayerWidget />
        <AiSearchBar />
      </section>

      {/* 3. Explore Our Hub Section */}
      <section className="pt-4 pb-12">
        <h2 className="mb-6 text-center font-serif text-xl font-bold uppercase tracking-wider text-[#1A202C] dark:text-gold-100">
          EXPLORE OUR HUB
        </h2>
        <ExploreGrid />
      </section>
    </div>
  );
}