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
    const updateRadiosBackUp = useRadioStore( (state) => state.setBackUp) 

    useEffect(() => {
        const fetchRadios = async () => {
            try {
                const resultRadios = await FetchApi()
                updateRadios(resultRadios)
                updateRadiosBackUp(resultRadios)
            } catch (error) {
                console.log('Error desde la api', error)
            }
        }
        fetchRadios()
    }, [])

    const handleButtonSelectRadio = (radioselected: Radio) => {
        const findSelectedRadio = radioList.find(radio => radio.stationuuid === radioselected.stationuuid)
        if (findSelectedRadio) {
            updateRadioPlay(findSelectedRadio)
        }
    }

    const getRandomFallbackImage = () => {
        const randomIndex = Math.floor(Math.random() * AlterImage.length)
        return AlterImage[randomIndex]?.image ?? ""
    }

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = getRandomFallbackImage()
    }

    return (
        <>
            <h2 className="uppercase text-neutral-400 px-4 pt-12 text-xs font-bold">discovery</h2>
            {radioList.map((radio) => (
                <div key={radio.stationuuid} className="p-2">
                    <div className="flex justify-between items-center py-4 px-3 bg-gray-400/5 rounded-3xl">
                        <div className="flex gap-4">
                            <img
                                src={radio.favicon || getRandomFallbackImage()}
                                alt={radio.name}
                                className="w-14 h-14 object-cover rounded-2xl"
                                onError={handleImageError}
                            />
                            <div className="flex flex-col space-y-1" >
                                <h2 className="capitalize text-xl font-semibold">{formatName(radio.name)}</h2>
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                    <SlLike />
                                    <p>{radio.votes} Ranking Votes</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleButtonSelectRadio(radio)} className="border rounded-full p-3 flex items-center justify-center cursor-pointer">
                            <FaPlay className="h-5 w-5 text-emerald-500" />
                        </button>
                    </div>
                </div>
            ))}
        </>
    )
}

export default ListRadios