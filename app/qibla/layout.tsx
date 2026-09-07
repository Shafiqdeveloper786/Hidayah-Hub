import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Qibla Direction Finder — Accurate Kaaba Direction | Hidayah Hub",
  description:
    "Find your Qibla direction to the Holy Kaaba with accuracy at Hidayah Hub — GPS-based Qibla compass, great-circle bearing calculation and beautiful interactive dial.",
  keywords: ["Qibla direction", "Qibla finder", "Kaaba direction", "Qibla compass", "Makkah direction"],
  alternates: { canonical: siteUrl("/qibla") },
  openGraph: {
    title: "Qibla Direction Finder | Hidayah Hub",
    description: "Accurate Kaaba Qibla direction by GPS with interactive compass.",
    url: siteUrl("/qibla"),
    siteName: "Hidayah Hub",
    type: "website",
  },
};

export default function QiblaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}