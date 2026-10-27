import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { RecipeResponse } from "../types";
import { favRecipe, getFavs } from "../services/recipeService";
import { useAuth } from "../context/useAuth";
import RecipeCard from "./RecipeCard";

type RecipeGridProps = {
  recipes: RecipeResponse[];
};

// Responsive grid of recipe cards. Each card is a real link to /app/recipes/:id,
// so it works with the keyboard, middle-click, and the browser back button.
// The recipe is passed in router state so the detail page can render instantly.
//
// Each card also gets a heart button for favouriting without opening the recipe.
// The heart sits *on top of* the link rather than inside it — a button inside a
// link is invalid HTML, and its click would also open the recipe.
export default function RecipeGrid({ recipes }: RecipeGridProps) {
  const { username } = useAuth();
  // ids of the user's favourites; null until loaded (hearts stay hidden till then)
  const [favIds, setFavIds] = useState<Set<number> | null>(null);
  // favourite counts changed by clicking a heart, so the card's "N favs" updates too
  const [counts, setCounts] = useState<Record<number, number>>({});
  // which heart is playing its pop animation
  const [popping, setPopping] = useState<number | null>(null);

  // One request for the whole grid instead of an isfav call per card
  useEffect(() => {
    let cancelled = false;
    getFavs()
      .then((favs) => {
        if (!cancelled) setFavIds(new Set(favs.map((r) => r.id)));
      })
      .catch((err) => console.error("Error loading favourites:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleFav(recipe: RecipeResponse, currentCount: number) {
    if (!favIds) return;
    const wasFav = favIds.has(recipe.id);

    // Optimistic update — flip the heart and count straight away
    const flip = (ids: Set<number>, add: boolean) => {
      const next = new Set(ids);
      if (add) next.add(recipe.id);
      else next.delete(recipe.id);
      return next;
    };
    setFavIds((ids) => (ids ? flip(ids, !wasFav) : ids));
    setCounts((c) => ({ ...c, [recipe.id]: currentCount + (wasFav ? -1 : 1) }));
    setPopping(recipe.id);
    setTimeout(() => setPopping(null), 450);

    try {
      // The server returns the updated recipe — use its count in case others favourited too
      const updated = await favRecipe(recipe.id);
      setCounts((c) => ({ ...c, [recipe.id]: updated.favouriteCount }));
    } catch (err) {
      // Revert on failure
      setFavIds((ids) => (ids ? flip(ids, wasFav) : ids));
      setCounts((c) => ({ ...c, [recipe.id]: currentCount }));
      console.error("Error toggling favourite:", err);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => {
        const shown = {
          ...recipe,
          favouriteCount: counts[recipe.id] ?? recipe.favouriteCount,
        };
        const isFav = favIds?.has(recipe.id) ?? false;
        // The backend won't let you favourite your own recipe, so no heart on those.
        // uploadedBy is the uploader's display name, which matches the logged-in username.
        const canFav = favIds !== null && recipe.uploadedBy !== username;

        return (
          // The wrapper does the hover lift so the card and its heart move together
          <div
            key={recipe.id}
            className="relative rounded-[20px] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <Link
              to={`/app/recipes/${recipe.id}`}
              state={{ recipe: shown }}
              className="block h-full rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
            >
              <RecipeCard recipe={shown} />
            </Link>

            {canFav && (
              <button
                type="button"
                onClick={() => toggleFav(recipe, shown.favouriteCount)}
                aria-pressed={isFav}
                aria-label={
                  isFav
                    ? `Remove ${recipe.title} from favourites`
                    : `Add ${recipe.title} to favourites`
                }
                title={isFav ? "Remove from favourites" : "Add to favourites"}
                // top/right line up with the photo's corner (card padding + a little inset)
                className="absolute top-[20px] right-[20px] z-20 w-[38px] h-[38px] rounded-full flex items-center justify-center bg-[var(--surface)]/90 backdrop-blur-sm shadow-md hover:scale-110 transition-transform focus-visible:outline-2 focus-visible:outline-[var(--secondary)]"
              >
                <span
                  className={`text-[20px] leading-none ${popping === recipe.id ? "heart-pop" : ""}`}
                  style={{ color: isFav ? "var(--heart)" : "var(--muted)" }}
                >
                  {isFav ? "♥" : "♡"}
                </span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
