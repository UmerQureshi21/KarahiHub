import { NavLink } from "react-router-dom";

const linkClass = "px-3 py-2 rounded-[8px] text-[14px] fred-med text-[var(--primary)] transition-colors duration-200 hover:bg-[var(--secondary)] hover:text-white";

export default function Navbar() {
  return (
    <header className="w-full bg-[var(--accent)] shadow-sm">
      <div className="w-full px-[16px] md:px-[24px] py-[12px] flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <img src="/logo.png" alt="" className="w-[36px]" />
          <span className="fred-bold text-[18px] text-[var(--primary)]">Karahi Hub</span>
        </div>
        <nav className="flex items-center gap-[6px]">
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
            MyFiles
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
