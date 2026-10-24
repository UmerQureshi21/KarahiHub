import { useEffect, useMemo, useState } from "react";
import { getFavs, inFavs, isRecipeOwned } from "../services/recipeService";
import type { RecipeResponse } from "../types";
import MyRecipeCard from "../components/MyRecipeCard";
import SortControls from "../components/SortControls";
import ViewRecipePage from "./ViewRecipePage";

const SORT_OPTIONS = [
  { value: "rating", label: "Rating" },
  { value: "cook_time", label: "Cook Time" },
  { value: "prep_time", label: "Prep Time" },
  { value: "created_at", label: "Newest" },
  { value: "favourite_count", label: "Most Favorited" },
] as const;

export default function FavRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipeToView, setRecipeToView] = useState<RecipeResponse | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [ascending, setAscending] = useState(false);

  const sortedRecipes = useMemo(() => {
    const sorted = [...recipes].sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortBy) {
        case "rating": aVal = a.rating; bVal = b.rating; break;
        case "cook_time": aVal = a.cookTime; bVal = b.cookTime; break;
        case "prep_time": aVal = a.prepTime; bVal = b.prepTime; break;
        case "favourite_count": aVal = a.favouriteCount; bVal = b.favouriteCount; break;
        case "created_at":
        default: aVal = a.id; bVal = b.id; break;
      }
      return ascending ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [recipes, sortBy, ascending]);

  useEffect(() => {
    async function fetchFavourites() {
      try {
        const data = await getFavs();
        setRecipes(data);
      } catch (err) {
        setError("Failed to load your favourites. Please try again.");
        console.error("Error fetching favourites:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFavourites();
  }, []);

  async function handleRecipeToView(recipe: RecipeResponse) {
    try {
      const [favStatus, ownedStatus] = await Promise.all([
        inFavs(recipe.id),
        isRecipeOwned(recipe.id),
      ]);
      setIsFav(favStatus);
      setIsOwned(ownedStatus);
    } catch (error) {
      console.error("Error checking recipe status:", error);
      setIsFav(false);
      setIsOwned(false);
    }
    setRecipeToView(recipe);
  }

  // Full recipe view when a card is clicked
  if (recipeToView) {
    return (
      <ViewRecipePage
        recipe={recipeToView}
        onBack={() => setRecipeToView(null)}
        isFav={isFav}
        isUsersRecipe={isOwned}
      />
    );
  }

  return (
    <div className="bg-[var(--surface)] p-6 md:p-10 mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="fred-bold text-[28px] md:text-[34px] text-[var(--primary)]">
          Your Favourites
        </h1>
        <p className="fred-light text-[15px] text-gray-500 mt-1">
          Recipes you've saved for later.
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--secondary)] rounded-full animate-spin" />
          <p className="fred-med text-[14px] text-gray-400 mt-4">
            Loading your favourites...
          </p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-[12px] px-5 py-4">
          <p className="fred-med text-[14px] text-red-600">{error}</p>
        </div>
      )}

      {/* Empty state — no favourites yet */}
      {!loading && !error && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-[48px] mb-4">&#9825;</span>
          <h2 className="fred-bold text-[20px] text-[var(--primary)] mb-2">
            No favourites yet
          </h2>
          <p className="fred-light text-[15px] text-gray-400 max-w-[360px]">
            Browse recipes and tap the heart to save them here.
          </p>
        </div>
      )}

      {/* Recipe grid */}
      {!loading && !error && recipes.length > 0 && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <p className="fred-med text-[14px] text-gray-400">
              {recipes.length} recipe{recipes.length !== 1 && "s"} saved
            </p>
            {recipes.length > 1 && (
              <SortControls
                options={SORT_OPTIONS}
                sortBy={sortBy}
                onSortChange={setSortBy}
                ascending={ascending}
                onAscendingChange={setAscending}
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedRecipes.map((recipe) => (
              <div key={recipe.id} onClick={() => handleRecipeToView(recipe)}>
                <MyRecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
