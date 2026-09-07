import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Five Pillars of Islam & Islamic Tools | Hidayah Hub",
  description:
    "Learn the Five Pillars of Islam (Shahada, Salah, Zakat, Sawm, Hajj) with authentic references and explore all the Islamic tools at Hidayah Hub.",
  keywords: ["Five Pillars of Islam", "Shahada", "Salah", "Zakat", "Sawm", "Hajj", "Islamic tools"],
  alternates: { canonical: siteUrl("/more") },
  openGraph: {
    title: "Five Pillars of Islam & Islamic Tools | Hidayah Hub",
    description: "Authentic details of the Five Pillars with Quran & Hadith references.",
    url: siteUrl("/more"),
    siteName: "Hidayah Hub",
    type: "website",
  },
};

export default function MoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}