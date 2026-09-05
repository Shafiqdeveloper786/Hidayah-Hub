import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";

const CANDIDATE_MODELS = [
  "qwen/qwen3.8-27b",
  "qwen/qwen3.6-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
];

const SYSTEM_PROMPT = `You are "Hidayah AI" — an authentic, respectful, scholarly, and compassionate Islamic AI assistant for Hidayah Hub.

Your core principles:
1. Base all answers strictly on authentic Islamic sources: The Holy Quran and the Sahih Hadith collections (Sahih Al-Bukhari, Sahih Muslim, Sunan An-Nasa'i, Sunan Abu Dawud, Jami At-Tirmidhi, Sunan Ibn Majah).
2. ALWAYS provide the exact Quranic Surah:Ayah reference (e.g. "Surah Al-Baqarah · 2:255") OR the Hadith collection + hadith number (e.g. "Sahih Al-Bukhari · 63"). NEVER invent a reference — if you are not certain of the exact citation, say so honestly and give the established scholarly consensus instead.
3. Include the relevant Arabic text with proper tashkeel (vowelization).
4. Provide comprehensive, accurate, and easy-to-understand explanations in clear English.
5. Provide a beautiful and complete Urdu (اردو) translation and explanation.
6. Be balanced and scholarly: clarify differences of scholarly opinion when relevant, and always advise consulting qualified local scholars for fiqh rulings / fatwa.
7. If the question is outside Islamic knowledge or is about a haram/harmful matter, respond kindly and steer toward beneficial Islamic guidance.
8. Format your response STRICTLY as valid JSON (no markdown, no code fences) with exactly these keys:
{
  "topic": "Concise topic title in English",
  "arabicQuote": "Arabic text of the Quranic ayah or Hadith",
  "reference": "Surah name & ayah number OR Hadith reference",
  "englishAnswer": "Detailed, accurate answer in English",
  "urduAnswer": "مکمل اور تفصیلی اردو جواب"
}`;

/**
 * Robustly parse the model's JSON answer even if it is wrapped in markdown
 * code fences or contains surrounding prose. Returns null when unparseable.
 */
function safeParseAnswer(raw: string): Record<string, string> | null {
  let cleaned = raw.trim();
  // Strip markdown code fences: ```json ... ``` or ``` ... ```
  const fence = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) cleaned = fence[1].trim();
  // Fall-back: extract the outermost JSON object braces
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end > start) cleaned = cleaned.slice(start, end + 1);
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === "object") return parsed as Record<string, string>;
  } catch {
    /* not JSON — fall through */
  }
  return null;
}

