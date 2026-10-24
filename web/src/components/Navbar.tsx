import { useState } from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navItems";
import { IconLogout, IconMoon, IconSun } from "./icons";
import Logo from "./Logo";

type NavbarProps = {
  isDark: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
};

const linkBase =
  "rounded-[8px] fred-med transition-colors duration-200 hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)]";
const activeClass = "bg-[var(--secondary)] text-[var(--on-secondary)]";
const idleClass = "text-[var(--primary)]";

// Inline links on tablets, full-width rows in the phone drawer
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `${linkBase} px-3 py-2 text-[14px] ${isActive ? activeClass : idleClass}`;
const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${linkBase} block px-4 py-3 text-[15px] ${isActive ? activeClass : idleClass}`;

const iconButtonClass =
  "h-[38px] w-[38px] flex items-center justify-center rounded-[8px] text-[var(--primary)] hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)] transition-colors duration-200";

// Top bar shown below the xl breakpoint, where the Sidebar is hidden
export default function Navbar({ isDark, onToggleDark, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Theme + logout buttons, shown in the bar on tablets and in the drawer on phones
  const actions = (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Dark mode"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={onToggleDark}
        className={iconButtonClass}
      >
        {isDark ? (
          <IconSun className="h-[20px] w-[20px]" />
        ) : (
          <IconMoon className="h-[20px] w-[20px]" />
        )}
      </button>
      <button
        type="button"
        aria-label="Logout"
        title="Logout"
        onClick={onLogout}
        className={iconButtonClass}
      >
        <IconLogout className="h-[20px] w-[20px]" />
      </button>
    </>
  );

  return (
    <header className="w-full bg-[var(--accent)] shadow-sm fred-bold relative">
      <div className="w-full px-[16px] md:px-[24px] py-[12px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-[10px]">
          <Logo className="w-[36px]" />
          <span className="fred-bold text-[18px] text-[var(--primary)]">
            Karahi Hub
          </span>
        </div>

        {/* Tablet nav — hidden on phones */}
        <nav className="hidden md:flex items-center gap-[6px]">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {label}
            </NavLink>
          ))}
          <span className="w-[1px] h-[24px] bg-[var(--border)] mx-[6px]" />
          {actions}
        </nav>

        {/* Hamburger button — visible on phones only */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
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

      {/* Phone dropdown menu — always rendered, animated with max-height.
          inert keeps the hidden links out of the tab order while it's closed. */}
      <nav
        inert={!menuOpen}
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          menuOpen ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <div className="px-[16px] pb-[16px] flex flex-col gap-[4px]">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={mobileLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div className="flex items-center gap-[6px] pt-[8px] mt-[4px] border-t border-[var(--border)]">
            {actions}
          </div>
        </div>
      </nav>
    </header>
  );
}
