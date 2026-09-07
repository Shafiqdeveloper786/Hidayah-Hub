import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Islamic Quiz — Test Your Knowledge | Hidayah Hub",
  description:
    "Challenge yourself with fun Islamic quizzes at Hidayah Hub — Quran, Hadith, Seerah and Islamic knowledge questions in English & Urdu with instant explanations.",
  keywords: ["Islamic quiz", "Quran quiz", "Hadith quiz", "Islamic knowledge", "Quran test"],
  alternates: { canonical: siteUrl("/quiz") },
  openGraph: {
    title: "Islamic Quiz — Test Your Knowledge | Hidayah Hub",
    description: "Islamic knowledge quizzes with instant explanations in English & Urdu.",
    url: siteUrl("/quiz"),
    siteName: "Hidayah Hub",
    type: "website",
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}