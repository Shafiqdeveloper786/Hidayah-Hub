"use client";

import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  HelpCircle,
  Moon,
  Quote,
  RefreshCw,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  VolumeX,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: number;
  category: "Quran" | "Hadith & Sunnah" | "Seerah" | "Pillars & Fiqh";
  questionEn: string;
  questionUr: string;
  options: string[];
  correctIndex: number;
  explanationEn: string;
  explanationUr: string;
  reference: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: "Quran",
    questionEn: "Which Surah of the Holy Quran is known as the 'Heart of the Quran'?",
    questionUr: "قرآن مجید کی کس سورت کو 'قرآن کا دل' کہا جاتا ہے؟",
    options: ["Surah Al-Baqarah", "Surah Yaseen", "Surah Al-Kahf", "Surah Ar-Rahman"],
    correctIndex: 1,
    explanationEn: "The Prophet Muhammad ﷺ said: 'Everything has a heart, and the heart of the Quran is Yaseen.'",
    explanationUr: "رسول اللہ ﷺ نے فرمایا: 'ہر چیز کا ایک دل ہوتا ہے اور قرآن کا دل سورۃ یٰسین ہے۔'",
    reference: "Sunan at-Tirmidhi 2887",
  },
  {
    id: 2,
    category: "Pillars & Fiqh",
    questionEn: "How many total obligatory (Farz) daily prayers are decreed in Islam?",
    questionUr: "اسلام میں روزانہ کل کتنی فرض نمازیں مقرر ہیں؟",
    options: ["3 Prayers", "4 Prayers", "5 Prayers", "7 Prayers"],
    correctIndex: 2,
    explanationEn: "Islam decrees 5 obligatory daily prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.",
    explanationUr: "اسلام میں روزانہ ۵ وقت کی فرض نمازیں مقرر ہیں: فجر، ظہر، عصر، مغرب اور عشاء۔",
    reference: "Sahih al-Bukhari 8 & Sahih Muslim 16",
  },
  {
    id: 3,
    category: "Seerah",
    questionEn: "In which year of Hijrah did the Conquest of Makkah (Fath Makkah) take place?",
    questionUr: "فتح مکہ کس ہجری میں رونما ہوا؟",
    options: ["6th Hijri", "8th Hijri", "10th Hijri", "2nd Hijri"],
    correctIndex: 1,
    explanationEn: "The Conquest of Makkah took place in Ramadan of the 8th year after Hijrah.",
    explanationUr: "فتح مکہ رمضان المبارک ۸ ہجری میں بغیر جنگ کے تاریخی فتح پر منتج ہوا۔",
    reference: "Sahih al-Bukhari 4275",
  },
  {
    id: 4,
    category: "Hadith & Sunnah",
    questionEn: "Which Sahabi narrated the highest number of Hadiths from the Prophet ﷺ?",
    questionUr: "سیدنا نبی کریم ﷺ سے سب سے زیادہ احادیث کس صحابی نے روایت کی ہیں؟",
    options: ["Abu Bakr As-Siddiq (RA)", "Abu Hurairah (RA)", "Umar ibn Al-Khattab (RA)", "Ali ibn Abi Talib (RA)"],
    correctIndex: 1,
    explanationEn: "Hazrat Abu Hurairah (RA) narrated 5,374 Hadiths due to his close companionship and devotion.",
    explanationUr: "حضرت ابو ہریرہ رضي اللہ عنہ نے ۵,۳۷۴ احادیث مبارکہ روایت کیں جو تمام صحابہ میں سب سے زیادہ تعداد ہے۔",
    reference: "Kutub al-Hadith Studies",
  },
  {
    id: 5,
    category: "Quran",
    questionEn: "Which Surah in the Quran does NOT begin with 'Bismillah-ir-Rahman-ir-Rahim'?",
    questionUr: "قرآن مجید کی کون سی واحد سورت 'بسم اللہ الرحمٰن الرحیم' سے شروع نہیں ہوتی؟",
    options: ["Surah At-Tawbah", "Surah An-Naml", "Surah Al-Anfal", "Surah Yasin"],
    correctIndex: 0,
    explanationEn: "Surah At-Tawbah (Surah 9) does not start with Bismillah as it emphasizes stern divine disavowal of treaty-breakers.",
    explanationUr: "سورۃ التوبہ (سورۃ نمبر ۹) واحد سورت ہے جس کے آغاز میں بسم اللہ درج نہیں ہے۔",
    reference: "Qur'an · Surah At-Tawbah (Surah 9)",
  },
  {
    id: 6,
    category: "Quran",
    questionEn: "What is the longest Surah in the Holy Quran?",
    questionUr: "قرآن مجید کی سب سے طویل سورت کون سی ہے؟",
    options: ["Surah Aal-Imran", "Surah Al-Baqarah", "Surah An-Nisa", "Surah Al-Ma'idah"],
    correctIndex: 1,
    explanationEn: "Surah Al-Baqarah is the 2nd Surah of the Quran and contains 286 verses.",
    explanationUr: "سورۃ البقرہ قرآن کی سب سے بڑی سورت ہے جس میں ۲۸۶ آیات مبارکہ ہیں۔",
    reference: "Qur'an · Surah 2",
  },
  {
    id: 7,
    category: "Pillars & Fiqh",
    questionEn: "What percentage of eligible annual wealth is payable as Zakat?",
    questionUr: "صاحبِ نصاب مال پر سالانہ کتنے فیصد زکوٰۃ فرض ہے؟",
    options: ["1.0%", "2.5%", "5.0%", "10.0%"],
    correctIndex: 1,
    explanationEn: "Zakat is fixed at 2.5% (1/40th) of qualifying surplus wealth held for one full lunar year.",
    explanationUr: "زکوٰۃ کا شرعی نصاب ہر سالانہ بچت اور مالِ تجارت پر ۲.۵ فیصد مقرر ہے۔",
    reference: "Fiqh Consensus & Sunan Abi Dawud",
  },
  {
    id: 8,
    category: "Seerah",
    questionEn: "What was the name of the cave where the first divine revelation (Wahy) descended upon Prophet Muhammad ﷺ?",
    questionUr: "وہ کون سا غار تھا جہاں رسول اللہ ﷺ پر پہلی وحی نازل ہوئی؟",
    options: ["Cave Saur (غارِ ثور)", "Cave Hira (غارِ حراء)", "Cave Quba", "Cave Uhud"],
    correctIndex: 1,
    explanationEn: "The Angel Jibreel (AS) descended with the first verses of Surah Al-Alaq in Cave Hira on Jabal al-Nour.",
    explanationUr: "جبل النور پر واقع غارِ حرا میں حضرت جبرائیل علیہ السلام پہلی وحی لائے۔",
    reference: "Sahih al-Bukhari 3",
  },
  {
    id: 9,
    category: "Hadith & Sunnah",
    questionEn: "What is the primary book of Hadith compiled by Imam al-Bukhari called?",
    questionUr: "امام بخاری رحمہ اللہ کی مشہور ترین کتابِ حدیث کا نام کیا ہے؟",
    options: ["Sahih al-Bukhari", "Muwatta Imam Malik", "Sunan An-Nasa'i", "Riyad as-Salihin"],
    correctIndex: 0,
    explanationEn: "Al-Jami' al-Sahih (commonly Sahih al-Bukhari) is recognized as the most authentic Hadith anthology.",
    explanationUr: "الجامع الصحيح (جامع صحیح البخاری) کو امت میں سب سے زیادہ صحیح ترین کتاب کا مقام حاصل ہے۔",
    reference: "Hadith Methodology Literature",
  },
  {
    id: 10,
    category: "Quran",
    questionEn: "Which verse in the Quran is considered the greatest verse ('Ayat al-Kursi')?",
    questionUr: "قرآن مجید کی سب سے اعظم آیت (آیۃ الکرسی) کس سورت میں ہے؟",
    options: ["Surah Al-Baqarah 2:255", "Surah Aal-Imran 3:18", "Surah Al-Ikhlas 112:1", "Surah Al-Hashr 59:23"],
    correctIndex: 0,
    explanationEn: "Ayat al-Kursi (Surah Al-Baqarah 2:255) is the greatest verse of the Quran describing Allah's Supreme Sovereignty.",
    explanationUr: "آیۃ الکرسی (سورۃ البقرہ ۲:۲۵۵) کو قرآن کی عظیم ترین آیت مبارکہ کا رتبہ حاصل ہے۔",
    reference: "Sahih Muslim 810",
  },
  {
    id: 11,
    category: "Seerah",
    questionEn: "What was the name of Prophet Muhammad's ﷺ mother?",
    questionUr: "رسول اللہ ﷺ کی والدہ ماجدہ کا اسمِ گرامی کیا تھا؟",
    options: ["Hazrat Khadijah (RA)", "Hazrat Aminah (RA)", "Hazrat Haleemah (RA)", "Hazrat Fatimah (RA)"],
    correctIndex: 1,
    explanationEn: "Prophet Muhammad's ﷺ mother was Hazrat Aminah bint Wahb (RA).",
    explanationUr: "آپ ﷺ کی والدہ ماجدہ کا نام حضرت آمنہ بنت وہب رضی اللہ عنہا تھا۔",
    reference: "Ar-Raheeq Al-Makhtum",
  },
  {
    id: 12,
    category: "Pillars & Fiqh",
    questionEn: "In which Islamic month is the obligatory Fasting (Sawm) observed?",
    questionUr: "فرض روزے کس اسلامی مہینے میں رکھے جاتے ہیں؟",
    options: ["Rajab", "Sha'ban", "Ramadan", "Dhul-Hijjah"],
    correctIndex: 2,
    explanationEn: "Fasting during the month of Ramadan is the 4th pillar of Islam.",
    explanationUr: "رمضان المبارک کے مقدس مہینے میں روزے رکھنا اسلام کے ۵ ارکان میں سے چوتھا رکن ہے۔",
    reference: "Qur'an 2:183",
  },
  {
    id: 13,
    category: "Seerah",
    questionEn: "In which year of Hijrah did the decisive Battle of Badr take place?",
    questionUr: "غزوہِ بدر کس ہجری میں پیش آیا؟",
    options: ["1st Hijri", "2nd Hijri", "3rd Hijri", "5th Hijri"],
    correctIndex: 1,
    explanationEn: "The Battle of Badr (Ghazwa-e-Badr) took place on 17 Ramadan in the 2nd year of Hijrah.",
    explanationUr: "غزوہِ بدر ۱۷ رمضان المبارک ۲ ہجری کو حق و باطل کے در میان تاریخی معرکہ ثابت ہوا۔",
    reference: "Sahih al-Bukhari 3950",
  },
  {
    id: 14,
    category: "Quran",
    questionEn: "How many total Parts (Juz / Para) is the Holy Quran divided into?",
    questionUr: "قرآن مجید کل کتنے پاروں (اجزاء) میں تقسیم ہے؟",
    options: ["20 Juz", "25 Juz", "30 Juz", "40 Juz"],
    correctIndex: 2,
    explanationEn: "The Quran consists of 30 Juz (Parts) facilitating daily recitation and completion.",
    explanationUr: "قرآن پاک کی تلاوت کو آسان بنانے کے لیے اس کو ۳۰ پاروں میں تقسیم کیا گیا ہے۔",
    reference: "Qur'an Recitation Tradition",
  },
  {
    id: 15,
    category: "Hadith & Sunnah",
    questionEn: "What is a Hadith Qudsi?",
    questionUr: "حدیثِ قدسی سے کیا مراد ہے؟",
    options: [
      "A Hadith narrated only in Makkah",
      "A Hadith where Prophet ﷺ quotes Allah's words in his own phrasing",
      "A Hadith about Islamic jurisprudence",
      "A weak narration",
    ],
    correctIndex: 1,
    explanationEn: "Hadith Qudsi is a sacred Hadith where the meaning is directly from Allah, expressed in the words of Prophet Muhammad ﷺ.",
    explanationUr: "حدیثِ قدسی وہ مبارک حدیث ہے جس میں معنی و کلام اللہ کا اور الفاظ رسول اللہ ﷺ کے ہوتے ہیں۔",
    reference: "Hadith Terminology (Mustalah al-Hadith)",
  },
  {
    id: 16,
    category: "Pillars & Fiqh",
    questionEn: "What is the unstitched white cloth worn by male pilgrims during Hajj & Umrah called?",
    questionUr: "حج و عمرہ کے دوران مرد حجاج کے پہنے جانے والے سفید غیر سلا لباس کو کیا کہتے ہیں؟",
    options: ["Jilbab", "Ihram (احرام)", "Thobe", "Keffiyeh"],
    correctIndex: 1,
    explanationEn: "Ihram consists of two unstitched white sheets symbolizing total humility and human equality.",
    explanationUr: "احرام دو غیر سلا سفید کپڑوں پر مشتمل ہوتا ہے جو دنیاوی حیثیت کو ختم کر کے مساوات کو ظاہر کرتا ہے۔",
    reference: "Fiqh al-Hajj",
  },
  {
    id: 17,
    category: "Quran",
    questionEn: "Which Prophet is mentioned the most times by name in the Holy Quran?",
    questionUr: "قرآن مجید میں سب سے زیادہ مرتبہ کس پیغمبر کا اسمِ گرامی آیا ہے؟",
    options: ["Prophet Isa (AS)", "Prophet Ibrahim (AS)", "Prophet Musa (AS)", "Prophet Adam (AS)"],
    correctIndex: 2,
    explanationEn: "Prophet Musa (Moses) AS is mentioned 136 times by name in the Holy Quran.",
    explanationUr: "حضرت موسیٰ علیہ السلام کا مبارک نام قرآن پاک میں ۱۳۶ بار ذکر ہوا ہے۔",
    reference: "Qur'anic Index Analysis",
  },
  {
    id: 18,
    category: "Seerah",
    questionEn: "Who was the very first person to accept Islam and embrace the message of Tawheed?",
    questionUr: "رسول اللہ ﷺ کی دعوت پر سب سے پہلے اسلام قبول کرنے والی شخصیت کون تھیں؟",
    options: ["Hazrat Abu Bakr (RA)", "Hazrat Khadijah (RA)", "Hazrat Ali (RA)", "Hazrat Zaid (RA)"],
    correctIndex: 1,
    explanationEn: "Mother of Believers, Hazrat Khadijah bint Khuwaylid (RA), was the first to accept Islam and comfort the Prophet ﷺ.",
    explanationUr: "ام المؤمنین حضرت خدیجۃ الکبریٰ رضی اللہ عنہا نے سب سے پہلے تصدیق و اسلام کا شرف حاصل کیا۔",
    reference: "Sahih al-Bukhari 3",
  },
  {
    id: 19,
    category: "Pillars & Fiqh",
    questionEn: "Which prayer in Islam has NO Ruku (bowing) and NO Sujood (prostration)?",
    questionUr: "اسلام میں وہ کون سی واحد نماز ہے جس میں نہ رکوع ہوتا ہے اور نہ سجدہ؟",
    options: ["Eid Prayer", "Janazah Prayer (نمازِ جنازہ)", "Istisqa Prayer", "Tahajjud Prayer"],
    correctIndex: 1,
    explanationEn: "The Funeral Prayer (Salat al-Janazah) consists solely of 4 Takbeers stood in Qiyam with Du'as, without Ruku or Sujood.",
    explanationUr: "نمازِ جنازہ صرف چار تکبیرات اور قیام پر مشتمل ہوتی ہے جس میں رکوع اور سجدہ نہیں ہوتا۔",
    reference: "Fiqh al-Jana'iz",
  },
  {
    id: 20,
    category: "Hadith & Sunnah",
    questionEn: "How many canonical Hadith collections form the primary Sunni corpus ('Kutub al-Sittah')?",
    questionUr: "صحاحِ ستہ سے مراد کتنی مستند کتبِ احادیث کا مجموعہ ہے؟",
    options: ["4 Books", "6 Books (چھ کتب)", "8 Books", "10 Books"],
    correctIndex: 1,
    explanationEn: "Kutub al-Sittah comprises the 6 major authentic Hadith books (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah).",
    explanationUr: "صحاحِ ستہ احادیث کی ۶ معتبر ترین کتابوں کا مجموعہ ہے۔",
    reference: "Hadith Sciences",
  },
];

