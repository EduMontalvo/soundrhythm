import axios from "axios"
import { RadiosSchema } from "../schema/RadiosSchema"
import { filterPlayableRadios } from "./FilterRadio"

export const FetchApi = async () => {
    const server = "https://de1.api.radio-browser.info"
    const url = `${server}/json/stations/bycountrycodeexact/PE?hidebroken=true`
    try {
        const { data } = await axios.get(url)

        const result = RadiosSchema.safeParse(data)
        if (result.success) {
            return filterPlayableRadios(result.data)
        }

        console.error("Error de validación del schema:", result.error)
        return []

    } catch (error) {
        console.error("Error al obtener radios:", error)
        return []
    }
}
