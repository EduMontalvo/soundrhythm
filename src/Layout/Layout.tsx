import { Outlet } from "react-router-dom"
import NavBar from "../components/NavBar"
import SearchBar from "../components/SearchBar"
import MusicPlayer from "../components/MusicPlayer"

const Layout = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Cabecera fija en la parte superior: NavBar + SearchBar */}
            <header className="fixed top-0 left-0 right-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                <NavBar />
                <SearchBar />
            </header>

            {/* Contenido con padding superior e inferior para no solapar los componentes fijos */}
            <main className="pt-28 pb-28">
                <Outlet />
            </main>

            {/* Reproductor fijo en la parte inferior */}
            <MusicPlayer />
        </div>
    )
}

export default Layout
