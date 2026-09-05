/**
 * Central SEO constants + helpers for Hidayah Hub.
 * Used by metadata, sitemap, robots and JSON-LD structured data.
 */

export const SITE_NAME = "Hidayah Hub";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hidayah-hub-jet.vercel.app";

export const SITE_DESCRIPTION =
  "Hidayah Hub is a serene Islamic digital companion — complete Quran PDF download, full Hadith collections (Sahih al-Bukhari, Sahih Muslim, Sunan in Arabic, Urdu & English), accurate prayer times, daily zikr, duas, Qibla direction and more.";

export const SITE_KEYWORDS = [
  "Hidayah Hub",
  "Quran",
  "Qur'an PDF download",
  "Complete Quran PDF",
  "Sahih al-Bukhari",
  "Sahih Muslim",
  "Hadith Urdu English Arabic",
  "Kutub al-Sittah",
  "Prayer times",
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
];

/** Join the base URL with a path. */
export const siteUrl = (path = ""): string =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;