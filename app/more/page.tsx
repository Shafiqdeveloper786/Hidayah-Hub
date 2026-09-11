"use client";

import {
  Award,
  BookOpen,
  Compass,
  Heart,
  HelpCircle,
  Layers,
  Moon,
  ScrollText,
  Shield,
  Sparkles,
  Sun,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

// 5 Pillars of Islam Data with Authentic References & Details
const FIVE_PILLARS = [
  {
    number: 1,
    arabic: "الشَّهَادَة",
    title: "1. Shahada (Declaration of Faith)",
    urduTitle: "شہادت (توحید و رسالت کا اقرار)",
    icon: Shield,
    hadithRef: "Sahih al-Bukhari 8 & Sahih Muslim 16",
    englishDesc: "The testimony that there is no god worthy of worship except Allah, and Muhammad ﷺ is His messenger. It is the fundamental core of Islamic monotheism (Tawheed), unlocking entrance into Islam.",
    urduDesc: "گواہی دینا کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے رسول ہیں۔ یہ اسلام کا سب سے بنیادی اور پہلا رکن ہے جو انسان کے ایمان کا سنگِ بنیاد ہے۔",
    quranQuote: "شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ",
    quranTranslation: "Allah witnesses that there is no deity except Him, and so do the angels and those of knowledge. (Surah Aal-Imran 3:18)",
    hadithText: "«بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ...»",
    hadithTranslation: "Islam is built upon five pillars: Testifying that there is no deity worthy of worship except Allah and that Muhammad is the Messenger of Allah...",
    keyBenefits: [
      "Purifies the soul from Shirk (associating partners with Allah)",
      "Unites all thoughts and desires under Divine Guidance",
      "Establishes immediate personal connection with Allah",
    ],
    keyBenefitsUr: [
      "شرک کی تمام الائشوں سے روح کو پاکیزہ بناتا ہے",
      "انسان کی زندگی کو ایک سچے رب کی بندگی میں ڈھالتا ہے",
      "خالق اور مخلوق کے درمیان براہِ راست تعلق قائم کرتا ہے",
    ],
  },
  {
    number: 2,
    arabic: "الصَّلَاة",
    title: "2. Salah (Daily Obligatory Prayers)",
    urduTitle: "نماز (پنجگانہ باجماعت عبادت)",
    icon: Sun,
    hadithRef: "Sahih al-Bukhari 528 & Sahih Muslim 667",
    englishDesc: "Performing the 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) at their prescribed times. Prayer is the main pillar of Deen, cleansing sins like a flowing river.",
    urduDesc: "دن اور رات میں پانچ وقت کی نمازیں اپنے مقررہ وقت پر ادا کرنا۔ نماز دین کا ستون ہے جو گناہوں کو ایسے دھوتی ہے جیسے نہر کا بہتا ہوا پانی۔",
    quranQuote: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    quranTranslation: "Indeed, prayer has been decreed upon the believers a decree of specified times. (Surah An-Nisa 4:103)",
    hadithText: "«أَرَأَيْتُمْ لَوْ أَنَّ نَهَرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ فِيهِ كُلَّ يَوْمٍ خَمْسًا، مَا تَقُولُ ذَلِكَ يُبْقِي مِنْ دَرَنِهِ؟»",
    hadithTranslation: "Consider if there were a river at the door of one of you in which he bathed five times a day, would any dirt remain on him? So are the five daily prayers.",
    keyBenefits: [
      "Acts as a daily spiritual mirror and barrier against sin (Fahsha)",
      "Provides structured peace and mindfulness 5 times daily",
      "Direct conversation (Munajat) with your Creator in Sujood",
    ],
    keyBenefitsUr: [
      "بے حیائی اور برائی سے انسان کی حفاظت کا سب سے بڑا ذریعہ",
      "دن میں پانچ بار ذہن اور روح کو سکون و اطمینان عطا کرتی ہے",
      "سجدے کی حالت میں ربِ ذوالجلال سے قربت کا بہترین موقع",
    ],
  },
  {
    number: 3,
    arabic: "الزَّكَاة",
    title: "3. Zakat (Purifying Alms / Obligatory Charity)",
    urduTitle: "زکوٰۃ (مالی پاکیزگی و واجب صدقہ)",
    icon: Heart,
    hadithRef: "Sahih al-Bukhari 1395 & Sunan an-Nasa'i 2435",
    englishDesc: "Giving 2.5% of one's accumulated savings and wealth annually to eligible recipients. Zakat purifies wealth, eliminates greed, and creates social welfare in the Ummah.",
    urduDesc: "صاحبِ نصاب مسلمان کا اپنے سالانہ مال میں سے 2.5 فیصد محتاجوں کو دینا۔ زکوٰۃ مال کو پاک کرتی، حرص و طمع مٹاتی اور معاشرے میں ہمدردی پیدا کرتی ہے۔",
    quranQuote: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
    quranTranslation: "And establish prayer and give Zakat and bow with those who bow in worship. (Surah Al-Baqarah 2:43)",
    hadithText: "«حَصِّنُوا أَمْوَالَكُمْ بِالزَّكَاةِ، وَدَاوُوا مَرْضَاكُمْ بِالصَّدَقَةِ»",
    hadithTranslation: "Fortify your wealth with Zakat and treat your sick ones with charity.",
    keyBenefits: [
      "Circulates wealth away from hoarding toward the needy",
      "Blesses and increases remaining wealth (Barakah)",
      "Breaks the grip of materialism and selfish desires",
    ],
    keyBenefitsUr: [
      "مال کو صرف چند ہاتھوں میں جمع ہونے سے روکتا ہے",
      "باقیماندہ مال میں برکت اور پاکیزگی پیدا کرتا ہے",
      "انسان کے اندر سے خود غرضی اور مادیت پرستی کا خاتمہ کرتا ہے",
    ],
  },
  {
    number: 4,
    arabic: "الصَّوْم",
    title: "4. Sawm (Fasting in the Month of Ramadan)",
    urduTitle: "صوم (رمضان المبارک کے فرض روزے)",
    icon: Moon,
    hadithRef: "Sahih al-Bukhari 1901 & Sahih Muslim 1151",
    englishDesc: "Abstaining from food, drink, and intimate desires from dawn until sunset during Ramadan. Fasting builds Taqwa (god-consciousness), self-control, and empathy for the hungry.",
    urduDesc: "رمضان المبارک میں صبح صادق سے غروبِ آفتاب تک کھانے، پینے اور خواہشات سے رکنا۔ روزہ انسان کے اندر تقویٰ، ضبطِ نفس اور غریبوں کا احساس بیدار کرتا ہے۔",
    quranQuote: "كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
    quranTranslation: "Decreed upon you is fasting as it was decreed upon those before you that you may become righteous. (Surah Al-Baqarah 2:183)",
    hadithText: "«مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ»",
    hadithTranslation: "Whoever fasts during Ramadan out of faith and seeking reward, his past sins will be forgiven.",
    keyBenefits: [
      "Develops deep Taqwa and emotional resilience",
      "Cleanses physical body and spiritual heart",
      "Special gate in Jannah named Al-Rayyan reserved for fasting believers",
    ],
    keyBenefitsUr: [
      "روحانی ارتقاء اور تقویٰ کی اعلیٰ منزلوں کے حصول کا ذریعہ",
      "جسمانی صحت اور نفسانی خواہشات پر مکمل کنٹرول",
      "جنت کا مخصوص دروازہ 'الریان' روزے داروں کے لیے مخصوص",
    ],
  },
  {
    number: 5,
    arabic: "الْحَجّ",
    title: "5. Hajj (Sacred Pilgrimage to Makkah)",
    urduTitle: "حج (بیت اللہ شریف کا مبارک سفر)",
    icon: Compass,
    hadithRef: "Sahih al-Bukhari 1521 & Sahih Muslim 1350",
    englishDesc: "The pilgrimage to Makkah once in a lifetime for those physically & financially able. Hajj unites millions of Muslims regardless of race or wealth in equal submission to Allah.",
    urduDesc: "زندگی میں ایک بار صاحبِ استطاعت بالغ مسلمان کے لیے بیت اللہ شریف کا سفر کرنا۔ حج ہر نسل، رنگ اور طبقے کے مسلمانوں کو بندگی میں ایک لڑی میں پروتا ہے۔",
    quranQuote: "وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا",
    quranTranslation: "And due to Allah from the people is a pilgrimage to the House — for whoever is able to find thereto a way. (Surah Aal-Imran 3:97)",
    hadithText: "«مَنْ حَجَّ هَذَا الْبَيْتَ فَلَمْ يَرْفُثْ وَلَمْ يَفْسُقْ رَجَعَ كَيَوْمِ وَلَدَتْهُ أُمُّهُ»",
    hadithTranslation: "Whoever performs Hajj to this House and does not commit obscenity or sin returns as sinless as the day his mother bore him.",
    keyBenefits: [
      "Wipes away past sins completely like a newborn baby",
      "Demonstrates global equality of all human beings in Ihram",
      "Revives the legacy of Prophet Ibrahim (AS) and Prophet Muhammad ﷺ",
    ],
    keyBenefitsUr: [
      "تمام پچھلے گناہوں کا مکمل خاتمہ — جیسے نو مولود بچہ",
      "احرام کے لباس میں تمام انسانوں کی برابری کا عالمگیر منظر",
      "حضرت ابراہیم علیہ السلام اور رسول اللہ ﷺ کی سنت کی تجدید",
    ],
  },
];

// Auxiliary Interactive Tools
const AUXILIARY_TOOLS = [
  {
    title: "Qibla Finder 🧭",
    subtitle: "Find the precise direction of Kaaba from anywhere in the world.",
    href: "/qibla",
    icon: Compass,
    badge: "Interactive Compass",
  },
  {
    title: "Islamic Daily Quiz 🧠",
    subtitle: "Test and grow your knowledge of Quran, Hadith & Seerah.",
    href: "/quiz",
    icon: HelpCircle,
    badge: "Gamified Quiz",
  },
  {
    title: "Daily Du'as & Azkar 🤲",
    subtitle: "Authentic supplications from the Sunnah for every morning & evening.",
    href: "/duas",
    icon: BookOpen,
    badge: "Masnoon Duas",
  },
  {
    title: "Hadith Collections 📚",
    subtitle: "Read Sahih Bukhari, Sahih Muslim & Sunan with translations.",
    href: "/hadith",
    icon: ScrollText,
    badge: "Authentic Hadith",
  },
];

export default function MorePage() {
  const [selectedPillar, setSelectedPillar] = useState(FIVE_PILLARS[0]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-10">
      {/* 1. Hero Banner Panel */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/70 shadow-[0_0_50px_rgba(191,160,89,0.35)] min-h-[320px] flex items-center justify-center text-center text-white py-12 px-4 sm:px-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-banner.jpg"
            alt="Arkan al-Islam Banner"
            fill sizes="100vw" quality={75}
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/90 via-black/50 to-[#070D18]/75" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-95" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/80 bg-[#121A26]/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#BFA059] backdrop-blur-md shadow-md">
            <Sparkles className="size-4 text-[#BFA059]" />
            <span>Arkan-e-Islam · The 5 Pillars of Faith</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            أَرْكَانُ الإِسْلَام
          </h1>

          <p className="text-sm sm:text-lg text-[#EAD090] font-semibold drop-shadow-sm max-w-2xl mx-auto">
            Deepen your understanding of the 5 fundamental pillars of Islam with Quranic evidence, Hadiths &amp; dual-language explanations.
          </p>
        </div>
      </section>

      {/* 2. Detailed Section: The Five Pillars of Islam (Arkan-e-Islam) */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#1A202C] dark:text-gold-100">
            The Five Pillars of Islam (أركان الإسلام)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            The foundational obligations that construct the structure of a Muslim's faith and daily life.
          </p>
        </div>

        {/* 5 Pillars Quick Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {FIVE_PILLARS.map((pillar) => (
            <button
              key={pillar.number}
              type="button"
              onClick={() => setSelectedPillar(pillar)}
              className={cn(
                "rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-sm",
                selectedPillar.number === pillar.number
                  ? "bg-gradient-to-r from-[#BFA059] to-[#D4AF37] text-[#0D1117] ring-2 ring-[#BFA059] shadow-md scale-105"
                  : "border border-[#BFA059]/40 bg-white text-[#1A202C] hover:bg-[#BFA059]/10 dark:bg-night-900 dark:text-gold-200"
              )}
            >
              #{pillar.number} {pillar.title.split("(")[0]}
            </button>
          ))}
        </div>

        {/* Active Selected Pillar Detail Display Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/40 bg-[#FAF7F0] p-6 shadow-xl sm:p-10 dark:border-night-800 dark:bg-night-900 space-y-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#1A202C] font-mono text-lg font-extrabold text-[#BFA059] shadow-md">
                  #{selectedPillar.number}
                </span>
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A202C] dark:text-gold-100">
                    {selectedPillar.title}
                  </h3>
                  <p className="font-arabic text-base font-bold text-[#BFA059]">
                    {selectedPillar.urduTitle}
                  </p>
                </div>
              </div>

              {/* Quranic Quote Box */}
              <div className="rounded-2xl border-2 border-[#BFA059]/30 bg-white p-5 text-right shadow-md dark:bg-night-950 space-y-2">
                <span className="text-[10px] font-black text-[#BFA059] uppercase tracking-wider block text-left">
                  QURANIC EVIDENCE
                </span>
                <p dir="rtl" lang="ar" className="font-arabic text-2xl sm:text-3xl font-bold text-[#1A202C] dark:text-gold-50 leading-loose">
                  {selectedPillar.quranQuote}
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 italic text-left">
                  &ldquo;{selectedPillar.quranTranslation}&rdquo;
                </p>
              </div>

              {/* Hadith Evidence Box */}
              <div className="rounded-2xl border border-[#BFA059]/25 bg-[#F4EFE6] p-5 shadow-inner dark:bg-night-950/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#BFA059] uppercase tracking-wider">
                    PROPHETIC HADITH EVIDENCE
                  </span>
                  <span className="text-[10px] font-bold text-[#BFA059]">
                    {selectedPillar.hadithRef}
                  </span>
                </div>
                <p dir="rtl" lang="ar" className="font-arabic text-xl font-bold text-[#1A202C] dark:text-[#EAD090] text-right leading-relaxed">
                  {selectedPillar.hadithText}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                  &ldquo;{selectedPillar.hadithTranslation}&rdquo;
                </p>
              </div>

              {/* Dual Explanations & Key Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#BFA059]/20 pt-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#BFA059]">
                    English Explanation &amp; Benefits
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                    {selectedPillar.englishDesc}
                  </p>
                  <ul className="space-y-1.5 pt-2">
                    {selectedPillar.keyBenefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span className="text-[#BFA059]">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 text-right">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#BFA059]">
                    اردو تشریح اور فضائل
                  </h4>
                  <p dir="rtl" className="font-arabic text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
                    {selectedPillar.urduDesc}
                  </p>
                  <ul dir="rtl" className="space-y-1.5 pt-2">
                    {selectedPillar.keyBenefitsUr.map((b, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs sm:text-sm font-arabic font-bold text-slate-700 dark:text-slate-300">
                        <span className="text-[#BFA059]">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Side Large Calligraphy Display */}
            <div className="hidden items-center justify-center lg:flex">
              <div className="flex size-64 flex-col items-center justify-center rounded-3xl border-2 border-[#BFA059]/40 bg-gradient-to-b from-[#1A202C] to-[#0D1117] p-6 text-center text-white shadow-2xl space-y-2">
                <p dir="rtl" lang="ar" className="font-arabic text-5xl font-extrabold text-[#BFA059] drop-shadow-md">
                  {selectedPillar.arabic}
                </p>
                <span className="text-xs font-black uppercase tracking-widest text-[#EAD090]">
                  Pillar #{selectedPillar.number}
                </span>
                <span className="text-[10px] text-slate-300 font-bold max-w-[180px]">
                  {selectedPillar.hadithRef}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* All 5 Pillars Grid Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FIVE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = selectedPillar.number === pillar.number;
            return (
              <div
                key={pillar.number}
                onClick={() => setSelectedPillar(pillar)}
                className={cn(
                  "cursor-pointer rounded-3xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                  isSelected
                    ? "border-[#BFA059] bg-[#FAF7F0] shadow-lg dark:bg-night-900 ring-2 ring-[#BFA059]/50"
                    : "border-slate-200 bg-white dark:border-night-800 dark:bg-night-950"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#1A202C] text-[#BFA059] shadow-md">
                    <Icon className="size-6" />
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-bold text-[#1A202C] dark:text-gold-100">
                      {pillar.title}
                    </h3>
                    <p className="font-arabic text-xs font-bold text-[#BFA059]">
                      {pillar.urduTitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Categorized Grid Layout of Additional Tools */}

      {/* 3. Categorized Grid Layout of Additional Tools */}
      <section className="space-y-6 pt-6">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-[#1A202C] dark:text-gold-100">
            Auxiliary Tools &amp; Features
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Explore extra interactive Islamic resources designed for daily spiritual practice.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUXILIARY_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#BFA059] hover:shadow-md dark:border-night-800 dark:bg-night-950"
              >
                <div className="space-y-3">
                  <span className="inline-block rounded-full bg-[#BFA059]/20 px-3 py-1 text-[10px] font-bold text-[#BFA059]">
                    {tool.badge}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-[#1A202C] text-[#BFA059] transition-transform group-hover:scale-110">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#1A202C] dark:text-gold-100">
                      {tool.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {tool.subtitle}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#BFA059]">
                  <span>Launch Tool</span>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
