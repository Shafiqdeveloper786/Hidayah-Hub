/**
 * Client-side persistence helpers for the user's chosen prayer-time location.
 * Stored in localStorage so the whole app can share one "home city".
 */

export interface StoredLocation {
  latitude: number;
  longitude: number;
  label: string;
  /** Optional short city name for the UI */
  city?: string;
}

const STORAGE_KEY = "hidayah-hub:location-v1";

export function getStoredLocation(): StoredLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredLocation;
    if (
      typeof parsed.latitude !== "number" ||
      typeof parsed.longitude !== "number" ||
      !parsed.label
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveLocation(location: StoredLocation) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch {
    /* storage unavailable — ignore */
  }
}

/** Default location shown before the user grants permission: Lahore, Pakistan. */
export const DEFAULT_LOCATION: StoredLocation = {
  latitude: 31.5497,
  longitude: 74.3436,
  label: "Lahore, Punjab, Pakistan",
  city: "Lahore, Pakistan",
};

/** Geolocation promise wrapper that resolves coordinates or throws. */
export function getCurrentPosition(
  timeoutMs = 8000
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: timeoutMs,
      maximumAge: 60_000,
    });
  });
}