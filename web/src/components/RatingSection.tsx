import { useState } from "react";
import { rateRecipe } from "../services/recipeService";
import type { RecipeResponse } from "../types";

interface RatingSectionProps {
  recipe: RecipeResponse;
}

export default function RatingSection({ recipe }: RatingSectionProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRate(star: number) {
    setSelectedStar(star);
    setError(null);
    try {
      await rateRecipe({ recipeId: recipe.id, score: star });
      setSubmitted(true);
    } catch (err) {
      setError("You've already rated this recipe.");
      setSelectedStar(0);
      console.error("Error rating recipe:", err);
    }
  }

  return (
    <div className="bg-[var(--accent)] rounded-[16px] p-6 text-center">
      <h2 className="fred-bold text-[18px] text-[var(--primary)] mb-2">
        Rate this recipe
      </h2>
      <p className="fred-light text-[13px] text-gray-400 mb-4">
        How would you rate this dish?
      </p>

      {/* 5-star rating */}
      <div className="flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => handleRate(star)}
            className="text-[32px] transition-colors cursor-pointer"
            style={{
              color:
                star <= (hoveredStar || selectedStar)
                  ? "var(--secondary)"
                  : "#d1d5db",
            }}
          >
            &#9733;
          </button>
        ))}
      </div>

      {selectedStar > 0 && (
        <p className="fred-med text-[13px] text-[var(--secondary)] mt-3">
          {submitted ? `You rated this ${selectedStar}/5` : "Submitting..."}
        </p>
      )}

      {error && (
        <p className="fred-light text-[13px] text-red-400 mt-3">
          {error}
        </p>
      )}
    </div>
  );
}
