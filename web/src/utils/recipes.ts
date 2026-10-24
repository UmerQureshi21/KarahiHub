import type { RecipeResponse, SortBy } from "../types";

// Matches the backend RecipeCategory enum values
export const CATEGORIES = [
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

// Formats "MAIN_COURSE" → "Main Course" for display
export const formatCategory = (category: string) =>
  category
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Sort choices shown on the dashboard, favourites and search pages.
// Values are the backend SortBy enum so search can send them as-is.
export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "RATING", label: "Rating" },
  { value: "COOK_TIME", label: "Cook Time" },
  { value: "PREP_TIME", label: "Prep Time" },
  { value: "CREATED_AT", label: "Newest" },
  { value: "FAVOURITE_COUNT", label: "Most Favourited" },
];

// Picks the number a recipe is sorted by for client-side sorting
const sortValue = (recipe: RecipeResponse, sortBy: SortBy): number => {
  switch (sortBy) {
    case "RATING":
      return recipe.rating;
    case "COOK_TIME":
      return recipe.cookTime;
    case "PREP_TIME":
      return recipe.prepTime;
    case "SERVING_COUNT":
      return recipe.servingCount;
    case "FAVOURITE_COUNT":
      return recipe.favouriteCount;
    default:
      return recipe.id; // higher id = newer
  }
};

// Returns a sorted copy (the dashboard and favourites lists aren't paged, so they sort locally)
export const sortRecipes = (
  recipes: RecipeResponse[],
  sortBy: SortBy,
  ascending: boolean,
) =>
  [...recipes].sort((a, b) => {
    const diff = sortValue(a, sortBy) - sortValue(b, sortBy);
    return ascending ? diff : -diff;
  });
