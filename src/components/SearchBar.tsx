import { TfiSearch } from "react-icons/tfi"

const SearchBar = () => {
    return (
        <div className="px-4 my-4 relative">
            <span className="material-symbols-rounded absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                <TfiSearch />
            </span>
            <input className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400" placeholder="Search radio stations or artists" type="text" />
        </div>
    )
}

export default SearchBar