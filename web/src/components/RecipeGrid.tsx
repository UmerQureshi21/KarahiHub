import { Link } from "react-router-dom";
import type { RecipeResponse } from "../types";
import RecipeCard from "./RecipeCard";

type RecipeGridProps = {
  recipes: RecipeResponse[];
};

// Responsive grid of recipe cards. Each card is a real link to /app/recipes/:id,
// so it works with the keyboard, middle-click, and the browser back button.
// The recipe is passed in router state so the detail page can render instantly.
export default function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <Link
          key={recipe.id}
          to={`/app/recipes/${recipe.id}`}
          state={{ recipe }}
          className="block rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
        >
          <RecipeCard recipe={recipe} />
        </Link>
      ))}
    </div>
  );
}
