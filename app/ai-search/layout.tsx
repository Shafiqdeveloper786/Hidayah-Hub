import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Islamic Search — Quran & Hadith Guidance | Hidayah Hub",
  description:
    "Ask Hidayah AI authentic Islamic questions and get accurate answers grounded in the Quran and Sahih Hadith — with exact Surah:Ayah and Hadith references in English & Urdu.",
  keywords: ["AI Islamic search", "Islamic AI", "Quran answers", "Hadith search", "Islamic guidance"],
  alternates: { canonical: siteUrl("/ai-search") },
  openGraph: {
    title: "AI Islamic Search — Quran & Hadith Guidance | Hidayah Hub",
    description: "Accurate, source-backed Islamic answers from the Quran and Sahih Hadith.",
    url: siteUrl("/ai-search"),
    siteName: "Hidayah Hub",
    type: "website",
  },
};

export default function AiSearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}