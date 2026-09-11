"use client";

import { Calendar, Clock, MapPin, Navigation } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  PRAYER_LABELS,
  type PrayerName,
} from "@/lib/prayerTimes";

const FIVE_PRAYERS: PrayerName[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

/**
 * Return the current time expressed in minutes-since-midnight for Pakistan (UTC+5).
 * Works correctly regardless of the browser's own timezone setting.
 */
function pkMinutesNow(): number {
  const nowUtcMs = Date.now() + new Date().getTimezoneOffset() * 60_000;
  const pkMs = nowUtcMs + 5 * 3_600_000;
  const d = new Date(pkMs);
  return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
}

/**
 * Return a Date object whose .getFullYear/.getMonth/.getDate reflect Pakistan date.
 */
function pkDate(): Date {
  const nowUtcMs = Date.now() + new Date().getTimezoneOffset() * 60_000;
  const pkMs = nowUtcMs + 5 * 3_600_000;
  return new Date(pkMs);
}

function pad2(n: number) {
  return String(Math.floor(n)).padStart(2, "0");
}

export function PrayerWidget() {
  const [mounted, setMounted] = useState(false);
  // Default strictly to DEFAULT_LOCATION on server & initial client render to avoid hydration mismatch
  const [location, setLocation] = useState<StoredLocation>(DEFAULT_LOCATION);
  const [tick, setTick] = useState(0);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredLocation();
    if (stored) {
      setLocation(stored);
    }
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDetectLocation = async () => {
    setDetecting(true);
    try {
      const pos = await getCurrentPosition(8000);
      const newLoc: StoredLocation = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        label: "Your Current Location",
        city: "My Location",
      };
      saveLocation(newLoc);
      setLocation(newLoc);
    } catch {
      // keep default (Lahore, Pakistan)
    } finally {
      setDetecting(false);
    }
  };

  // Prayer times — computed from Pakistan date, using UTC+5 offset
  const today = pkDate();
  const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const times = useMemo(
    () =>
      getPrayerTimes({
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: 5, // Pakistan Standard Time = UTC+5 always
        date: today,
        method: METHODS.Karachi, // UIS Karachi — standard for Pakistan
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.latitude, location.longitude, dateKey]
  );

  // Current time in Pakistan minutes-since-midnight
  const minutesNow = pkMinutesNow();

  const { next, label, secondsLeft } = useMemo(() => {
    const upcoming = FIVE_PRAYERS.find((name) => times[name] > minutesNow);
    if (upcoming) {
      const diffMins = times[upcoming] - minutesNow;
      return {
        next: upcoming as PrayerName,
        label: PRAYER_LABELS[upcoming],
        secondsLeft: Math.max(0, Math.round(diffMins * 60)),
      };
    }
    // After Isha — next Fajr is tomorrow
    const fajrTomorrow = times.fajr + 1440;
    return {
      next: "fajr" as PrayerName,
      label: "Fajr",
      secondsLeft: Math.max(0, Math.round((fajrTomorrow - minutesNow) * 60)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [times, tick]);

  const hrs = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#BFA059]/40 bg-white p-5 shadow-md dark:border-night-800 dark:bg-night-900">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-night-800">
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-[#1A202C] dark:text-gold-100">
          🕌 Prayer Times
        </h2>
        <button
          type="button"
          onClick={handleDetectLocation}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#BFA059]/15 px-3 py-1 text-[11px] font-bold text-[#BFA059] transition-all hover:bg-[#BFA059]/30 active:scale-95"
          title="Click to detect your location"
        >
          {detecting ? (
            <Navigation className="size-3 animate-spin" />
          ) : (
            <MapPin className="size-3" />
          )}
          <span className="max-w-[120px] truncate" suppressHydrationWarning>
            {location.city ?? "Lahore, Pakistan"}
          </span>
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {/* ── Next Prayer Countdown Card ── */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1A202C] to-[#2D3748] p-4 text-white shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#BFA059]">
            <Calendar className="size-3" />
            Next Prayer
          </div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold leading-none text-white">{label}</p>
              <p className="mt-1 text-sm font-semibold text-[#BFA059]" suppressHydrationWarning>
                {formatTime(times[next], "12h")}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Clock className="size-3.5 text-[#BFA059]/70" />
                <span
                  className="font-mono text-base font-bold tracking-wider text-white"
                  suppressHydrationWarning
                >
                  {mounted ? `${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}` : "00:00:00"}
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-slate-300">time remaining</p>
            </div>
          </div>
        </div>

        {/* ── 5 Prayers Grid ── */}
        <div className="grid grid-cols-5 gap-1.5">
          {FIVE_PRAYERS.map((name) => {
            const isNext = name === next;
            return (
              <div
                key={name}
                className={`flex flex-col items-center rounded-xl border py-2 px-1 text-center transition-all ${
                  isNext
                    ? "border-[#BFA059] bg-[#BFA059]/20 shadow-sm"
                    : "border-slate-100 bg-slate-50 dark:border-night-800 dark:bg-night-950"
                }`}
              >
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    isNext ? "text-[#BFA059]" : "text-slate-300"
                  }`}
                >
                  {PRAYER_LABELS[name].slice(0, 3)}
                </span>
                <span
                  className={`mt-0.5 font-mono text-[10px] font-bold ${
                    isNext ? "text-[#1A202C]" : "text-slate-600 dark:text-slate-300"
                  }`}
                  suppressHydrationWarning
                >
                  {formatTime(times[name], "12h")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}