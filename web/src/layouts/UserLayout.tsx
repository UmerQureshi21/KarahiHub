import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function UserLayout() {
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isClosed={isSidebarClosed}
        onToggle={() => setIsSidebarClosed((prev) => !prev)}
      />
      <main
        className="flex-1 transition-all duration-500"
        style={{ marginLeft: isSidebarClosed ? "88px" : "250px" }}
      >
        <Outlet />
      </main>
    </div>
  );
}