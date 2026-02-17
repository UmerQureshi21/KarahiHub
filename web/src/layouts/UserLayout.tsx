import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function UserLayout() {
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const { username } = useAuth();

  return (
    <div className="flex min-h-screen flex-col xl:flex-row">
      <div className="xl:hidden">
        <Navbar />
      </div>
      <div className="hidden xl:block">
        <Sidebar
          isClosed={isSidebarClosed}
          onToggle={() => setIsSidebarClosed((prev) => !prev)}
          name={username || "User"}
        />
      </div>
      <main
        className={`flex-1 transition-all duration-500 ${
          isSidebarClosed ? "xl:ml-[88px]" : "xl:ml-[250px]"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
