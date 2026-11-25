import { create } from 'zustand'
import type { Radio } from '../schema/RadiosSchema'
interface RadioStoreState {
    radios: Radio[],
    radiosBackUp: Radio[],
    radioplay: Radio,
    isPlaying: boolean,
    volume: number,
    rankingLocal: Radio[],
    setRadios: (radios: Radio[]) => void
    setBackUp: (radios: Radio[]) => void
    setRadioPlay: (newRadio: Radio) => void
    setPlaying: (playing: boolean) => void
    setVolume: (volume: number) => void
    setRankingLocal: (radio: Radio) => void
}

export const useRadioStore = create<RadioStoreState>((set) => ({
    radios: [],
    radiosBackUp: [],
    radioplay: {} as Radio,
    isPlaying: false,
    volume: 0.8,
    rankingLocal: [],
    setRadios: (radios) => set({ radios: radios }),
    setBackUp: (radios) => set({ radiosBackUp: radios }),
    setRadioPlay: (radio) => set({ radioplay: radio, isPlaying: true }),
    setPlaying: (playing) => set({ isPlaying: playing }),
    setVolume: (volume) => set({ volume }),
    setRankingLocal: () => set({
        
        /*  ...get(), rankingLocal: [...get().rankingLocal, radio] */ }),
})) 