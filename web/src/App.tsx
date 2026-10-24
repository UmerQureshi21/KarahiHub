import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RootLayout from "./layouts/RootLayout";
import LandingPage from "./pages/LandingPage";
import UserLayout from "./layouts/UserLayout";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import AuthPage from "./pages/AuthPage";
import SearchPage from "./pages/SearchPage";
import FavRecipesPage from "./pages/FavRecipesPage";
import RecipePage from "./pages/RecipePage";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
    ],
  },
  {
    path: "/app",
    element: <UserLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        // /app on its own goes to the dashboard, so the nav highlights the right link
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
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
      {
        path: "recipes/:id",
        element: <RecipePage />,
      },
    ],
  },
  {
    // anything that didn't match above
    path: "*",
    element: <ErrorPage />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
