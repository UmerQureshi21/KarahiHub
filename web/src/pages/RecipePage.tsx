import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../types";
import type { RecipeResponse } from "../types";
import {
  favRecipe,
  getRecipeById,
  inFavs,
  isRecipeOwned,
} from "../services/recipeService";
import { formatCategory } from "../utils/recipes";
import RatingSection from "../components/RatingSection";
import Spinner from "../components/Spinner";

// Route: /app/recipes/:id
// Keyed by id so moving between recipes starts each one with fresh state.
export default function RecipePage() {
  const { id } = useParams();
  return <RecipeView key={id} id={Number(id)} />;
}

function RecipeView({ id }: { id: number }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Cards pass the recipe in router state so we can draw the page immediately;
  // on a direct visit / reload there's no state and we wait for the fetch.
  const passedRecipe = (location.state as { recipe?: RecipeResponse } | null)
    ?.recipe;
  const [recipe, setRecipe] = useState<RecipeResponse | null>(
    passedRecipe?.id === id ? passedRecipe : null,
  );
  // null until we know — the favourite button and rating section wait for these
  const [isFaved, setIsFaved] = useState<boolean | null>(null);
  const [isOwned, setIsOwned] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  // Always fetch the latest copy (fav count / rating may have changed since the list loaded)
  useEffect(() => {
    let cancelled = false;
    Promise.all([getRecipeById(id), inFavs(id), isRecipeOwned(id)])
      .then(([fresh, fav, owned]) => {
        if (cancelled) return;
        setRecipe(fresh);
        setIsFaved(fav);
        setIsOwned(owned);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error loading recipe:", err);
        setError(
          err instanceof ApiError && err.status === 404
            ? "This recipe doesn't exist or has been removed."
            : "Couldn't load this recipe. Please try again.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Go back to wherever the user came from (search results keep their filters/page);
  // if they landed here directly there's no in-app history, so go to the dashboard.
  function handleBack() {
    if (location.key !== "default") navigate(-1);
    else navigate("/app/dashboard");
  }

  // Re-fetch after rating so the average shown at the top updates
  function refreshRecipe() {
    getRecipeById(id)
      .then(setRecipe)
      .catch((err) => console.error("Error refreshing recipe:", err));
  }

  async function handleToggleFav() {
    if (!recipe || isFaved === null) return;
    const wasFaved = isFaved;

    // Optimistic update — flip immediately so the UI feels instant
    setIsFaved(!wasFaved);
    setRecipe({
      ...recipe,
      favouriteCount: recipe.favouriteCount + (wasFaved ? -1 : 1),
    });

    // Trigger the bounce animation
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);

    try {
      // The server returns the updated recipe, which also corrects any count drift
      setRecipe(await favRecipe(recipe.id));
    } catch (err) {
      // Revert on failure
      setIsFaved(wasFaved);
      setRecipe(recipe);
      console.error("Error toggling favourite:", err);
    }
  }

  const backButton = (
    <div className="max-w-[900px] mx-auto px-6 pt-6">
      <button
        onClick={handleBack}
        className="fred-med text-[14px] text-[var(--secondary)] hover:underline"
      >
        &larr; Back
      </button>
    </div>
  );

  if (!recipe) {
    return (
      <div className="bg-[var(--surface)] min-h-screen">
        {backButton}
        {error ? (
          <div className="max-w-[900px] mx-auto px-6 py-16 text-center">
            <p className="fred-med text-[16px] text-[var(--primary)] mb-4">
              {error}
            </p>
            <Link
              to="/app/search"
              className="fred-med text-[14px] text-[var(--secondary)] hover:underline"
            >
              Search recipes
            </Link>
          </div>
        ) : (
          <Spinner label="Loading recipe..." />
        )}
      </div>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;
  const images = recipe.imageUrls.slice(0, 3);
  const imageCount = images.length;

  return (
    <div className="bg-[var(--surface)] min-h-screen">
      {backButton}

      {/* Hero image section */}
      {imageCount > 0 && (
        <div className="max-w-[900px] mx-auto px-6 pt-4">
          <div
            className={`grid gap-[4px] rounded-[16px] overflow-hidden ${
              imageCount === 1
                ? "grid-cols-1 h-[300px] md:h-[400px]"
                : imageCount === 2
                  ? "grid-cols-2 h-[280px] md:h-[360px]"
                  : "grid-cols-2 grid-rows-2 h-[280px] md:h-[360px]"
            }`}
          >
            {images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`${recipe.title} ${idx + 1}`}
                className={`w-full h-full object-cover ${
                  imageCount === 3 && idx === 0 ? "row-span-2" : ""
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Header — title, uploader, favourite */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="fred-bold text-[28px] md:text-[36px] text-[var(--primary)] leading-tight">
              {recipe.title}
            </h1>

            {/* Favourite button with heart fill + pop animation.
                Disabled until we know whether it's already a favourite. */}
            <button
              onClick={handleToggleFav}
              disabled={isFaved === null}
              aria-pressed={isFaved ?? false}
              aria-label={isFaved ? "Remove from favourites" : "Add to favourites"}
              className={`shrink-0 mt-1 flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer disabled:cursor-wait disabled:opacity-60 ${
                isFaved
                  ? "border-[var(--secondary)] bg-[var(--secondary)]/10"
                  : "border-[var(--border)] hover:border-[var(--secondary)] hover:bg-[var(--secondary)]/5"
              }`}
            >
              {/* Heart icon with burst ring behind it */}
              <span className="relative flex items-center justify-center w-[22px] h-[22px]">
                {/* Burst ring — expands and fades on favourite */}
                {animating && isFaved && (
                  <span className="absolute inset-0 rounded-full border-2 border-[var(--secondary)] heart-burst" />
                )}
                {/* Heart glyph — pops on every click */}
                <span
                  className={`text-[18px] transition-colors duration-300 ${animating ? "heart-pop" : ""}`}
                  style={{ color: isFaved ? "var(--secondary)" : "var(--muted)" }}
                >
                  {isFaved ? "♥" : "♡"}
                </span>
              </span>
              <span className="fred-med text-[13px] text-[var(--primary)]">
                {recipe.favouriteCount}
              </span>
            </button>
          </div>

          <p className="fred-light text-[14px] text-[var(--muted)]">
            by {recipe.uploadedBy}
          </p>
        </div>

        {/* Description */}
        <p className="fred-light text-[16px] text-[var(--muted)] leading-relaxed">
          {recipe.description}
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Rating", value: recipe.rating > 0 ? `${recipe.rating.toFixed(1)}/5` : "N/A" },
            { label: "Prep", value: `${recipe.prepTime}m` },
            { label: "Cook", value: `${recipe.cookTime}m` },
            { label: "Total", value: `${totalTime}m` },
            { label: "Servings", value: `${recipe.servingCount}` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex-1 min-w-[100px] bg-[var(--accent)] rounded-[12px] px-4 py-3 text-center"
            >
              <p className="fred-bold text-[18px] text-[var(--primary)]">
                {stat.value}
              </p>
              <p className="fred-light text-[12px] text-[var(--muted)] mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Categories */}
        {recipe.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.categories.map((cat) => (
              <span
                key={cat}
                className="text-[13px] bg-[var(--secondary)]/10 text-[var(--secondary)] fred-med px-3 py-1.5 rounded-full"
              >
                {formatCategory(cat)}
              </span>
            ))}
          </div>
        )}

        {/* Ingredients + Instructions side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6">
          {/* Ingredients */}
          <div className="bg-[var(--accent)] rounded-[16px] p-6">
            <h2 className="fred-bold text-[18px] text-[var(--primary)] mb-4">
              Ingredients
            </h2>
            <ul className="flex flex-col gap-2.5">
              {recipe.ingredients.map((ing, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 fred-light text-[14px] text-[var(--primary)]"
                >
                  {/* Small dot */}
                  <span className="shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--secondary)]" />
                  <span>
                    <span className="fred-med">{ing.quantity}</span>
                    {ing.unitOfMeasurement && (
                      <span className="text-[var(--muted)]">
                        {" "}
                        {ing.unitOfMeasurement}
                      </span>
                    )}{" "}
                    {ing.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-[var(--accent)] rounded-[16px] p-6">
            <h2 className="fred-bold text-[18px] text-[var(--primary)] mb-4">
              Instructions
            </h2>
            <ol className="flex flex-col gap-4">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  {/* Step number circle */}
                  <span className="shrink-0 w-[28px] h-[28px] rounded-full bg-[var(--secondary)] text-[var(--on-secondary)] fred-bold text-[13px] flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="fred-light text-[14px] text-[var(--primary)] leading-relaxed pt-0.5">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Rating section — only once we know the user doesn't own this recipe */}
        {isOwned === false && (
          <RatingSection recipeId={recipe.id} onRated={refreshRecipe} />
        )}
      </div>
    </div>
  );
}
