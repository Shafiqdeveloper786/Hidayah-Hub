import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Daily Islamic Reflections — Quranic Wisdom | Hidayah Hub",
  description:
    "Daily Islamic reflections and Quranic wisdom at Hidayah Hub — thoughtful reminders, ayahs and powerful lessons for the soul in English & Urdu.",
  keywords: ["Islamic reflections", "Quranic wisdom", "Daily Islamic reminders", "Spiritual reflections"],
  alternates: { canonical: siteUrl("/reflections") },
  openGraph: {
    title: "Daily Islamic Reflections — Quranic Wisdom | Hidayah Hub",
    description: "Powerful daily reminders and Quranic wisdom for the heart.",
    url: siteUrl("/reflections"),
    siteName: "Hidayah Hub",
    type: "website",
  },
};

export default function ReflectionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}