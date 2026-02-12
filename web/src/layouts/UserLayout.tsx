import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div>
      <h1>sidebar component</h1>
      <Outlet />
      <h1>footer component</h1>
    </div>
  );
}