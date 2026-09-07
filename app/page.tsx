import type { Metadata } from "next";
import { AiSearchBar } from "@/components/home/AiSearchBar";
import { HeroBannerCarousel } from "@/components/home/HeroBannerCarousel";
import { ExploreGrid } from "@/components/home/ExploreGrid";
import { PrayerWidget } from "@/components/home/PrayerWidget";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hidayah Hub — Islamic Companion: Quran Online, Hadith Collections & Prayer Times",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: siteUrl("/"),
  },
  openGraph: {
    title: "Hidayah Hub — Islamic Companion | Quran Online, Hadith & Prayer Times",
    description: SITE_DESCRIPTION,
    url: siteUrl("/"),
    siteName: SITE_NAME,
    type: "website",
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: "Hidayah",
      description: SITE_DESCRIPTION,
      inLanguage: ["en", "ur", "ar"],
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/ai-search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      sameAs: [SITE_URL],
      areaServed: "Worldwide",
    },
  ],
};

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
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