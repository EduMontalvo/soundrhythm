import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useRadioStore } from "../stores/useRadioStore";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About", end: false },
  { to: "/contact", label: "Contact", end: false },
];

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useRadioStore((state) => state.theme);
  const toggleTheme = useRadioStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className="p-2 rounded-xl text-slate-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100/80 dark:hover:bg-neutral-900 transition-colors cursor-pointer active:scale-95"
    >
      {isDark ? (
        <IoSunnyOutline className="w-5 h-5 text-amber-400" />
      ) : (
        <IoMoonOutline className="w-5 h-5" />
      )}
    </button>
  );

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center font-bold tracking-tight">
          <span className="text-xl text-slate-800 dark:text-slate-100">Sound</span>
          <span className="text-xl text-emerald-500">Rhythm</span>
        </Link>

        {/* Desktop links + Theme toggle */}
        <div className="hidden md:flex items-center gap-5">
          <nav>
            <ul className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-neutral-300">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `transition-colors ${
                        isActive
                          ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "hover:text-emerald-500 dark:hover:text-emerald-400"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="h-4 w-px bg-slate-200 dark:bg-neutral-800" />
          {themeButton}
        </div>

        {/* Mobile Actions: Theme toggle + Hamburger */}
        <div className="flex md:hidden items-center gap-1">
          {themeButton}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-700 dark:text-neutral-200 hover:text-emerald-500 hover:bg-slate-100/80 dark:hover:bg-neutral-900 rounded-xl transition-colors cursor-pointer"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <HiXMark className="w-6 h-6" />
            ) : (
              <HiBars3 className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <nav className="md:hidden mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
          <ul className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-neutral-200">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-xl transition-colors ${
                      isActive
                        ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "hover:bg-emerald-50 dark:hover:bg-neutral-900 hover:text-emerald-600 dark:hover:text-emerald-400"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default NavBar;
