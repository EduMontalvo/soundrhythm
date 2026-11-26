import { Outlet, useLocation } from "react-router-dom";
import MusicPlayer from "../components/MusicPlayer";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";

const Layout = () => {
    const { pathname } = useLocation();
    const isHome = pathname === "/";

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* Cabecera fija en la parte superior: NavBar + SearchBar (solo en Home) */}
            <header className="fixed top-0 left-0 right-0 w-full z-40 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.35)] transition-colors duration-200">
                <NavBar />
                {isHome && <SearchBar />}
            </header>

            {/* Contenido con padding superior e inferior para no solapar los componentes fijos */}
            <main className={`${isHome ? "pt-28" : "pt-16"} pb-28`}>
                <Outlet />
            </main>

            {/* Reproductor fijo en la parte inferior */}
            <MusicPlayer />
        </div>
    );
};

export default Layout;
