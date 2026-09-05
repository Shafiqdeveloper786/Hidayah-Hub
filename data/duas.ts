/**
 * A curated collection of daily supplications (Duas) and azkar
 * with Arabic text, transliteration, translation and source references.
 */

export interface Dua {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  urduTranslation: string;
  reference: string;
  /** Optional note like the source verse/context */
  note?: string;
}

export const DUA_CATEGORIES = [
  "Morning & Evening",
  "Sleep & Waking",
  "Home & Meals",
  "Prayer & Wudu",
  "Travel",
  "Protection & Health",
  "Istikhara & Decisions",
  "Forgiveness",
  "Qur'anic Supplications",
  "Ramadan",
] as const;

export const DUAS: Dua[] = [
  {
    id: "morning-evening",
    category: "Morning & Evening",
    title: "Morning & Evening Protection",
    arabic:
      "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    transliteration:
      "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilayka an-nushur.",
    translation:
      "O Allah, by You we enter the morning and by You we enter the evening; by You we live and by You we die, and to You is the final return.",
    urduTranslation:
      "اے اللہ! تیرے ہی حکم سے ہم نے صبح کی اور تیرے ہی حکم سے ہم نے شام کی، اور تیرے ہی حکم سے ہم جیتے ہیں اور تیرے ہی حکم سے مرتے ہیں اور اسی کی طرف لوٹنا ہے۔",
    reference: "Jami' at-Tirmidhi 3391",
  },
  {
    id: "evening-afiyah",
    category: "Morning & Evening",
    title: "Well-Being in Both Worlds",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    transliteration:
      "Allahumma inni as'alukal-'afiyah fid-dunya wal-akhirah.",
    translation:
      "O Allah, I ask You for well-being in this world and in the Hereafter.",
    urduTranslation:
      "اے اللہ! میں تجھ سے دنیا اور آخرت میں عافیت اور سلامتی کا سوال کرتا ہوں۔",
    reference: "Sunan Ibn Majah 3871",
  },
  {
    id: "protection-harm",
    category: "Protection & Health",
    title: "Protection Against All Harm",
    arabic:
      "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration:
      "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul-'Alim.",
    translation:
      "In the Name of Allah with Whose Name nothing can cause harm in the earth or in the heavens, and He is the All-Hearing, All-Knowing.",
    urduTranslation:
      "اللہ کے نام سے جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی، اور وہی سب کچھ سننے والا اور جاننے والا ہے۔",
    reference: "Sunan Abi Dawud 5088",
    note: "Recite 3 times in the morning and evening for complete protection.",
  },
  {
    id: "sleep",
    category: "Sleep & Waking",
    title: "Before Sleeping",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya.",
    translation: "In Your name, O Allah, I die and I live.",
    urduTranslation: "اے اللہ! تیرے نام کے ساتھ ہی میں مرتا (سوتا) ہوں اور جیتا (جاگتا) ہوں۔",
    reference: "Sahih al-Bukhari 6324",
  },
  {
    id: "waking",
    category: "Sleep & Waking",
    title: "Upon Waking",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration:
      "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
    translation:
      "Praise be to Allah who gave us life after He caused us to die, and to Him is the resurrection.",
    urduTranslation:
      "تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے (سلانے) کے بعد زندہ کیا اور اسی کی طرف دوبارہ اٹھنا ہے۔",
    reference: "Sahih al-Bukhari 6312",
  },
  {
    id: "after-wudu",
    category: "Prayer & Wudu",
    title: "Supplication After Wudu",
    arabic:
      "أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
    transliteration:
      "Ash-hadu alla ilaha illallahu wahdahu la sharika lahu, wa ash-hadu anna Muhammadan 'abduhu wa rasuluhu. Allahummaj-'alni minat-tawwabina waj-'alni minal-mutatahhirin.",
    translation:
      "I bear witness that none has the right to be worshipped except Allah alone, without partner; and I bear witness that Muhammad is His servant and Messenger. O Allah, make me of those who repent and make me of those who purify themselves.",
    urduTranslation:
      "میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے اس کا کوئی شریک نہیں، اور گواہی دیتا ہوں کہ محمد ﷺ اس کے بندے اور رسول ہیں۔ اے اللہ! مجھے توبہ کرنے والوں اور پاکیزگی اختیار کرنے والوں میں شامل فرما۔",
    reference: "Sahih Muslim 234 & Tirmidhi 55",
  },
  {
    id: "entering-home",
    category: "Home & Meals",
    title: "Entering the Home",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    transliteration:
      "Allahumma inni as'aluka khayral-mawliji wa khayral-makhraji; bismillahi walajna wa bismillahi kharajna wa 'ala Allahi Rabbina tawakkalna.",
    translation:
      "O Allah, I ask You for the best of entering and the best of leaving. In the name of Allah we enter, and in the name of Allah we leave, and upon Allah, our Lord, we rely.",
    urduTranslation:
      "اے اللہ! میں تجھ سے داخل ہونے کی اور نکلنے کی بہترین جگہ کا سوال کرتا ہوں؛ اللہ کے نام کے ساتھ ہم داخل ہوئے اور اللہ ہی پر ہمارا توکل ہے۔",
    reference: "Sunan Abi Dawud 5096",
  },
  {
    id: "leaving-home",
    category: "Home & Meals",
    title: "Leaving the Home",
    arabic:
      "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration:
      "Bismillahi tawakkaltu 'ala Allahi, wa la hawla wa la quwwata illa billah.",
    translation:
      "In the name of Allah, I place my trust in Allah; there is no might and no power except with Allah.",
    urduTranslation:
      "اللہ کے نام کے ساتھ، میں نے اللہ پر توکل کیا اور اللہ کی توفیق کے بغیر نہ گناہوں سے بچنے کی طاقت ہے نہ نیکی کرنے کی قوت۔",
    reference: "Sunan Abi Dawud 5095",
  },
  {
    id: "before-eating",
    category: "Home & Meals",
    title: "Before Eating",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah.",
    translation: "In the name of Allah.",
    urduTranslation: "اللہ کے نام سے شروع کرتا ہوں۔",
    reference: "Sahih al-Bukhari 5376",
  },
  {
    id: "after-eating",
    category: "Home & Meals",
    title: "After Eating",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration:
      "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin.",
    translation:
      "Praise be to Allah who fed us, gave us drink, and made us Muslims.",
    urduTranslation:
      "تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں کھلایا اور پلایا اور ہمیں مسلمانوں میں سے بنایا۔",
    reference: "Sunan Abi Dawud 3850",
  },
  {
    id: "anxiety-anxiety",
    category: "Protection & Health",
    title: "Relief from Anxiety & Distress",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    transliteration:
      "Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala'id-dayni wa ghalabatir-rijal.",
    translation:
      "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debt and the oppression of men.",
    urduTranslation:
      "اے اللہ! میں پریشانی اور غم سے، عاجزی اور سستی سے، بخل اور بزدلی سے، اور قرض کے بوجھ اور لوگوں کے تسلط سے تیری پناہ مانگتا ہوں۔",
    reference: "Sahih al-Bukhari 2893",
  },
  {
    id: "travel",
    category: "Travel",
    title: "When Boarding a Vehicle",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration:
      "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun.",
    translation:
      "Glory be to Him who subjected this to us, and we were not capable of it; and surely, to our Lord we will return.",
    urduTranslation:
      "پاک ہے وہ ذات جس نے اس (سواری) کو ہمارے تابع کر دیا، ورنہ ہم اسے قابو میں لانے کی طاقت نہ رکھتے تھے، اور بلا شبہ ہم اپنے رب ہی کی طرف لوٹنے والے ہیں۔",
    reference: "Sahih Muslim 1342",
  },
  {
    id: "istikhara",
    category: "Istikhara & Decisions",
    title: "Istikhara — Seeking Guidance",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ وَتَعْلَمُ وَلَا أَعْلَمُ وَأَنْتَ عَلَّامُ الْغُيُوبِ...",
    transliteration:
      "Allahumma inni astakhiruka bi'ilmika wa astaqdiruka biqudratika wa as'aluka min fadlikal-'azim...",
    translation:
      "O Allah, I seek Your counsel by Your Knowledge and I seek Your help by Your Power, and I ask You of Your great bounty...",
    urduTranslation:
      "اے اللہ! میں تیرے علم کے وسیلے سے خیر کا طالب ہوں اور تیری قدرت کے وسیلے سے قدرت کا طالب ہوں...",
    reference: "Sahih al-Bukhari 1162",
    note: "Pray two rak'ahs of voluntary prayer, then recite this dua while contemplating your choice.",
  },
  {
    id: "sayyid-istighfar",
    category: "Forgiveness",
    title: "Sayyid al-Istighfar — Master Supplication for Forgiveness",
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration:
      "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu. A'udhu bika min sharri ma sana'tu. Abu'u laka bini'matika 'alayya, wa abu'u bidhanbi, faghfir li fa innahu la yaghfirudh-dhunuba illa anta.",
    translation:
      "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me — for none forgives sins except You.",
    urduTranslation:
      "اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے ہی مجھے پیدا کیا اور میں تیرا بندہ ہوں اور میں اپنی طاقت کے مطابق تیرے عہد اور وعدے پر قائم ہوں۔",
    reference: "Sahih al-Bukhari 6306",
    note: "Whoever recites it with firm faith in the morning/evening and dies that day/night enters Paradise.",
  },
  {
    id: "parents",
    category: "Qur'anic Supplications",
    title: "For Parents",
    arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Rabbir-hamhuma kama rabbayani saghira.",
    translation: "My Lord, have mercy upon them as they raised me when I was small.",
    urduTranslation: "اے میرے رب! ان دونوں (والدین) پر رحم فرما جس طرح انہوں نے مجھے بچپن میں (محبت سے) پالا۔",
    reference: "Qur'an 17:24",
  },
  {
    id: "knowledge",
    category: "Qur'anic Supplications",
    title: "For Knowledge",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma.",
    translation: "My Lord, increase me in knowledge.",
    urduTranslation: "اے میرے رب! میرے علم میں اضافہ فرما۔",
    reference: "Qur'an 20:114",
  },
  {
    id: "distress-yunus",
    category: "Qur'anic Supplications",
    title: "Dua of Yunus (Distress)",
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa anta, subhanaka, inni kuntu minaz-zalimin.",
    translation:
      "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    urduTranslation:
      "تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ہی قصورواروں میں سے تھا۔",
    reference: "Qur'an 21:87",
    note: "No Muslim ever supplicates with these words except that Allah answers him. — Tirmidhi 3505",
  },
  {
    id: "ramadan-forgiveness",
    category: "Ramadan",
    title: "Dua for Laylat al-Qadr",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni.",
    translation:
      "O Allah, You are Most Forgiving and You love forgiveness, so forgive me.",
    urduTranslation:
      "اے اللہ! تو بہت معاف فرمانے والا ہے اور معافی کو پسند فرماتا ہے، پس مجھے معاف فرما دے۔",
    reference: "Jami' at-Tirmidhi 3513",
  },
  {
    id: "iftar",
    category: "Ramadan",
    title: "At the Time of Iftar",
    arabic:
      "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
    transliteration: "Dhahaba adhdhama'u wabtallatil-'uruqu wa thabatal-ajru in sha'Allah.",
    translation:
      "The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
    urduTranslation:
      "پیاس بجھ گئی، رگیں تر ہو گئیں اور ان شاء اللہ اجر ثابت ہو گیا۔",
    reference: "Sunan Abi Dawud 2357",
  },
];