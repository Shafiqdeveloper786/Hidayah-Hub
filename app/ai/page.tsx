import type { Metadata } from "next";
import AiSearchPage from "@/app/ai-search/page";

export const metadata: Metadata = {
  title: "Ask Hidayah AI · Authentic Quran & Hadith Search",
  description: "Get authentic, context-aware answers from the Holy Qur'an and Sunnah with references.",
};

export default function AiPage() {
  return <AiSearchPage />;
}