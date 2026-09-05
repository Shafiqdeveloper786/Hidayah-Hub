/**
 * Qibla (direction to the Kaaba) calculation.
 *
 * Uses the great-circle initial bearing between the observer's coordinates
 * and the Kaaba in Makkah (21.4225° N, 39.8262° E).
 */

export const KAABA_COORDS = { lat: 21.4225, lng: 39.8262 } as const;

const dtr = (d: number) => (d * Math.PI) / 180;
const rtd = (r: number) => (r * 180) / Math.PI;

/** Great-circle bearing from a location to the Kaaba, in degrees [0, 360). */
export function getQiblaBearing(latitude: number, longitude: number): number {
  const phiK = dtr(KAABA_COORDS.lat);
  const phi = dtr(latitude);
  const dLon = dtr(KAABA_COORDS.lng - longitude);
  const y = Math.sin(dLon);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(dLon);
  const bearing = (rtd(Math.atan2(y, x)) + 360) % 360;
  return bearing;
}

/** Great-circle distance from a location to the Kaaba, in kilometres. */
export function getQiblaDistanceKm(latitude: number, longitude: number): number {
  const R = 6371; // Earth's mean radius (km)
  const dLat = dtr(KAABA_COORDS.lat - latitude);
  const dLon = dtr(KAABA_COORDS.lng - longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(dtr(latitude)) *
      Math.cos(dtr(KAABA_COORDS.lat)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/** Convert a compass bearing to a human-readable cardinal direction. */
export function bearingToCompass(bearing: number): string {
  const directions = [
    "North",
    "North-East",
    "East",
    "South-East",
    "South",
    "South-West",
    "West",
    "North-West",
  ];
  const index = Math.round(((bearing % 360) + 360) % 360 / 45) % 8;
  return directions[index];
}