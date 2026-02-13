import type { Recipe } from "../types";

type TopRecipeProps = {
  recipe: Recipe;
};

export default function TopRecipe({ recipe }: TopRecipeProps) {
  return (
    <div className="relative bg-white w-full fred-med h-full rounded-[30px] overflow-hidden hover:transform hover:scale-[1.02] transition duration-300 ease shadow-lg">
      {/* Creator Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3 z-10">
        <div className="w-[36px] h-[36px] bg-[var(--secondary)] rounded-full flex items-center justify-center fred-bold text-[16px] text-white">
          {recipe.username.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] text-gray-500 fred-light">Recipe by</span>
          <span className="text-[14px] text-[var(--primary)] fred-bold">{recipe.username}</span>
        </div>
      </div>

      {/* Recipe Image */}
      <img
        src={recipe.imageUrl}
        alt={recipe.name}
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Gradient Overlay with Recipe Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
        {/* Recipe Name */}
        <h3 className="text-white text-lg mb-2">{recipe.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <span className="text-yellow-400 text-xl">★</span>
          <span className="text-white text-base">
            {recipe.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
