import { getMyRecipes } from "../services/recipeService";

 

export default function DashboardPage() {

  async function fetchMyRecipes() {
    try {
      const recipes = await getMyRecipes();
      console.log("My Recipes:", recipes);
    } catch (error) {
      console.error("Error fetching my recipes:", error);
    }
  }

  fetchMyRecipes();

  return (
    <div>
      <h1>Dashboard Page</h1>
    </div>
  );
}