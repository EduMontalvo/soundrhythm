import { AlterImage } from "../data/data";
import { KNOWN_STATION_LOGOS } from "../data/knownRadios";

/**
 * Deterministic fallback image using an index to pick one of the local
 * AlterImage placeholder images. Avoids Math.random() during render.
 */
export const getDeterministicFallback = (index: number): string =>
    AlterImage[index % AlterImage.length]?.image ?? "";

/**
 * Resolves the best available logo for a radio station using a priority chain:
 *   1. Local SVG logo (if station name matches a known station)
 *   2. API-provided favicon (if present and non-empty)
 *   3. Deterministic generic fallback image
 *
 * @param name - Station name (case-insensitive match)
 * @param apiFavicon - favicon URL from the API response (optional)
 * @param fallbackIndex - Index used to pick a deterministic generic image
 */
export const getStationLogo = (
  name: string,
  apiFavicon?: string,
  fallbackIndex = 0
): string => {
  const normalizedName = name.toLowerCase();

  // 1. Try local known logo
  for (const [key, localLogo] of Object.entries(KNOWN_STATION_LOGOS)) {
    if (normalizedName.includes(key)) return localLogo;
  }

  // 2. Try API favicon
  if (apiFavicon?.trim()) return apiFavicon;

  // 3. Generic deterministic fallback
  return getDeterministicFallback(fallbackIndex);
};
