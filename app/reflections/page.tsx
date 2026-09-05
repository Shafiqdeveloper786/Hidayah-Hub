"use client";

import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Feather,
  Heart,
  Quote,
  Search,
  Share2,
  Sparkles,
  Star,
  Type,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Reflection {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  readTime: string;
  category: string;
  categoryColor: string;
  isFeatured?: boolean;
  excerpt: string;
  fullBodyEn: string;
  fullBodyUr: string;
  quoteArabic: string;
  quoteTranslation: string;
  quoteRef: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const REFLECTIONS: Reflection[] = [
  {
    id: "tawakkul-letting-go",
    title: "The Art of Letting Go & Deep Tawakkul",
    subtitle: "زاویہِ توکل — Finding absolute stillness when life feels overwhelming",
    author: "Zavia Spiritual Desk",
    readTime: "4 min read",
    category: "Tawakkul",
    categoryColor: "#3B82F6",
    isFeatured: true,
    excerpt:
      "True peace does not come from controlling every outcome; it comes from surrendering the outcome to Allah. When we loosen our tight grip on the unknown, our heart finally finds rest.",
    fullBodyEn: `We live in an age that demands total control. We analyze every scenario, worry about tomorrow's provisions, and exhaust our minds attempting to craft the perfect future. Yet, real spiritual serenity begins the moment we realize that we are not the directors of the universe.\n\nAllah says in Surah At-Talaq: "And whoever relies upon Allah — then He is sufficient for him." (65:3).\n\nTawakkul is not passive surrender; it is active effort combined with quiet, unshakeable trust. You tie your camel, and then you leave the rest to the Most Merciful. When you learn to let go, the heavy burden falls off your shoulders and your heart can finally breathe.\n\nThe secret is this: when your plan fails, that is not Allah abandoning you — that is Allah redirecting you toward something far better than what you imagined.`,
    fullBodyUr: `حقیقی سکون اس بات کو تسلیم کرنے میں ہے کہ ہر بات کا مالک و مختار صرف اللہ رب العزت ہے۔ جب انسان اپنے معاملات کو اللہ کے سپرد کر دیتا ہے تو دل کو وہ قرار ملتا ہے جو دنیا کی کوئی شئے نہیں دے سکتی۔\n\nتوکل کا مطلب کام چھوڑنا نہیں بلکہ محنت کرنے کے بعد نتیجہ اللہ پر چھوڑ دینا ہے۔ یہی توکل انسان کو ذہنی سکون اور قلبی اطمینان عطا کرتا ہے۔`,
    quoteArabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    quoteTranslation: "And whoever relies upon Allah — then He is sufficient for him.",
    quoteRef: "Qur'an · Surah At-Talaq 65:3",
  },
  {
    id: "power-of-gratitude",
    title: "The Healing Power of Gratitude (Shukr)",
    subtitle: "شکر کی شفا — How Shukr transforms scarcity into divine abundance",
    author: "Hidayah Literary",
    readTime: "3 min read",
    category: "Gratitude",
    categoryColor: "#10B981",
    excerpt:
      "Gratitude is the mirror that reflects blessings we often take for granted. When you say 'Alhamdulillah' from the depth of your soul, even simple moments turn into divine treasures.",
    fullBodyEn: `The greatest poverty is not a lack of wealth — it is a heart devoid of gratitude. When we focus on what is missing, our world contracts. But when we count what Allah has granted — breath, sight, safety, Islam — abundance floods our perception.\n\nAllah promises: "If you are grateful, I will surely increase you in favor." (Surah Ibrahim 14:7).\n\nGratitude is not just a feeling; it is a daily practice. Begin each morning by naming three blessings you often overlook. Watch how quickly your perspective transforms from complaint into contentment.\n\nShukr multiplies peace inside your home and tranquility inside your chest. It is not that grateful people have more — it is that they see more in what they already have.`,
    fullBodyUr: `شکر گزاری انسان کو مایوسی سے نکال کر امید کی روشنی کی طرف لے جاتی ہے۔ جب بندہ "یا رب! تیرا شکر ہے" کہتا ہے تو اس کی نعمتوں میں مسلسل اضافہ ہوتا رہتا ہے۔\n\nشکر ادا کرنا صرف زبان سے نہیں بلکہ دل کی گہرائی سے ہونا چاہیے۔ جب ہم اللہ کی نعمتوں کا شمار کرتے ہیں تو پتہ چلتا ہے کہ اس کی رحمت ہم پر ہر لمحہ برستی ہے۔`,
    quoteArabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    quoteTranslation: "If you are grateful, I will surely increase you in favor.",
    quoteRef: "Qur'an · Surah Ibrahim 14:7",
  },
  {
    id: "patience-in-silence",
    title: "Patience & Dignity in Quiet Moments",
    subtitle: "صبر اور خاموشی — Why silent endurance is a beloved form of worship",
    author: "Zavia Spiritual Desk",
    readTime: "5 min read",
    category: "Patience",
    categoryColor: "#A855F7",
    excerpt:
      "Not all grief needs an audience. Sometimes the highest degree of patience is swallowing your tears, smiling at the world, and taking your heart's sorrow straight to your Creator in Tahajjud.",
    fullBodyEn: `Prophet Ya'qub (AS) demonstrated the pinnacle of spiritual elegance when he said: "I only complain of my suffering and my grief to Allah." (Surah Yusuf 12:86).\n\nWhen tests arrive, human instinct urges us to complain to everyone around us. Yet, taking your tears secretly to your prayer mat builds an intimate, unbreakable bond between you and your Lord.\n\nSilence before creation; conversation with the Creator. There is a profound dignity in the believer who endures quietly — not because they feel nothing, but because they know exactly where to take their pain.\n\nThe night of Tahajjud is the most private sanctuary ever designed. No one else hears. Only Allah listens. And He is the Best of listeners.`,
    fullBodyUr: `صبرِ جمیل وہ صبر ہے جس میں مخلوق کے سامنے شکوہ و شکایت نہ ہو، بلکہ انسان اپنا سارا دکھ اپنے رب کے سامنے سجدے میں بہا دے۔\n\nجب آنکھیں بند ہوں اور سجدہ گاہ آنسوؤں سے تر ہو — وہاں کوئی نہیں سنتا سوائے اللہ کے۔ اور وہ ذات سب سے بہترین سننے والی ہے۔`,
    quoteArabic: "إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ",
    quoteTranslation: "I only complain of my suffering and my grief to Allah.",
    quoteRef: "Qur'an · Surah Yusuf 12:86",
  },
  {
    id: "inner-peace-heart",
    title: "Purifying the Spiritual Heart (Tazkiyah)",
    subtitle: "تزکیہِ نفس — Removing jealousy, anger, and worldly attachments",
    author: "Hidayah Literary",
    readTime: "4 min read",
    category: "Inner Peace",
    categoryColor: "#F59E0B",
    excerpt:
      "A clean heart carries no malice toward creation. When you forgive those who wronged you, you liberate yourself before you free them.",
    fullBodyEn: `The Prophet Muhammad ﷺ was asked who among people is the best. He replied: "Everyone who is pure of heart and truthful in speech." Pure of heart means having no hatred, envy, or deceit toward anyone.\n\nJealousy corrodes the one who carries it far more than the one it targets. Anger clouds your judgment and distances you from wise decision-making. Worldly attachment chains you to anxiety about tomorrow.\n\nForgiveness is not weakness — it is spiritual royalty. Clearing your heart every night before sleep creates an inner sanctuary untouched by worldly chaos. The practice is simple: before closing your eyes, forgive everyone who wronged you today.\n\nQiyamah will not ask how much wealth you accumulated. It will ask about the state of your heart.`,
    fullBodyUr: `دل کا تزکیہ ہی حقیقی کامیابی ہے۔ کینہ، بغض اور حسد سے پاک دل ہی روزِ قیامت اللہ کے حضور مقبول و کامیاب ٹھہرے گا۔\n\nمعاف کرنا کمزوری نہیں، بلکہ یہ روحانی طاقت کی علامت ہے۔ جو انسان دوسروں کو معاف کر دیتا ہے، وہ سب سے پہلے خود کو آزاد کرتا ہے۔`,
    quoteArabic: "إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ",
    quoteTranslation: "Except one who comes to Allah with a sound heart.",
    quoteRef: "Qur'an · Surah Ash-Shu'ara 26:89",
  },
  {
    id: "dunya-and-akhirah",
    title: "This World is a Bridge, Not a Home",
    subtitle: "دنیا و آخرت — Walking the bridge without building a home on it",
    author: "Zavia Spiritual Desk",
    readTime: "3 min read",
    category: "Wisdom",
    categoryColor: "#EC4899",
    excerpt:
      "The Prophet ﷺ said: 'Be in this world as if you were a stranger or a traveller on a path.' A traveller does not unpack everything — they keep their heart light for the journey ahead.",
    fullBodyEn: `Sayyiduna Abdullah ibn Umar (RA) narrated that the Prophet ﷺ took him by the shoulder and said: "Be in this world as if you were a stranger or a traveler on a path." (Bukhari)\n\nA traveler does not decorate a hotel room as if it were their permanent home. They sleep there, rest, refuel, and move on. The wise traveler keeps their eyes fixed on the destination.\n\nThis world is not the destination — it is the bridge. The beauty of the bridge is not that you stop on it, but that it leads you somewhere magnificent. Do not grieve over what you lose in this dunya; grieve only over losing your connection with Allah.\n\nSpend your days building for the akhirah — but do not neglect your duties here either. The best believer balances both worlds.`,
    fullBodyUr: `آپ ﷺ نے فرمایا: دنیا میں ایسے رہو جیسے ایک مسافر۔ مسافر سفر کو مستقل گھر نہیں بناتا۔ وہ آرام کرتا ہے، پھر آگے بڑھ جاتا ہے۔\n\nدنیا کی محبت میں اتنا نہ ڈوبو کہ آخرت یاد ہی نہ رہے۔ لیکن دنیاوی ذمہ داریاں بھی نبھاؤ۔ اعتدال ہی مؤمن کا راستہ ہے۔`,
    quoteArabic: "كُن فِي الدُّنيَا كَأَنَّكَ غَرِيبٌ أَو عَابِرُ سَبِيلٍ",
    quoteTranslation: "Be in this world as if you were a stranger or a traveler on a path.",
    quoteRef: "Sahih Al-Bukhari · Hadith 6416",
  },
  {
    id: "hope-in-allah",
    title: "Never Lose Hope in Allah's Infinite Mercy",
    subtitle: "رحمتِ الٰہی — The door of Tawbah is always open for you",
    author: "Hidayah Literary",
    readTime: "4 min read",
    category: "Hope",
    categoryColor: "#06B6D4",
    excerpt:
      "No matter how far you have strayed, Allah's mercy is wider than your mistakes. The Prophet ﷺ said Allah is more joyful over the repentance of a servant than a man who finds his lost camel in a desert.",
    fullBodyEn: `There is a dangerous whisper that Shaytan plants: "You have sinned too many times. You have gone too far. There is no way back." This is his most powerful lie, because it leads a person to despair of the Most Merciful.\n\nAllah says: "Say, O My servants who have transgressed against themselves — do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful." (Surah Az-Zumar 39:53)\n\nThe door of Tawbah opens from the inside. You are the one who holds the key. All that is required is sincere regret, genuine resolve to change, and one step toward your Lord. As the hadith teaches us: take one step, and Allah comes to you walking. Come to Him walking, and He comes to you running.\n\nYour past does not define your future in Allah's mercy.`,
    fullBodyUr: `اللہ تعالیٰ کی رحمت ہر گناہ سے بڑی ہے۔ شیطان کا سب سے بڑا ہتھیار یہ ہے کہ وہ انسان کو اللہ کی رحمت سے مایوس کر دے۔\n\nتوبہ کا دروازہ ہمیشہ کھلا ہے۔ بس ایک قدم اٹھاؤ اپنے رب کی طرف — وہ تمہاری طرف دوڑ کر آئے گا۔ یہی اللہ کی لامحدود محبت اور رحمت ہے۔`,
    quoteArabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    quoteTranslation: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
    quoteRef: "Qur'an · Surah Az-Zumar 39:53",
  },
  {
    id: "light-of-tahajjud",
    title: "The Sanctuary of Tahajjud Prayer",
    subtitle: "شبِ بیداری — Whispering to the King when the entire world sleeps",
    author: "Zavia Spiritual Desk",
    readTime: "4 min read",
    category: "Hope",
    categoryColor: "#6366F1",
    excerpt:
      "The arrow shot at Tahajjud never misses its target. When the world is wrapped in quiet dark, Allah descends to the lowest heaven asking: 'Who is calling upon Me so that I may answer?'",
    fullBodyEn: `While the rest of the creation sleeps, a sacred invitation is extended. In the final third of every night, our Creator lowers His mercy to the lowest heaven and asks: "Is there anyone asking, that I may give them? Is there anyone seeking forgiveness, that I may forgive them?" (Sahih Muslim).\n\nTahajjud is not just a prayer; it is an intimate audience with the Lord of the worlds. The tears shed in the darkness of the night are liquid diamonds in the eyes of angels. When you feel unheard by people, wake up before Fajr, bow your head on the cool floor, and pour your heart out.\n\nNo request is too large for Allah, and no broken heart is beyond His healing touch.`,
    fullBodyUr: `تہجد کا وقت وہ نورانی لمحہ ہے جب کائنات سو رہی ہوتی ہے اور ربِ ذوالجلال اپنے بندوں کی پکار سننے کے لیے قریب تر ہوتا ہے۔ تہجد میں مانگی گئی دعا اس تیر کی طرح ہے جو کبھی نشانے سے نہیں چوکتا۔\n\nاگر دنیا کی ہر دروازہ بند محسوس ہو، تو تہجد کا مصلّٰی بچھائیں اور اپنے دل کی بات اپنے رب سے کہیں، وہ ہر پکار سننے والا ہے۔`,
    quoteArabic: "وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا",
    quoteTranslation: "And from part of the night, pray with it as additional worship for you; it may be that your Lord will raise you to a praised station.",
    quoteRef: "Qur'an · Surah Al-Isra 17:79",
  },
  {
    id: "power-of-istighfar",
    title: "The Hidden Key of Frequent Istighfar",
    subtitle: "استغفار کی برکت — Unlocking closed doors and attracting divine sustenance",
    author: "Hidayah Literary",
    readTime: "4 min read",
    category: "Inner Peace",
    categoryColor: "#14B8A6",
    excerpt:
      "Istighfar is not merely for past sins; it is a magnet for divine relief, unexpected provision, and heart serenity in times of economic or mental stress.",
    fullBodyEn: `Hasan al-Basri (RA) was once approached by three different men: one complaining of poverty, another of drought, and a third of childlessness. To all three, he gave the exact same advice: "Increase in Istighfar."\n\nWhen asked why, he quoted Prophet Nuh (AS) from Surah Nuh: "Ask forgiveness of your Lord. Indeed, He is ever a Perpetual Forgiver. He will send rain upon you in showers and give you increase in wealth and children and provide for you gardens..." (71:10-12).\n\nRepentance clears the spiritual dust from our hearts and opens closed doors in our worldly lives. When you feel stuck in your career, distressed in your relationships, or heavy in your mind, let your tongue continuously recite 'Astaghfirullah'. Watch how Allah removes barriers you thought were permanent.`,
    fullBodyUr: `استغفار صرف گناہوں کی معافی کا ذریعہ نہیں بلکہ رزق میں کشادگی، تنگیوں کے خاتمے اور دل کے سکون کا بھی سب سے بڑا راز ہے۔\n\nحسن بصریؒ کے پاس جب بھی کوئی پریشان حال آتا تو وہ استغفار کی کثرت کا مشورہ دیتے۔ ہر بند راستے کو کھولنے کی چابی 'استغفر اللہ' کی ورد ہے۔`,
    quoteArabic: "اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا يُرْسِلِ السَّمَاءَ عَلَيْكُم مِّدْرَارًا",
    quoteTranslation: "Ask forgiveness of your Lord. Indeed, He is ever a Perpetual Forgiver. He will send rain upon you in abundant showers.",
    quoteRef: "Qur'an · Surah Nuh 71:10-11",
  },
  {
    id: "tadabbur-quran",
    title: "Contemplating the Words of Allah (Tadabbur)",
    subtitle: "تدبر القرآن — Reading the Qur'an as a personal letter to your soul",
    author: "Zavia Spiritual Desk",
    readTime: "5 min read",
    category: "Wisdom",
    categoryColor: "#8B5CF6",
    excerpt:
      "Do not read the Qur'an merely to finish pages; read it to let pages transform your character. Every verse is a living conversation between Creator and creation.",
    fullBodyEn: `The Quran was not revealed simply to sit on high shelves wrapped in silk covers. It was sent to be recited, understood, felt, and lived.\n\nAllah asks in Surah Sad: "[This is] a blessed Book which We have revealed to you, [O Muhammad], that they might reflect upon its verses and that those of understanding would be reminded." (38:29).\n\nWhen you open the Quran, read as if Allah is speaking directly to you today in your current situation. When it mentions patience, reflect on your current hardship. When it mentions gratitude, count your current blessings. A single ayah read with deep contemplation (Tadabbur) is worth more to the soul than finishing chapters without heart engagement.`,
    fullBodyUr: `قرآن مجید محض پڑھنے کی کتاب نہیں بلکہ اس کی آیات میں تدبر اور غور و فکر انسان کی زندگی بدل کر رکھ دیتا ہے۔\n\nقرآن پاک کا ہر لفظ دل کے زنگ کو دور کرتا ہے اور بندے کو اللہ تعالیٰ کی معرفت عطا کرتا ہے۔ جب بھی قرآن پڑھیں، ایسے پڑھیں جیسے اللہ آپ سے بلاواسطہ مخاطب ہے۔`,
    quoteArabic: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ وَلِيَتَذَكَّرَ أُولُو الْأَلْبَابِ",
    quoteTranslation: "This is a blessed Book revealed to you that they might reflect upon its verses.",
    quoteRef: "Qur'an · Surah Sad 38:29",
  },
  {
    id: "gift-of-ikhlas",
    title: "Sincerity in Secret Actions (Ikhlas)",
    subtitle: "اخلاصِ نیت — The immense power of hidden good deeds",
    author: "Hidayah Literary",
    readTime: "3 min read",
    category: "Inner Peace",
    categoryColor: "#F43F5E",
    excerpt:
      "A small action done purely for Allah outweighs a mountain of deeds done for public applause. Keep a secret treasure of good deeds known only to Him.",
    fullBodyEn: `The early righteous predecessors used to hide their good deeds just as fiercely as people today hide their sins. They wept in secret, gave charity silently, and prayed long into the night without telling a soul.\n\nThe Prophet ﷺ listed among the seven shaded under Allah's Throne on Judgment Day: "A person who gives charity in secret such that his left hand does not know what his right hand has given." (Bukhari & Muslim).\n\nPublic praise is temporary; divine acceptance is eternal. Protect your intentions (Niyyah). Build a hidden portfolio of secret prayers, undisclosed sadaqah, and anonymous acts of kindness. These hidden roots anchor your faith when storms blow.`,
    fullBodyUr: `اخلاص نیت وہ روح ہے جو ہر عمل کو قبولیت کا درجہ عطا کرتی ہے۔ لوگوں کو دکھانے کے بجائے خاموشی سے کیا گیا چھوٹا سا نیک عمل بھی پہاڑ سے بڑا اجر رکھتا ہے۔\n\nاپنی نیکیوں کو ایسے چھپاؤ جیسے اپنے گناہوں کو چھپاتے ہو۔ خفیہ صدقہ اور خلوت کی عبادت ہی روزِ قیامت کا سایا ہے۔`,
    quoteArabic: "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ",
    quoteTranslation: "And they were not commanded except to worship Allah, being sincere to Him in religion.",
    quoteRef: "Qur'an · Surah Al-Bayyinah 98:5",
  },
  {
    id: "contentment-qada",
    title: "Tranquility in What Allah Has Written",
    subtitle: "الرضا بالقضاء — Surrendering gracefully to the Divine Decree",
    author: "Zavia Spiritual Desk",
    readTime: "4 min read",
    category: "Tawakkul",
    categoryColor: "#D97706",
    excerpt:
      "What is written for you will never miss you, and what missed you was never destined for you. Contentment (Rida) turns heartbreak into divine peace.",
    fullBodyEn: `One of the greatest sources of mental anxiety is fighting reality — wishing yesterday happened differently or resenting a closed door. Yet, belief in Al-Qadr (Divine Decree) brings absolute relief to the believer's spirit.\n\nThe Prophet ﷺ said: "How wonderful is the affair of the believer, for all his affairs are good. If prosperity comes to him, he expresses gratitude and that is good for him; and if adversity befalls him, he endures with patience and that is good for him." (Sahih Muslim).\n\nWhen a door closes, know that Allah saved you from something you could not see. Rida does not mean you do not feel pain; it means you accept the Creator's wisdom above your own desires.`,
    fullBodyUr: `رضا بالرضا یعنی اللہ کے فیصلے پر خوش رہنا انسان کو ذہنی کشمکش سے آزاد کر دیتا ہے۔ جو کچھ تمہارے لیے لکھا گیا ہے وہ تم تک پہنچ کر رہے گا۔\n\nجب بندہ تقدیر پر راضی ہو جاتا ہے، تو ناکامی بھی اس کے لیے حکمت بن جاتی ہے اور ہر حال میں دل کو طمأنینت حاصل ہوتی ہے۔`,
    quoteArabic: "مَا أَصَابَ مِن مُّصِيبَةٍ فِي الْأَرْضِ وَلَا فِي أَنفُسِكُمْ إِلَّا فِي كِتَابٍ مِّن قَبْلِ أَن نَّبْرَأَهَا",
    quoteTranslation: "No disaster strikes upon the earth or within yourselves except that it is in a register before We bring it into being.",
    quoteRef: "Qur'an · Surah Al-Hadid 57:22",
  },
  {
    id: "blessings-of-salawat",
    title: "Illuminating Your Life with Salawat",
    subtitle: "الصلاة على النبي — The miraculous blessings of sending Durood",
    author: "Hidayah Literary",
    readTime: "4 min read",
    category: "Gratitude",
    categoryColor: "#059669",
    excerpt:
      "Sending Salawat upon Prophet Muhammad ﷺ dissolves worries, forgives sins, and earns ten divine mercies from Allah for every single blessing sent.",
    fullBodyEn: `Ubayy ibn Ka'b (RA) once said to the Prophet ﷺ: "O Messenger of Allah, I send many blessings upon you. How much of my supplication should I devote to you?" The Prophet ﷺ encouraged him to increase until Ubayy said: "Then I will devote all my supplications to sending blessings upon you." The Prophet ﷺ replied: "Then your worries will be relieved and your sins will be forgiven." (Tirmidhi).\n\nWhen you send Durood upon the Beloved ﷺ, Allah responds by sending ten blessings upon you. It elevates your status, purifies your speech, and fills your heart with deep love for the Sunnah.\n\nMake it a habit while walking, driving, or resting to say: 'Allahumma Salli Ala Muhammadin wa Ala Ali Muhammad'. Experience how tranquility settles into your life.`,
    fullBodyUr: `درود شریف کا ورد غموں کے خاتمے، گناہوں کی بخشش اور برکات کے نزول کا سچا وسیلہ ہے۔ ہر ایک درود کے بدلے اللہ تعالیٰ دس رحمتیں نازل فرماتا ہے۔\n\nنبی اکرم ﷺ پر درود بھیجنا مؤمن کی روح کے لیے نکھار اور دل کے لیے چین کا سامان ہے۔ اپنی زبان کو درود و سلام سے تر رکھیں۔`,
    quoteArabic: "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا",
    quoteTranslation: "Indeed, Allah and His angels send blessings upon the Prophet. O you who have believed, ask Allah to bless him and grant him peace.",
    quoteRef: "Qur'an · Surah Al-Ahzab 33:56",
  },
];

const CATEGORIES = ["All", "Tawakkul", "Gratitude", "Patience", "Inner Peace", "Wisdom", "Hope"];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ReflectionsPage() {
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [displayLang, setDisplayLang] = useState<"en" | "ur">("en");
  const [modalLang, setModalLang] = useState<"en" | "ur">("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedBm = localStorage.getItem("hidayah_reflections_bm");
      if (savedBm) setBookmarkedIds(JSON.parse(savedBm));
      const savedLikes = localStorage.getItem("hidayah_reflections_likes");
      if (savedLikes) setLikedIds(JSON.parse(savedLikes));
    } catch {
      // ignore
    }
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem("hidayah_reflections_bm", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem("hidayah_reflections_likes", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return REFLECTIONS.filter((r) => {
      const matchCat = activeCategory === "All" || r.category === activeCategory;
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.excerpt.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        r.fullBodyUr.includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const handleShare = (id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/reflections#${id}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const openReflection = (r: Reflection) => {
    setSelectedReflection(r);
    setModalLang(displayLang);
  };

  const currentIdx = selectedReflection
    ? REFLECTIONS.findIndex((r) => r.id === selectedReflection.id)
    : -1;
  const prevReflection = currentIdx > 0 ? REFLECTIONS[currentIdx - 1] : null;
  const nextReflection =
    currentIdx >= 0 && currentIdx < REFLECTIONS.length - 1
      ? REFLECTIONS[currentIdx + 1]
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-10">

      {/* ══ 1. HERO BANNER PANEL ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/70 shadow-[0_0_50px_rgba(191,160,89,0.35)] min-h-[360px] flex items-center justify-center text-center text-white py-12 px-4 sm:px-8">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-banner.jpg"
            alt="Spiritual Reflections & Quranic Wisdom Banner"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/90 via-black/50 to-[#070D18]/75" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-95" />
        </div>

        {/* Central Hero Content */}
        <div className="relative z-10 mx-auto max-w-3xl w-full space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/80 bg-[#121A26]/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#BFA059] backdrop-blur-md shadow-md">
            <Feather className="size-4 text-[#BFA059]" />
            Roohani Zaviye · Spiritual Reflections &amp; Wisdom
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            روحی زاوئیے
          </h1>

          <p className="text-sm sm:text-lg text-[#EAD090] font-semibold drop-shadow-sm max-w-2xl mx-auto">
            Heart-touching Islamic contemplations, Quranic wisdom, &amp; spiritual lessons for daily peace in English &amp; Urdu.
          </p>

          {/* Search Input Bar */}
          <div className="relative mx-auto mt-6 max-w-xl w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#BFA059]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search e.g. "Tawakkul", "Sabr", "تہجد", "استغفار"…'
              className="w-full rounded-2xl border-2 border-[#BFA059]/80 bg-white py-3.5 pl-12 pr-12 text-sm font-medium text-[#1A202C] placeholder-slate-400 shadow-2xl outline-none transition focus:border-[#BFA059] focus:ring-4 focus:ring-[#BFA059]/30"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══ 2. CATEGORY & LANGUAGE FILTER TABS ═════════════════════════════════ */}
      <div className="space-y-4">
        {/* Language Switcher bar for main cards grid */}
        <div className="flex items-center justify-center gap-3 pb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Language / زبان:</span>
          <div className="inline-flex rounded-full border-2 border-[#BFA059]/60 p-1 bg-white dark:bg-[#111827] shadow-md">
            <button
              type="button"
              onClick={() => setDisplayLang("en")}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-black transition-all",
                displayLang === "en"
                  ? "bg-[#BFA059] text-[#0D1117] shadow-sm"
                  : "text-slate-600 dark:text-[#EAD090] hover:text-[#BFA059]"
              )}
            >
              English Cards
            </button>
            <button
              type="button"
              onClick={() => setDisplayLang("ur")}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-black transition-all font-arabic",
                displayLang === "ur"
                  ? "bg-[#BFA059] text-[#0D1117] shadow-sm"
                  : "text-slate-600 dark:text-[#EAD090] hover:text-[#BFA059]"
              )}
            >
              اردو میں کارڈز
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-5 py-2 text-xs sm:text-sm font-extrabold transition-all duration-200 active:scale-95 shadow-sm",
                  isActive
                    ? "bg-gradient-to-r from-[#BFA059] to-[#D4AF37] text-[#0D1117] ring-2 ring-[#BFA059]/60 shadow-[0_0_20px_rgba(191,160,89,0.3)] scale-105"
                    : "border border-[#BFA059]/30 bg-white dark:bg-[#111827] text-slate-700 dark:text-[#EAD090] hover:border-[#BFA059] hover:bg-[#BFA059]/10"
                )}
              >
                {cat}
              </button>
            );
          })}

          {isMounted && bookmarkedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveCategory("__bookmarked__")}
              className={cn(
                "rounded-full px-5 py-2 text-xs sm:text-sm font-extrabold transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-sm",
                activeCategory === "__bookmarked__"
                  ? "bg-[#BFA059] text-[#0D1117] ring-2 ring-[#BFA059]/60 shadow-md"
                  : "border border-[#BFA059]/40 bg-white dark:bg-[#111827] text-[#BFA059] hover:bg-[#BFA059]/10"
              )}
            >
              <Star className="size-3.5 fill-current" /> Saved ({bookmarkedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* ══ 4. MAIN REFLECTION CARDS GRID ═════════════════════════════════════ */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#BFA059]/40 p-12 text-center text-slate-400 space-y-3">
          <Sparkles className="size-10 mx-auto text-[#BFA059] opacity-40" />
          <p className="font-bold text-base text-slate-600 dark:text-slate-300">
            No reflections matched your search criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategory("All");
            }}
            className="rounded-full border border-[#BFA059] px-4 py-1.5 text-xs font-bold text-[#BFA059] hover:bg-[#BFA059]/10"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(activeCategory === "__bookmarked__"
            ? REFLECTIONS.filter((r) => bookmarkedIds.includes(r.id))
            : filtered
          ).map((item) => {
            const isBookmarked = isMounted && bookmarkedIds.includes(item.id);
            const isLiked = isMounted && likedIds.includes(item.id);
            const isCopied = copiedId === item.id;

            return (
              <article
                key={item.id}
                id={item.id}
                className="group relative flex flex-col justify-between rounded-3xl border-2 border-[#BFA059]/30 bg-gradient-to-b from-white to-[#FDFBF7] dark:from-[#111827] dark:to-[#0B0F19] shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(191,160,89,0.2)] hover:border-[#BFA059] overflow-hidden"
              >
                {/* Top Accent Strip */}
                <div
                  className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
                  style={{ background: item.categoryColor }}
                />

                <div className="p-6 space-y-4 flex-1">
                  {/* Top Meta Row */}
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm"
                      style={{ background: item.categoryColor }}
                    >
                      {item.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-400">
                      <Clock className="size-3 text-[#BFA059]" />
                      {item.readTime}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h2 className={cn(
                      "font-serif text-lg font-bold leading-snug text-[#1A202C] dark:text-[#F5EDD5] group-hover:text-[#BFA059] transition-colors duration-200",
                      displayLang === "ur" && "font-arabic text-right text-xl"
                    )}>
                      {displayLang === "ur" ? item.subtitle.split("—")[0].trim() : item.title}
                    </h2>
                    <p className={cn("text-[11px] font-bold text-[#BFA059]/90", displayLang === "ur" && "text-right")}>
                      {displayLang === "ur" ? item.title : item.subtitle}
                    </p>
                  </div>

                  {/* Elegant Quote Highlight Box */}
                  <div className="rounded-2xl border border-[#BFA059]/25 bg-[#FAF7F0] dark:bg-[#0D121D] p-3.5 space-y-1.5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <Quote className="size-3.5 text-[#BFA059]" />
                      <span className="text-[9px] font-black text-[#BFA059]/80 uppercase tracking-wider">
                        {item.quoteRef}
                      </span>
                    </div>
                    <p
                      dir="rtl"
                      lang="ar"
                      className="font-arabic text-base font-bold text-[#1A202C] dark:text-[#EAD090] leading-loose text-right"
                    >
                      {item.quoteArabic}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 italic line-clamp-2">
                      &ldquo;{item.quoteTranslation}&rdquo;
                    </p>
                  </div>

                  {/* Excerpt */}
                  {displayLang === "ur" ? (
                    <p dir="rtl" lang="ur" className="font-arabic text-[#1A202C] dark:text-slate-200 text-[#1A202C] text-sm leading-relaxed text-right line-clamp-3">
                      {item.fullBodyUr.split("\n\n")[0]}
                    </p>
                  ) : (
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                      {item.excerpt}
                    </p>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="px-6 pb-5 pt-3 border-t border-[#BFA059]/15 flex items-center justify-between bg-black/5 dark:bg-white/5">
                  <button
                    type="button"
                    onClick={() => openReflection(item)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1A202C] dark:bg-[#BFA059] px-4 py-2 text-xs font-black text-[#BFA059] dark:text-[#0D1117] shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <BookOpen className="size-3.5" />
                    {displayLang === "ur" ? "مضمون پڑھیں" : "Read Article"}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Share */}
                    <button
                      type="button"
                      onClick={() => handleShare(item.id)}
                      title="Copy share link"
                      className="flex size-8 items-center justify-center rounded-full border border-slate-200 dark:border-[#BFA059]/30 bg-white dark:bg-[#1A202C] text-slate-500 hover:text-[#BFA059] hover:bg-slate-50 dark:hover:bg-[#1A202C]/80 transition"
                    >
                      {isCopied ? (
                        <Check className="size-3.5 text-emerald-500" />
                      ) : (
                        <Share2 className="size-3.5" />
                      )}
                    </button>

                    {/* Bookmark */}
                    <button
                      type="button"
                      onClick={() => toggleBookmark(item.id)}
                      title={isBookmarked ? "Remove Bookmark" : "Save Reflection"}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full border transition-all duration-200",
                        isBookmarked
                          ? "border-[#BFA059] bg-[#BFA059] text-[#0D1117] shadow-md"
                          : "border-slate-200 dark:border-[#BFA059]/30 bg-white dark:bg-[#1A202C] text-slate-400 hover:text-[#BFA059]"
                      )}
                    >
                      <Star className={cn("size-3.5", isBookmarked && "fill-current")} />
                    </button>

                    {/* Like */}
                    <button
                      type="button"
                      onClick={() => toggleLike(item.id)}
                      title="Like reflection"
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full border transition-all duration-200",
                        isLiked
                          ? "border-rose-500 bg-rose-500 text-white shadow-md"
                          : "border-slate-200 dark:border-[#BFA059]/30 bg-white dark:bg-[#1A202C] text-slate-400 hover:text-rose-500"
                      )}
                    >
                      <Heart className={cn("size-3.5", isLiked && "fill-current")} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* ══ 5. DAILY WISDOM FOOTER BANNER ═════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/50 bg-gradient-to-r from-[#121A26] via-[#1A2536] to-[#0A101D] p-8 text-center text-white shadow-2xl">
        <Sparkles className="size-7 text-[#BFA059] mx-auto mb-3" />
        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#BFA059] mb-3">
          Daily Quranic Prescription
        </h3>
        <p
          dir="rtl"
          lang="ar"
          className="font-arabic text-2xl sm:text-3xl font-bold text-[#EAD090] leading-loose mb-3"
        >
          أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
        </p>
        <p className="text-sm sm:text-base text-slate-200 font-semibold italic max-w-xl mx-auto">
          &ldquo;Verily, in the remembrance of Allah do hearts find rest.&rdquo;
        </p>
        <p className="text-xs font-bold text-[#BFA059]/80 mt-2">— Qur'an · Surah Ar-Ra'd 13:28</p>
      </section>

      {/* ══ 6. FULL READING MODAL READER ═════════════════════════════════════ */}
      {selectedReflection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedReflection(null);
          }}
        >
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2.5rem] border-2 border-[#BFA059]/60 bg-[#FDFBF7] dark:bg-[#0D1117] shadow-2xl">
            {/* Category bar */}
            <div
              className="h-2 w-full rounded-t-[2.5rem]"
              style={{ background: selectedReflection.categoryColor }}
            />

            {/* Modal sticky header */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#BFA059]/25 px-6 py-4 bg-[#FDFBF7]/95 dark:bg-[#0D1117]/95 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Feather className="size-4 text-[#BFA059]" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#BFA059]">
                  {selectedReflection.category} · {selectedReflection.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Language Switcher */}
                <div className="flex rounded-xl border-2 border-[#BFA059]/40 overflow-hidden text-[11px] font-extrabold shadow-sm">
                  <button
                    type="button"
                    onClick={() => setModalLang("en")}
                    className={cn(
                      "px-3 py-1 transition-colors",
                      modalLang === "en"
                        ? "bg-[#BFA059] text-[#0D1117]"
                        : "bg-white dark:bg-[#1A202C] text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalLang("ur")}
                    className={cn(
                      "px-3 py-1 transition-colors",
                      modalLang === "ur"
                        ? "bg-[#BFA059] text-[#0D1117]"
                        : "bg-white dark:bg-[#1A202C] text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    اردو
                  </button>
                </div>

                {/* Font Size Controls */}
                <div className="hidden sm:flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setFontSize((s) => Math.max(13, s - 1))}
                    title="Decrease font size"
                    className="rounded-lg border border-[#BFA059]/30 px-2 py-1 text-[11px] font-bold text-[#BFA059] hover:bg-[#BFA059]/10"
                  >
                    A−
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                    title="Increase font size"
                    className="rounded-lg border border-[#BFA059]/30 px-2 py-1 text-[11px] font-bold text-[#BFA059] hover:bg-[#BFA059]/10"
                  >
                    A+
                  </button>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedReflection(null)}
                  className="flex size-9 items-center justify-center rounded-full border border-slate-300 dark:border-[#BFA059]/30 hover:bg-slate-200 dark:hover:bg-[#1A202C] transition"
                >
                  <X className="size-4 text-slate-600 dark:text-[#EAD090]" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 sm:px-10 pb-8 pt-6 space-y-6">
              {/* Title & Metadata */}
              <div className="space-y-2 border-b border-[#BFA059]/20 pb-5">
                <h2 className="font-serif text-2xl sm:text-4xl font-extrabold leading-snug text-[#1A202C] dark:text-[#F5EDD5]">
                  {selectedReflection.title}
                </h2>
                <p className="text-sm font-bold text-[#BFA059]">
                  {selectedReflection.subtitle}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span>Author: {selectedReflection.author}</span>
                  <span>•</span>
                  <span>{selectedReflection.readTime}</span>
                </div>
              </div>

              {/* Arabic Quote Header Card */}
              <div className="rounded-3xl border-2 border-[#BFA059]/40 bg-[#FAF7F0] dark:bg-[#070D18] p-6 text-center shadow-lg space-y-2">
                <p
                  dir="rtl"
                  lang="ar"
                  className="font-arabic text-2xl sm:text-3xl font-bold text-[#1A202C] dark:text-[#EAD090] leading-loose"
                >
                  {selectedReflection.quoteArabic}
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 italic">
                  &ldquo;{selectedReflection.quoteTranslation}&rdquo;
                </p>
                <p className="text-[11px] font-black text-[#BFA059] uppercase tracking-wider pt-1">
                  {selectedReflection.quoteRef}
                </p>
              </div>

              {/* Body Text */}
              {modalLang === "en" ? (
                <div
                  className="space-y-4 text-slate-700 dark:text-slate-200 leading-relaxed font-serif"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {selectedReflection.fullBodyEn.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="size-4 text-[#BFA059]" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#BFA059]">
                      اردو زاویہ و تفصیلی مضمون
                    </span>
                  </div>
                  {selectedReflection.fullBodyUr.split("\n\n").map((para, i) => (
                    <p
                      key={i}
                      dir="rtl"
                      lang="ur"
                      className="font-arabic leading-loose text-slate-800 dark:text-slate-100 text-right"
                      style={{ fontSize: `${fontSize + 3}px` }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Sticky Footer Navigation */}
            <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-[#BFA059]/20 px-6 py-4 bg-[#FDFBF7]/95 dark:bg-[#0D1117]/95 backdrop-blur-md">
              <button
                type="button"
                disabled={!prevReflection}
                onClick={() => prevReflection && openReflection(prevReflection)}
                className="flex items-center gap-1.5 rounded-xl border border-[#BFA059]/40 px-4 py-2 text-xs font-bold text-[#BFA059] hover:bg-[#BFA059]/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="size-4" /> Previous
              </button>

              <button
                type="button"
                onClick={() => setSelectedReflection(null)}
                className="rounded-xl bg-[#BFA059] px-6 py-2 text-xs font-black text-[#0D1117] shadow-md hover:bg-[#D4AF37] transition"
              >
                Close Article
              </button>

              <button
                type="button"
                disabled={!nextReflection}
                onClick={() => nextReflection && openReflection(nextReflection)}
                className="flex items-center gap-1.5 rounded-xl border border-[#BFA059]/40 px-4 py-2 text-xs font-bold text-[#BFA059] hover:bg-[#BFA059]/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                Next <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}