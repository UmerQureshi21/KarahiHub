import { useState } from "react";
import { searchRecipes, inFavs } from "../services/recipeService";
import type { RecipeResponse, SearchFilterRequest } from "../types";
import MyRecipeCard from "../components/MyRecipeCard";
import ViewRecipePage from "./ViewRecipePage";

const ALL_CATEGORIES = [
  "APPETIZER",
  "MAIN_COURSE",
  "DESSERT",
  "SIDE_DISH",
  "SOUP",
  "SALAD",
  "BREAKFAST",
  "SNACK",
  "BEVERAGE",
];

const SORT_OPTIONS = [
  { value: "rating", label: "Rating" },
  { value: "cook_time", label: "Cook Time" },
  { value: "prep_time", label: "Prep Time" },
  { value: "created_at", label: "Newest" },
] as const;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [searched, setSearched] = useState(false);
  const [recipeToView, setRecipeToView] = useState<RecipeResponse | null>(null);
  const [isFav, setIsFav] = useState(false);

  // filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrep, setMinPrep] = useState("");
  const [maxPrep, setMaxPrep] = useState("");
  const [minCook, setMinCook] = useState("");
  const [maxCook, setMaxCook] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [minServings, setMinServings] = useState("");
  const [maxServings, setMaxServings] = useState("");

  // sort state
  const [sortBy, setSortBy] = useState<SearchFilterRequest["sortBy"]>("rating");
  const [ascending, setAscending] = useState(false);

  // toggles whether the filter panel is visible
  const [showFilters, setShowFilters] = useState(false);

  function toggleCategory(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  function buildRequest(): SearchFilterRequest {
    return {
      query: query.trim(),
      // if no categories selected, send all so nothing gets filtered out
      categories:
        selectedCategories.length > 0 ? selectedCategories : ALL_CATEGORIES,
      minPrep: minPrep ? parseInt(minPrep) : 0,
      maxPrep: maxPrep ? parseInt(maxPrep) : 1440,
      minCook: minCook ? parseInt(minCook) : 0,
      maxCook: maxCook ? parseInt(maxCook) : 1440,
      minRating: minRating ? parseFloat(minRating) : 0,
      maxRating: maxRating ? parseFloat(maxRating) : 5,
      minServings: minServings ? parseInt(minServings) : 1,
      maxServings: maxServings ? parseInt(maxServings) : 10,
      sortBy,
      ascending,
    };
  }

  async function fetchSearchResults() {
    try {
      const results = await searchRecipes(buildRequest());
      setRecipes(results);
      setSearched(true);
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  }

  // display-friendly category name: MAIN_COURSE -> Main Course
  function formatCategory(category: string) {
    return category
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  }

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

  return recipeToView != null ? (
    <ViewRecipePage recipe={recipeToView} onBack={() => setRecipeToView(null)} isFav={isFav} />
  ) : (
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
        className="flex gap-2 mb-4"
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

      {/* Toggle filters button */}
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="fred-med text-[14px] text-[var(--secondary)] mb-4 hover:underline"
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Filter & Sort panel */}
      {showFilters && (
        <div className="bg-[var(--accent)] rounded-[16px] p-5 mb-8 flex flex-col gap-5">
          {/* Category filter */}
          <div>
            <h3 className="fred-bold text-[14px] text-[var(--primary)] mb-2">
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[13px] fred-med transition-colors ${
                    selectedCategories.includes(cat)
                      ? "bg-[var(--secondary)] text-[var(--surface)]"
                      : "bg-[var(--surface)] text-[var(--primary)] border border-gray-200"
                  }`}
                >
                  {formatCategory(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Range filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Prep time */}
            <div>
              <label className="fred-bold text-[13px] text-[var(--primary)] mb-1 block">
                Prep Time (min)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={0}
                  value={minPrep}
                  onChange={(e) => setMinPrep(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-[8px] border border-gray-200 fred-med text-[13px] text-[var(--primary)] outline-none focus:border-[var(--secondary)]"
                />
                <span className="fred-light text-[13px] text-gray-400">to</span>
                <input
                  type="number"
                  min={0}
                  value={maxPrep}
                  onChange={(e) => setMaxPrep(e.target.value)}
                  placeholder="1440"
                  className="w-full px-3 py-2 rounded-[8px] border border-gray-200 fred-med text-[13px] text-[var(--primary)] outline-none focus:border-[var(--secondary)]"
                />
              </div>
            </div>

            {/* Cook time */}
            <div>
              <label className="fred-bold text-[13px] text-[var(--primary)] mb-1 block">
                Cook Time (min)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={0}
                  value={minCook}
                  onChange={(e) => setMinCook(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-[8px] border border-gray-200 fred-med text-[13px] text-[var(--primary)] outline-none focus:border-[var(--secondary)]"
                />
                <span className="fred-light text-[13px] text-gray-400">to</span>
                <input
                  type="number"
                  min={0}
                  value={maxCook}
                  onChange={(e) => setMaxCook(e.target.value)}
                  placeholder="1440"
                  className="w-full px-3 py-2 rounded-[8px] border border-gray-200 fred-med text-[13px] text-[var(--primary)] outline-none focus:border-[var(--secondary)]"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="fred-bold text-[13px] text-[var(--primary)] mb-1 block">
                Rating
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-[8px] border border-gray-200 fred-med text-[13px] text-[var(--primary)] outline-none focus:border-[var(--secondary)]"
                />
                <span className="fred-light text-[13px] text-gray-400">to</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={maxRating}
                  onChange={(e) => setMaxRating(e.target.value)}
                  placeholder="5"
                  className="w-full px-3 py-2 rounded-[8px] border border-gray-200 fred-med text-[13px] text-[var(--primary)] outline-none focus:border-[var(--secondary)]"
                />
              </div>
            </div>

            {/* Servings */}
            <div>
              <label className="fred-bold text-[13px] text-[var(--primary)] mb-1 block">
                Servings
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={1}
                  value={minServings}
                  onChange={(e) => setMinServings(e.target.value)}
                  placeholder="1"
                  className="w-full px-3 py-2 rounded-[8px] border border-gray-200 fred-med text-[13px] text-[var(--primary)] outline-none focus:border-[var(--secondary)]"
                />
                <span className="fred-light text-[13px] text-gray-400">to</span>
                <input
                  type="number"
                  min={1}
                  value={maxServings}
                  onChange={(e) => setMaxServings(e.target.value)}
                  placeholder="10"
                  className="w-full px-3 py-2 rounded-[8px] border border-gray-200 fred-med text-[13px] text-[var(--primary)] outline-none focus:border-[var(--secondary)]"
                />
              </div>
            </div>
          </div>

          {/* Sort controls */}
          <div>
            <h3 className="fred-bold text-[14px] text-[var(--primary)] mb-2">
              Sort by
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSortBy(option.value)}
                  className={`px-3 py-1.5 rounded-full text-[13px] fred-med transition-colors ${
                    sortBy === option.value
                      ? "bg-[var(--secondary)] text-[var(--surface)]"
                      : "bg-[var(--surface)] text-[var(--primary)] border border-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}

              {/* ASC / DESC toggle */}
              <button
                type="button"
                onClick={() => setAscending(!ascending)}
                className="ml-2 px-3 py-1.5 rounded-full text-[13px] fred-med bg-[var(--surface)] text-[var(--primary)] border border-gray-200 hover:border-[var(--secondary)] transition-colors"
              >
                {ascending ? "Low to High" : "High to Low"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {searched && recipes.length === 0 && (
        <p className="fred-med text-[15px] text-gray-400">
          No recipes found for "{query}".
        </p>
      )}

      {recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div
              onClick={() => {
                handleRecipeToView(recipe);
              }}
            >
              <MyRecipeCard key={`Recipe ${recipe.id}`} recipe={recipe} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
