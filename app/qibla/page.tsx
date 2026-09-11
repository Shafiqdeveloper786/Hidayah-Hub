"use client";

import {
  CheckCircle,
  Compass,
  Globe2,
  Info,
  LocateFixed,
  MapPin,
  Navigation,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  bearingToCompass,
  getQiblaBearing,
  getQiblaDistanceKm,
} from "@/lib/qibla";
import { DEFAULT_LOCATION } from "@/lib/location";
import { cn } from "@/lib/utils";

const POPULAR_CITIES = [
  { name: "Lahore, Pakistan", lat: 31.5204, lng: 74.3587 },
  { name: "Karachi, Pakistan", lat: 24.8607, lng: 67.0011 },
  { name: "Islamabad, Pakistan", lat: 33.6844, lng: 73.0479 },
  { name: "Rawalpindi, Pakistan", lat: 33.5651, lng: 73.0169 },
  { name: "Peshawar, Pakistan", lat: 34.0151, lng: 71.5249 },
  { name: "Quetta, Pakistan", lat: 30.1798, lng: 66.975 },
  { name: "Faisalabad, Pakistan", lat: 31.4504, lng: 73.135 },
  { name: "Multan, Pakistan", lat: 30.1575, lng: 71.5249 },
  { name: "Mecca, Saudi Arabia", lat: 21.3891, lng: 39.8579 },
  { name: "Medina, Saudi Arabia", lat: 24.5247, lng: 39.5692 },
  { name: "Dubai, United Arab Emirates", lat: 25.2048, lng: 55.2708 },
  { name: "London, United Kingdom", lat: 51.5074, lng: -0.1278 },
  { name: "New York, USA", lat: 40.7128, lng: -74.006 },
  { name: "Istanbul, Turkey", lat: 41.0082, lng: 28.9784 },
  { name: "Kuala Lumpur, Malaysia", lat: 3.139, lng: 101.6869 },
];

