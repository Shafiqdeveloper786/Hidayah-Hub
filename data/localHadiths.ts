/**
 * Local authentic Hadith dataset containing narrations across 4 major books:
 * 1. Sahih Al-Bukhari (صحيح البخاري)
 * 2. Sahih Muslim (صحيح مسلم)
 * 3. 40 Hadith Nawawi (الأربعون النووية)
 * 4. Riyad As-Salihin (رياض الصالحين)
 */

export interface LocalHadith {
  id: string;
  bookId: "bukhari" | "muslim" | "nawawi" | "riyad";
  bookName: string;
  bookArabic: string;
  chapter: string;
  chapterUrdu: string;
  hadithNumber: number;
  grade: "Sahih" | "Hasan";
  arabicText: string;
  urduTranslation: string;
  englishTranslation: string;
  reference: string;
}

export const LOCAL_HADITHS: LocalHadith[] = [
  // ── 1. SAHIH AL-BUKHARI ──────────────────────────────────────────────────
  {
    id: "bukhari-1",
    bookId: "bukhari",
    bookName: "Sahih Al-Bukhari",
    bookArabic: "صحيح البخاري",
    chapter: "Book of Revelation · باب بدء الوحي",
    chapterUrdu: "وحی کا بیان",
    hadithNumber: 1,
    grade: "Sahih",
    arabicText: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.",
    urduTranslation: "اعمال کا دارومدار نیتوں پر ہے اور ہر انسان کو وہی ملے گا جس کی اس نے نیت کی۔ پس جس کی ہجرت دنیا حاصل کرنے کے لیے ہو یا کسی عورت سے نکاح کرنے کے لیے، تو اس کی ہجرت اسی کے لیے ہے جس کی طرف اس نے ہجرت کی۔",
    englishTranslation: "Actions are judged by intentions, and every person will get what they intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration is for what he emigrated for.",
    reference: "Sahih Al-Bukhari · Hadith #1 (Volume 1, Book 1)",
  },
  {
    id: "bukhari-2",
    bookId: "bukhari",
    bookName: "Sahih Al-Bukhari",
    bookArabic: "صحيح البخاري",
    chapter: "Book of Belief (Iman) · باب الإيمان",
    chapterUrdu: "ایمان کا بیان",
    hadithNumber: 13,
    grade: "Sahih",
    arabicText: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.",
    urduTranslation: "تم میں سے کوئی شخص اس وقت تک کامل مؤمن نہیں ہو سکتا جب تک کہ وہ اپنے بھائی کے لیے بھی وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔",
    englishTranslation: "None of you truly believes until he loves for his brother what he loves for himself.",
    reference: "Sahih Al-Bukhari · Hadith #13 (Book 2, Hadith 6)",
  },
  {
    id: "bukhari-3",
    bookId: "bukhari",
    bookName: "Sahih Al-Bukhari",
    bookArabic: "صحيح البخاري",
    chapter: "Book of Character & Manners · باب الأدب",
    chapterUrdu: "حسنِ اخلاق کا بیان",
    hadithNumber: 6018,
    grade: "Sahih",
    arabicText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ.",
    urduTranslation: "مسلمان وہ ہے جس کی زبان اور ہاتھ کے شر سے دوسرے مسلمان محفوظ رہیں۔",
    englishTranslation: "A true Muslim is one from whose tongue and hand other Muslims are safe.",
    reference: "Sahih Al-Bukhari · Hadith #10 & #6018",
  },
  {
    id: "bukhari-4",
    bookId: "bukhari",
    bookName: "Sahih Al-Bukhari",
    bookArabic: "صحيح البخاري",
    chapter: "Book of Knowledge · باب العلم",
    chapterUrdu: "علم کی فضیلت",
    hadithNumber: 71,
    grade: "Sahih",
    arabicText: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ.",
    urduTranslation: "اللہ تعالیٰ جس شخص کے ساتھ بھلائی کا ارادہ فرماتا ہے، اسے دین کی گہری سمجھ (فقہ) عطا کر دیتا ہے۔",
    englishTranslation: "Whomever Allah wishes good for, He grants him deep understanding of the religion.",
    reference: "Sahih Al-Bukhari · Hadith #71 (Book 3, Hadith 13)",
  },

  // ── 2. SAHIH MUSLIM ─────────────────────────────────────────────────────
  {
    id: "muslim-1",
    bookId: "muslim",
    bookName: "Sahih Muslim",
    bookArabic: "صحيح مسلم",
    chapter: "Book of Purification (Taharah) · باب الطهارة",
    chapterUrdu: "طہارت اور پاکیزگی",
    hadithNumber: 223,
    grade: "Sahih",
    arabicText: "الطَّهُورُ شَطْرُ الإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلأُ الْمِيزَانَ.",
    urduTranslation: "پاکیزگی اور صفائی آدھا ایمان ہے، اور الحمد للہ کہنا ترازو کو (نیکیوں سے) بھر دیتا ہے۔",
    englishTranslation: "Purity is half of faith, and saying 'Alhamdulillah' (Praise be to Allah) fills the scale of good deeds.",
    reference: "Sahih Muslim · Hadith #223 (Book 2, Hadith 1)",
  },
  {
    id: "muslim-2",
    bookId: "muslim",
    bookName: "Sahih Muslim",
    bookArabic: "صحيح مسلم",
    chapter: "Book of Remembrance & Dua · باب الذكر والدعاء",
    chapterUrdu: "ذکر و دعا کی فضیلت",
    hadithNumber: 2699,
    grade: "Sahih",
    arabicText: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ.",
    urduTranslation: "جو شخص علمِ دین حاصل کرنے کے لیے کسی راستے پر چلتا ہے، اللہ تعالیٰ اس کے لیے جنت کا راستہ آسان فرما دیتا ہے۔",
    englishTranslation: "Whoever travels a path in search of knowledge, Allah makes easy for him a path to Paradise.",
    reference: "Sahih Muslim · Hadith #2699 (Book 48, Hadith 38)",
  },
  {
    id: "muslim-3",
    bookId: "muslim",
    bookName: "Sahih Muslim",
    bookArabic: "صحيح مسلم",
    chapter: "Book of Virtue & Manners · باب البر والصلة",
    chapterUrdu: "تقویٰ اور حلم",
    hadithNumber: 2564,
    grade: "Sahih",
    arabicText: "إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ.",
    urduTranslation: "بے شک اللہ تعالیٰ تمہاری صورتوں اور تمہارے مالوں کو نہیں دیکھتا، بلکہ وہ تمہارے دلوں اور تمہارے اعمال کو دیکھتا ہے۔",
    englishTranslation: "Verily Allah does not look at your appearances or your wealth, but He looks at your hearts and your actions.",
    reference: "Sahih Muslim · Hadith #2564 (Book 45, Hadith 43)",
  },

  // ── 3. FORTY HADITH NAWAWI ──────────────────────────────────────────────
  {
    id: "nawawi-1",
    bookId: "nawawi",
    bookName: "Forty Hadith Nawawi",
    bookArabic: "الأربعون النووية",
    chapter: "Fundamentals of Faith · أصول الدين",
    chapterUrdu: "دین کے بنیادی اصول",
    hadithNumber: 2,
    grade: "Sahih",
    arabicText: "أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ.",
    urduTranslation: "احسان یہ ہے کہ تم اللہ کی عبادت اس طرح کرو گویا تم اسے دیکھ رہے ہو، اور اگر تم اسے نہیں دیکھ رہے تو بے شک وہ تمہیں دیکھ رہا ہے۔",
    englishTranslation: "Excellence (Ihsan) is to worship Allah as if you see Him, for if you do not see Him, He surely sees you.",
    reference: "Forty Hadith Nawawi · Hadith #2 (Hadith Jibreel)",
  },
  {
    id: "nawawi-2",
    bookId: "nawawi",
    bookName: "Forty Hadith Nawawi",
    bookArabic: "الأربعون النووية",
    chapter: "Good Manners & Speech · حفظ اللسان",
    chapterUrdu: "خاموشی اور بھلی بات",
    hadithNumber: 15,
    grade: "Sahih",
    arabicText: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ.",
    urduTranslation: "جو شخص اللہ اور آخرت کے دن پر ایمان رکھتا ہو، اسے چاہیے کہ وہ بھلی بات کہے یا پھر خاموش رہے۔",
    englishTranslation: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
    reference: "Forty Hadith Nawawi · Hadith #15",
  },
  {
    id: "nawawi-3",
    bookId: "nawawi",
    bookName: "Forty Hadith Nawawi",
    bookArabic: "الأربعون النووية",
    chapter: "Self-Restraint & Anger · ترك الغضب",
    chapterUrdu: "غصے پر ضبط",
    hadithNumber: 16,
    grade: "Sahih",
    arabicText: "لاَ تَغْضَبْ، فَرَدَّدَ مِرَارًا، قَالَ: لاَ تَغْضَبْ.",
    urduTranslation: "ایک شخص نے نبی ﷺ سے عرض کیا: مجھے کوئی نصیحت فرمائیے۔ آپ ﷺ نے فرمایا: غصہ نہ کرو۔ اس نے بار بار پوچھا، آپ ﷺ نے ہر بار یہی فرمایا: غصہ نہ کرو۔",
    englishTranslation: "A man said to the Prophet ﷺ: 'Advise me.' He said: 'Do not become angry.' The man repeated his request several times, and the Prophet ﷺ said: 'Do not become angry.'",
    reference: "Forty Hadith Nawawi · Hadith #16",
  },

  // ── 4. RIYAD AS-SALIHIN ─────────────────────────────────────────────────
  {
    id: "riyad-1",
    bookId: "riyad",
    bookName: "Riyad As-Salihin",
    bookArabic: "رياض الصالحين",
    chapter: "Book of Sincerity & Intention · باب الإخلاص",
    chapterUrdu: "اخلاص اور نیک نیت",
    hadithNumber: 1,
    grade: "Sahih",
    arabicText: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلاَّ عِزًّا، وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلاَّ رَفَعَهُ اللَّهُ.",
    urduTranslation: "صدقہ دینے سے مال میں کوئی کمی نہیں آتی، اور معاف کرنے سے اللہ بندے کی عزت میں اضافہ ہی فرماتا ہے، اور جو شخص اللہ کی خاطر عاجزی اختیار کرتا ہے، اللہ اسے بلندی عطا فرماتا ہے۔",
    englishTranslation: "Charity does not decrease wealth, and Allah increases the honor of a servant who forgives, and no one humbles himself for the sake of Allah except that Allah raises his status.",
    reference: "Riyad As-Salihin · Hadith #556 / Book 1",
  },
  {
    id: "riyad-2",
    bookId: "riyad",
    bookName: "Riyad As-Salihin",
    bookArabic: "رياض الصالحين",
    chapter: "Book of Patience (Sabr) · باب الصبر",
    chapterUrdu: "صبر اور برداشت",
    hadithNumber: 27,
    grade: "Sahih",
    arabicText: "عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لأَحَدٍ إِلاَّ لِلْمُؤْمِنِ: إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ.",
    urduTranslation: "مؤمن کا معاملہ بھی عجیب ہے! اس کے ہر معاملے میں خیر ہے۔ اور یہ فضیلت مؤمن کے علاوہ کسی اور کو حاصل نہیں۔ اگر اسے خوشی ملے تو وہ شکر کرتا ہے، جو اس کے لیے خیر ہے؛ اور اگر اسے کوئی تکلیف پہنچے تو وہ صبر کرتا ہے، جو اس کے لیے خیر ہے۔",
    englishTranslation: "How wonderful is the affair of the believer, for all his affairs are good for him, and this applies to no one except a believer: if prosperity comes to him he is thankful and that is good for him, and if adversity comes to him he endures with patience and that is good for him.",
    reference: "Riyad As-Salihin · Hadith #27",
  },
];
