/**
 * "Ayah of the Day" — a rotating curation of beautiful Qur'anic verses
 * (Arabic + English translation + Urdu translation + audio reciter MP3 + Tafseer).
 */

export interface Verse {
  arabic: string;
  translation: string;
  urduTranslation: string;
  reference: string;
  theme: string;
  audioUrl: string;
  tafseerEnglish: string;
  tafseerUrdu: string;
}

export const VERSES: Verse[] = [
  {
    arabic: "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوْا وَالَّذِينَ هُمْ مُحْسِنُونَ",
    translation: "Indeed, Allah is with those who fear Him and those who are doers of good.",
    urduTranslation: "بیشک اللہ ان لوگوں کے ساتھ ہے جو تقویٰ اختیار کرتے ہیں اور جو احسان کرنے والے ہیں۔",
    reference: "An-Nahl 16:128",
    theme: "Taqwa & Ihsan",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2029.mp3",
    tafseerEnglish: "Allah Almighty affirms His divine support, guardianship, and mercy for those who possess Taqwa (reverence of Allah) and Ihsan (doing good deeds with perfection and sincerity). Allah guards them in adversity and grants them victory in this life and high status in the hereafter.",
    tafseerUrdu: "اس آیتِ مبارکہ میں اللہ تعالیٰ کا ارشار ہے کہ اس کی خاص نصرت، معیت اور رحمت ان لوگوں کے ساتھ ہے جو تقویٰ اور پرہیزگاری اختیار کرتے ہیں اور نیکی کے کاموں میں احسان یعنی بہترین رویہ اپناتے ہیں۔ اللہ تعالیٰ متقین اور محسنین کو ہر تنگی سے نجات عطا فرماتا ہے۔",
  },
  {
    arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
    translation: "And your Lord says: Call upon Me; I will respond to you.",
    urduTranslation: "اور تمہارے رب نے فرمایا: مجھ سے دعا کرو، میں تمہاری دعا قبول کروں گا۔",
    reference: "Ghafir 40:60",
    theme: "Supplication",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4203.mp3",
    tafseerEnglish: "This verse contains a direct command and a sacred promise from Allah SWT to His servants. Supplication (Du'a) is the essence of worship. Allah invites believers to ask from Him directly without intermediaries, guaranteeing that no sincere prayer is ignored.",
    tafseerUrdu: "اس آیتِ کریمہ میں اللہ رب العزت نے اپنے بندوں کو براہِ راست دعا مانگنے کا حکم دیا ہے اور قبولیت کی پکی ضمانت دی ہے۔ رسول اللہ ﷺ نے فرمایا کہ دعا ہی عبادت کا مغز ہے۔ سچے دل سے کی گئی کوئی دعا ضائع نہیں جاتی۔",
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    urduTranslation: "پس تم مجھے یاد رکھو، میں تمہیں یاد رکھوں گا، اور میرا شکر ادا کرو اور میری ناشکری نہ کرو۔",
    reference: "Al-Baqarah 2:152",
    theme: "Remembrance",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/159.mp3",
    tafseerEnglish: "Allah commands believers to maintain continuous Dhikr (remembrance) and Shukr (gratitude). In return, Allah remembers the servant in the highest gathering with forgiveness, mercy, and elevation of rank.",
    tafseerUrdu: "اللہ تعالیٰ فرماتا ہے کہ جب بندہ اپنے رب کو یاد کرتا ہے، تسبیح و تلاوت کرتا ہے تو اللہ تعالی بھی اپنے بندے کو رحمت اور مغفرت کے ساتھ یاد رکھتا ہے۔ نعمتوں پر شکر گزاری سے اللہ تعالیٰ نعمتوں میں مزید برکت عطا فرماتا ہے۔",
  },
  {
    arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُمْ بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation: "Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.",
    urduTranslation: "وہ لوگ جو ایمان لائے اور ان کے دل اللہ کے ذکر سے اطمینان پاتے ہیں۔ سن لو! اللہ کے ذکر ہی سے دلوں کو اطمینان حاصل ہوتا ہے۔",
    reference: "Ar-Ra'd 13:28",
    theme: "Peace of Heart",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1735.mp3",
    tafseerEnglish: "True inner peace, tranquility, and contentment of the human soul cannot be found in worldly wealth or status, but exclusively in connecting with Allah through His remembrance, prayer, and recitation of the Qur'an.",
    tafseerUrdu: "انسان کے دل کا سچا سکون، اطمینان اور روح کی بالیدگی دنیاوی مال و اسباب میں نہیں بلکہ صرف اور صرف اللہ کے ذکر، نماز اور تلاوتِ قرآن میں مضمر ہے۔",
  },
  {
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation: "And whoever relies upon Allah — then He is sufficient for him.",
    urduTranslation: "اور جو شخص اللہ پر توکل کرتا ہے تو وہ اس کے لیے کافی ہے۔",
    reference: "At-Talaq 65:3",
    theme: "Tawakkul",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5234.mp3",
    tafseerEnglish: "Tawakkul is trusting Allah's wisdom and plan after taking legitimate means. Allah promises that whoever places their total trust in Him will find Allah sufficient for all their physical and spiritual needs.",
    tafseerUrdu: "توکل کا مطلب ہے اسباب اختیار کرنے کے بعد تمام معاملے کی باگ ڈور اللہ کے سپرد کر دینا۔ جو شخص اپنے تمام معاملات میں اللہ پر پختہ بھروسہ رکھتا ہے، اللہ اس کی تمام ضرورتوں کی کفالت فرماتا ہے۔",
  },
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship comes ease. Indeed, with hardship comes ease.",
    urduTranslation: "پس یقیناً تنگی کے ساتھ آسانی ہے۔ بے شک تنگی کے ساتھ آسانی ہے۔",
    reference: "Ash-Sharh 94:5-6",
    theme: "Hope",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6125.mp3",
    tafseerEnglish: "Allah repeats this assurance twice to comfort believers. No hardship is permanent; relief is intimately linked with difficulty and will inevitably prevail.",
    tafseerUrdu: "اللہ تعالیٰ نے اس بات کی دو مرتبہ تکرار فرما کر مومنین کے لیے تسلی کا پیغام دیا ہے کہ کوئی تنگی اور آزمائش دائمی نہیں، ہر دشواری کے ساتھ کشائش اور آسانی لازماً آتی ہے۔",
  },
  {
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translation: "And when My servants ask you concerning Me — indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
    urduTranslation: "اور جب میرے بندے آپ سے میرے بارے میں پوچھیں تو (انہیں بتا دیں کہ) میں قریب ہوں، میں پکارنے والے کی پکار کا جواب دیتا ہوں جب وہ مجھے پکارتا ہے۔",
    reference: "Al-Baqarah 2:186",
    theme: "Du'a",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/193.mp3",
    tafseerEnglish: "Allah highlights His absolute closeness to His creation. He answers prayers without delay or barrier, reinforcing the deep personal relationship between the believer and their Creator.",
    tafseerUrdu: "اس آیت میں اللہ تعالیٰ نے اپنی قربت کا بیان فرمایا ہے کہ وہ اپنے بندے کی ہر دعا کو سنتا ہے اور قبول فرماتا ہے، اس لیے بندے کو چاہیے کہ وہ ہمیشہ اسی کو پکارے اور اسی پر ایمان رکھے۔",
  },
  {
    arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    translation: "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
    urduTranslation: "آپ فرما دیجیے: اے میرے بندو جنہوں نے اپنی جانوں پر زیادتی کی ہے! اللہ کی رحمت سے مایوس نہ ہو، بے شک اللہ تمام گناہوں کو بخش دیتا ہے۔",
    reference: "Az-Zumar 39:53",
    theme: "Mercy",
    audioUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/4111.mp3",
    tafseerEnglish: "This is one of the most hopeful verses in the Qur'an. Allah invites all sinners to turn back in sincere repentance, assuring them that His divine mercy encompasses all transgressions.",
    tafseerUrdu: "قرآن مجید کی امید افزا آیات میں سے ایک ہے جہاں اللہ تعالیٰ تمام گناہ گاروں کو سچی توبہ کی دعوت دیتا ہے اور فرماتا ہے کہ اللہ کی بے پایاں رحمت ہر گناہ کو معاف کرنے والی ہے۔",
  },
];

/** Pick the verse for "today" deterministically (by day-of-year). */
export function getVerseOfTheDay(date: Date = new Date()): Verse {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return VERSES[dayOfYear % VERSES.length];
}