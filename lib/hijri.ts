/**
 * Hijri (Islamic) calendar helpers.
 *
 * Preferred source: the browser's built-in `Intl.DateTimeFormat` with the
 * Umm al-Qura calendar (accurate, i18n-aware). A tabular (Kuwaiti algorithm)
 * fallback is provided for environments without Intl islamic-ca support.
 */

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  monthNameAr: string;
  dayName: string;
  formatted: string;
  formattedArabic: string;
}

export const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

export const HIJRI_MONTHS_ARABIC = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

function intlDayName(date: Date, arabic: boolean) {
  try {
    return new Intl.DateTimeFormat(arabic ? "ar" : "en", {
      weekday: "long",
    }).format(date);
  } catch {
    return "";
  }
}

/** Gregorian → Hijri (tabular Kuwaiti algorithm, used as a fallback). */
function toTabularHijri(date: Date): { day: number; month: number; year: number } {
  // Julian day number for the civil date (midnight UTC)
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  let jd = Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4);
  jd += Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12);
  jd -= Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4);
  jd += d - 32075;

  // Adjust to Islamic epoch
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { day, month: month + 1, year };
}

/** Get the Hijri date for a Gregorian date. */
export function getHijriDate(date: Date): HijriDate {
  const dayName = intlDayName(date, false);
  const dayNameAr = intlDayName(date, true);
  let day: number;
  let month: number;
  let year: number;
  let monthName: string;
  let monthNameAr: string;

  try {
    // Prefer the accurate Umm al-Qura calendar via Intl
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).formatToParts(date);
    const get = (type: string) =>
      parts.find((p) => p.type === type)?.value ?? "1";
    day = parseInt(get("day"), 10);
    month = parseInt(get("month"), 10);
    year = parseInt(get("year"), 10);
    if (!day || !month || !year || Number.isNaN(year)) {
      throw new Error("unparseable");
    }
  } catch {
    const fallback = toTabularHijri(date);
    day = fallback.day;
    month = fallback.month;
    year = fallback.year;
  }

  monthName = HIJRI_MONTHS[(month - 1 + 12) % 12];
  monthNameAr = HIJRI_MONTHS_ARABIC[(month - 1 + 12) % 12];

  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    day,
    month,
    year,
    monthName,
    dayName,
    formatted: `${dayName}, ${day} ${monthName} ${year} AH`,
    formattedArabic: `${dayNameAr}، ${day} ${monthNameAr} ${year} هـ`,
    monthNameAr,
  };
}

/** Arabic month name for a given month index (1-12). */
export function hijriMonthName(month: number, arabic = false) {
  const idx = (month - 1 + 12) % 12;
  return arabic ? HIJRI_MONTHS_ARABIC[idx] : HIJRI_MONTHS[idx];
}

/** Convert a Hijri year/month/day to approximate Gregorian (for Ramadan planning). */
export function hijriToGregorian(hYear: number, hMonth: number, hDay: number): Date {
  // Julian day for Islamic date
  const jd =
    1948440 +
    (hYear - 1) * 354 +
    Math.floor((3 + 11 * hYear) / 30) +
    (hMonth - 1) * 29 +
    Math.floor(hMonth / 2) +
    hDay - 1;
  // Julian day to Gregorian
  const a = jd + 1402;
  const b = Math.floor((a - 1) / 146097);
  const c = a - 146097 * b;
  const d = Math.floor(c / 36524);
  const e = c - 36524 * d;
  const f = Math.floor((e + 1) / 1461);
  const g = e - 1461 * f;
  const h = Math.floor((g + 1) / 365);
  const day = g - 365 * h + 1;
  const month =
    h < 11
      ? h + 2
      : h === 11
        ? 1
        : (() => {
            const extra = h - 11;
            return extra === 1 ? 2 : 2 + (extra - 1);
          })();
  const year = 4 * b + d + (h === 11 || h < 0 ? 0 : Math.floor((month - 2) / 12));
  return new Date(Date.UTC(year, month - 1, day));
}