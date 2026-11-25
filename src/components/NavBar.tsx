import { useState } from "react";
import { Link } from "react-router-dom";
import { HiBars3, HiXMark } from "react-icons/hi2";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center font-bold tracking-tight">
          <span className="text-xl text-slate-800">Sound</span>
          <span className="text-xl text-emerald-500">Rhythm</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <li>
              <Link to="/" className="hover:text-emerald-500 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <a href="#about" className="hover:text-emerald-500 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-emerald-500 transition-colors">
                Contact
              </a>
            </li>
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
            <li>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="#about"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default NavBar;
