"use client";

import {
  Bell,
  BellOff,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Compass,
  Globe,
  Info,
  MapPin,
  Moon,
  Navigation,
  Pause,
  Play,
  RefreshCw,
  Search,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_LOCATION,
  getCurrentPosition,
  getStoredLocation,
  saveLocation,
  type StoredLocation,
} from "@/lib/location";
import {
  formatTime,
  getPrayerTimes,
  METHODS,
  PRAYER_ARABIC,
  PRAYER_LABELS,
  type PrayerName,
} from "@/lib/prayerTimes";
import { getHijriDate } from "@/lib/hijri";
import { cn } from "@/lib/utils";

// ── Major Cities Data ─────────────────────────────────────────────────────────
const POPULAR_CITIES: StoredLocation[] = [
  { city: "Lahore, Pakistan", label: "Lahore, Punjab, Pakistan", latitude: 31.5497, longitude: 74.3436 },
  { city: "Karachi, Pakistan", label: "Karachi, Sindh, Pakistan", latitude: 24.8607, longitude: 67.0011 },
  { city: "Islamabad, Pakistan", label: "Islamabad, Capital, Pakistan", latitude: 33.6844, longitude: 73.0479 },
  { city: "Rawalpindi, Pakistan", label: "Rawalpindi, Punjab, Pakistan", latitude: 33.5651, longitude: 73.0169 },
  { city: "Peshawar, Pakistan", label: "Peshawar, KPK, Pakistan", latitude: 34.0151, longitude: 71.5249 },
  { city: "Quetta, Pakistan", label: "Quetta, Balochistan, Pakistan", latitude: 30.1798, longitude: 66.975 },
  { city: "Faisalabad, Pakistan", label: "Faisalabad, Punjab, Pakistan", latitude: 31.4504, longitude: 73.135 },
  { city: "Multan, Pakistan", label: "Multan, Punjab, Pakistan", latitude: 30.1575, longitude: 71.5249 },
  { city: "Sialkot, Pakistan", label: "Sialkot, Punjab, Pakistan", latitude: 32.4945, longitude: 74.5229 },
  { city: "Gujranwala, Pakistan", label: "Gujranwala, Punjab, Pakistan", latitude: 32.1877, longitude: 74.1945 },
  { city: "Makkah, Saudi Arabia", label: "Makkah Al-Mukarramah, Saudi Arabia", latitude: 21.3891, longitude: 39.8579 },
  { city: "Madinah, Saudi Arabia", label: "Madinah Al-Munawwarah, Saudi Arabia", latitude: 24.5247, longitude: 39.5692 },
  { city: "Dubai, UAE", label: "Dubai, United Arab Emirates", latitude: 25.2048, longitude: 55.2708 },
  { city: "London, UK", label: "London, United Kingdom", latitude: 51.5074, longitude: -0.1278 },
  { city: "New York, USA", label: "New York, USA", latitude: 40.7128, longitude: -74.006 },
];

