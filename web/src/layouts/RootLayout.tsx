import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="bg-[var(--accent)] min-h-screen">
      <Outlet />
    </div>
  );
}
