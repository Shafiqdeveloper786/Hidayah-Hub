import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Duas & Azkar — Masnoon Supplications with Urdu & English | Hidayah Hub",
  description:
    "Authentic Duas and Azkar (daily supplications) from Quran & Sunnah at Hidayah Hub — categorized for every moment with Arabic, Urdu & English translations.",
  keywords: ["Duas", "Azkar", "Masnoon duas", "Islamic supplications", "Daily duas"],
  alternates: { canonical: siteUrl("/duas") },
  openGraph: {
    title: "Duas & Azkar — Masnoon Supplications | Hidayah Hub",
    description: "Daily supplications from Quran & Sunnah with Arabic, Urdu and English.",
    url: siteUrl("/duas"),
    siteName: "Hidayah Hub",
    type: "website",
  },
};

export default function DuasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}