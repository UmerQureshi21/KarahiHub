import type { RecipeResponse } from "../types";

type MyRecipeCardProps = {
  recipe: RecipeResponse;
};

export default function MyRecipeCard({ recipe }: MyRecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="bg-[var(--surface)] rounded-[16px] p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
      {/* Title + favourite count */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="fred-bold text-[18px] text-[var(--primary)] leading-tight">
          {recipe.title}
        </h3>
        <span className="shrink-0 bg-[var(--accent)] text-[var(--secondary)] fred-bold text-[13px] px-2.5 py-1 rounded-full">
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
      <div className="flex items-center gap-4 text-[13px] text-gray-400 fred-light border-t border-gray-100 pt-3 mt-auto">
        <div className="flex items-center gap-1.5">
          <span>Prep {recipe.prepTime}m</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Cook {recipe.cookTime}m</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Total {totalTime}m</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span>{recipe.servingCount} serving{recipe.servingCount !== 1 && "s"}</span>
        </div>
      </div>
    </div>
  );
}
