import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navItems";
import { IconChevronRight, IconLogout, IconMoon, IconSun } from "./icons";
import Logo from "./Logo";

type SidebarProps = {
  isClosed: boolean;
  onToggle: () => void;
  name: string;
  isDark: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
};

// Shared row styling. Icons use currentColor, so setting the text colour here colours both.
const rowClass =
  "w-full h-full flex items-center rounded-[6px] transition-all duration-300 overflow-hidden";
const idleClass =
  "text-[var(--primary)] hover:bg-[var(--secondary)] hover:text-[var(--on-secondary)]";
const activeClass = "bg-[var(--secondary)] text-[var(--on-secondary)]";
const iconClass = "h-[20px] w-[20px] min-w-[60px]";
const labelClass = "text-[16px] font-medium whitespace-nowrap";

export default function Sidebar({
  isClosed,
  onToggle,
  name,
  isDark,
  onToggleDark,
  onLogout,
}: SidebarProps) {
  return (
    <nav
      className={`fixed top-0 left-0 h-full ${
        isClosed ? "w-[88px]" : "w-[250px]"
      } fred-bold p-[10px] px-[14px] bg-[var(--accent)] transition-all duration-500 z-20`}
    >
      <header className="relative h-[60px] flex items-center">
        <div className="relative flex items-center w-full overflow-hidden">
          <span className="min-w-[60px] flex items-center shrink-0">
            <Logo className="w-[40px] rounded-[2px]" />
          </span>
          <span className="text-[16px] font-semibold text-[var(--primary)] whitespace-nowrap">
            {name || "User"}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-1/2 -right-[25px] -translate-y-1/2 h-[35px] w-[35px] bg-[var(--secondary)] flex items-center justify-center rounded-full text-[var(--on-secondary)]"
          aria-label={isClosed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {/* Points right when collapsed (expand), left when open (collapse) */}
          <IconChevronRight
            className={`h-[22px] w-[22px] transition-transform duration-500 ${
              isClosed ? "" : "rotate-180"
            }`}
          />
        </button>
      </header>

      <div className="h-[90%] flex flex-col justify-between mt-[20px]">
        <ul className="mt-[10px]">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <li key={to} className="h-[50px] mt-[10px] flex items-center">
              {/* NavLink sets aria-current="page" on the active link; we highlight it too */}
              <NavLink
                to={to}
                title={isClosed ? label : undefined}
                className={({ isActive }) =>
                  `${rowClass} ${isActive ? activeClass : idleClass}`
                }
              >
                <Icon className={iconClass} />
                <span className={labelClass}>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <ul>
          <li className="h-[50px] mt-[10px] flex items-center">
            <button
              type="button"
              onClick={onLogout}
              title={isClosed ? "Logout" : undefined}
              className={`${rowClass} ${idleClass}`}
            >
              <IconLogout className={iconClass} />
              <span className={labelClass}>Logout</span>
            </button>
          </li>

          <li className="h-[50px] mt-[10px] flex items-center">
            {/* The whole row is the switch, so it's one tab stop and one click target */}
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              aria-label="Dark mode"
              onClick={onToggleDark}
              className="relative w-full h-full flex items-center rounded-[6px] overflow-hidden bg-[var(--surface)] text-[var(--primary)] cursor-pointer"
            >
              <span className="relative h-[50px] w-[60px] flex items-center justify-center shrink-0">
                <IconMoon
                  className={`absolute h-[20px] w-[20px] transition-opacity duration-200 ${
                    isDark ? "opacity-0" : "opacity-100"
                  }`}
                />
                <IconSun
                  className={`absolute h-[20px] w-[20px] transition-opacity duration-200 ${
                    isDark ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
              <span className={labelClass}>
                {isDark ? "Dark Mode" : "Light Mode"}
              </span>

              {/* Track + knob */}
              <span className="absolute right-[10px] h-[22px] w-[44px] rounded-[25px] bg-[var(--primary)]">
                <span
                  className={`absolute top-1/2 -translate-y-1/2 h-[15px] w-[15px] rounded-full bg-[var(--surface)] transition-all duration-300 ${
                    isDark ? "left-[25px]" : "left-[5px]"
                  }`}
                />
              </span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
