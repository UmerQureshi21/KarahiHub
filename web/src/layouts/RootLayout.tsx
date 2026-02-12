import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="bg-[var(--accent)]">
      <Outlet />
      <div>footer component</div>
    </div>
  );
}
