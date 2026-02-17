import { useState } from "react";
import { searchRecipes } from "../services/recipeService";
import type { RecipeResponse } from "../types";
import MyRecipeCard from "../components/MyRecipeCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [searched, setSearched] = useState(false);

  async function fetchSearchResults() {
    if (!query.trim()) return;
    try {
      const results = await searchRecipes(query.trim());
      setRecipes(results);
      setSearched(true);
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  }

  return (
    <div className="bg-[var(--surface)] p-6 md:p-10 mx-auto min-h-screen">
      <h1 className="fred-bold text-[28px] md:text-[34px] text-[var(--primary)] mb-2">
        Search Recipes
      </h1>
      <p className="fred-light text-[15px] text-gray-500 mb-6">
        Find recipes by title, ingredient, or category.
      </p>

      {/* Search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchSearchResults();
        }}
        className="flex gap-2 mb-8"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Chicken Karahi"
          className="flex-1 px-4 py-3 rounded-[10px] border border-gray-200 md:border-[var(--accent)] md:bg-[var(--surface)] fred-med text-[14px] text-[var(--primary)] outline-none focus:border-[var(--secondary)] transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-[10px] bg-[var(--secondary)] text-[var(--surface)] fred-bold text-[14px] hover:opacity-90 transition-opacity shrink-0"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {searched && recipes.length === 0 && (
        <p className="fred-med text-[15px] text-gray-400">
          No recipes found for "{query}".
        </p>
      )}

      {recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <MyRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
