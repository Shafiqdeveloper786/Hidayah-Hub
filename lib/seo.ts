/**
 * Central SEO constants + helpers for Hidayah Hub.
 * Used by metadata, sitemap, robots and JSON-LD structured data.
 */

export const SITE_NAME = "Hidayah Hub";

/** Production domain — update here to switch the entire site's canonical/SEO URLs. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hidayah-hub-official.vercel.app";

export const SITE_DESCRIPTION =
  "Hidayah Hub is your free Islamic Companion — read the Quran Online in Arabic, Urdu & English with PDF download, explore complete Hadith Collections (Sahih al-Bukhari, Muslim, Sunan), get accurate Prayer Times, daily Zikr, Duas & Qibla direction.";

export const SITE_KEYWORDS = [
  "Hidayah Hub",
  "Islamic Companion",
  "Quran Online",
  "Hadith Collections",
  "Prayer Times",
  "Complete Quran PDF",
  "Sahih al-Bukhari",
  "Sahih Muslim",
  "Kutub al-Sittah",
  "Hadith Urdu English Arabic",
  "Namaz times",
  "Zikr",
  "Tasbeeh",
  "Duas",
  "Qibla direction",
  "Islamic app",
  "Sunnah",
  "Urdu hadith",
  "حدیث",
  "قرآن",
  "نوائے وقت",
];

/** Join the base URL with a path. */
export const siteUrl = (path = ""): string =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;