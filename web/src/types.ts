export type Recipe = {
    name: string;
    imageUrl: string;
    rating: number
    username: string;
    description: string;
    instructions: string[];
    prepTime: number; // in minutes
    cookTime: number; // in minutes
    servingCount: number;
    categories: string[];
    ingredients: Ingredient[];
}

export type Ingredient = {
    name: string;
    quantity: number;
    unit?: string;
}

// Matches the backend RecipeRequest DTO sent to POST /api/recipes
export type RecipeRequest = {
    title: string;
    description: string;
    ingredients: IngredientRequest[];
    instructions: string[];
    prepTime: number;
    cookTime: number;
    servingCount: number;
    categories: string[];
}

// Matches the backend IngredientRequest DTO (quantity is a string on the backend)
export type IngredientRequest = {
    name: string;
    quantity: string;
    unitOfMeasurement: string | null;
}

export type AuthResponse = {
    accessToken: string;
    email: string;
    username: string;
}