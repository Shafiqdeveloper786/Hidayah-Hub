"use client";

import { AlarmClock, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_METHOD,
  getPrayerTimes,
  formatTime,
  PRAYER_LABELS,
  PRAYER_ARABIC,
  type PrayerName,
} from "@/lib/prayerTimes";
import {
  getStoredLocation,
  DEFAULT_LOCATION,
} from "@/lib/location";
import { getHijriDate } from "@/lib/hijri";
import { cn } from "@/lib/utils";

const FIVE_PRAYERS: PrayerName[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

function minutesOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

export function NextPrayerCard() {
  const location = useMemo(() => getStoredLocation() ?? DEFAULT_LOCATION, []);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tz = -now.getTimezoneOffset() / 60;
  const times = useMemo(
    () =>
      getPrayerTimes({
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: tz,
        date: now,
        method: DEFAULT_METHOD,
      }),
    [location.latitude, location.longitude, tz, now.getDate(), now.getMonth(), now.getFullYear()]
  );

  const hijri = useMemo(() => getHijriDate(now), [now.getDate(), now.getMonth(), now.getFullYear()]);

  const minutesNow = minutesOfDay(now);

  const { next, secondsRemaining } = useMemo(() => {
    const upcoming = FIVE_PRAYERS.find((name) => times[name] > minutesNow);
    if (upcoming) {
      const diffMinutes = times[upcoming] - minutesNow;
      return { next: upcoming, secondsRemaining: Math.round(diffMinutes * 60) };
    }
    // After Isha — next is tomorrow's Fajr
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = getPrayerTimes({
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: tz,
      date: tomorrow,
      method: DEFAULT_METHOD,
    });
    const diffMinutes = 24 * 60 - minutesNow + tomorrowTimes.fajr;
    return { next: "fajr" as const, secondsRemaining: Math.round(diffMinutes * 60) };
  }, [times, minutesNow, now, location.latitude, location.longitude, tz]);

  const clamp0 = Math.max(secondsRemaining, 0);
  const hours = Math.floor(clamp0 / 3600);
  const min = Math.floor((clamp0 % 3600) / 60);
  const sec = clamp0 % 60;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand-200/70 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 text-white shadow-xl shadow-brand-900/20 dark:border-brand-700 dark:from-night-800 dark:via-brand-950 dark:to-night-950">
      <div className="absolute inset-0 pattern-arch opacity-60" aria-hidden />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-brand-100">
              <MapPin className="size-3.5" /> {location.city ?? "Your location"}
            </p>
            <p className="mt-1 text-sm text-brand-100/90">{hijri.formatted}</p>
          </div>
          <AlarmClock className="size-6 text-gold-300" aria-hidden />
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-200">
              Next Prayer
            </p>
            <h3 className="mt-1 block font-serif text-2xl font-semibold">
              {PRAYER_LABELS[next]}
              <span className="ml-2 align-middle font-arabic text-lg text-brand-100">
                {PRAYER_ARABIC[next]}
              </span>
            </h3>
          </div>
          <div className="text-right">
            <div className="font-mono text-3xl font-bold tabular-nums">
              {String(hours).padStart(2, "0")}
              <span className="text-gold-300">:</span>
              {String(min).padStart(2, "0")}
              <span className="text-gold-300">:</span>
              {String(sec).padStart(2, "0")}
            </div>
            <p className="text-[11px] uppercase tracking-wider text-brand-100/80">
              until {formatTime(times[next])}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-5 gap-1.5">
          {FIVE_PRAYERS.map((name) => (
            <div
              key={name}
              className={cn(
                "rounded-xl border px-1 py-2 text-center transition-colors",
                name === next
                  ? "border-gold-300/70 bg-gold-400/15"
                  : "border-white/15 bg-white/5"
              )}
            >
              <p className="font-arabic text-sm text-brand-100">{PRAYER_ARABIC[name]}</p>
              <p className="font-mono text-xs tabular-nums text-white">{formatTime(times[name], "24h")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}