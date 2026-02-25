export type Recipe = {
  name: string;
  imageUrl: string;
  rating: number;
  username: string;
  description: string;
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servingCount: number;
  categories: string[];
  ingredients: Ingredient[];
};

export type Ingredient = {
  name: string;
  quantity: number;
  unit?: string;
};

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
};

// Matches the backend IngredientRequest DTO (quantity is a string on the backend)
export type IngredientRequest = {
  name: string;
  quantity: string;
  unitOfMeasurement: string | null;
};

export type AuthResponse = {
  accessToken: string;
  email: string;
  username: string;
};

// Matches the backend RecipeResponse DTO returned from GET/POST endpoints
export type RecipeResponse = {
  id: number;
  uploadedBy: string;
  title: string;
  description: string;
  ingredients: IngredientRequest[];
  imageUrls: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servingCount: number;
  categories: string[];
  favouriteCount: number;
};

// Matches the backend ErrorResponse record from GlobalExceptionHandler
export type ErrorResponse = {
  status: number;
  message: string;
};

// Custom error class that carries the full ErrorResponse (status + message).
// Extends Error so it works with try/catch, but also exposes the status code
// so callers can check for 401s, 409s, etc.
export class ApiError extends Error {
  status: number;
  message: string;
  constructor(response: ErrorResponse) {
    super(response.message);
    this.status = response.status;
    this.message = response.message;
  }
}

export type CategoryResponse = {
  names: string[];
};

export type SearchFilterRequest = {
  query: string;
  categories: string[];
  minPrep: number;
  maxPrep: number;
  minCook: number;
  maxCook: number;
  minRating: number;
  maxRating: number;
  minServings: number;
  maxServings: number;
  sortBy: "rating" | "prep_time" | "cook_time" | "created_at";
  ascending: boolean;
};
