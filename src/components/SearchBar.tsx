import { useEffect, useState } from "react"
import { TfiSearch } from "react-icons/tfi"
import { useRadioStore } from "../stores/useRadioStore"

const SearchBar = () => {
    const [textSearch, setTextSearch] = useState('')
    const radiosBackup = useRadioStore((state) => state.radiosBackUp)
    const setRadios = useRadioStore((state) => state.setRadios)

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextSearch(e.target.value)
    }

    useEffect(() => {
        const RadioDebounce = setTimeout(() => {
            if (textSearch.trim() === "") {
                setRadios(radiosBackup)
                return
            }
            const findRadio = radiosBackup.filter(radio =>
                radio.name.toLowerCase().includes(textSearch.toLowerCase().trim())
            )
            setRadios(findRadio)
        }, 100)

        return () => clearTimeout(RadioDebounce)
    }, [textSearch, radiosBackup, setRadios])

    const handleCleanButton = () => {
        setTextSearch("")
        setRadios(radiosBackup)
    }

    return (
        <div className="px-4 pb-3">
            <div className="relative max-w-4xl mx-auto">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">
                    <TfiSearch />
                </span>
                <input
                    onChange={handleChangeInput}
                    value={textSearch}
                    className="w-full pl-11 pr-11 py-3 bg-slate-100/90 dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800/90 border border-transparent dark:border-neutral-800 focus:border-emerald-500/30 dark:focus:border-emerald-500/40 rounded-2xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-neutral-900 text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500"
                    placeholder="Search radio stations or artists"
                    type="text"
                />
                {textSearch && (
                    <button
                        type="button"
                        onClick={handleCleanButton}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200/80 dark:bg-neutral-800 hover:bg-slate-300 dark:hover:bg-neutral-700 text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-100 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90"
                        title="Limpiar búsqueda"
                        aria-label="Limpiar búsqueda"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}

export default SearchBar
