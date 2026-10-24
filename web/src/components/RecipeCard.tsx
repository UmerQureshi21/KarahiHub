import type { RecipeResponse } from "../types";
import { formatCategory } from "../utils/recipes";
import Logo from "./Logo";

type RecipeCardProps = {
  recipe: RecipeResponse;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  // Show at most 3 images
  const images = recipe.imageUrls.slice(0, 3);
  const imageCount = images.length;

  return (
    <div className="group h-full flex flex-col gap-[20px] bg-[var(--accent)] p-[10px] rounded-[20px] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      {/* Image section — up to 3 photos in a grid, or a placeholder when there are none */}
      <div
        className={`relative z-10 grid gap-[3px] h-[190px] rounded-[14px] overflow-hidden shadow-md [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-105 ${
          imageCount <= 1
            ? "grid-cols-1"
            : imageCount === 2
              ? "grid-cols-2"
              : "grid-cols-2 grid-rows-2"
        }`}
      >
        {imageCount === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-[var(--surface)]">
            <Logo className="w-[64px] opacity-30" />
          </div>
        ) : (
          images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={idx === 0 ? recipe.title : ""}
              loading="lazy"
              className={`w-full h-full object-cover ${
                imageCount === 3 && idx === 0 ? "row-span-2" : ""
              }`}
            />
          ))
        )}
      </div>

      {/* Data section */}
      <div className="flex-1 bg-[var(--surface)] rounded-[14px] p-5 pt-6 flex flex-col gap-3 shadow-sm">
        {/* Title + favourite count */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="fred-bold text-[18px] text-[var(--primary)] leading-tight">
            {recipe.title}
          </h3>
          <span className="shrink-0 text-[var(--secondary)] fred-bold text-[13px] px-2.5 py-1 rounded-full bg-[var(--secondary)]/10">
            {recipe.favouriteCount} fav{recipe.favouriteCount !== 1 && "s"}
          </span>
        </div>

        {/* Description */}
        <p className="fred-light text-[14px] text-[var(--muted)] line-clamp-2">
          {recipe.description}
        </p>

        {/* Categories */}
        {recipe.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.categories.map((category) => (
              <span
                key={category}
                className="text-[12px] bg-[var(--secondary)]/10 text-[var(--secondary)] fred-med px-2.5 py-1 rounded-full"
              >
                {formatCategory(category)}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[var(--muted)] fred-light border-t border-[var(--border)] pt-3 mt-auto">
          <span>Prep {recipe.prepTime}m</span>
          <span>Cook {recipe.cookTime}m</span>
          <span>Total {totalTime}m</span>
          <span className="ml-auto">
            {recipe.servingCount} serving{recipe.servingCount !== 1 && "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
