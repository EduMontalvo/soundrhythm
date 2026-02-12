 "react";
import { IoPlayCircle } from "react-icons/io5";
import { FetchApi } from "../utils/fetchapi";
import { formatName } from "../utils/formatname";
import { useRadioStore } from "../stores/useRadioStore";
import { useEffect } from "react";
import type { Radio } from "../schema/RadiosSchema";

const ListRadios = () => {

    const updateRadios = useRadioStore((state) => state.setRadios)
    const updateRadioPlay = useRadioStore((state) => state.setRadioPlay)
    const radioList = useRadioStore((state) => state.radios)


    useEffect(() => {
        const fetchRadios = async () => {
            try {
                const resultRadios = await FetchApi()
                updateRadios(resultRadios)
            } catch (error) {
                console.log('Devolvio error desde la api', error)
            }
        }
        fetchRadios()
    }, [])

    const handleButtonSelectRadio = (radioselected : Radio) => {
        const findSelectedRadio = radioList.find(radio => radio.stationuuid === radioselected.stationuuid )
        if(findSelectedRadio){
            updateRadioPlay(findSelectedRadio)
        }
    }

    return (
        <>
            <h2 className="uppercase text-neutral-400 px-4 pt-12 text-xs">discovery</h2>
            {radioList.map((radio) => (
                <div key={radio.stationuuid}>
                    <div className="flex justify-between items-center p-4 focus:shadow-2xl focus:border-amber-400 focus:border h-[80%] w-[90%] mx-auto">
                        <div className="flex flex-col space-y-1" >
                            <h2 className="capitalize text-xl">{formatName(radio.name)}</h2>
                            <p>Ranking Votes: {radio.votes}</p>
                        </div>
                        <button onClick={() => handleButtonSelectRadio(radio)}>
                            <IoPlayCircle className="h-12 w-12 text-green-700/60" />
                        </button>
                    </div>
                </div>
            ))}
        </>
    )
}

export default ListRadios