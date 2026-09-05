import type { Metadata } from "next";
import { HadithBrowser } from "@/components/hadith/HadithBrowser";
import { HADITH_BOOKS } from "@/data/hadithBooks";
import { loadBookDataset } from "@/lib/hadithData";
import { SITE_NAME, SITE_URL, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Complete Hadith Books — Sahih Bukhari, Muslim, Tirmidhi (Arabic, Urdu & English)",
  description:
    "Read the complete Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami at-Tirmidhi, Sunan an-Nasa'i and Sunan Ibn Majah — full Kutub al-Sittah with Arabic, Urdu and English text, free.",
  keywords: [
    "Sahih al-Bukhari complete",
    "Sahih Muslim Urdu English Arabic",
    "Kutub al-Sittah",
    "Sunan Abi Dawud",
    "Jami at-Tirmidhi",
    "read hadith online",
    "حدیث",
    "صحیح بخاری",
    "اردو حدیث",
  ],
  alternates: {
    canonical: siteUrl("/hadith"),
  },
  openGraph: {
    title: "Complete Hadith Books — Arabic, Urdu & English | Hidayah Hub",
    description:
      "Full, unabridged Hadith collections (Kutub al-Sittah) with Arabic text, Urdu translation and English translation — read free online.",
    url: siteUrl("/hadith"),
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    alternateLocale: ["ur_PK", "ar_SA"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete Hadith Books — Arabic, Urdu & English",
    description:
      "Read the complete Sahih al-Bukhari, Sahih Muslim and Sunan collections in Arabic, Urdu & English.",
  },
};

export default async function HadithPage() {
  // Pre-render the first book's English text so Google / users see real
  // content immediately (and it's cheaper than a client-only load).
  const book = HADITH_BOOKS[0]; // Sahih al-Bukhari
  let initialDataset = null;
  try {
    initialDataset = await loadBookDataset(book, {
      translations: "none",
      cacheMode: "force-cache",
    });
  } catch (err) {
    console.error("Failed to pre-render hadith data:", err);
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Complete Hadith Library (Kutub al-Sittah)",
      description:
        "Full, unabridged Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami at-Tirmidhi, Sunan an-Nasa'i and Sunan Ibn Majah with Arabic, Urdu and English text.",
      url: siteUrl("/hadith"),
      inLanguage: ["ar", "ur", "en"],
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Hadith", item: siteUrl("/hadith") },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <HadithBrowser
        initialBookId="bukhari"
        initialDataset={
          initialDataset && initialDataset.hadiths.length > 0 ? initialDataset : null
        }
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}