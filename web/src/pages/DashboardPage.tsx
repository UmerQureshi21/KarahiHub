import { useEffect, useState } from "react";
import { getMyRecipes } from "../services/recipeService";
import { getCurrentUsername } from "../services/userService";
import MyRecipeCard from "../components/MyRecipeCard";
import type { RecipeResponse } from "../types";

export default function DashboardPage() {
  const [username, setUsername] = useState<string>("");
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const name = getCurrentUsername();
    if (name) setUsername(name);

    const fetchRecipes = async () => {
      try {
        const data = await getMyRecipes();
        setRecipes(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto">
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
        <div className="bg-[var(--surface)] rounded-[16px] p-5 shadow-sm">
          <p className="fred-light text-[13px] text-gray-400">My Recipes</p>
          <p className="fred-bold text-[28px] text-[var(--primary)]">
            {loading ? "-" : recipes.length}
          </p>
        </div>
        <div className="bg-[var(--surface)] rounded-[16px] p-5 shadow-sm">
          <p className="fred-light text-[13px] text-gray-400">Total Favourites</p>
          <p className="fred-bold text-[28px] text-[var(--secondary)]">
            {loading ? "-" : recipes.reduce((sum, r) => sum + r.favouriteCount, 0)}
          </p>
        </div>
        <div className="bg-[var(--surface)] rounded-[16px] p-5 shadow-sm col-span-2 md:col-span-1">
          <p className="fred-light text-[13px] text-gray-400">Avg Cook Time</p>
          <p className="fred-bold text-[28px] text-[var(--primary)]">
            {loading || recipes.length === 0
              ? "-"
              : Math.round(
                  recipes.reduce((sum, r) => sum + r.prepTime + r.cookTime, 0) /
                    recipes.length
                ) + "m"}
          </p>
        </div>
      </section>

      {/* My recipes section */}
      <section>
        <h2 className="fred-bold text-[20px] text-[var(--primary)] mb-4">
          My Recipes
        </h2>

        {loading && (
          <p className="fred-light text-[15px] text-gray-400">Loading your recipes...</p>
        )}

        {error && (
          <p className="fred-med text-[14px] text-red-500">{error}</p>
        )}

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
            {recipes.map((recipe) => (
              <MyRecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
