import { create } from 'zustand'
import type { Radio } from '../schema/RadiosSchema'
interface RadioStoreState {
    radios: Radio[],
    setRadios: (radios : Radio[]) => void
}

export const useRadioStore = create<RadioStoreState>( (set,get) => ({
    radios: [],
    setRadios: (radios) => set({radios: radios })
})) 