export default function QuizPage() {
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter questions by category
  const questions = useMemo(() => {
    if (selectedCat === "All") return QUIZ_QUESTIONS;
    return QUIZ_QUESTIONS.filter((q) => q.category === selectedCat);
  }, [selectedCat]);

  // Hydrate high score
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hidayah_quiz_highscore");
      if (saved) setHighScore(Number(saved));
    } catch {}
  }, []);

  // Web Audio feedback generator
  const playFeedbackSound = (type: "correct" | "wrong" | "click") => {
    if (!isSoundOn || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "correct") {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "wrong") {
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.exponentialRampToValueAtTime(164.81, ctx.currentTime + 0.2); // E3
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch {}
  };

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    playFeedbackSound("click");
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      playFeedbackSound("correct");
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      playFeedbackSound("wrong");
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Quiz Completed
      setQuizFinished(true);
      const finalScore = score + (selectedOption === currentQ.correctIndex ? 1 : 0);
      if (finalScore > highScore) {
        setHighScore(finalScore);
        try {
          localStorage.setItem("hidayah_quiz_highscore", String(finalScore));
        } catch {}
      }
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizFinished(false);
    setScore(0);
    setStreak(0);
  };

  const handleShareResults = () => {
    if (typeof window !== "undefined") {
      const text = `I scored ${score}/${questions.length} on Hidayah Hub Islamic Quiz! Test your Islamic knowledge here: ${window.location.origin}/quiz`;
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Luxury Hero Banner matching /ai-search */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/70 shadow-[0_0_50px_rgba(191,160,89,0.35)] min-h-[320px] flex items-center justify-center text-center text-white py-10 px-4 sm:px-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-banner.jpg"
            alt="Islamic Quiz Banner"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/85 via-black/40 to-[#070D18]/75" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-95" />
        </div>

        <div className="relative z-10 p-4 sm:p-8 text-center text-white space-y-5 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/80 bg-[#121A26]/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#BFA059] backdrop-blur-md shadow-md">
            <Trophy className="size-4 text-[#BFA059]" />
            Test &amp; Expand Your Knowledge
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            اسلامی <span className="text-[#D1B876]">کویز</span> و معلومات
          </h1>

          <p className="text-xs sm:text-base text-[#EAD090] font-semibold max-w-2xl mx-auto leading-relaxed">
            Test your knowledge of the Holy Qur'an, Sahih Hadith, Seerah Nabawiyyah, and Islamic Fiqh with authentic referenced explanations.
          </p>

          {/* Controls Bar: Sound + High Score */}
          <div className="flex items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/50 bg-black/60 px-5 py-2 backdrop-blur-md text-xs font-bold text-[#D1B876]">
              <Award className="size-4 text-[#BFA059]" />
              <span>Personal Best: {highScore} / {QUIZ_QUESTIONS.length}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsSoundOn((prev) => !prev)}
              className="flex size-9 items-center justify-center rounded-full border border-[#BFA059]/50 bg-black/60 text-[#D1B876] hover:bg-[#BFA059]/20 transition"
              title={isSoundOn ? "Mute Sound" : "Enable Sound"}
            >
              {isSoundOn ? <Volume2 className="size-4 text-[#BFA059]" /> : <VolumeX className="size-4 opacity-50" />}
            </button>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {["All", "Quran", "Hadith & Sunnah", "Seerah", "Pillars & Fiqh"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setSelectedCat(cat);
              restartQuiz();
            }}
            className={cn(
              "rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-sm",
              selectedCat === cat
                ? "bg-gradient-to-r from-[#BFA059] to-[#D4AF37] text-black shadow-md ring-2 ring-[#BFA059] scale-105"
                : "border border-[#BFA059]/30 bg-white text-slate-700 hover:bg-[#BFA059]/10 dark:bg-night-900 dark:text-slate-300"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quiz Playing Area */}
      {!quizFinished ? (
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Progress Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#BFA059]/30 bg-white p-4 shadow-sm dark:bg-night-900">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-[#BFA059] text-xs font-black text-black">
                {currentIdx + 1}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Question {currentIdx + 1} of {questions.length}
              </span>
            </div>

            <span className="rounded-full bg-[#BFA059]/20 px-3 py-1 text-xs font-bold text-[#8C6F2D] dark:text-[#D1B876]">
              {currentQ.category}
            </span>

            {/* Score & Streak */}
            <div className="flex items-center gap-4 text-xs font-bold">
              {streak > 1 && (
                <span className="flex items-center gap-1 text-amber-500 animate-pulse">
                  <Zap className="size-4 fill-amber-500" />
                  <span>{streak} Streak!</span>
                </span>
              )}

              <div className="flex items-center gap-1.5 text-[#BFA059]">
                <Trophy className="size-4" />
                <span>Score: {score}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-[#BFA059] via-[#D4AF37] to-[#8C6F2D] transition-all duration-300 shadow-sm"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Main Question Display Card */}
          <div className="rounded-[2.5rem] border-2 border-[#BFA059]/40 bg-gradient-to-b from-[#FAF7F0] to-[#F5EFE0] p-6 sm:p-10 shadow-xl dark:border-night-800 dark:from-night-900 dark:to-night-950 space-y-6">
            {/* Question Text in English & Urdu */}
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-gold-100 leading-snug">
                {currentQ.questionEn}
              </h2>
              <p
                dir="rtl"
                className="font-arabic text-lg sm:text-xl font-bold text-[#8C6F2D] dark:text-[#D1B876] leading-relaxed"
              >
                {currentQ.questionUr}
              </p>
            </div>

            {/* Options Grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let btnStyle = "border-slate-200/80 bg-white hover:border-[#BFA059] dark:bg-night-900 dark:border-slate-800";

                if (isSubmitted) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500 font-bold";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "border-rose-500 bg-rose-500/20 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500";
                  }
                } else if (isSelected) {
                  btnStyle = "border-[#BFA059] bg-[#BFA059]/20 ring-2 ring-[#BFA059] font-bold";
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isSubmitted}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border-2 p-4 text-left text-sm font-semibold transition-all active:scale-[0.98] shadow-sm",
                      btnStyle
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-[#BFA059]/20 text-xs font-black text-[#8C6F2D] dark:text-gold-200">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </span>

                    {isSubmitted && isCorrect && <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle className="size-5 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Referenced Explanation Box (Appears after submission) */}
            {isSubmitted && (
              <div className="rounded-2xl border-2 border-[#BFA059]/40 bg-white p-5 space-y-3 dark:bg-night-950 animate-fadeIn shadow-md">
                <div className="flex items-center justify-between border-b border-[#BFA059]/20 pb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#BFA059]">
                    <Quote className="size-4" /> Authentic Reference
                  </span>
                  <span className="text-[11px] font-black text-[#BFA059] uppercase tracking-wider">
                    {currentQ.reference}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {currentQ.explanationEn}
                </p>
                <p dir="rtl" className="font-arabic text-sm sm:text-base text-[#8C6F2D] dark:text-gold-300 leading-relaxed text-right font-semibold">
                  {currentQ.explanationUr}
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#BFA059]/20">
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#BFA059] to-[#D4AF37] px-8 py-3.5 text-sm font-black text-black shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  <span>Submit Answer</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1A202C] px-8 py-3.5 text-sm font-black text-[#EAD090] border-2 border-[#BFA059]/50 shadow-lg transition-all hover:bg-[#0D1117] active:scale-95"
                >
                  <span>{currentIdx < questions.length - 1 ? "Next Question →" : "View Final Results 🏆"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Finished Result Screen */
        <div className="mx-auto max-w-2xl rounded-[2.5rem] border-2 border-[#BFA059]/50 bg-white p-8 sm:p-12 text-center shadow-2xl dark:bg-night-900 space-y-6">
          <div className="inline-flex size-24 items-center justify-center rounded-full bg-gradient-to-b from-[#BFA059]/20 to-[#BFA059]/40 border-2 border-[#BFA059] text-[#BFA059] shadow-inner">
            <Trophy className="size-12 animate-bounce text-[#BFA059]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-gold-100">
              Quiz Completed!
            </h2>
            <p className="text-sm font-arabic font-bold text-[#8C6F2D] dark:text-[#D1B876]">
              مَا شَاءَ اللَّهُ — JazakAllah Khair for testing your knowledge!
            </p>
          </div>

          {/* Final Score Circle */}
          <div className="rounded-3xl border-2 border-[#BFA059]/30 bg-[#FAF7F0] p-6 dark:bg-night-950 max-w-sm mx-auto space-y-2 shadow-inner">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              Your Final Score
            </p>
            <p className="font-mono text-5xl font-extrabold text-[#8C6F2D] dark:text-gold-100">
              {score} / {questions.length}
            </p>
            <div className="flex items-center justify-center gap-3 text-xs font-extrabold text-[#BFA059] pt-1">
              <span>Accuracy: {Math.round((score / questions.length) * 100)}%</span>
              <span>•</span>
              <span>Max Streak: {maxStreak} 🔥</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={restartQuiz}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#BFA059] to-[#D4AF37] px-8 py-3.5 text-sm font-black text-black shadow-lg transition-all hover:brightness-110 active:scale-95"
            >
              <RotateCcw className="size-4" />
              <span>Try Quiz Again</span>
            </button>

            <button
              type="button"
              onClick={handleShareResults}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#BFA059]/60 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition-all hover:bg-[#BFA059]/10 active:scale-95 dark:bg-night-950 dark:text-gold-200"
            >
              {copiedLink ? <Check className="size-4 text-emerald-500" /> : <Share2 className="size-4 text-[#BFA059]" />}
              <span>{copiedLink ? "Link Copied!" : "Share Results"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}