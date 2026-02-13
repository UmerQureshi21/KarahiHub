import type { Recipe } from "../types";

type TopRecipeProps = {
  recipe: Recipe;
};

export default function TopRecipe({ recipe }: TopRecipeProps) {
  return (
    <div className="bg-white w-full fred-med h-full rounded-[30px] overflow-hidden hover:transform hover:scale-[1.02] transition duration-300 ease shadow-lg flex flex-col">
      {/* Image Section */}
      <div className="relative w-full h-[60%]">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
          <span className="text-yellow-400 text-lg">★</span>
          <span className="text-[var(--primary)] fred-bold text-sm">
            {recipe.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-[32px] h-[32px] bg-[var(--secondary)] rounded-full flex items-center justify-center fred-bold text-[14px] text-white">
            {recipe.username.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-500 fred-light">
              Recipe by
            </span>
            <span className="text-[13px] text-[var(--primary)] fred-bold">
              {recipe.username}
            </span>
          </div>
        </div>

        {/* Recipe Name */}
        <h3 className="text-[var(--primary)] fred-bold text-xl mb-2">
          {recipe.name}
        </h3>

        {/* Mock Description */}
        <p className="text-gray-600 fred-light text-sm mb-3 line-clamp-2 flex-1">
          A delicious and authentic Pakistani recipe passed down through
          generations. Perfect for family gatherings and special occasions.
        </p>

        {/* Mock Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500 fred-light border-t border-gray-100 pt-1">
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>45 min</span>
          </div>
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>4 servings</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Category</span>
            <span>Dinner, Lunch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
