import { create } from 'zustand'
import type { Radio } from '../schema/RadiosSchema'
interface RadioStoreState {
    radios: Radio[],
    radioplay: Radio,
    isPlaying: boolean,
    setRadios: (radios : Radio[]) => void
    setRadioPlay: (newRadio : Radio) => void
    setPlaying: (playing : boolean) => void
}

export const useRadioStore = create<RadioStoreState>( (set,get) => ({
    radios: [],
    radioplay: {} as Radio,
    isPlaying:false,
    setRadios: (radios) => set({radios: radios }),
    setRadioPlay: (radio) =>set({radioplay : radio,isPlaying : true}),
    setPlaying: (playing) => set({isPlaying : playing})
})) 