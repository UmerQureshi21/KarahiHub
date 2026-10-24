import { Link } from "react-router-dom";
import { getMyRecipes } from "../services/recipeService";
import { useAuth } from "../context/useAuth";
import { useRecipeList } from "../hooks/useRecipeList";
import RecipeGrid from "../components/RecipeGrid";
import SortControls from "../components/SortControls";
import Spinner from "../components/Spinner";

export default function DashboardPage() {
  const { username } = useAuth();
  const {
    recipes,
    sorted,
    loading,
    error,
    sortBy,
    setSortBy,
    ascending,
    setAscending,
  } = useRecipeList(getMyRecipes, "Failed to load your recipes. Please try again.");

  const totalFavourites = recipes.reduce((sum, r) => sum + r.favouriteCount, 0);
  const avgTotalTime =
    recipes.length === 0
      ? null
      : Math.round(
          recipes.reduce((sum, r) => sum + r.prepTime + r.cookTime, 0) /
            recipes.length,
        );

  return (
    <div className="bg-[var(--surface)] p-6 md:p-10 mx-auto min-h-screen">
      {/* Welcome section */}
      <section className="mb-10">
        <h1 className="fred-bold text-[28px] md:text-[34px] text-[var(--primary)]">
          Welcome back, {username || "Chef"}
        </h1>
        <p className="fred-light text-[15px] text-[var(--muted)] mt-1">
          Here's what's happening with your recipes.
        </p>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-[var(--accent)] rounded-[16px] p-5 shadow-sm">
          <p className="fred-light text-[13px] text-[var(--muted)]">My Recipes</p>
          <p className="fred-bold text-[28px] text-[var(--primary)]">
            {loading ? "-" : recipes.length}
          </p>
        </div>
        <div className="bg-[var(--accent)] rounded-[16px] p-5 shadow-sm">
          <p className="fred-light text-[13px] text-[var(--muted)]">
            Total Favourites
          </p>
          <p className="fred-bold text-[28px] text-[var(--secondary)]">
            {loading ? "-" : totalFavourites}
          </p>
        </div>
        <div className="bg-[var(--accent)] rounded-[16px] p-5 shadow-sm col-span-2 md:col-span-1">
          {/* prep + cook, so it's labelled as total time */}
          <p className="fred-light text-[13px] text-[var(--muted)]">
            Avg Total Time
          </p>
          <p className="fred-bold text-[28px] text-[var(--primary)]">
            {loading || avgTotalTime === null ? "-" : `${avgTotalTime}m`}
          </p>
        </div>
      </section>

      {/* My recipes section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="fred-bold text-[20px] text-[var(--primary)]">
            My Recipes
          </h2>
          {recipes.length > 1 && (
            <SortControls
              sortBy={sortBy}
              onSortChange={setSortBy}
              ascending={ascending}
              onAscendingChange={setAscending}
            />
          )}
        </div>

        {loading && <Spinner label="Loading your recipes..." />}

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-[12px] px-5 py-4">
            <p className="fred-med text-[14px] text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && recipes.length === 0 && (
          <div className="bg-[var(--accent)] rounded-[16px] p-8 text-center">
            <p className="fred-med text-[16px] text-[var(--muted)]">
              You haven't uploaded any recipes yet.
            </p>
            <Link
              to="/app/upload"
              className="inline-block mt-4 px-5 py-2.5 rounded-[10px] bg-[var(--secondary)] text-[var(--on-secondary)] fred-bold text-[14px] hover:opacity-90 transition-opacity"
            >
              Upload your first recipe
            </Link>
          </div>
        )}

        {!loading && !error && recipes.length > 0 && <RecipeGrid recipes={sorted} />}
      </section>
    </div>
  );
}
