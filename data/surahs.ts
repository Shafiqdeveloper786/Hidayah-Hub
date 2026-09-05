/**
 * Complete metadata for all 114 Surahs of the Qur'an.
 * Embedded locally so the directory works instantly and offline.
 */

export interface Surah {
  /** 1-based Surah number */
  id: number;
  /** Arabic name */
  name: string;
  /** Latin transliteration */
  transliteration: string;
  /** Common English translation of the name */
  english: string;
  /** Number of ayahs */
  ayahs: number;
  /** Revelation place */
  revelation: "Meccan" | "Medinan";
}

export const SURAHS: Surah[] = [
  { id: 1, name: "الفاتحة", transliteration: "Al-Fatihah", english: "The Opening", ayahs: 7, revelation: "Meccan" },
  { id: 2, name: "البقرة", transliteration: "Al-Baqarah", english: "The Cow", ayahs: 286, revelation: "Medinan" },
  { id: 3, name: "آل عمران", transliteration: "Aal-Imran", english: "Family of Imran", ayahs: 200, revelation: "Medinan" },
  { id: 4, name: "النساء", transliteration: "An-Nisa", english: "The Women", ayahs: 176, revelation: "Medinan" },
  { id: 5, name: "المائدة", transliteration: "Al-Ma'idah", english: "The Table Spread", ayahs: 120, revelation: "Medinan" },
  { id: 6, name: "الأنعام", transliteration: "Al-An'am", english: "The Cattle", ayahs: 165, revelation: "Meccan" },
  { id: 7, name: "الأعراف", transliteration: "Al-A'raf", english: "The Heights", ayahs: 206, revelation: "Meccan" },
  { id: 8, name: "الأنفال", transliteration: "Al-Anfal", english: "The Spoils of War", ayahs: 75, revelation: "Medinan" },
  { id: 9, name: "التوبة", transliteration: "At-Tawbah", english: "The Repentance", ayahs: 129, revelation: "Medinan" },
  { id: 10, name: "يونس", transliteration: "Yunus", english: "Jonah", ayahs: 109, revelation: "Meccan" },
  { id: 11, name: "هود", transliteration: "Hud", english: "Hud", ayahs: 123, revelation: "Meccan" },
  { id: 12, name: "يوسف", transliteration: "Yusuf", english: "Joseph", ayahs: 111, revelation: "Meccan" },
  { id: 13, name: "الرعد", transliteration: "Ar-Ra'd", english: "The Thunder", ayahs: 43, revelation: "Medinan" },
  { id: 14, name: "إبراهيم", transliteration: "Ibrahim", english: "Abraham", ayahs: 52, revelation: "Meccan" },
  { id: 15, name: "الحجر", transliteration: "Al-Hijr", english: "The Rocky Tract", ayahs: 99, revelation: "Meccan" },
  { id: 16, name: "النحل", transliteration: "An-Nahl", english: "The Bee", ayahs: 128, revelation: "Meccan" },
  { id: 17, name: "الإسراء", transliteration: "Al-Isra", english: "The Night Journey", ayahs: 111, revelation: "Meccan" },
  { id: 18, name: "الكهف", transliteration: "Al-Kahf", english: "The Cave", ayahs: 110, revelation: "Meccan" },
  { id: 19, name: "مريم", transliteration: "Maryam", english: "Mary", ayahs: 98, revelation: "Meccan" },
  { id: 20, name: "طه", transliteration: "Taha", english: "Ta-Ha", ayahs: 135, revelation: "Meccan" },
  { id: 21, name: "الأنبياء", transliteration: "Al-Anbiya", english: "The Prophets", ayahs: 112, revelation: "Meccan" },
  { id: 22, name: "الحج", transliteration: "Al-Hajj", english: "The Pilgrimage", ayahs: 78, revelation: "Medinan" },
  { id: 23, name: "المؤمنون", transliteration: "Al-Mu'minun", english: "The Believers", ayahs: 118, revelation: "Meccan" },
  { id: 24, name: "النور", transliteration: "An-Nur", english: "The Light", ayahs: 64, revelation: "Medinan" },
  { id: 25, name: "الفرقان", transliteration: "Al-Furqan", english: "The Criterion", ayahs: 77, revelation: "Meccan" },
  { id: 26, name: "الشعراء", transliteration: "Ash-Shu'ara", english: "The Poets", ayahs: 227, revelation: "Meccan" },
  { id: 27, name: "النمل", transliteration: "An-Naml", english: "The Ant", ayahs: 93, revelation: "Meccan" },
  { id: 28, name: "القصص", transliteration: "Al-Qasas", english: "The Stories", ayahs: 88, revelation: "Meccan" },
  { id: 29, name: "العنكبوت", transliteration: "Al-Ankabut", english: "The Spider", ayahs: 69, revelation: "Meccan" },
  { id: 30, name: "الروم", transliteration: "Ar-Rum", english: "The Romans", ayahs: 60, revelation: "Meccan" },
  { id: 31, name: "لقمان", transliteration: "Luqman", english: "Luqman", ayahs: 34, revelation: "Meccan" },
  { id: 32, name: "السجدة", transliteration: "As-Sajdah", english: "The Prostration", ayahs: 30, revelation: "Meccan" },
  { id: 33, name: "الأحزاب", transliteration: "Al-Ahzab", english: "The Combined Forces", ayahs: 73, revelation: "Medinan" },
  { id: 34, name: "سبأ", transliteration: "Saba", english: "Sheba", ayahs: 54, revelation: "Meccan" },
  { id: 35, name: "فاطر", transliteration: "Fatir", english: "The Originator", ayahs: 45, revelation: "Meccan" },
  { id: 36, name: "يس", transliteration: "Ya-Sin", english: "Ya Sin", ayahs: 83, revelation: "Meccan" },
  { id: 37, name: "الصافات", transliteration: "As-Saffat", english: "Those Ranged in Ranks", ayahs: 182, revelation: "Meccan" },
  { id: 38, name: "ص", transliteration: "Sad", english: "The Letter Sad", ayahs: 88, revelation: "Meccan" },
  { id: 39, name: "الزمر", transliteration: "Az-Zumar", english: "The Groups", ayahs: 75, revelation: "Meccan" },
  { id: 40, name: "غافر", transliteration: "Ghafir", english: "The Forgiver", ayahs: 85, revelation: "Meccan" },
  { id: 41, name: "فصلت", transliteration: "Fussilat", english: "Explained in Detail", ayahs: 54, revelation: "Meccan" },
  { id: 42, name: "الشورى", transliteration: "Ash-Shura", english: "The Consultation", ayahs: 53, revelation: "Meccan" },
  { id: 43, name: "الزخرف", transliteration: "Az-Zukhruf", english: "The Ornaments of Gold", ayahs: 89, revelation: "Meccan" },
  { id: 44, name: "الدخان", transliteration: "Ad-Dukhan", english: "The Smoke", ayahs: 59, revelation: "Meccan" },
  { id: 45, name: "الجاثية", transliteration: "Al-Jathiyah", english: "The Crouching", ayahs: 37, revelation: "Meccan" },
  { id: 46, name: "الأحقاف", transliteration: "Al-Ahqaf", english: "The Wind-Curved Sandhills", ayahs: 35, revelation: "Meccan" },
  { id: 47, name: "محمد", transliteration: "Muhammad", english: "Muhammad", ayahs: 38, revelation: "Medinan" },
  { id: 48, name: "الفتح", transliteration: "Al-Fath", english: "The Victory", ayahs: 29, revelation: "Medinan" },
  { id: 49, name: "الحجرات", transliteration: "Al-Hujurat", english: "The Rooms", ayahs: 18, revelation: "Medinan" },
  { id: 50, name: "ق", transliteration: "Qaf", english: "The Letter Qaf", ayahs: 45, revelation: "Meccan" },
  { id: 51, name: "الذاريات", transliteration: "Adh-Dhariyat", english: "The Winnowing Winds", ayahs: 60, revelation: "Meccan" },
  { id: 52, name: "الطور", transliteration: "At-Tur", english: "The Mount", ayahs: 49, revelation: "Meccan" },
  { id: 53, name: "النجم", transliteration: "An-Najm", english: "The Star", ayahs: 62, revelation: "Meccan" },
  { id: 54, name: "القمر", transliteration: "Al-Qamar", english: "The Moon", ayahs: 55, revelation: "Meccan" },
  { id: 55, name: "الرحمن", transliteration: "Ar-Rahman", english: "The Most Merciful", ayahs: 78, revelation: "Medinan" },
  { id: 56, name: "الواقعة", transliteration: "Al-Waqi'ah", english: "The Inevitable", ayahs: 96, revelation: "Meccan" },
  { id: 57, name: "الحديد", transliteration: "Al-Hadid", english: "The Iron", ayahs: 29, revelation: "Medinan" },
  { id: 58, name: "المجادلة", transliteration: "Al-Mujadila", english: "The Pleading Woman", ayahs: 22, revelation: "Medinan" },
  { id: 59, name: "الحشر", transliteration: "Al-Hashr", english: "The Exile", ayahs: 24, revelation: "Medinan" },
  { id: 60, name: "الممتحنة", transliteration: "Al-Mumtahanah", english: "She Who Is Examined", ayahs: 13, revelation: "Medinan" },
  { id: 61, name: "الصف", transliteration: "As-Saf", english: "The Ranks", ayahs: 14, revelation: "Medinan" },
  { id: 62, name: "الجمعة", transliteration: "Al-Jumu'ah", english: "Friday", ayahs: 11, revelation: "Medinan" },
  { id: 63, name: "المنافقون", transliteration: "Al-Munafiqun", english: "The Hypocrites", ayahs: 11, revelation: "Medinan" },
  { id: 64, name: "التغابن", transliteration: "At-Taghabun", english: "The Mutual Disillusion", ayahs: 18, revelation: "Medinan" },
  { id: 65, name: "الطلاق", transliteration: "At-Talaq", english: "The Divorce", ayahs: 12, revelation: "Medinan" },
  { id: 66, name: "التحريم", transliteration: "At-Tahrim", english: "The Prohibition", ayahs: 12, revelation: "Medinan" },
  { id: 67, name: "الملك", transliteration: "Al-Mulk", english: "The Sovereignty", ayahs: 30, revelation: "Meccan" },
  { id: 68, name: "القلم", transliteration: "Al-Qalam", english: "The Pen", ayahs: 52, revelation: "Meccan" },
  { id: 69, name: "الحاقة", transliteration: "Al-Haqqah", english: "The Reality", ayahs: 52, revelation: "Meccan" },
  { id: 70, name: "المعارج", transliteration: "Al-Ma'arij", english: "The Ascending Stairways", ayahs: 44, revelation: "Meccan" },
  { id: 71, name: "نوح", transliteration: "Nuh", english: "Noah", ayahs: 28, revelation: "Meccan" },
  { id: 72, name: "الجن", transliteration: "Al-Jinn", english: "The Jinn", ayahs: 28, revelation: "Meccan" },
  { id: 73, name: "المزمل", transliteration: "Al-Muzzammil", english: "The Enshrouded One", ayahs: 20, revelation: "Meccan" },
  { id: 74, name: "المدثر", transliteration: "Al-Muddaththir", english: "The Cloaked One", ayahs: 56, revelation: "Meccan" },
  { id: 75, name: "القيامة", transliteration: "Al-Qiyamah", english: "The Resurrection", ayahs: 40, revelation: "Meccan" },
  { id: 76, name: "الإنسان", transliteration: "Al-Insan", english: "The Man", ayahs: 31, revelation: "Medinan" },
  { id: 77, name: "المرسلات", transliteration: "Al-Mursalat", english: "The Emissaries", ayahs: 50, revelation: "Meccan" },
  { id: 78, name: "النبأ", transliteration: "An-Naba", english: "The News", ayahs: 40, revelation: "Meccan" },
  { id: 79, name: "النازعات", transliteration: "An-Nazi'at", english: "Those Who Drag Forth", ayahs: 46, revelation: "Meccan" },
  { id: 80, name: "عبس", transliteration: "Abasa", english: "He Frowned", ayahs: 42, revelation: "Meccan" },
  { id: 81, name: "التكوير", transliteration: "At-Takwir", english: "The Overthrowing", ayahs: 29, revelation: "Meccan" },
  { id: 82, name: "الانفطار", transliteration: "Al-Infitar", english: "The Cleaving", ayahs: 19, revelation: "Meccan" },
  { id: 83, name: "المطففين", transliteration: "Al-Mutaffifin", english: "The Defrauding", ayahs: 36, revelation: "Meccan" },
  { id: 84, name: "الانشقاق", transliteration: "Al-Inshiqaq", english: "The Sundering", ayahs: 25, revelation: "Meccan" },
  { id: 85, name: "البروج", transliteration: "Al-Buruj", english: "The Constellations", ayahs: 22, revelation: "Meccan" },
  { id: 86, name: "الطارق", transliteration: "At-Tariq", english: "The Nightcomer", ayahs: 17, revelation: "Meccan" },
  { id: 87, name: "الأعلى", transliteration: "Al-A'la", english: "The Most High", ayahs: 19, revelation: "Meccan" },
  { id: 88, name: "الغاشية", transliteration: "Al-Ghashiyah", english: "The Overwhelming", ayahs: 26, revelation: "Meccan" },
  { id: 89, name: "الفجر", transliteration: "Al-Fajr", english: "The Dawn", ayahs: 30, revelation: "Meccan" },
  { id: 90, name: "البلد", transliteration: "Al-Balad", english: "The City", ayahs: 20, revelation: "Meccan" },
  { id: 91, name: "الشمس", transliteration: "Ash-Shams", english: "The Sun", ayahs: 15, revelation: "Meccan" },
  { id: 92, name: "الليل", transliteration: "Al-Layl", english: "The Night", ayahs: 21, revelation: "Meccan" },
  { id: 93, name: "الضحى", transliteration: "Ad-Duha", english: "The Morning Hours", ayahs: 11, revelation: "Meccan" },
  { id: 94, name: "الشرح", transliteration: "Ash-Sharh", english: "The Relief", ayahs: 8, revelation: "Meccan" },
  { id: 95, name: "التين", transliteration: "At-Tin", english: "The Fig", ayahs: 8, revelation: "Meccan" },
  { id: 96, name: "العلق", transliteration: "Al-Alaq", english: "The Clot", ayahs: 19, revelation: "Meccan" },
  { id: 97, name: "القدر", transliteration: "Al-Qadr", english: "The Night of Decree", ayahs: 5, revelation: "Meccan" },
  { id: 98, name: "البينة", transliteration: "Al-Bayyinah", english: "The Clear Proof", ayahs: 8, revelation: "Medinan" },
  { id: 99, name: "الزلزلة", transliteration: "Az-Zalzalah", english: "The Earthquake", ayahs: 8, revelation: "Medinan" },
  { id: 100, name: "العاديات", transliteration: "Al-Adiyat", english: "The Courser", ayahs: 11, revelation: "Meccan" },
  { id: 101, name: "القارعة", transliteration: "Al-Qari'ah", english: "The Calamity", ayahs: 11, revelation: "Meccan" },
  { id: 102, name: "التكاثر", transliteration: "At-Takathur", english: "The Rivalry in World Increase", ayahs: 8, revelation: "Meccan" },
  { id: 103, name: "العصر", transliteration: "Al-Asr", english: "The Declining Day", ayahs: 3, revelation: "Meccan" },
  { id: 104, name: "الهمزة", transliteration: "Al-Humazah", english: "The Traducer", ayahs: 9, revelation: "Meccan" },
  { id: 105, name: "الفيل", transliteration: "Al-Fil", english: "The Elephant", ayahs: 5, revelation: "Meccan" },
  { id: 106, name: "قريش", transliteration: "Quraysh", english: "Quraysh", ayahs: 4, revelation: "Meccan" },
  { id: 107, name: "الماعون", transliteration: "Al-Ma'un", english: "The Small Kindnesses", ayahs: 7, revelation: "Meccan" },
  { id: 108, name: "الكوثر", transliteration: "Al-Kawthar", english: "The Abundance", ayahs: 3, revelation: "Meccan" },
  { id: 109, name: "الكافرون", transliteration: "Al-Kafirun", english: "The Disbelievers", ayahs: 6, revelation: "Meccan" },
  { id: 110, name: "النصر", transliteration: "An-Nasr", english: "The Divine Support", ayahs: 3, revelation: "Medinan" },
  { id: 111, name: "المسد", transliteration: "Al-Masad", english: "The Palm Fiber", ayahs: 5, revelation: "Meccan" },
  { id: 112, name: "الإخلاص", transliteration: "Al-Ikhlas", english: "The Sincerity", ayahs: 4, revelation: "Meccan" },
  { id: 113, name: "الفلق", transliteration: "Al-Falaq", english: "The Daybreak", ayahs: 5, revelation: "Meccan" },
  { id: 114, name: "الناس", transliteration: "An-Nas", english: "Mankind", ayahs: 6, revelation: "Meccan" },
];

export function getSurah(id: number | string): Surah | undefined {
  const number = typeof id === "string" ? parseInt(id, 10) : id;
  return SURAHS.find((s) => s.id === number);
}

export const TOTAL_AYAHS = SURAHS.reduce((sum, s) => sum + s.ayahs, 0);