import { useEffect, useMemo, useState } from "react";
import { getMyRecipes, inFavs } from "../services/recipeService";
import { useAuth } from "../context/AuthContext";
import MyRecipeCard from "../components/MyRecipeCard";
import SortControls from "../components/SortControls";
import ViewRecipePage from "./ViewRecipePage";
import type { ApiError, RecipeResponse } from "../types";

const SORT_OPTIONS = [
  { value: "rating", label: "Rating" },
  { value: "cook_time", label: "Cook Time" },
  { value: "prep_time", label: "Prep Time" },
  { value: "created_at", label: "Newest" },
  { value: "favourite_count", label: "Most Favorited" },
] as const;

export default function DashboardPage() {
  const { username } = useAuth();
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipeToView, setRecipeToView] = useState<RecipeResponse | null>(null);
  const [isFav, setIsFav] = useState(false);
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
        default: aVal = a.id; bVal = b.id; break; // higher id = newer
      }
      return ascending ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [recipes, sortBy, ascending]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getMyRecipes();
        setRecipes(data);
      } catch (err) {
        setError((err as ApiError).message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  async function handleRecipeToView(recipe: RecipeResponse) {
    try {
      const favStatus = await inFavs(recipe.id);
      setIsFav(favStatus);
    } catch (error) {
      console.error("Error checking favourite status:", error);
      setIsFav(false);
    }
    setRecipeToView(recipe);
  }

  if (recipeToView) {
    return (
      <ViewRecipePage
        recipe={recipeToView}
        onBack={() => setRecipeToView(null)}
        isFav={isFav}
        isUsersRecipe={true}
      />
    );
  }

  return (
    <div className="bg-[var(--surface)] p-6 md:p-10  mx-auto min-h-screen">
      {/* Welcome section */}
      <section className="mb-10">
        <h1 className="fred-bold text-[28px] md:text-[34px] text-[var(--primary)]">
          Welcome back, {username || "Chef"}
        </h1>
        <p className="fred-light text-[15px] text-gray-500 mt-1">
          Here's what's happening with your recipes.
        </p>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-[var(--accent)] rounded-[16px] p-5 shadow-sm">
          <p className="fred-light text-[13px] text-gray-400">My Recipes</p>
          <p className="fred-bold text-[28px] text-[var(--primary)]">
            {loading ? "-" : recipes.length}
          </p>
        </div>
        <div className="bg-[var(--accent)] rounded-[16px] p-5 shadow-sm">
          <p className="fred-light text-[13px] text-gray-400">
            Total Favourites
          </p>
          <p className="fred-bold text-[28px] text-[var(--secondary)]">
            {loading
              ? "-"
              : recipes.reduce((sum, r) => sum + r.favouriteCount, 0)}
          </p>
        </div>
        <div className="bg-[var(--accent)] rounded-[16px] p-5 shadow-sm col-span-2 md:col-span-1">
          <p className="fred-light text-[13px] text-gray-400">Avg Cook Time</p>
          <p className="fred-bold text-[28px] text-[var(--primary)]">
            {loading || recipes.length === 0
              ? "-"
              : Math.round(
                  recipes.reduce((sum, r) => sum + r.prepTime + r.cookTime, 0) /
                    recipes.length,
                ) + "m"}
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
              options={SORT_OPTIONS}
              sortBy={sortBy}
              onSortChange={setSortBy}
              ascending={ascending}
              onAscendingChange={setAscending}
            />
          )}
        </div>

        {loading && (
          <p className="fred-light text-[15px] text-gray-400">
            Loading your recipes...
          </p>
        )}

        {error && <p className="fred-med text-[14px] text-red-500">{error}</p>}

        {!loading && !error && recipes.length === 0 && (
          <div className="bg-[var(--surface)] rounded-[16px] p-8 text-center shadow-sm">
            <p className="fred-med text-[16px] text-gray-400">
              You haven't uploaded any recipes yet.
            </p>
            <p className="fred-light text-[14px] text-gray-400 mt-1">
              Head to the Upload page to share your first recipe!
            </p>
          </div>
        )}

        {!loading && !error && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedRecipes.map((recipe) => (
              <div key={recipe.id} onClick={() => handleRecipeToView(recipe)}>
                <MyRecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
