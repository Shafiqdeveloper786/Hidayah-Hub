import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Zikr & Tasbeeh Hub — Daily Dhikr Counter with Arabic | Hidayah Hub",
  description:
    "Zikr & Tasbeeh Hub at Hidayah Hub — beautiful daily dhikr, tasbeeh counter and Qur'anic remembrances with Arabic text, transliteration and rewards.",
  keywords: ["Zikr", "Tasbeeh", "Dhikr", "Tasbeeh counter", "Allah ke zikr", "Daily zikr"],
  alternates: { canonical: siteUrl("/zikr") },
  openGraph: {
    title: "Zikr & Tasbeeh Hub | Hidayah Hub",
    description: "Daily dhikr and tasbeeh counter with Arabic text and meanings.",
    url: siteUrl("/zikr"),
    siteName: "Hidayah Hub",
    type: "website",
  },
};

export default function ZikrLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}