const OBLIGATORY_PRAYERS: PrayerName[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

const ALL_PRAYERS: PrayerName[] = [
  "imsak",
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "sunset",
  "maghrib",
  "isha",
  "midnight",
];

const PRAYER_DESCRIPTIONS: Partial<Record<PrayerName, string>> = {
  imsak: "سحری کا اختتام — Stop eating before Fajr",
  fajr: "نمازِ فجر — Dawn prayer before sunrise",
  sunrise: "طلوعِ آفتاب — End of Fajr prayer window",
  dhuhr: "نمازِ ظہر — Noon prayer after zenith",
  asr: "نمازِ عصر — Afternoon prayer before sunset",
  sunset: "غروبِ آفتاب — Sun sets completely below horizon",
  maghrib: "نمازِ مغرب — Post-sunset evening prayer",
  isha: "نمازِ عشاء — Night prayer after twilight ends",
  midnight: "نصف اللیل — Middle of the Islamic night",
};

export default function PrayerTimesPage() {
  const [location, setLocation] = useState<StoredLocation>(DEFAULT_LOCATION);
  const [methodId, setMethodId] = useState("Karachi");
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");
  const [locating, setLocating] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const [audioAlertEnabled, setAudioAlertEnabled] = useState(true);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [activeAdhanNotification, setActiveAdhanNotification] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  // Guard to fire each obligatory prayer's auto-adhan only once per day.
  const lastAutoAdhanRef = useRef("");

  // Hydration safety & Live timer tick
  useEffect(() => {
    setIsMounted(true);
    setNow(new Date());

    const stored = getStoredLocation();
    if (stored) setLocation(stored);

    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const method = METHODS[methodId] ?? METHODS.Karachi ?? METHODS.MWL;

  // Computed prayer timings for current date & location
  const times = useMemo(() => {
    const d = now ?? new Date();
    return getPrayerTimes({
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: -d.getTimezoneOffset() / 60,
      date: d,
      method,
    });
  }, [location, method, now]);

  // Determine current active prayer & next upcoming prayer countdown
  const { currentPrayer, nextPrayer, timeToNext } = useMemo(() => {
    if (!now) {
      return { currentPrayer: "fajr" as PrayerName, nextPrayer: "fajr" as PrayerName, timeToNext: 0 };
    }
    const currentMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    let curr: PrayerName = "isha";
    let nxt: PrayerName = "fajr";
    let diffMins = 0;

    const orderedPrayers: { name: PrayerName; time: number }[] = ALL_PRAYERS.map((p) => ({
      name: p,
      time: times[p],
    })).sort((a, b) => a.time - b.time);

    for (let i = 0; i < orderedPrayers.length; i++) {
      if (currentMins >= orderedPrayers[i].time) {
        curr = orderedPrayers[i].name;
        nxt = orderedPrayers[(i + 1) % orderedPrayers.length].name;
      }
    }

    const nxtObj = orderedPrayers.find((p) => p.name === nxt);
    if (nxtObj) {
      let targetMins = nxtObj.time;
      if (targetMins < currentMins) targetMins += 24 * 60;
      diffMins = targetMins - currentMins;
    }

    return { currentPrayer: curr, nextPrayer: nxt, timeToNext: Math.max(0, diffMins) };
  }, [now, times]);

  // Play / Stop Real Makkah Adhan MP3 Audio cleanly using local served /makkah-adhan.mp3
  const togglePlayAdhan = () => {
    if (isPlayingAdhan && activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0; // reset so replay starts from beginning
      activeAudioRef.current = null;
      setIsPlayingAdhan(false);
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }

    const audio = new Audio("/makkah-adhan.mp3");
    audio.preload = "auto";
    audio.currentTime = 0;
    activeAudioRef.current = audio;

    audio.onended = () => {
      setIsPlayingAdhan(false);
      activeAudioRef.current = null;
    };
    audio.onpause = () => {
      setIsPlayingAdhan(false);
    };
    audio.onerror = () => {
      setIsPlayingAdhan(false);
      activeAudioRef.current = null;
    };

    audio
      .play()
      .then(() => setIsPlayingAdhan(true))
      .catch((err) => {
        console.warn("Audio playback issue handled quietly:", err);
        setIsPlayingAdhan(false);
      });
  };

  const triggerAdhanAlert = (prayerNameStr: string) => {
    setActiveAdhanNotification(`حی على الصلاة — It is now time for ${prayerNameStr} Prayer in ${location.city || location.label}!`);
    togglePlayAdhan();
  };

  // Automatic Adhan trigger the moment an obligatory prayer time is reached.
  // Uses a per-day+prayer guard so it fires exactly once, and a small ±4s
  // detection window so the 1s ticking clock can never skip it silently.
  useEffect(() => {
    if (!isMounted || !now || !audioAlertEnabled) return;
    const currentMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const dateKey = now.toDateString();

    for (const p of OBLIGATORY_PRAYERS) {
      const t = times[p];
      if (typeof t !== "number" || Number.isNaN(t)) continue;
      if (Math.abs(currentMins - t) < 0.07) {
        const key = `${dateKey}|${p}`;
        if (lastAutoAdhanRef.current !== key) {
          lastAutoAdhanRef.current = key;
          triggerAdhanAlert(PRAYER_LABELS[p]);
        }
      }
    }
  }, [now, times, isMounted, audioAlertEnabled]);

  // Format Countdown hh:mm:ss
  const countdownString = useMemo(() => {
    const totalSecs = Math.floor(timeToNext * 60);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
  }, [timeToNext]);

  // Reverse Geocoding to fetch City & Country Name for GPS
  const handleDetectLocation = async () => {
    setLocating(true);
    try {
      const pos = await getCurrentPosition(10000);
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      let cityName = "Your Location, Pakistan";
      let fullLabel = `GPS (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        if (res.ok) {
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.county || data.address?.state || "";
          const country = data.address?.country || "";
          if (city && country) {
            cityName = `${city}, ${country}`;
            fullLabel = `${city}, ${country}`;
          } else if (country) {
            cityName = `GPS Location, ${country}`;
            fullLabel = `GPS Location, ${country}`;
          }
        }
      } catch {
        // fallback
      }

      const newLoc: StoredLocation = {
        latitude: lat,
        longitude: lon,
        label: fullLabel,
        city: cityName,
      };

      setLocation(newLoc);
      saveLocation(newLoc);
      lastAutoAdhanRef.current = "";
    } catch {
      alert("Could not retrieve GPS coordinates. Defaulting to Lahore, Pakistan.");
    } finally {
      setLocating(false);
    }
  };

  const selectCity = (cityObj: StoredLocation) => {
    lastAutoAdhanRef.current = "";
    setLocation(cityObj);
    saveLocation(cityObj);
    setCityQuery("");
  };

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.label.toLowerCase().includes(cityQuery.toLowerCase()) ||
    (c.city && c.city.toLowerCase().includes(cityQuery.toLowerCase()))
  );

  const currentDateObj = now ?? new Date();
  const hijri = getHijriDate(currentDateObj);
  const dateLabel = currentDateObj.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-10">

      {/* ══ LIVE ADHAN NOTIFICATION BANNER (WHEN ACTIVE) ══════════════════════ */}
      {activeAdhanNotification && (
        <div className="sticky top-4 z-50 flex items-center justify-between rounded-3xl border-2 border-[#BFA059] bg-gradient-to-r from-[#121A26] via-[#1A2536] to-[#0A101D] px-6 py-4 text-white shadow-2xl animate-bounce">
          <div className="flex items-center gap-3">
            <Volume2 className="size-6 text-[#BFA059] animate-pulse" />
            <div>
              <p className="text-sm font-black text-[#EAD090]">
                {activeAdhanNotification}
              </p>
              <p className="text-[11px] font-bold text-slate-300">
                Playing Authentic Makkah Al-Mukarramah Adhan Audio
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveAdhanNotification(null);
              if (activeAudioRef.current) {
                activeAudioRef.current.pause();
                activeAudioRef.current = null;
              }
              setIsPlayingAdhan(false);
            }}
            className="flex size-8 items-center justify-center rounded-full border border-[#BFA059] text-[#BFA059] hover:bg-[#BFA059]/20"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* ══ 1. HERO BANNER PANEL (PROMINENT CITY & COUNTRY DISPLAY) ════════════ */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/70 shadow-[0_0_50px_rgba(191,160,89,0.35)] min-h-[390px] flex items-center justify-center text-center text-white py-12 px-4 sm:px-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-banner.jpg"
            alt="Islamic Prayer Times & Location Guidance Banner"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/90 via-black/50 to-[#070D18]/75" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-95" />
        </div>

        {/* Central Content */}
        <div className="relative z-10 mx-auto max-w-3xl w-full space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/80 bg-[#121A26]/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#BFA059] backdrop-blur-md shadow-md">
            <Clock className="size-4 text-[#BFA059]" />
            Accurate Solar Geometry · Islamic Prayer Times
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            اوقاتِ نماز
          </h1>

          {/* Prominent City & Country Name Display */}
          <div className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-[#BFA059] bg-[#0D1117]/90 px-6 py-2.5 text-sm sm:text-base text-[#EAD090] font-extrabold backdrop-blur-md shadow-2xl">
            <MapPin className="size-5 text-[#BFA059] animate-bounce" />
            <span>Active Location:</span>
            <strong className="text-white text-base sm:text-lg underline underline-offset-4 decoration-[#BFA059]">
              {location.city || location.label}
            </strong>
          </div>

          {/* Next Prayer Countdown Widget + Real Adhan Controls */}
          <div className="mx-auto mt-4 max-w-lg rounded-3xl border-2 border-[#BFA059] bg-[#121A26]/95 p-5 backdrop-blur-md shadow-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-extrabold text-[#EAD090] uppercase tracking-wider">
              <span>Next Prayer: <strong className="text-white">{PRAYER_LABELS[nextPrayer]} ({PRAYER_ARABIC[nextPrayer]})</strong></span>
              <span className="text-[#BFA059]">{PRAYER_DESCRIPTIONS[nextPrayer]?.split("—")[0]}</span>
            </div>
            
            <div className="font-mono text-4xl sm:text-5xl font-black text-[#BFA059] tracking-wider drop-shadow-md">
              {isMounted ? countdownString : "00h 00m 00s"}
            </div>

            {/* Banner Real Adhan Controls */}
            <div className="pt-3 border-t border-[#BFA059]/25 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={togglePlayAdhan}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#BFA059] px-5 py-2.5 text-xs font-black text-[#0D1117] shadow-lg transition-all hover:bg-[#D4AF37] hover:scale-105 active:scale-95"
              >
                {isPlayingAdhan ? <Pause className="size-4" /> : <Play className="size-4" />}
                {isPlayingAdhan ? "Stop Adhan Audio" : "🔊 Play Makkah Adhan"}
              </button>

              <button
                type="button"
                onClick={() => setAudioAlertEnabled(!audioAlertEnabled)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all",
                  audioAlertEnabled
                    ? "border-2 border-[#BFA059] bg-[#BFA059]/20 text-[#EAD090] shadow-sm"
                    : "border border-slate-600 bg-slate-800 text-slate-400"
                )}
              >
                {audioAlertEnabled ? <Bell className="size-4 text-[#BFA059]" /> : <BellOff className="size-4" />}
                {audioAlertEnabled ? "Auto-Adhan ON" : "Auto-Adhan OFF"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. LOCATION & METHOD CONTROLS BAR ═════════════════════════════════ */}
      <div className="rounded-3xl border-2 border-[#BFA059]/40 bg-white dark:bg-[#111827] p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Location Selector & GPS Button */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={locating}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#BFA059] px-5 py-2.5 text-xs font-black text-[#0D1117] shadow-md transition-all hover:bg-[#D4AF37] hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {locating ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Navigation className="size-4" />
              )}
              {locating ? "Detecting GPS City & Country…" : "📍 Detect My GPS Location"}
            </button>

            {/* City Dropdown Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#BFA059]" />
              <input
                type="text"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                placeholder="Search city e.g. Lahore, Karachi…"
                className="w-full rounded-2xl border-2 border-[#BFA059]/40 bg-slate-50 dark:bg-[#0D1117] py-2.5 pl-10 pr-4 text-xs font-bold text-[#1A202C] dark:text-[#EAD090] placeholder-slate-400 outline-none transition focus:border-[#BFA059]"
              />
              {cityQuery && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-2xl border-2 border-[#BFA059] bg-[#111827] p-2 shadow-2xl">
                  {filteredCities.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => selectCity(c)}
                      className="w-full rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-200 hover:bg-[#BFA059]/20 transition flex items-center justify-between"
                    >
                      <span>{c.city || c.label}</span>
                      <MapPin className="size-3 text-[#BFA059]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick City Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {POPULAR_CITIES.slice(0, 5).map((c) => {
              const isSelected = location.city === c.city || location.label === c.label;
              return (
                <button
                  key={c.city}
                  type="button"
                  onClick={() => selectCity(c)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-extrabold transition-all active:scale-95",
                    isSelected
                      ? "bg-[#BFA059] text-[#0D1117] shadow-md ring-2 ring-[#BFA059]/50"
                      : "border border-[#BFA059]/30 bg-slate-100 dark:bg-[#1A202C] text-slate-700 dark:text-[#EAD090] hover:bg-[#BFA059]/10"
                  )}
                >
                  {c.city}
                </button>
              );
            })}
          </div>

          {/* 12h / 24h & Method Dropdown */}
          <div className="flex items-center gap-3">
            <select
              value={methodId}
              onChange={(e) => setMethodId(e.target.value)}
              className="rounded-2xl border-2 border-[#BFA059]/40 bg-white dark:bg-[#0D1117] px-3 py-2 text-xs font-bold text-[#1A202C] dark:text-[#EAD090] outline-none"
            >
              {Object.values(METHODS).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className="flex rounded-xl border-2 border-[#BFA059]/40 overflow-hidden text-xs font-bold">
              <button
                type="button"
                onClick={() => setTimeFormat("12h")}
                className={cn(
                  "px-3 py-1.5 transition",
                  timeFormat === "12h" ? "bg-[#BFA059] text-[#0D1117]" : "bg-white dark:bg-[#0D1117] text-slate-500"
                )}
              >
                12H
              </button>
              <button
                type="button"
                onClick={() => setTimeFormat("24h")}
                className={cn(
                  "px-3 py-1.5 transition",
                  timeFormat === "24h" ? "bg-[#BFA059] text-[#0D1117]" : "bg-white dark:bg-[#0D1117] text-slate-500"
                )}
              >
                24H
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ 3. GREGORIAN & HIJRI DATE BAR ═════════════════════════════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-[#BFA059]/30 bg-gradient-to-r from-[#121A26] to-[#1A2536] px-6 py-4 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <CalendarDays className="size-5 text-[#BFA059]" />
          <div>
            <div className="text-sm font-bold text-white">{dateLabel}</div>
            <div className="text-xs text-[#EAD090] font-semibold" dir="rtl">
              {hijri.formattedArabic}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#BFA059]">
          <Globe className="size-4" />
          <span>Calculated for {location.city || location.label}</span>
        </div>
      </div>

      {/* ══ 4. PRAYER TIMINGS GRID CARDS ══════════════════════════════════════ */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_PRAYERS.map((name) => {
          const isObligatory = OBLIGATORY_PRAYERS.includes(name);
          const isCurrent = currentPrayer === name;
          const isNext = nextPrayer === name;
          const minutes = times[name];
          const formatted = isMounted ? formatTime(minutes, timeFormat) : "--:--";
          const desc = PRAYER_DESCRIPTIONS[name];

          return (
            <div
              key={name}
              className={cn(
                "relative flex flex-col justify-between rounded-[2rem] border-2 p-6 sm:p-7 shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden",
                isCurrent
                  ? "border-2 border-[#BFA059] bg-gradient-to-br from-[#121A26] via-[#1A2536] to-[#0A101D] text-white shadow-[0_0_40px_rgba(191,160,89,0.4)] ring-2 ring-[#BFA059]/80"
                  : isNext
                  ? "border-[#BFA059] bg-gradient-to-b from-white to-[#FDFBF7] dark:from-[#111827] dark:to-[#0D1117] text-[#1A202C] dark:text-[#EAD090] shadow-md"
                  : "border-[#BFA059]/30 bg-white dark:bg-[#111827] text-[#1A202C] dark:text-[#F5EDD5]"
              )}
            >
              {/* Top Accent Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl font-arabic text-2xl font-black shadow-md",
                      isObligatory
                        ? "bg-[#BFA059] text-[#0D1117]"
                        : "bg-slate-100 dark:bg-[#1A202C] text-[#BFA059]"
                    )}
                  >
                    {PRAYER_ARABIC[name]}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-extrabold capitalize">
                      {PRAYER_LABELS[name]}
                    </h3>
                    <p className="text-xs font-bold text-[#BFA059]">
                      {isObligatory ? "فرض نماز · Obligatory" : "سنت / مستحب · Sunnah"}
                    </p>
                  </div>
                </div>

                {isCurrent && (
                  <span className="rounded-full bg-[#BFA059] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#0D1117] shadow-md animate-pulse">
                    Active Now
                  </span>
                )}
                {isNext && !isCurrent && (
                  <span className="rounded-full border-2 border-[#BFA059] bg-[#BFA059]/20 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#BFA059]">
                    Next Up
                  </span>
                )}
              </div>

              {/* Big Stylish Time Display */}
              <div className="my-6 text-center">
                <div className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-[#BFA059] drop-shadow-sm">
                  {formatted}
                </div>
                {desc && (
                  <p className="mt-2 text-xs text-[#BFA059] dark:text-slate-300 font-semibold">
                    {desc}
                  </p>
                )}
              </div>

              {/* Card Footer Indicator */}
              <div className="border-t border-[#BFA059]/20 pt-4 flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Islamic Timings</span>
                <span className="font-arabic text-base text-[#BFA059]">{PRAYER_ARABIC[name]}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* ══ 5. DUA AFTER ADHAN BANNER ══════════════════════════════════════════ */}
      <section className="rounded-[2.5rem] border-2 border-[#BFA059]/50 bg-gradient-to-br from-[#121A26] to-[#0D1117] p-8 text-center text-[#EAD090] shadow-2xl space-y-3">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#BFA059]">
          Dua After Adhan · اذان کے بعد کی دعا
        </h3>
        <p dir="rtl" lang="ar" className="font-arabic text-2xl sm:text-3xl font-bold text-[#EAD090] leading-loose max-w-3xl mx-auto">
          اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ
        </p>
        <p className="text-xs sm:text-sm text-slate-300 italic max-w-2xl mx-auto">
          &ldquo;O Allah, Lord of this perfect call and established prayer, grant Muhammad the Intercession and Favor, and raise him to the praised station which You have promised him.&rdquo;
        </p>
      </section>

    </div>
  );
}