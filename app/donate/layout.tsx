import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Donate — Support Hidayah Hub (EasyPaisa, JazzCash, Crypto) | Hidayah Hub",
  description:
    "Support Hidayah Hub's free Islamic tools for the global Ummah — donate securely via EasyPaisa, JazzCash or Crypto (MetaMask). 100% ad-free, Sadaqah Jariyah.",
  keywords: ["Donate", "Islamic charity", "Sadaqah", "Support Islamic app", "EasyPaisa JazzCash"],
  alternates: { canonical: siteUrl("/donate") },
  openGraph: {
    title: "Donate & Support Hidayah Hub",
    description: "Keep Hidayah Hub free — donate via EasyPaisa, JazzCash or Crypto.",
    url: siteUrl("/donate"),
    siteName: "Hidayah Hub",
    type: "website",
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}