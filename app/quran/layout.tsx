import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Quran Online — Read Complete Quran in Arabic, Urdu & English | Hidayah Hub",
  description:
    "Read the complete Quran Online at Hidayah Hub — 114 Surahs in clear Arabic script with Urdu & English translations, real-time Tilawat with ayah highlighting, and full Quran PDF download.",
  keywords: ["Quran Online", "Quran reading", "Quran Arabic Urdu English", "Complete Quran PDF", "Tilawat"],
  alternates: { canonical: siteUrl("/quran") },
  openGraph: {
    title: "Quran Online — Arabic, Urdu & English | Hidayah Hub",
    description: "Read the complete Holy Quran online with translations, audio Tilawat and PDF download.",
    url: siteUrl("/quran"),
    siteName: "Hidayah Hub",
    type: "website",
  },
};

export default function QuranLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}