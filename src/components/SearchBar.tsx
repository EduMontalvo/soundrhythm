import { useEffect, useState } from "react"
import { TfiSearch } from "react-icons/tfi"
import { useRadioStore } from "../stores/useRadioStore"

const SearchBar = () => {

    const [textSearch, setTextSearch] = useState('')
    const radiosBackup = useRadioStore((state) => state.radiosBackUp)
    const setRadios = useRadioStore((state) => state.setRadios)

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setTextSearch(e.target.value)

    }
    useEffect(() => {
        const RadioDebounce = setTimeout(() => {
            lookForChances()
        }, 100);
        return () => clearTimeout(RadioDebounce)
    }, [textSearch])

    const lookForChances = () => {
        /* const findRadio = radiosBackup.filter(radio => radio.name.toLowerCase().trim().includes(textSearch.toLowerCase().trim()))
        if (findRadio.length === 0 || textSearch === "") {
            setRadios(radiosBackup)
        } else {
            setRadios(findRadio)
        } */
       if(textSearch.trim() === ""){
        setRadios(radiosBackup)
        return
       }

       const findRadio = radiosBackup.filter(radio => radio.name.toLowerCase().includes(textSearch.toLowerCase().trim()))
       setRadios(findRadio)

    }
    const handleCleanButton = () => {
        setTextSearch("")
        setRadios(radiosBackup)
    }

    return (
        <div className="px-4 my-4 relative">
            <span className=" absolute left-8 top-1/2 -translate-y-1/2 text-slate-400">
                <TfiSearch />
            </span>
            <input onChange={handleChangeInput} value={textSearch} className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl text-sm transition-all focus:outline-none" placeholder="Search radio stations or artists" type="text" />
            {
                textSearch &&
                    <button className="absolute right-6 top-1 font-bold text-gray-400 p-2" onClick={handleCleanButton}>x</button>
            }
        </div>
    )
}

export default SearchBar