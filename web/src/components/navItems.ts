import { IconFolder, IconHome, IconSearch, IconUpload } from "./icons";

// The app's main pages, shared by the desktop Sidebar and the mobile/tablet Navbar
export const NAV_ITEMS = [
  { to: "/app/dashboard", label: "Dashboard", Icon: IconHome },
  { to: "/app/upload", label: "Upload", Icon: IconUpload },
  { to: "/app/search", label: "Search", Icon: IconSearch },
  { to: "/app/favourites", label: "My Favourites", Icon: IconFolder },
];
