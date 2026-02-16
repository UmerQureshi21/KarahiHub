import { useState } from "react";
import { NavLink } from "react-router-dom";

const linkClass =
  "px-3 py-2 rounded-[8px] text-[14px] fred-med text-[var(--primary)] transition-colors duration-200 hover:bg-[var(--secondary)] hover:text-white";

// Same styles but full-width for the mobile drawer
const mobileLinkClass =
  "block px-4 py-3 rounded-[8px] text-[15px] fred-med text-[var(--primary)] transition-colors duration-200 hover:bg-[var(--secondary)] hover:text-white";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[var(--accent)] shadow-sm fred-bold relative">
      <div className="w-full px-[16px] md:px-[24px] py-[12px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-[10px]">
          <img src="/logo.png" alt="" className="w-[36px]" />
          <span className="fred-bold text-[18px] text-[var(--primary)]">
            Karahi Hub
          </span>
        </div>

        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-[6px]">
          <NavLink to="/app/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/app/upload" className={linkClass}>
            Upload
          </NavLink>
          <NavLink to="/app/search" className={linkClass}>
            Search
          </NavLink>
          <NavLink to="/app/favourites" className={linkClass}>
            My Favourites
          </NavLink>
        </nav>

        {/* Hamburger button — visible on mobile only */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-[22px] h-[2px] bg-[var(--primary)] transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-[var(--primary)] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-[var(--primary)] transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
          />
        </button>
      </div>

      {/* Mobile dropdown menu — always rendered, animated with max-height */}
      <nav
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          menuOpen ? "max-h-[300px]" : "max-h-0"
        }`}
      >
        <div className="px-[16px] pb-[16px] flex flex-col gap-[4px]">
          <NavLink to="/app/dashboard" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/app/upload" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            Upload
          </NavLink>
          <NavLink to="/app/search" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            Search
          </NavLink>
          <NavLink to="/app/favourites" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
            My Favourites
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
