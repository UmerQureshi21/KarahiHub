import type { RecipeResponse } from "../types";

type MyRecipeCardProps = {
  recipe: RecipeResponse;
};

export default function MyRecipeCard({ recipe }: MyRecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  // Show at most 3 images
  const images = recipe.imageUrls.slice(0, 3);
  const imageCount = images.length;

  return (
    <div className="flex flex-col gap-[20px] bg-[var(--accent)] p-[10px] rounded-[20px]">
      {/* Image section — rounded, sits above the data card with a slight overlap */}
      {imageCount > 0 && (
        <div
          className={`relative z-10 grid gap-[3px] h-[190px] rounded-[14px] overflow-hidden shadow-md ${
            imageCount === 1
              ? "grid-cols-1"
              : imageCount === 2
                ? "grid-cols-2"
                : "grid-cols-2 grid-rows-2"
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
      )}

      {/* Data section — overlaps the image slightly to create a layered look */}
      <div
        className={`bg-[var(--surface)] rounded-[14px] p-5 pt-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200 `}
      >
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
        <p className="fred-light text-[14px] text-gray-500 line-clamp-2">
          {recipe.description}
        </p>

        {/* Categories */}
        {recipe.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.categories.map((category, idx) => (
              <span
                key={idx}
                className="text-[12px] bg-[var(--secondary)]/10 text-[var(--secondary)] fred-med px-2.5 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 text-[13px] text-gray-400 fred-light border-t border-gray-200/50 pt-3 mt-auto">
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
