import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiBars3, HiXMark } from "react-icons/hi2";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About", end: false },
  { to: "/contact", label: "Contact", end: false },
];

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center font-bold tracking-tight">
          <span className="text-xl text-slate-800">Sound</span>
          <span className="text-xl text-emerald-500">Rhythm</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-slate-600">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `transition-colors ${
                      isActive
                        ? "text-emerald-600 font-semibold"
                        : "hover:text-emerald-500"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-emerald-500 hover:bg-slate-100/80 rounded-xl transition-colors cursor-pointer"
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

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <nav className="md:hidden mt-3 pt-3 border-t border-slate-100">
          <ul className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-xl transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-600 font-semibold"
                        : "hover:bg-emerald-50 hover:text-emerald-600"
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
