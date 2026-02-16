import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import LandingPage from "./pages/LandingPage";
import UserLayout from "./layouts/UserLayout";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import AuthPage from "./pages/AuthPage";
import SearchPage from "./pages/SearchPage";
import FavRecipesPage from "./pages/FavRecipesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
    ],
  },
  {
    path: "/app",
    element: <UserLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/app",
        element: <DashboardPage />,
      },
      {
        path: "upload",
        element: <UploadPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "favourites",
        element: <FavRecipesPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
