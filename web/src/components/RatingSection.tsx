import { useEffect, useState } from "react";
import { getMyRating, rateRecipe, updateRating } from "../services/recipeService";
import { ApiError } from "../types";
import { IconPencil } from "./icons";

interface RatingSectionProps {
  recipeId: number;
  // called after a successful rating so the parent can refresh the average
  onRated: () => void;
}

export default function RatingSection({ recipeId, onRated }: RatingSectionProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  // the user's saved score — 0 means they haven't rated it yet
  const [myScore, setMyScore] = useState(0);
  // true while the user has chosen to change an existing rating
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // shows a brief "Rating updated!" confirmation after an edit
  const [justUpdated, setJustUpdated] = useState(false);

  // Load any rating the user already gave, so they see it instead of empty stars
  useEffect(() => {
    let cancelled = false;
    getMyRating(recipeId)
      .then((rating) => {
        if (!cancelled && rating) setMyScore(rating.score);
      })
      .catch((err) => console.error("Error loading your rating:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  const hasRated = myScore > 0;
  // Stars are clickable the first time, and again once "Update rating" is pressed
  const interactive = !hasRated || editing;
  const locked = loading || submitting || !interactive;

  async function handleRate(star: number) {
    setSubmitting(true);
    setError(null);
    try {
      const rating = editing
        ? await updateRating({ recipeId, score: star })
        : await rateRecipe({ recipeId, score: star });
      setMyScore(rating.score);
      if (editing) {
        setEditing(false);
        setJustUpdated(true);
        setTimeout(() => setJustUpdated(false), 2500);
      }
      onRated();
    } catch (err) {
      // Show the backend's reason (already rated, own recipe, ...) rather than guessing
      setError(err instanceof ApiError ? err.message : "Couldn't save your rating.");
      console.error("Error rating recipe:", err);
    } finally {
      setSubmitting(false);
    }
  }

  // Stars fill up to the hovered star while choosing, otherwise up to the saved score
  const filledUpTo = interactive && hoveredStar ? hoveredStar : myScore;

  return (
    <div className="bg-[var(--accent)] rounded-[16px] p-6 text-center">
      <h2 className="fred-bold text-[18px] text-[var(--primary)] mb-2">
        {hasRated ? "Your rating" : "Rate this recipe"}
      </h2>
      <p className="fred-light text-[13px] text-[var(--muted)] mb-4">
        {editing
          ? "Pick a new rating"
          : hasRated
            ? "Thanks for rating this dish!"
            : "How would you rate this dish?"}
      </p>

      {/* 5-star rating */}
      <div
        className="flex items-center justify-center gap-1"
        onMouseLeave={() => setHoveredStar(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={locked}
            aria-label={`Rate ${star} out of 5`}
            onMouseEnter={() => setHoveredStar(star)}
            onFocus={() => setHoveredStar(star)}
            onBlur={() => setHoveredStar(0)}
            onClick={() => handleRate(star)}
            className="text-[32px] transition-colors cursor-pointer disabled:cursor-default"
            style={{
              color: star <= filledUpTo ? "var(--star)" : "var(--border)",
            }}
          >
            &#9733;
          </button>
        ))}
      </div>

      {submitting && (
        <p className="fred-med text-[13px] text-[var(--secondary)] mt-3">
          Submitting...
        </p>
      )}

      {!submitting && justUpdated && (
        <p className="fred-med text-[13px] text-[var(--secondary)] mt-3">
          Rating updated!
        </p>
      )}

      {!submitting && !justUpdated && hasRated && !editing && (
        <div className="mt-3 flex flex-col items-center gap-2">
          <p className="fred-med text-[13px] text-[var(--secondary)]">
            You rated this {myScore}/5
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] fred-med border border-[var(--border)] text-[var(--muted)] hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-colors cursor-pointer"
          >
            <IconPencil className="w-[13px] h-[13px]" />
            Update rating
          </button>
        </div>
      )}

      {!submitting && editing && (
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="mt-3 fred-med text-[13px] text-[var(--muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
        >
          Cancel
        </button>
      )}

      {error && (
        <p className="fred-light text-[13px] text-red-500 mt-3">{error}</p>
      )}
    </div>
  );
}