export default function QiblaPage() {
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  }>({
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
    city: "Lahore",
    country: "Pakistan",
  });

  const [locating, setLocating] = useState(false);
  const [status, setStatus] = useState<string>(
    "Default location set to Lahore, Pakistan. Click 'Detect My GPS Location' for exact Qibla direction."
  );
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [hasCompassSensor, setHasCompassSensor] = useState(false);

  // Compute bearing & distance
  const bearing = useMemo(
    () => getQiblaBearing(coords.latitude, coords.longitude),
    [coords]
  );
  const distance = useMemo(
    () => getQiblaDistanceKm(coords.latitude, coords.longitude),
    [coords]
  );
  const directionStr = useMemo(() => bearingToCompass(bearing), [bearing]);

  // Device orientation compass support
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // @ts-ignore iOS webkitCompassHeading
      const compassHeading = e.webkitCompassHeading || (e.alpha ? 360 - e.alpha : null);
      if (compassHeading !== null && compassHeading !== undefined) {
        setDeviceHeading(Math.round(compassHeading));
        setHasCompassSensor(true);
      }
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
        window.removeEventListener("deviceorientation", handleOrientation, true);
      }
    };
  }, []);

  const requestCompassPermission = async () => {
    if (
      typeof window !== "undefined" &&
      // @ts-ignore iOS requestPermission
      typeof DeviceOrientationEvent !== "undefined" &&
      // @ts-ignore iOS requestPermission
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        // @ts-ignore iOS requestPermission
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === "granted") {
          setHasCompassSensor(true);
          setStatus("Live compass sensor permission granted.");
        } else {
          setStatus("Compass sensor permission was denied.");
        }
      } catch {
        setStatus("Compass sensor is active.");
      }
    }
  };

  // Geolocation trigger
  const locateUser = async () => {
    setLocating(true);
    setStatus("Accessing device GPS coordinates…");
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!("geolocation" in navigator)) {
          reject(new Error("Geolocation is not supported by your browser."));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = pos.coords;
      setStatus("Resolving city and country name…");

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.suburb ||
          "Current Location";
        const country = data.address?.country || "";

        setCoords({ latitude, longitude, city, country });
        setStatus(`Qibla calculated accurately for ${city}${country ? `, ${country}` : ""}.`);
      } catch {
        setCoords({
          latitude,
          longitude,
          city: "GPS Location",
          country: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
        });
        setStatus("Qibla calculated using exact GPS coordinates.");
      }
    } catch (err) {
      setStatus(
        err instanceof Error
          ? err.message
          : "Unable to retrieve GPS location. Showing Lahore, Pakistan fallback."
      );
    } finally {
      setLocating(false);
    }
  };

  const handleCitySelect = (cityName: string) => {
    const found = POPULAR_CITIES.find((c) => c.name === cityName);
    if (found) {
      const [cityPart, countryPart] = found.name.split(", ");
      setCoords({
        latitude: found.lat,
        longitude: found.lng,
        city: cityPart,
        country: countryPart || "",
      });
      setStatus(`Qibla recalculated for ${found.name}.`);
    }
  };

  // Dial angle calculation: if device sensor available, show relative angle
  const dialRotation = deviceHeading !== null ? (bearing - deviceHeading + 360) % 360 : bearing;

  // Turn calculation for user
  const turnAngle = deviceHeading !== null ? Math.round((bearing - deviceHeading + 360) % 360) : null;
  const isAligned = turnAngle !== null && (turnAngle <= 5 || turnAngle >= 355);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Luxury Hero Banner matching /ai-search */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/70 shadow-[0_0_50px_rgba(191,160,89,0.35)] min-h-[320px] flex items-center justify-center text-center text-white py-10 px-4 sm:px-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-banner.jpg"
            alt="Qibla Finder Banner"
            fill sizes="100vw" quality={75}
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/80 via-black/40 to-[#070D18]/70" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-95" />
        </div>

        <div className="relative z-10 p-4 sm:p-8 text-center text-white space-y-5 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/80 bg-[#121A26]/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#BFA059] backdrop-blur-md shadow-md">
            <Navigation className="size-4 text-[#BFA059]" />
            Great-Circle Bearing to Makkah
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            Interactive <span className="text-[#D1B876]">Qibla</span> Finder
          </h1>

          <p className="text-xs sm:text-base text-[#EAD090] font-semibold max-w-2xl mx-auto leading-relaxed">
            Find the exact direction of the Holy Kaaba in Makkah al-Mukarramah (21.4225° N, 39.8262° E) from anywhere in the world using precise spherical trigonometry &amp; device compass sensors.
          </p>

          {/* Quick Location Badge */}
          <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#BFA059]/40 bg-black/60 px-5 py-2.5 backdrop-blur-md text-xs font-semibold text-[#D1B876] shadow-lg">
            <MapPin className="size-4 text-[#BFA059]" />
            <span>Active Location: {coords.city}{coords.country ? `, ${coords.country}` : ""}</span>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Interactive Compass Dial (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center rounded-[2.5rem] border border-[#BFA059]/40 bg-gradient-to-b from-[#FAF7F0] to-[#F5EFE0] p-8 shadow-xl dark:border-night-800 dark:from-night-900 dark:to-night-950 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between w-full mb-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#BFA059]/15 border border-[#BFA059]/30 px-3 py-1 text-[11px] font-bold text-[#8C6F2D] dark:text-[#D1B876]">
              <Compass className="size-3.5" />
              {hasCompassSensor ? `Live Phone Sensor: ${deviceHeading}°` : "Static Compass Bearing"}
            </div>

            <button
              type="button"
              onClick={requestCompassPermission}
              className="text-[11px] font-bold text-[#BFA059] underline hover:text-black dark:hover:text-white"
            >
              Calibrate Phone Compass
            </button>
          </div>

          {/* Alignment Alert Banner */}
          {turnAngle !== null && (
            <div
              className={cn(
                "mb-4 w-full rounded-2xl p-3 text-center text-xs font-bold transition-all border",
                isAligned
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-800 dark:text-emerald-300"
                  : "bg-amber-500/20 border-amber-500/50 text-amber-900 dark:text-amber-200"
              )}
            >
              {isAligned
                ? "✓ Perfect! Your phone is pointing directly towards the Holy Qibla!"
                : `Rotate your phone ${turnAngle > 180 ? 360 - turnAngle : turnAngle}° ${
                    turnAngle > 180 ? "counter-clockwise ↺" : "clockwise ↻"
                  } to align with Qibla.`}
            </div>
          )}

          {/* Compass Dial Graphic */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Outer Decorative Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#BFA059]/30 animate-spin-slow" />

            <svg viewBox="0 0 240 240" className="h-72 w-72 sm:h-80 sm:w-80 shadow-2xl rounded-full">
              {/* Background Circle */}
              <circle cx="120" cy="120" r="110" fill="#1A202C" stroke="#BFA059" strokeWidth="3" />
              <circle cx="120" cy="120" r="102" fill="#0F141C" />

              {/* Ticks */}
              {Array.from({ length: 72 }).map((_, i) => (
                <line
                  key={i}
                  x1="120"
                  y1="22"
                  x2="120"
                  y2={i % 6 === 0 ? "34" : i % 3 === 0 ? "28" : "25"}
                  stroke={i % 6 === 0 ? "#D1B876" : "#4A5568"}
                  strokeWidth={i % 6 === 0 ? 2.5 : 1}
                  transform={`rotate(${i * 5} 120 120)`}
                />
              ))}

              {/* Cardinal Labels */}
              {[
                { label: "N", x: 120, y: 52, color: "#D1B876" },
                { label: "E", x: 188, y: 126, color: "#9AE6B4" },
                { label: "S", x: 120, y: 198, color: "#E2E8F0" },
                { label: "W", x: 52, y: 126, color: "#9AE6B4" },
              ].map((t) => (
                <text
                  key={t.label}
                  x={t.x}
                  y={t.y}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="800"
                  fill={t.color}
                >
                  {t.label}
                </text>
              ))}

              {/* Qibla Needle Pointer */}
              <g transform={`rotate(${dialRotation} 120 120)`} className="transition-transform duration-500 ease-out">
                {/* Gold Qibla Needle pointing UP towards Kaaba */}
                <polygon points="120,38 112,120 128,120" fill="url(#goldGradient)" />
                <polygon points="120,202 112,120 128,120" fill="#2D3748" />

                {/* Kaaba Symbol Icon at tip */}
                <rect x="114" y="26" width="12" height="12" fill="#D1B876" rx="2" stroke="#FFFFFF" strokeWidth="1" />
              </g>

              {/* Gradients */}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F6E05E" />
                  <stop offset="100%" stopColor="#BFA059" />
                </linearGradient>
              </defs>

              {/* Center Pivot */}
              <circle cx="120" cy="120" r="8" fill="#BFA059" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="120" cy="120" r="3" fill="#1A202C" />
            </svg>
          </div>

          {/* Angle Display below compass */}
          <div className="mt-4 text-center space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-[#BFA059]">
              Qibla Bearing
            </p>
            <p className="font-mono text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-gold-100">
              {bearing.toFixed(1)}°
            </p>
            <p className="text-sm font-semibold text-[#8C6F2D] dark:text-[#D1B876]">
              {directionStr} Direction
            </p>
          </div>
        </div>

        {/* Right Column: Controls, Location & Guidance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Action Card: Location & GPS */}
          <div className="rounded-[2rem] border border-[#BFA059]/40 bg-white p-6 shadow-lg dark:bg-night-900 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-gold-100 flex items-center gap-2">
                <Globe2 className="size-5 text-[#BFA059]" />
                Location &amp; Coordinates
              </h2>
              <span className="text-xs font-semibold text-slate-300">
                GPS Precision
              </span>
            </div>

            {/* GPS Detection Button */}
            <button
              type="button"
              onClick={() => void locateUser()}
              disabled={locating}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#BFA059] to-[#8C6F2D] px-6 py-3.5 text-sm font-bold text-black shadow-lg transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              <LocateFixed className={cn("size-4", locating && "animate-spin")} />
              <span>{locating ? "Detecting Location..." : "Detect My Live GPS Location"}</span>
            </button>

            {/* City Dropdown Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Or Select a Major City:
              </label>
              <select
                onChange={(e) => handleCitySelect(e.target.value)}
                defaultValue="Lahore, Pakistan"
                className="w-full rounded-xl border border-[#BFA059]/40 bg-[#FAF7F0] p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#BFA059] dark:bg-night-950 dark:text-slate-200"
              >
                {POPULAR_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Status Message */}
            <div className="flex items-start gap-2.5 rounded-xl bg-[#BFA059]/10 p-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300 border border-[#BFA059]/30">
              <Info className="size-4 shrink-0 text-[#BFA059] mt-0.5" />
              <span>{status}</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#BFA059]/30 bg-white p-4 shadow-md dark:bg-night-900 text-center space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Distance to Kaaba
              </p>
              <p className="font-mono text-2xl font-bold text-[#8C6F2D] dark:text-gold-200">
                {distance.toLocaleString("en-US")} km
              </p>
              <p className="text-[11px] text-slate-500">Great-Circle Route</p>
            </div>

            <div className="rounded-2xl border border-[#BFA059]/30 bg-white p-4 shadow-md dark:bg-night-900 text-center space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Kaaba Target
              </p>
              <p className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200">
                21.42° N, 39.82° E
              </p>
              <p className="text-[11px] text-slate-500">Makkah al-Mukarramah</p>
            </div>
          </div>

          {/* How to Align Prayer Mat Card without AI icon */}
          <div className="rounded-[2rem] border border-[#BFA059]/40 bg-gradient-to-b from-[#FAF7F0] to-[#F5EFE0] p-6 shadow-lg dark:border-night-800 dark:from-night-900 dark:to-night-950 space-y-3">
            <h3 className="font-serif text-base font-bold text-slate-900 dark:text-gold-100 flex items-center gap-2">
              <CheckCircle className="size-4 text-[#BFA059]" />
              How to Align Your Prayer Mat
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#BFA059] text-[10px] font-bold text-black">
                  1
                </span>
                <span>Place your device flat on a non-metallic, level surface.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#BFA059] text-[10px] font-bold text-black">
                  2
                </span>
                <span>
                  Rotate yourself until the golden Kaaba needle points to{" "}
                  <strong>{bearing.toFixed(1)}° ({directionStr})</strong> on your compass dial.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#BFA059] text-[10px] font-bold text-black">
                  3
                </span>
                <span>Position your prayer rug directly facing this direction for Salah.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}