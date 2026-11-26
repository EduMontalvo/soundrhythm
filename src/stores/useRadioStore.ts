import { create } from 'zustand'
import type { Radio } from '../schema/RadiosSchema'
import { markStationUnavailable } from '../utils/FilterRadio'

const FAVORITES_STORAGE_KEY = 'soundrhythm:favorite_radios'
const THEME_STORAGE_KEY = 'soundrhythm:theme'

export type ThemeMode = 'light' | 'dark'

const applyThemeClass = (theme: ThemeMode): void => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', theme === 'dark')
}

const loadInitialTheme = (): ThemeMode => {
    if (typeof window === 'undefined') return 'light'
    try {
        const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
        if (stored === 'light' || stored === 'dark') {
            applyThemeClass(stored)
            return stored
        }
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const resolved: ThemeMode = prefersDark ? 'dark' : 'light'
        applyThemeClass(resolved)
        return resolved
    } catch {
        return 'light'
    }
}

const saveTheme = (theme: ThemeMode): void => {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
        // Ignore storage quota or privacy mode errors
    }
}

const loadFavoriteIds = (): string[] => {
    if (typeof window === 'undefined') return []
    try {
        const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed)
            ? parsed.filter((id): id is string => typeof id === 'string')
            : []
    } catch {
        return []
    }
}

const saveFavoriteIds = (ids: string[]): void => {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
    } catch {
        // Ignore storage quota or privacy mode errors
    }
}

interface RadioStoreState {
    radios: Radio[],
    radiosBackUp: Radio[],
    radioplay: Radio,
    isPlaying: boolean,
    volume: number,
    rankingLocal: Radio[],
    favoriteIds: string[],
    theme: ThemeMode,
    setRadios: (radios: Radio[]) => void
    setBackUp: (radios: Radio[]) => void
    setRadioPlay: (newRadio: Radio) => void
    setPlaying: (playing: boolean) => void
    setVolume: (volume: number) => void
    setRankingLocal: (radio: Radio) => void
    toggleFavorite: (stationuuid: string) => void
    toggleTheme: () => void
    removeUnavailableRadio: (stationuuid: string) => void
}

export const useRadioStore = create<RadioStoreState>((set) => ({
    radios: [],
    radiosBackUp: [],
    radioplay: {} as Radio,
    isPlaying: false,
    volume: 0.8,
    rankingLocal: [],
    favoriteIds: loadFavoriteIds(),
    theme: loadInitialTheme(),
    setRadios: (radios) => set({ radios }),
    setBackUp: (radios) => set({ radiosBackUp: radios }),
    setRadioPlay: (radio) => set({ radioplay: radio, isPlaying: true }),
    setPlaying: (playing) => set({ isPlaying: playing }),
    setVolume: (volume) => set({ volume }),
    setRankingLocal: () => set({}),
    toggleFavorite: (stationuuid) => {
        if (!stationuuid) return
        set((state) => {
            const exists = state.favoriteIds.includes(stationuuid)
            const nextFavorites = exists
                ? state.favoriteIds.filter((id) => id !== stationuuid)
                : [stationuuid, ...state.favoriteIds]
            saveFavoriteIds(nextFavorites)
            return { favoriteIds: nextFavorites }
        })
    },
    toggleTheme: () => {
        set((state) => {
            const nextTheme: ThemeMode = state.theme === 'dark' ? 'light' : 'dark'
            applyThemeClass(nextTheme)
            saveTheme(nextTheme)
            return { theme: nextTheme }
        })
    },
    removeUnavailableRadio: (stationuuid) => {
        markStationUnavailable(stationuuid)
        set((state) => {
            const isActive = state.radioplay?.stationuuid === stationuuid
            const hasFavorite = state.favoriteIds.includes(stationuuid)
            const nextFavorites = hasFavorite
                ? state.favoriteIds.filter((id) => id !== stationuuid)
                : state.favoriteIds
            if (hasFavorite) {
                saveFavoriteIds(nextFavorites)
            }
            return {
                radios: state.radios.filter((r) => r.stationuuid !== stationuuid),
                radiosBackUp: state.radiosBackUp.filter((r) => r.stationuuid !== stationuuid),
                favoriteIds: nextFavorites,
                radioplay: isActive ? ({} as Radio) : state.radioplay,
                isPlaying: isActive ? false : state.isPlaying,
            }
        })
    },
}))
