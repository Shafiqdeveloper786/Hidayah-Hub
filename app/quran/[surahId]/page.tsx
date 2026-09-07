import type { Metadata } from "next";
import { SurahReader } from "@/components/quran/SurahReader";
import { getSurah, SURAHS } from "@/data/surahs";
import { siteUrl } from "@/lib/seo";

interface Props {
  params: Promise<{ surahId: string }>;
}

export function generateStaticParams(): { surahId: string }[] {
  return SURAHS.map((s) => ({ surahId: String(s.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { surahId } = await params;
  const surah = getSurah(surahId);
  if (!surah) return { title: "Surah not found" };
  return {
    title: `Surah ${surah.transliteration} (${surah.english}) — Read Online`,
    description: `Read Surah ${surah.transliteration} — ${surah.ayahs} ayahs, ${surah.revelation}. Arabic text with Urdu & English translation at Hidayah Hub.`,
    alternates: { canonical: siteUrl(`/quran/${surah.id}`) },
    openGraph: {
      title: `Surah ${surah.transliteration} (${surah.english}) — Read Online`,
      description: `Read Surah ${surah.transliteration} — ${surah.ayahs} ayahs with Arabic, Urdu & English translation.`,
      url: siteUrl(`/quran/${surah.id}`),
      siteName: "Hidayah Hub",
      type: "article",
    },
  };
}

export default async function SurahPage({ params }: Props) {
  const { surahId } = await params;
  const id = parseInt(surahId, 10);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <SurahReader surahId={Number.isNaN(id) ? 1 : id} />
    </div>
  );
}