import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Prayer Times — Accurate Namaz Times by Location & Auto-Adhan | Hidayah Hub",
  description:
    "Get accurate Prayer Times (Namaz times) for your location at Hidayah Hub — Fajr, Dhuhr, Asr, Maghrib & Isha with live countdown and authentic Makkah Adhan that plays automatically at prayer time.",
  keywords: ["Prayer Times", "Namaz times", "Salah times", "Adhan", "Fajr Dhuhr Asr Maghrib Isha", "Prayer time by location"],
  alternates: { canonical: siteUrl("/prayer-times") },
  openGraph: {
    title: "Prayer Times by Location — Auto-Adhan | Hidayah Hub",
    description: "Accurate Islamic prayer times with live countdown and automatic Makkah Adhan.",
    url: siteUrl("/prayer-times"),
    siteName: "Hidayah Hub",
    type: "website",
  },
};

export default function PrayerTimesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}