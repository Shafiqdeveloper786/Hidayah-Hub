/**
 * Metadata for the major Hadith collections browsable in the app.
 *
 * Content is streamed as complete, unabridged books from the free, open
 * fawazahmed0/hadith-api project (Arabic, Urdu and English translations).
 * Each book loads its ENTIRE contents (the full `.min.json` book file), so
 * readers get the complete authentic book — not just a few chosen narrations.
 *
 * NOTE: the ahmad & riyadussalihin editions are NOT present on the hadith-api
 * CDN, so they have been dropped in favour of books that actually exist there.
 */

export interface HadithBook {
  id: string;
  name: string;
  nameArabic: string;
  author: string;
  /** Edition slug used by the hadith-api CDN (English full-book file). */
  edition: string;
  /** Total number of hadith in the book (per the CDN edition numbering). */
  hadithCount: number;
  /** Whether a complete Urdu translation exists on the CDN. */
  hasUrdu: boolean;
  description: string;
  color: string;
}

export const HADITH_BOOKS: HadithBook[] = [
  {
    id: "bukhari",
    name: "Sahih al-Bukhari",
    nameArabic: "صحيح البخاري",
    author: "Imam Muhammad al-Bukhari (d. 256 AH)",
    edition: "eng-bukhari",
    hadithCount: 7563,
    hasUrdu: true,
    description:
      "The most authentic collection of hadith after the Qur'an; ~7,500 narrations arranged by theme and compiled over 16 years.",
    color: "#1e7d59",
  },
  {
    id: "muslim",
    name: "Sahih Muslim",
    nameArabic: "صحيح مسلم",
    author: "Imam Muslim ibn al-Hajjaj (d. 261 AH)",
    edition: "eng-muslim",
    hadithCount: 7563,
    hasUrdu: true,
    description:
      "The second most authentic collection; ~7,500 narrations sifted from 300,000, prized for its meticulous organisation.",
    color: "#0e7490",
  },
  {
    id: "tirmidhi",
    name: "Jami' at-Tirmidhi",
    nameArabic: "جامع الترمذي",
    author: "Imam Abu Isa at-Tirmidhi (d. 279 AH)",
    edition: "eng-tirmidhi",
    hadithCount: 3956,
    hasUrdu: true,
    description:
      "A comprehensive Jami' which records rulings and grades each narration; ~3,900 hadith across belief, practice and manners.",
    color: "#7c3aed",
  },
  {
    id: "abudawud",
    name: "Sunan Abi Dawud",
    nameArabic: "سنن أبي داود",
    author: "Imam Abu Dawud as-Sijistani (d. 275 AH)",
    edition: "eng-abudawud",
    hadithCount: 5274,
    hasUrdu: true,
    description:
      "A Sunan focused on legal rulings; ~5,200 narrations selected from 500,000, specifically covering jurisprudence (fiqh).",
    color: "#b45309",
  },
  {
    id: "nasai",
    name: "Sunan an-Nasa'i",
    nameArabic: "سنن النسائي",
    author: "Imam Ahmad an-Nasa'i (d. 303 AH)",
    edition: "eng-nasai",
    hadithCount: 5758,
    hasUrdu: true,
    description:
      "Also called 'Al-Mujtaba' — renowned for rigorous scrutiny of narrators and the completeness of its chains.",
    color: "#be123c",
  },
  {
    id: "ibnmajah",
    name: "Sunan Ibn Majah",
    nameArabic: "سنن ابن ماجه",
    author: "Imam Muhammad ibn Majah (d. 273 AH)",
    edition: "eng-ibnmajah",
    hadithCount: 4341,
    hasUrdu: true,
    description:
      "The sixth of the Kutub al-Sittah (six canonical books) — includes the celebrated book on Zuhd (asceticism).",
    color: "#ca8a04",
  },
  {
    id: "malik",
    name: "Muwatta Malik",
    nameArabic: "موطأ مالك",
    author: "Imam Malik ibn Anas (d. 179 AH)",
    edition: "eng-malik",
    hadithCount: 1857,
    hasUrdu: true,
    description:
      "The earliest surviving major hadith compilation and the practice (Amal) of the people of Madinah.",
    color: "#16a34a",
  },
  {
    id: "nawawi",
    name: "Forty Hadith of an-Nawawi",
    nameArabic: "الأربعون النووية",
    author: "Imam Yahya an-Nawawi (d. 676 AH)",
    edition: "eng-nawawi",
    hadithCount: 42,
    hasUrdu: false,
    description:
      "Forty-two comprehensive narrations that summarise the entire religion — 'the fundamentals of Islam'.",
    color: "#0284c7",
  },
];

export function getHadithBook(id: string): HadithBook | undefined {
  return HADITH_BOOKS.find((book) => book.id === id);
}

export const HADITH_CDN_BASE =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";

/** URL for the full-book file of a book edition (all hadiths in one file). */
export function hadithFullBookUrl(book: HadithBook) {
  return `${HADITH_CDN_BASE}/${book.edition}.min.json`;
}