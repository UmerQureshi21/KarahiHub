import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/useAuth";
import { useDarkMode } from "../hooks/useDarkMode";
import { isAuthenticated, logout } from "../services/userService";

export default function UserLayout() {
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const { username, initializing } = useAuth();
  const { isDark, toggleDark } = useDarkMode();
  const location = useLocation();

  // On a hard reload the access token isn't in memory yet — AuthProvider is
  // restoring it from the refresh cookie. Wait for that before deciding to redirect.
  if (initializing) {
    return (
      <div className="min-h-screen bg-[var(--accent)]">
        <Spinner />
      </div>
    );
  }

  // Remember where the user was headed so AuthPage can send them back after login
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // logout() clears the session and notifies AuthContext; the re-render above
  // then sees isAuthenticated() === false and redirects to /auth
  const handleLogout = () => {
    logout();
  };

  return (
    // The "dark" class swaps the colour variables (see index.css) for everything inside
    // the app. The landing and auth pages sit outside this and always stay light.
    <div
      className={`flex min-h-screen flex-col xl:flex-row bg-[var(--surface)] ${
        isDark ? "dark" : ""
      }`}
    >
      <div className="xl:hidden">
        <Navbar
          isDark={isDark}
          onToggleDark={toggleDark}
          onLogout={handleLogout}
        />
      </div>
      <div className="hidden xl:block">
        <Sidebar
          isClosed={isSidebarClosed}
          onToggle={() => setIsSidebarClosed((prev) => !prev)}
          name={username || "User"}
          isDark={isDark}
          onToggleDark={toggleDark}
          onLogout={handleLogout}
        />
      </div>
      <main
        className={`flex-1 min-w-0 transition-all duration-500 ${
          isSidebarClosed ? "xl:ml-[88px]" : "xl:ml-[250px]"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
