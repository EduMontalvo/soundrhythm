import { create } from 'zustand'
import type { Radio } from '../schema/RadiosSchema'
interface RadioStoreState {
    radios: Radio[],
    radiosBackUp: Radio[],
    radioplay: Radio,
    isPlaying: boolean,
    setRadios: (radios: Radio[]) => void
    setBackUp: (radios: Radio[]) => void
    setRadioPlay: (newRadio: Radio) => void
    setPlaying: (playing: boolean) => void
}

export const useRadioStore = create<RadioStoreState>((set, get) => ({
    radios: [],
    radiosBackUp: [],
    radioplay: {} as Radio,
    isPlaying: false,
    setRadios: (radios) => set({ radios: radios }),
    setBackUp: (radios) => set({ radiosBackUp: radios }),
    setRadioPlay: (radio) => set({ radioplay: radio, isPlaying: true }),
    setPlaying: (playing) => set({ isPlaying: playing })
})) 