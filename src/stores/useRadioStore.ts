import { create } from 'zustand'
import type { Radio } from '../schema/RadiosSchema'
interface RadioStoreState {
    radios: Radio[],
    radioplay: Radio
    setRadios: (radios : Radio[]) => void
}

export const useRadioStore = create<RadioStoreState>( (set,get) => ({
    radios: [],
    radioplay: {} as Radio,
    setRadios: (radios) => set({radios: radios })
    /* Falta definir la funcion que actualizara radioplay  y asi pueda verlo desde el componente MusicPlayer */
})) 