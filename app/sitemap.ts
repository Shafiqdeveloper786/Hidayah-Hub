import type { MetadataRoute } from "next";
import { SURAHS } from "@/data/surahs";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Array<{ path: string; priority: number; changeFrequency: "weekly" | "daily" | "monthly" }> = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/quran", priority: 0.9, changeFrequency: "weekly" },
    { path: "/hadith", priority: 0.9, changeFrequency: "weekly" },
    { path: "/prayer-times", priority: 0.9, changeFrequency: "daily" },
    { path: "/duas", priority: 0.8, changeFrequency: "weekly" },
    { path: "/zikr", priority: 0.8, changeFrequency: "weekly" },
    { path: "/reflections", priority: 0.7, changeFrequency: "weekly" },
    { path: "/qibla", priority: 0.7, changeFrequency: "monthly" },
    { path: "/ai", priority: 0.8, changeFrequency: "monthly" },
    { path: "/ai-search", priority: 0.8, changeFrequency: "monthly" },
    { path: "/quiz", priority: 0.6, changeFrequency: "monthly" },
    { path: "/more", priority: 0.6, changeFrequency: "monthly" },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" },
    { path: "/donate", priority: 0.5, changeFrequency: "monthly" },
  ];

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: siteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // One sitemap entry for every Surah page (114 URLs) — great for indexing.
  const surahUrls: MetadataRoute.Sitemap = SURAHS.map((s) => ({
    url: siteUrl(`/quran/${s.id}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticUrls, ...surahUrls];
}