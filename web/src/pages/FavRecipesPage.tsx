import { Link } from "react-router-dom";
import { getFavs } from "../services/recipeService";
import { useRecipeList } from "../hooks/useRecipeList";
import RecipeGrid from "../components/RecipeGrid";
import SortControls from "../components/SortControls";
import Spinner from "../components/Spinner";

export default function FavRecipesPage() {
  const {
    recipes,
    sorted,
    loading,
    error,
    sortBy,
    setSortBy,
    ascending,
    setAscending,
  } = useRecipeList(getFavs, "Failed to load your favourites. Please try again.");

  return (
    <div className="bg-[var(--surface)] p-6 md:p-10 mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="fred-bold text-[28px] md:text-[34px] text-[var(--primary)]">
          Your Favourites
        </h1>
        <p className="fred-light text-[15px] text-[var(--muted)] mt-1">
          Recipes you've saved for later.
        </p>
      </div>

      {loading && <Spinner label="Loading your favourites..." />}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-[12px] px-5 py-4">
          <p className="fred-med text-[14px] text-red-500">{error}</p>
        </div>
      )}

      {/* Empty state — no favourites yet */}
      {!loading && !error && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-[48px] mb-4 text-[var(--muted)]">&#9825;</span>
          <h2 className="fred-bold text-[20px] text-[var(--primary)] mb-2">
            No favourites yet
          </h2>
          <p className="fred-light text-[15px] text-[var(--muted)] max-w-[360px]">
            Browse recipes and tap the heart to save them here.
          </p>
          <Link
            to="/app/search"
            className="mt-5 px-5 py-2.5 rounded-[10px] bg-[var(--secondary)] text-[var(--on-secondary)] fred-bold text-[14px] hover:opacity-90 transition-opacity"
          >
            Browse recipes
          </Link>
        </div>
      )}

      {/* Recipe grid */}
      {!loading && !error && recipes.length > 0 && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <p className="fred-med text-[14px] text-[var(--muted)]">
              {recipes.length} recipe{recipes.length !== 1 && "s"} saved
            </p>
            {recipes.length > 1 && (
              <SortControls
                sortBy={sortBy}
                onSortChange={setSortBy}
                ascending={ascending}
                onAscendingChange={setAscending}
              />
            )}
          </div>
          <RecipeGrid recipes={sorted} />
        </>
      )}
    </div>
  );
}
