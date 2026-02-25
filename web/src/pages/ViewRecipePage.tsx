import { useState } from "react";
import type { RecipeResponse } from "../types";

interface ViewRecipePageProps {
  recipe: RecipeResponse;
  onBack: () => void;
}

// Formats "MAIN_COURSE" → "Main Course"
const formatCategory = (cat: string) =>
  cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function ViewRecipePage({ recipe, onBack }: ViewRecipePageProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const images = recipe.imageUrls.slice(0, 3);
  const imageCount = images.length;

  // Placeholder state for rating — wired up later
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);

  return (
    <div className="bg-[var(--surface)] min-h-screen">
      {/* Back button */}
      <div className="max-w-[900px] mx-auto px-6 pt-6">
        <button
          onClick={onBack}
          className="fred-med text-[14px] text-[var(--secondary)] hover:underline"
        >
          &larr; Back to results
        </button>
      </div>

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

            {/* Favourite button — placeholder, wired up later */}
            <button className="shrink-0 mt-1 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-[var(--secondary)] hover:bg-[var(--secondary)]/5 transition-colors">
              <span className="text-[18px]">&#9825;</span>
              <span className="fred-med text-[13px] text-[var(--primary)]">
                {recipe.favouriteCount}
              </span>
            </button>
          </div>

          <p className="fred-light text-[14px] text-gray-400">
            by {recipe.uploadedBy}
          </p>
        </div>

        {/* Description */}
        <p className="fred-light text-[16px] text-gray-500 leading-relaxed">
          {recipe.description}
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3">
          {[
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
              <p className="fred-light text-[12px] text-gray-400 mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Categories */}
        {recipe.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.categories.map((cat, idx) => (
              <span
                key={idx}
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
                      <span className="text-gray-400"> {ing.unitOfMeasurement}</span>
                    )}
                    {" "}
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
                  <span className="shrink-0 w-[28px] h-[28px] rounded-full bg-[var(--secondary)] text-white fred-bold text-[13px] flex items-center justify-center mt-0.5">
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

        {/* Rate this recipe — placeholder section */}
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
                onClick={() => setSelectedStar(star)}
                className="text-[32px] transition-colors"
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
              You rated this {selectedStar}/5
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
