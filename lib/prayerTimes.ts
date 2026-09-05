/**
 * Prayer Times calculation engine.
 *
 * A self-contained, offline implementation of the widely-adopted "PrayTimes"
 * solar-geometry algorithm (by Hamid Zarrabi-Zadeh, MIT license), written in
 * TypeScript for the Hidayah Hub app. No external API required — prayer times
 * are computed from first principles using the observer's latitude/longitude
 * and the local time-zone offset.
 */

export type AsrJuristic = "Standard" | "Hanafi";
export type MidnightMode = "Standard" | "Jafari";
export type HighLatRule =
  | "NightMiddle"
  | "AngleBased"
  | "OneSeventh"
  | "TwilightAngle";

export interface MethodConfig {
  /** Solar angle (degrees below horizon) at Fajr */
  fajrAngle: number;
  /** Solar angle (degrees below horizon) at Isha, or null when using minutes */
  ishaAngle: number | null;
  /** Minutes after Maghrib for Isha (used when ishaAngle is null) */
  ishaMinutes: number | null;
  /** Solar angle for Maghrib (e.g. Jafari 4°); null = at sunset */
  maghribAngle: number | null;
  /** Minutes after sunset for Maghrib */
  maghribMinutes: number | null;
  /** Minutes after mid-day for Dhuhr */
  dhuhrMinutes: number;
  asrJuristic: AsrJuristic;
  midnight: MidnightMode;
}

export interface CalculationMethod {
  id: string;
  name: string;
  region: string;
  config: MethodConfig;
}

export interface PrayerTimesInput {
  /** Latitude in decimal degrees (negative = south) */
  latitude: number;
  /** Longitude in decimal degrees (negative = west) */
  longitude: number;
  /** UTC offset in hours (e.g. +5.5, -4) */
  timezone: number;
  /** Any calendar date to compute times for */
  date?: Date;
  method?: CalculationMethod;
  highLatRule?: HighLatRule;
}

export interface PrayerTimesResult {
  imsak: number;
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  sunset: number;
  maghrib: number;
  isha: number;
  midnight: number;
  /** The local date these times were computed for */
  date: Date;
  method: CalculationMethod;
  highLatRule: HighLatRule;
}

/* ----------------------------- Methods ----------------------------- */

