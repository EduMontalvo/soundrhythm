import { create } from 'zustand'
import type { Radio } from '../schema/RadiosSchema'
interface RadioStoreState {
    radios: Radio[],
    radioplay: Radio
    setRadios: (radios : Radio[]) => void
    setRadioPlay: (newRadio : Radio) => void
}

export const useRadioStore = create<RadioStoreState>( (set,get) => ({
    radios: [],
    radioplay: {} as Radio,
    setRadios: (radios) => set({radios: radios }),
    setRadioPlay: (radio) =>set({radioplay : radio}) 
})) 