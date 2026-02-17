import { useState } from "react";
import { NavLink } from "react-router-dom";

type SidebarProps = {
  isClosed: boolean;
  onToggle: () => void;
  name: string;
};

const IconChevronRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M9 6l6 6-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconHome = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M3 11l9-7 9 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 10v10h14V10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconUpload = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M12 16V6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 10l4-4 4 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 18h16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconSearch = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <circle
      cx="11"
      cy="11"
      r="7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M20 20l-3.5-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconFolder = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M3 7h6l2 2h10v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 7V5a2 2 0 012-2h5l2 2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconLogout = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M10 17l5-5-5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 12H4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M20 4v16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconMoon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M21 14.5A8.5 8.5 0 019.5 3a7 7 0 1011.5 11.5z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconSun = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <circle
      cx="12"
      cy="12"
      r="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2.1 2.1M17.4 17.4l2.1 2.1M19.5 4.5l-2.1 2.1M6.6 17.4l-2.1 2.1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function Sidebar({ isClosed, onToggle, name }: SidebarProps) {
  const [isDark, setIsDark] = useState(false);
  const textClass = `text-[16px] font-medium text-[var(--primary)] transition-opacity duration-200 whitespace-nowrap ${
    isClosed ? "opacity-0" : "opacity-100"
  }`;

  function onDarkMode() {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
    // document.documentElement is the <html> element, toggling the "dark" 
    // class on it will allow us to use CSS to switch themes based on that class.

  }

  return (
    <nav
      className={`fixed top-0 left-0 h-full ${
        isClosed ? "w-[88px]" : "w-[250px]"
      } fred-bold p-[10px] px-[14px] bg-[var(--accent)] transition-all duration-500 z-20`}
    >
      <header className="relative h-[60px] flex items-center">
        <div className="relative flex items-center w-full">
          <span className="min-w-[60px] flex items-center shrink-0">
            <img src="/logo.png" alt="" className="w-[40px] rounded-[2px]" />
          </span>
          <div
            className={`absolute left-[60px] top-1/2 -translate-y-1/2 flex flex-col transition-opacity duration-200 ${
              isClosed ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="text-[16px] font-semibold text-[var(--primary)] whitespace-nowrap">
              {name || "User"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-1/2 -right-[25px] -translate-y-1/2 h-[35px] w-[35px] bg-[var(--secondary)] flex items-center justify-center rounded-full text-white"
          aria-label="Toggle sidebar"
        >
          <IconChevronRight className="h-[22px] w-[22px]" />
        </button>
      </header>

      <div className="h-[90%] flex flex-col justify-between mt-[20px]">
        <div className="menu">
          <ul className="mt-[10px]">
            <li className="h-[50px] mt-[10px] list-none flex items-center">
              <NavLink
                to="/app/dashboard"
                className="group w-full h-full flex items-center rounded-[6px] transition-all duration-300 hover:bg-[var(--secondary)]"
              >
                <IconHome className="h-[20px] w-[20px] min-w-[60px] flex items-center justify-center text-[var(--primary)] transition-all duration-300 group-hover:text-white" />
                <span
                  className={`${textClass} group-hover:text-white`}
                >
                  Dashboard
                </span>
              </NavLink>
            </li>
            <li className="h-[50px] mt-[10px] list-none flex items-center">
              <NavLink
                to="/app/upload"
                className="group w-full h-full flex items-center rounded-[6px] transition-all duration-300 hover:bg-[var(--secondary)]"
              >
                <IconUpload className="h-[20px] w-[20px] min-w-[60px] flex items-center justify-center text-[var(--primary)] transition-all duration-300 group-hover:text-white" />
                <span
                  className={`${textClass} group-hover:text-white`}
                >
                  Upload
                </span>
              </NavLink>
            </li>
            <li className="h-[50px] mt-[10px] list-none flex items-center">
              <NavLink
                to="/app/search"
                className="group w-full h-full flex items-center rounded-[6px] transition-all duration-300 hover:bg-[var(--secondary)]"
              >
                <IconSearch className="h-[20px] w-[20px] min-w-[60px] flex items-center justify-center text-[var(--primary)] transition-all duration-300 group-hover:text-white" />
                <span
                  className={`${textClass} group-hover:text-white`}
                >
                  Search
                </span>
              </NavLink>
            </li>
            <li className="h-[50px] mt-[10px] list-none flex items-center">
              <NavLink
                to="/app/favourites"
                className="group w-full h-full flex items-center rounded-[6px] transition-all duration-300 hover:bg-[var(--secondary)]"
              >
                <IconFolder className="h-[20px] w-[20px] min-w-[60px] flex items-center justify-center text-[var(--primary)] transition-all duration-300 group-hover:text-white" />
                <span
                  className={`${textClass} group-hover:text-white`}
                >
                  My Favourites
                </span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="bottom-content">
          <li className="h-[50px] mt-[10px] list-none flex items-center">
            <NavLink
              to="/auth"
              className="group w-full h-full flex items-center rounded-[6px] transition-all duration-300 hover:bg-[var(--secondary)]"
            >
              <IconLogout className="h-[20px] w-[20px] min-w-[60px] flex items-center justify-center text-[var(--primary)] transition-all duration-300 group-hover:text-white" />
              <span
                className={`${textClass} group-hover:text-white`}
              >
                Logout
              </span>
            </NavLink>
          </li>

          <li className="h-[50px] mt-[10px] list-none flex items-center bg-[var(--surface)] relative rounded-[6px]">
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 flex  items-center transition-opacity duration-200 ${
                isClosed ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="relative h-[50px] w-[60px] flex items-center justify-center">
                <IconMoon
                  className={`absolute h-[20px] w-[20px] text-[var(--primary)] transition-opacity duration-200 ${
                    isDark ? "opacity-0" : "opacity-100"
                  }`}
                />
                <IconSun
                  className={`absolute h-[20px] w-[20px] text-[var(--primary)] transition-opacity duration-200 ${
                    isDark ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <span className={`${textClass} group-hover:text-white`}>
                {isDark ? "Dark Mode" : "Light Mode"}
              </span>
            </div>

            <button
              type="button"
              onClick={onDarkMode}
              className="absolute right-[6px] h-full w-[52px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle dark mode"
            >
              <span className="relative h-[22px] w-[44px] rounded-[25px] bg-[var(--primary)]">
                <span
                  className={`absolute top-1/2 -translate-y-1/2 h-[15px] w-[15px] rounded-full bg-[var(--surface)] transition-all duration-300 ${
                    isDark ? "left-[25px]" : "left-[5px]"
                  }`}
                ></span>
              </span>
            </button>
          </li>
        </div>
      </div>
    </nav>
  );
}