export const METHODS: Record<string, CalculationMethod> = {
  MWL: {
    id: "MWL",
    name: "Muslim World League",
    region: "Europe, North America, East Asia",
    config: {
      fajrAngle: 18,
      ishaAngle: 17,
      ishaMinutes: null,
      maghribAngle: null,
      maghribMinutes: null,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
  ISNA: {
    id: "ISNA",
    name: "Islamic Society of North America",
    region: "North America (some regions)",
    config: {
      fajrAngle: 15,
      ishaAngle: 15,
      ishaMinutes: null,
      maghribAngle: null,
      maghribMinutes: null,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
  Egypt: {
    id: "Egypt",
    name: "Egyptian General Authority of Survey",
    region: "Africa, Syria, Iraq, Lebanon, Malaysia",
    config: {
      fajrAngle: 19.5,
      ishaAngle: 17.5,
      ishaMinutes: null,
      maghribAngle: null,
      maghribMinutes: null,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
  Makkah: {
    id: "Makkah",
    name: "Umm al-Qura, Makkah",
    region: "Arabian Peninsula",
    config: {
      fajrAngle: 18.5,
      ishaAngle: null,
      ishaMinutes: 90,
      maghribAngle: null,
      maghribMinutes: 0,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
  Karachi: {
    id: "Karachi",
    name: "University of Islamic Sciences, Karachi",
    region: "Pakistan, Bangladesh, India, Afghanistan",
    config: {
      fajrAngle: 18,
      ishaAngle: 18,
      ishaMinutes: null,
      maghribAngle: null,
      maghribMinutes: 0,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
  Tehran: {
    id: "Tehran",
    name: "Institute of Geophysics, University of Tehran",
    region: "Iran, parts of Caucasus",
    config: {
      fajrAngle: 17.7,
      ishaAngle: 14,
      ishaMinutes: null,
      maghribAngle: 4.5,
      maghribMinutes: null,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Jafari",
    },
  },
  Jafari: {
    id: "Jafari",
    name: "Shia Ithna-Ashari (Jafari)",
    region: "Shia communities worldwide",
    config: {
      fajrAngle: 16,
      ishaAngle: 14,
      ishaMinutes: null,
      maghribAngle: 4,
      maghribMinutes: null,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Jafari",
    },
  },
  Gulf: {
    id: "Gulf",
    name: "Gulf Region",
    region: "UAE, Oman, Kuwait, Bahrain, Qatar",
    config: {
      fajrAngle: 19.5,
      ishaAngle: null,
      ishaMinutes: 90,
      maghribAngle: null,
      maghribMinutes: 0,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
  Kuwait: {
    id: "Kuwait",
    name: "Kuwait",
    region: "Kuwait",
    config: {
      fajrAngle: 18,
      ishaAngle: null,
      ishaMinutes: 90,
      maghribAngle: null,
      maghribMinutes: 0,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
  Qatar: {
    id: "Qatar",
    name: "Qatar",
    region: "Qatar",
    config: {
      fajrAngle: 18,
      ishaAngle: null,
      ishaMinutes: 90,
      maghribAngle: null,
      maghribMinutes: 0,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
  Singapore: {
    id: "Singapore",
    name: "Singapore",
    region: "Singapore, Malaysia",
    config: {
      fajrAngle: 20,
      ishaAngle: 18,
      ishaMinutes: null,
      maghribAngle: null,
      maghribMinutes: 0,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
  France: {
    id: "France",
    name: "Union of Islamic Organisations of France",
    region: "France & parts of Europe",
    config: {
      fajrAngle: 12,
      ishaAngle: 12,
      ishaMinutes: null,
      maghribAngle: null,
      maghribMinutes: 0,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
  Turkey: {
    id: "Turkey",
    name: "Diyanet İşleri Başkanlığı",
    region: "Turkey",
    config: {
      fajrAngle: 18,
      ishaAngle: 17,
      ishaMinutes: null,
      maghribAngle: null,
      maghribMinutes: 0,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
  Russia: {
    id: "Russia",
    name: "Russia",
    region: "Russia & CIS",
    config: {
      fajrAngle: 16,
      ishaAngle: 15,
      ishaMinutes: null,
      maghribAngle: null,
      maghribMinutes: 0,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
  Moonsighting: {
    id: "Moonsighting",
    name: "Moonsighting Committee",
    region: "North America (Moonsighting.com)",
    config: {
      fajrAngle: 18,
      ishaAngle: 18,
      ishaMinutes: null,
      maghribAngle: 0.5,
      maghribMinutes: null,
      dhuhrMinutes: 0,
      asrJuristic: "Standard",
      midnight: "Standard",
    },
  },
};

export const DEFAULT_METHOD = METHODS.MWL;
export const HIGH_LAT_RULES: HighLatRule[] = [
  "NightMiddle",
  "AngleBased",
  "OneSeventh",
  "TwilightAngle",
];

/* --------------------------- Math helpers --------------------------- */

const dtr = (d: number) => (d * Math.PI) / 180.0;
const rtd = (r: number) => (r * 180.0) / Math.PI;
const sin = (d: number) => Math.sin(dtr(d));
const cos = (d: number) => Math.cos(dtr(d));
const tan = (d: number) => Math.tan(dtr(d));
const arcsin = (x: number) => rtd(Math.asin(x));
const arccos = (x: number) => rtd(Math.acos(x));
const arctan = (x: number) => rtd(Math.atan(x));
const arccot = (x: number) => rtd(Math.atan(1 / x));
const arctan2 = (y: number, x: number) => rtd(Math.atan2(y, x));

const fixAngle = (a: number) => fix(a, 360);
const fixHour = (a: number) => fix(a, 24);

function fix(a: number, b: number) {
  a = a - b * Math.floor(a / b);
  return a < 0 ? a + b : a;
}

/* --------------------------- Sun position --------------------------- */

function sunPosition(julianDay: number) {
  const D = julianDay - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * sin(g) + 0.02 * sin(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const declination = arcsin(sin(e) * sin(L));
  const RA = arctan2(cos(e) * sin(L), cos(L)) / 15;
  const equation = q / 15 - fixHour(RA);
  return { declination, equation };
}

/* --------------------------- Date helpers --------------------------- */

function julian(year: number, month: number, day: number) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

function dayOfYear(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return Math.floor(julian(y, m, d) - julian(y, 1, 1)) + 1;
}

/* ------------------------- Prayer computation ------------------------ */

export function getPrayerTimes(input: PrayerTimesInput): PrayerTimesResult {
  const {
    latitude,
    longitude,
    timezone,
    date = new Date(),
    method = DEFAULT_METHOD,
    highLatRule = "NightMiddle",
  } = input;

  const lat = latitude;
  const lng = longitude;
  const config = method.config;

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  const year = dateOnly.getFullYear();
  const month = dateOnly.getMonth() + 1;
  const day = dateOnly.getDate();

  /** Julian day at a given local hour-of-day (sun position reference). */
  const jd = (hour: number) => julian(year, month, day) + hour / 24 - lng / (15 * 24);

  const midDay = (time: number) => {
    const eqt = sunPosition(jd(time)).equation;
    return fixHour(12 - eqt - timezone + lng / 15);
  };

  const sunAngleTime = (angle: number, time: number, ccw = false) => {
    const decl = sunPosition(jd(time)).declination;
    const noon = midDay(time);
    const t =
      (1 / 15) * arccos((-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat)));
    return noon + (ccw ? -t : t);
  };

  const asrTime = (factor: number, time: number) => {
    const decl = sunPosition(jd(time)).declination;
    const angle = -arccot(factor + tan(Math.abs(lat - decl)));
    return sunAngleTime(angle, time);
  };

  /* --- base times of day (hours) --- */
  let imsak = 5;
  let fajr = 5;
  let sunrise = 6;
  let dhuhr = 12;
  let asr = 13;
  let sunset = 18;
  let maghrib = 18;
  let isha = 18;

  dhuhr = midDay(dhuhr) + config.dhuhrMinutes / 60;
  sunrise = sunAngleTime(0.833, sunrise, true);
  sunset = sunAngleTime(0.833, sunset, false);

  fajr = sunAngleTime(config.fajrAngle, fajr, true);
  isha =
    config.ishaMinutes != null
      ? sunset + config.ishaMinutes / 60
      : config.ishaAngle != null
        ? sunAngleTime(config.ishaAngle, isha, false)
        : sunset;

  maghrib =
    config.maghribAngle != null
      ? sunAngleTime(config.maghribAngle, maghrib, false)
      : config.maghribMinutes != null
        ? sunset + config.maghribMinutes / 60
        : sunset;

  asr = asrTime(config.asrJuristic === "Hanafi" ? 2 : 1, asr);
  imsak = fajr - 10 / 60;

  /* --- high-latitude adjustments (ONLY for |lat| > 48°) --- */
  // For normal latitudes like Pakistan (31°N), these are NOT needed and would
  // produce completely wrong times (e.g. Fajr showing as 10 PM).
  if (Math.abs(lat) > 48) {
    const nightTime = fixHour(sunset - sunrise);

    const nightPortion = (angle: number) => {
      try {
        const decl = sunPosition(jd(sunset)).declination;
        return (
          (1 / 15) * arccos((-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat)))
        );
      } catch {
        return 1 / 2;
      }
    };

    const portionOfNight = (angle: number) => {
      switch (highLatRule) {
        case "NightMiddle":  return 1 / 2;
        case "OneSeventh":   return 1 / 7;
        case "AngleBased":   return nightPortion(angle);
        case "TwilightAngle":return nightPortion(angle);
        default:             return nightPortion(angle);
      }
    };

    const adjustHLTime = (time: number, angle: number, ccw: boolean) => {
      const diff = portionOfNight(angle) * nightTime;
      return ccw ? fixHour(time - diff) : fixHour(time + diff);
    };

    fajr   = adjustHLTime(fajr,   config.fajrAngle,         true);
    isha   = adjustHLTime(isha,   config.ishaAngle ?? 17,   false);
    maghrib= adjustHLTime(maghrib, config.maghribAngle ?? 0, false);
  }
  imsak = fajr - 10 / 60;

  const midnight = fixHour(sunset + fixHour(sunset - sunrise) / 2);

  const toMinutes = (h: number) => Math.round(fixHour(h) * 60);

  return {
    imsak: toMinutes(imsak),
    fajr: toMinutes(fajr),
    sunrise: toMinutes(sunrise),
    dhuhr: toMinutes(dhuhr),
    asr: toMinutes(asr),
    sunset: toMinutes(sunset),
    maghrib: toMinutes(maghrib),
    isha: toMinutes(isha),
    midnight: toMinutes(midnight),
    date: dateOnly,
    method,
    highLatRule,
  };
}

/* ----------------------------- Formatting ----------------------------- */

/** Format a minutes-since-midnight value into a 12/24h time string. */
export function formatTime(minutes: number, format: "12h" | "24h" = "12h"): string {
  const clamped = Math.max(0, Math.min(minutes, 1439));
  const h24 = Math.floor(clamped / 60);
  const m = clamped % 60;
  const mm = m.toString().padStart(2, "0");
  if (format === "24h") {
    return `${h24.toString().padStart(2, "0")}:${mm}`;
  }
  const period = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${mm} ${period}`;
}

export type PrayerName =
  | "imsak"
  | "fajr"
  | "sunrise"
  | "dhuhr"
  | "asr"
  | "sunset"
  | "maghrib"
  | "isha"
  | "midnight";

export const PRAYER_ORDER: PrayerName[] = [
  "imsak",
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "sunset",
  "maghrib",
  "isha",
];

export const PRAYER_LABELS: Record<PrayerName, string> = {
  imsak: "Imsak",
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  sunset: "Sunset",
  maghrib: "Maghrib",
  isha: "Isha",
  midnight: "Midnight",
};

export const PRAYER_ARABIC: Record<PrayerName, string> = {
  imsak: "إمساك",
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  sunset: "الغروب",
  maghrib: "المغرب",
  isha: "العشاء",
  midnight: "منتصف الليل",
};