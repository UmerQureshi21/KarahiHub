import { useEffect, useMemo, useState } from "react";
import type { RecipeResponse, SortBy } from "../types";
import { sortRecipes } from "../utils/recipes";

// Loads a full (unpaged) recipe list once and sorts it on the client.
// Shared by the dashboard and favourites pages.
export function useRecipeList(
  fetchRecipes: () => Promise<RecipeResponse[]>,
  errorMessage: string,
) {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("RATING");
  const [ascending, setAscending] = useState(false);

  useEffect(() => {
    // ignore a response that lands after the page has unmounted
    let cancelled = false;
    fetchRecipes()
      .then((data) => {
        if (!cancelled) setRecipes(data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError(errorMessage);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchRecipes, errorMessage]);

  const sorted = useMemo(
    () => sortRecipes(recipes, sortBy, ascending),
    [recipes, sortBy, ascending],
  );

  return {
    recipes,
    sorted,
    loading,
    error,
    sortBy,
    setSortBy,
    ascending,
    setAscending,
  };
}
