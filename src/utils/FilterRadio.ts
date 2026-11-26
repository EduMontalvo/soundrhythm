import type { Radio } from "../schema/RadiosSchema";

const UNAVAILABLE_STORAGE_KEY = "soundrhythm:unavailable_radios";

export const getUnavailableStationIds = (): Set<string> => {
    if (typeof window === "undefined") return new Set();
    try {
        const raw = window.localStorage.getItem(UNAVAILABLE_STORAGE_KEY);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed)
            ? new Set(parsed.filter((id): id is string => typeof id === "string"))
            : new Set();
    } catch {
        return new Set();
    }
};

export const markStationUnavailable = (stationuuid: string): void => {
    if (!stationuuid || typeof window === "undefined") return;
    if (typeof navigator !== "undefined" && !navigator.onLine) return;

    try {
        const ids = getUnavailableStationIds();
        if (ids.has(stationuuid)) return;
        ids.add(stationuuid);
        window.localStorage.setItem(UNAVAILABLE_STORAGE_KEY, JSON.stringify(Array.from(ids)));
    } catch {
        // Ignore storage quota or privacy mode errors
    }
};

export const isPlayableRadio = (
    radio: Radio,
    unavailableIds: Set<string> = getUnavailableStationIds()
): boolean => {
    if (!radio.stationuuid || unavailableIds.has(radio.stationuuid)) return false;
    if (radio.lastcheckok === 0) return false;

    const url = radio.url_resolved?.trim() ?? "";
    if (!/^https?:\/\//i.test(url)) return false;

    // Native HTML5 <audio> cannot play HLS (.m3u8) streams in most desktop browsers without hls.js
    if (radio.hls === 1 || /\.m3u8(\?|$)/i.test(url)) return false;

    // Browsers block HTTP audio streams on HTTPS pages (Mixed Content)
    if (
        typeof window !== "undefined" &&
        window.location.protocol === "https:" &&
        url.startsWith("http://")
    ) {
        return false;
    }

    return true;
};

export const filterPlayableRadios = (radios: Radio[]): Radio[] => {
    const unavailableIds = getUnavailableStationIds();
    const seenIds = new Set<string>();
    const seenUrls = new Set<string>();

    return radios.filter((radio) => {
        if (!isPlayableRadio(radio, unavailableIds)) return false;
        const normalizedUrl = radio.url_resolved.trim();
        if (seenIds.has(radio.stationuuid) || seenUrls.has(normalizedUrl)) {
            return false;
        }
        seenIds.add(radio.stationuuid);
        seenUrls.add(normalizedUrl);
        return true;
    });
};
