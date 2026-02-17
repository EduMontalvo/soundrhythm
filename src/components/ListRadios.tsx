import { FetchApi } from "../utils/fetchapi";
import { formatName } from "../utils/formatname";
import { useRadioStore } from "../stores/useRadioStore";
import { useEffect, useState } from "react";
import type { Radio } from "../schema/RadiosSchema";
import { FaPlay } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import { AlterImage } from "../data/data";

const ListRadios = () => {

    const updateRadios = useRadioStore((state) => state.setRadios)
    const updateRadioPlay = useRadioStore((state) => state.setRadioPlay)
    const radioList = useRadioStore((state) => state.radios)
    const [imgBackup, setImgBackup] = useState("")

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


        /* const randomIndex = Math.floor(Math.random() * AlterImage.length)
        const pickIMG = AlterImage[randomIndex]?.image
        if (pickIMG) setImgBackup(pickIMG) */

    }, [])

    const handleButtonSelectRadio = (radioselected: Radio) => {
        const findSelectedRadio = radioList.find(radio => radio.stationuuid === radioselected.stationuuid)
        if (findSelectedRadio) {
            updateRadioPlay(findSelectedRadio)
        }
    }


    return (
        <>
            <h2 className="uppercase text-neutral-400 px-4 pt-12 text-xs font-bold">discovery</h2>
            {radioList.map((radio) => (
                <div key={radio.stationuuid}>
                    <div className="flex justify-between items-center p-4">
                        <div className="flex gap-4">
                            {radio.favicon !== ""?
                                (<img src={radio.favicon} alt="" className="w-10" />)
                                :
                                (radio.favicon === null ?
                                    <img src={imgBackup} alt="" className="w-10" />
                                    :
                                    <img src={imgBackup} alt="" className="w-10" />
                                )
                            }
                            <div className="flex flex-col space-y-1" >
                                <h2 className="capitalize text-xl font-semibold">{formatName(radio.name)}</h2>
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                    <SlLike />
                                    <p>{radio.votes} Ranking Votes</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleButtonSelectRadio(radio)} className="border rounded-full p-3 flex items-center justify-center cursor-pointer">
                            <FaPlay className="h-3 w-3 text-emerald-500" />
                        </button>
                    </div>
                </div>
            ))}
        </>
    )
}

export default ListRadios