// Knowledge base for instant authentic fallback if Groq API or network is unavailable
const KNOWLEDGE_BASE: Record<string, { topic: string; arabicQuote: string; reference: string; englishAnswer: string; urduAnswer: string }> = {
  sabar: {
    topic: "The Virtues & Blessings of Sabr (Patience)",
    arabicQuote: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    reference: "Surah Al-Baqarah · 2:153",
    englishAnswer: "Allah Almighty commands believers to seek help through patience and prayer, promising His special presence and support to those who remain patient. Sabr involves remaining steadfast during trials, avoiding sin, and maintaining complete trust in Allah's wisdom.",
    urduAnswer: "اللہ تعالیٰ مومنوں کو ہدایت دیتا ہے کہ صبر اور نماز کے ذریعے مدد حاصل کریں۔ بے شک اللہ صابرین کے ساتھ ہے۔ صبر میں آزمائشوں پر ثابت قدم رہنا، گناہوں سے بچنا اور اللہ کے فیصلوں پر راضی رہنا شامل ہے۔",
  },
  laylatul: {
    topic: "The Excellence of Laylatul Qadr (Night of Decree)",
    arabicQuote: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ",
    reference: "Surah Al-Qadr · 97:3",
    englishAnswer: "Laylatul Qadr is a blessed night during the last ten odd nights of Ramadan, superior in virtue to a thousand months (over 83 years of worship). Worship, dua, and Quranic recitation on this night carry immense rewards.",
    urduAnswer: "لیلة القدر رمضان المبارک کی آخری دس طاق راتوں میں سے ایک ہے جو ہزار مہینوں کی عبادت سے زیادہ افضل ہے۔ اس مبارک رات میں عبادت، دعا اور تلاوتِ قرآن کا اجر و ثواب بے حساب ہے۔",
  },
  rizq: {
    topic: "Increasing Rizq (Sustenance) according to Quran & Sunnah",
    arabicQuote: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ",
    reference: "Surah At-Talaq · 65:2-3",
    englishAnswer: "The primary keys to increasing Rizq are Taqwa (God-consciousness), Istighfar (seeking forgiveness), maintaining family ties (Silat-ur-Rahm), giving charity (Sadaqah), and relying sincerely upon Allah (Tawakkul).",
    urduAnswer: "رزق میں برکت کے بنیادی اسباب: تقویٰ کا اختیار کرنا، استغفار کی کثرت، صلہ رحمی (رشتہ داروں کے ساتھ حسنِ سلوک)، صدقہ و خیرات اور اللہ تعالیٰ پر سچا توکل ہے۔",
  },
  istikhara: {
    topic: "The Method & Importance of Salat al-Istikhara",
    arabicQuote: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ",
    reference: "Sahih Al-Bukhari · 1166",
    englishAnswer: "Salat al-Istikhara consists of 2 Rakat non-obligatory prayer followed by the famous Istikhara supplication, asking Allah to guide you towards what is best for your deen, worldly life, and akhirah when making important decisions.",
    urduAnswer: "استخارہ کا طریقہ: دو رکعت نفل پڑھ کر مسنون دعا پڑھیں۔ اس میں اللہ تعالیٰ سے اپنے اہم فیصلے (شادی، کاروبار، سفر وغیرہ) میں خیر و برکت کی ہدایت مانگی جاتی ہے۔",
  },
  subhanallah: {
    topic: "Virtues of SubhanAllah and Tasbeeh",
    arabicQuote: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ ، ثَقِيلَتَانِ فِي الْمِيزَانِ : سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    reference: "Sahih Al-Bukhari · 6406 / Sahih Muslim · 2694",
    englishAnswer: "The Prophet (ﷺ) said: 'Two words are light on the tongue, heavy on the scales, and beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil-Adheem.' Continual tasbeeh purifies the heart and earns vast spiritual rewards.",
    urduAnswer: "نبی کریم ﷺ نے فرمایا: دو کلمے زبان پر ہلکے، میزان میں بھاری اور رحمن کو محبوب ہیں: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ'۔ ذکر الٰہی سے دل کو اطمینان نصیب ہوتا ہے۔",
  },
  walidain: {
    topic: "Righteousness to Parents (Birr al-Walidain)",
    arabicQuote: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا",
    reference: "Surah Al-Isra · 17:23",
    englishAnswer: "Allah commands kindness to parents right after commanding His worship. Treating parents with respect, gentle speech, financial care, and praying for their forgiveness are among the highest deeds in Islam.",
    urduAnswer: "اللہ تعالیٰ نے اپنی عبادت کے ساتھ والدین سے حسن سلوک کا حکم دیا ہے۔ ان سے نرمی سے بات کرنا، خدمت کرنا اور ان کی مغفرت کے لیے دعا کرنا اسلام میں عظیم ترین اعمال میں سے ہے۔",
  },
namaz: {
    topic: "The Importance of Salah (Prayer) in Islam",
    arabicQuote: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    reference: "Surah An-Nisa · 4:103",
    englishAnswer: "Salah (the five daily prayers) is the second pillar of Islam and the most important act of worship after faith itself. The Prophet (ﷺ) said: 'The covenant between us and them is prayer; whoever abandons it has disbelieved' (Sunan At-Tirmidhi · 2621). It purifies sins, connects the servant to Allah, and is the first thing a person is asked about on the Day of Judgment.",
    urduAnswer: "نماز (پانچ وقت کی فرض نمازیں) اسلام کا دوسرا رکن اور ایمان کے بعد سب سے اہم عبادت ہے۔ نبی کریم ﷺ نے فرمایا: 'ہمارے اور ان کے درمیان عہد نماز ہے؛ جس نے اسے چھوڑا اس نے کفر کیا' (سنن ترمذی: 2621)۔ نماز گناہوں کو دھوتی ہے، بندے کو اللہ سے جوڑتی ہے اور قیامت کے روز سب سے پہلے نماز ہی کا حساب ہوگا۔",
  },
  zakat: {
    topic: "The Obligation & Wisdom of Zakat",
    arabicQuote: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ",
    reference: "Surah Al-Baqarah · 2:43",
    englishAnswer: "Zakat is the third pillar of Islam — an obligatory annual charity (2.5% of wealth above the Nisab) paid to eight categories of recipients mentioned in Surah At-Tawbah (9:60). It purifies wealth, reduces inequality, and fulfils the rights of the poor upon the rich Muslims.",
    urduAnswer: "زکوٰۃ اسلام کا تیسرا رکن ہے — نصاب سے زائد مال پر سالانہ ڈھائی فیصد (2.5%) فرض صدقہ ہے جو سورۃ توبہ (9:60) کے آٹھ مصارف میں صرف کیا جاتا ہے۔ زکوٰۃ مال کو پاک کرتی ہے، معاشرتی تفاوت گھٹاتی ہے اور امیروں پر غریبوں کے حقوق ادا کرتی ہے۔",
  },
  hajj: {
    topic: "The Pilgrimage of Hajj — Its Obligation & Virtues",
    arabicQuote: "وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا",
    reference: "Surah Aal-Imran · 3:97",
    englishAnswer: "Hajj is the fifth pillar of Islam — a once-in-a-lifetime pilgrimage to Makkah obligatory upon every able-bodied Muslim who can afford the journey. The Prophet (ﷺ) said an accepted Hajj has no reward except Paradise (Sahih Al-Bukhari · 1773). It symbolises unity, equality, and complete submission to Allah.",
    urduAnswer: "حج اسلام کا پانچواں رکن ہے — بیت اللہ کی زیارت جو ہر صاحبِ استطاعت مسلمان پر عمر بھر میں ایک بار فرض ہے۔ نبی کریم ﷺ نے فرمایا حجِ مبرور کا ثواب جنت کے سوا کچھ نہیں (صحیح بخاری: 1773)۔ حج وحدت، برابری اور اللہ کی کامل اطاعت کی علامت ہے۔",
  },
  ramadan: {
    topic: "The Blessed Month of Ramadan & Fasting",
    arabicQuote: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ",
    reference: "Surah Al-Baqarah · 2:185",
    englishAnswer: "Ramadan is the ninth month of the Islamic calendar in which the Qur'an was revealed, and fasting it is the fourth pillar of Islam. Fasting teaches taqwa, discipline and compassion for the poor. The Prophet (ﷺ) said: 'Whoever fasts Ramadan with faith and seeking reward, his past sins are forgiven' (Sahih Al-Bukhari · 38).",
    urduAnswer: "رمضان اسلامی سال کا نواں مہینہ ہے جس میں قرآن نازل ہوا، اور اس کا روزہ اسلام کا چوتھا رکن ہے۔ روزہ تقویٰ، نظم و ضبط اور غریبوں کے ساتھ ہمدردی سکھاتا ہے۔ نبی کریم ﷺ نے فرمایا: 'جس نے ایمان اور ثواب کی نیت سے رمضان کے روزے رکھے، اس کے پچھلے گناہ معاف کر دیے جاتے ہیں' (صحیح بخاری: 38)۔",
  },
tawakkul: {
    topic: "Trusting in Allah (Tawakkul) — True Reliance",
    arabicQuote: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    reference: "Surah At-Talaq · 65:3",
    englishAnswer: "Tawakkul means sincere reliance upon Allah while taking the necessary lawful means. The Prophet (ﷺ) said: 'If you relied upon Allah as you should, He would provide for you as He provides for the birds — they leave hungry and return full' (Jami' At-Tirmidhi · 2344). True tawakkul combines effort with complete trust in Allah's decree.",
    urduAnswer: "توکل کا مطلب ہے جائز اسباب اختیار کرتے ہوئے اللہ پر سچا بھروسہ کرنا۔ نبی کریم ﷺ نے فرمایا: 'اگر تم اللہ پر سچا توکل کرو تو وہ تمہیں ایسے رزق دیتا جیسے پرندوں کو دیتا ہے — وہ بھوکے جاتے ہیں اور بھرے پیٹ لوٹتے ہیں' (ترمذی: 2344)۔ توکل محنت کے ساتھ اللہ کے فیصلے پر مکمل اعتماد کا نام ہے۔",
  },
  istighfar: {
    topic: "The Power of Istighfar (Seeking Forgiveness)",
    arabicQuote: "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
    reference: "Surah Nuh · 71:10",
    englishAnswer: "Istighfar (saying 'Astaghfirullah') is a key to forgiveness, sustenance and peace. The Prophet (ﷺ) said: 'Whoever makes it a habit to seek Allah's forgiveness, Allah will grant him relief from every worry, a way out of every hardship, and provide for him from where he does not expect' (Sunan Abi Dawud · 1518).",
    urduAnswer: "استغفار ('أستغفر اللہ' کہنا) مغفرت، رزق اور سکون کی کنجی ہے۔ نبی کریم ﷺ نے فرمایا: 'جو شخص استغفار کو اپنی عادت بنا لے، اللہ اسے ہر غم سے نجات، ہر تنگی سے راہ نکالنے کا ذریعہ اور ایسی جگہ سے رزق دیتا ہے جہاں سے اسے گمان بھی نہ ہو' (سنن ابی داؤد: 1518)۔",
  },
  jannah: {
    topic: "The Description & Blessings of Jannah (Paradise)",
    arabicQuote: "أُعِدَّتْ لِلْمُتَّقِينَ فِيهَا أَنْهَارٌ مِّن مَّاءٍ غَيْرِ آسِنٍ",
    reference: "Surah Muhammad · 47:15",
    englishAnswer: "Jannah (Paradise) is the eternal abode prepared by Allah for the believers — a place of unimaginable bliss with rivers, gardens, bounties and, most importantly, the pleasure of Allah and the vision of Him. No eye has seen, no ear has heard, and no heart can imagine its delights (Sahih Al-Bukhari · 7498).",
    urduAnswer: "جنت مومنین کے لیے اللہ کا ابدی ٹھکانہ ہے — نہریں، باغات، نعمتیں اور سب سے بڑی نعمت اللہ کی رضا اور اس کا دیدار۔ اس کی نعمتیں ایسی ہیں جو نہ کسی آنکھ نے دیکھیں، نہ کان نے سنیں اور نہ کسی دل نے سوچیں (صحیح بخاری: 7498)۔",
  },
  dua: {
    topic: "The Virtue & Etiquettes of Dua (Supplication)",
    arabicQuote: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
    reference: "Surah Ghafir · 40:60",
    englishAnswer: "Dua is the essence of worship — a direct, humble conversation with Allah. The Prophet (ﷺ) said: 'Dua is worship' (Jami' At-Tirmidhi · 2969). Best etiquettes include praising Allah first, sending salawat upon the Prophet (ﷺ), facing the Qiblah, raising hands with humility, and being certain that Allah will answer in the best way and time.",
    urduAnswer: "دعا عبادت کا مغز ہے — اللہ سے براہِ راست عاجزانہ گفتگو۔ نبی کریم ﷺ نے فرمایا: 'دعا ہی عبادت ہے' (جامع ترمذی: 2969)۔ بہترین آداب: اللہ کی حمد، درودِ شریف، قبلہ رخ ہونا، ہاتھ اٹھا کر عاجزی اور یقین کے ساتھ دعا کرنا کہ اللہ بہترین وقت پر بہترین طریقے سے قبول فرمائے گا۔",
  },
  quran: {
    topic: "The Virtues of the Holy Quran & Recitation",
    arabicQuote: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ",
    reference: "Surah Sad · 38:29",
    englishAnswer: "The Qur'an is the final revelation and the greatest guidance for humanity — a book of reflection, healing and light. The Prophet (ﷺ) said: 'The best of you are those who learn the Qur'an and teach it' (Sahih Al-Bukhari · 5027). Every letter recited carries reward, and it will intercede for its companion on the Day of Judgment.",
    urduAnswer: "قرآن مجید آخری آسمانی کتاب اور انسانیت کے لیے عظیم ترین ہدایت ہے — غور و فکر، شفا اور نور کی کتاب۔ نبی کریم ﷺ نے فرمایا: 'تم میں بہترین وہ ہے جو قرآن سیکھے اور سکھائے' (صحیح بخاری: 5027)۔ اس کا ہر حرف پڑھنے پر ثواب ہے اور یہ قیامت کے دن اپنے پڑھنے والے کے لیے سفارش کرے گا۔",
  },
  shukr: {
    topic: "The Excellence of Gratitude (Shukr)",
    arabicQuote: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    reference: "Surah Ibrahim · 14:7",
    englishAnswer: "Shukr (gratitude to Allah) invites more blessings, purifies the heart, and is a sign of true faith and contentment. Allah promises: 'If you are grateful, I will surely increase you (in favor).' Gratitude is shown through the heart (realisation), the tongue (praise), and the limbs (obedience).",
    urduAnswer: "شکر اللہ کی نعمتوں کو بڑھاتا ہے، دل کو پاک کرتا ہے اور حقیقی ایمان و قناعت کی نشانی ہے۔ اللہ تعالیٰ فرماتا ہے: 'اگر تم شکر کرو گے تو میں تمہیں ضرور زیادہ دوں گا' (ابراہیم: 7)۔ شکر دل سے (تسلیم)، زبان سے (حمد) اور اعضاء سے (اطاعت) ادا ہوتا ہے۔",
  },
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const question = (body.question ?? "").trim();

  if (!question) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }

  // Match the best fallback knowledge-base entry (longest key wins) so common
  // questions always get an accurate, instant, source-backed answer.
  const lowerQ = question.toLowerCase();
  const matchedKey = Object.keys(KNOWLEDGE_BASE)
    .filter((k) => lowerQ.includes(k))
    .sort((a, b) => b.length - a.length)[0];

  const getFallbackAnswer = () => {
    if (matchedKey) return KNOWLEDGE_BASE[matchedKey];
    return {
      topic: `Islamic Guidance: ${question}`,
      arabicQuote: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ",
      reference: "Surah An-Nahl · 16:43",
      englishAnswer: `Regarding "${question}": Islam teaches us to seek authentic knowledge from the Holy Quran and the Sunnah of Prophet Muhammad (ﷺ). Patience (Sabr), prayer (Salah), and good character are foundational. For specific jurisprudence (fiqh) rulings, always consult qualified local Islamic scholars.`,
      urduAnswer: `آپ کے سوال "${question}" کے متعلق: اسلام قرآن و سنت کی روشنی میں زندگی گزارنے کی ہدایت دیتا ہے۔ صبر، نماز اور اچھے اخلاق مومن کی شان ہیں۔ شرعی مسائل اور تفصیلی فتویٰ کے لیے مستند علماء کرام سے رجوع کریں۔`,
    };
  };

  if (!GROQ_API_KEY) {
    return NextResponse.json({ answer: getFallbackAnswer() });
  }

  // Iterate over candidate models (most capable first) with a 30s timeout.
  for (const model of CANDIDATE_MODELS) {
    const timeoutController = new AbortController();
    const timer = setTimeout(() => timeoutController.abort(), 30000);
    try {
      const groqRes = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Question: ${question}\n\nProvide an authentic Islamic response based on the Quran & authentic Hadith in strict JSON format as specified.`,
            },
          ],
          temperature: 0.2,
          max_tokens: 1200,
          response_format: { type: "json_object" },
        }),
        signal: timeoutController.signal,
      });

      if (groqRes.ok) {
        const data = await groqRes.json();
        const rawContent = data.choices?.[0]?.message?.content ?? "{}";

        const maybeParsed = safeParseAnswer(rawContent);
        if (maybeParsed) {
          // Validate/coerce fields so the response is always complete & accurate.
          const fb = getFallbackAnswer();
          const parsed = {
            topic: (maybeParsed.topic ?? "").trim() || fb.topic,
            arabicQuote: (maybeParsed.arabicQuote ?? "").trim() || fb.arabicQuote,
            reference: (maybeParsed.reference ?? "").trim() || fb.reference,
            englishAnswer: (maybeParsed.englishAnswer ?? "").trim() || fb.englishAnswer,
            urduAnswer: (maybeParsed.urduAnswer ?? "").trim() || fb.urduAnswer,
          };
          return NextResponse.json({ answer: parsed });
        }
        // Unparseable JSON — return the rich fallback instead of raw junk.
        return NextResponse.json({ answer: getFallbackAnswer() });
      }
    } catch (err) {
      console.warn(`Model ${model} error:`, err instanceof Error ? err.message : err);
    } finally {
      clearTimeout(timer);
    }
  }

  // Return the rich authentic knowledge-base response if all models fail.
  return NextResponse.json({ answer: getFallbackAnswer() });
}