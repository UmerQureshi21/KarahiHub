import { api } from "./apiClient";
import type {
  PageResponse,
  RatingRequest,
  RatingResponse,
  RecipeRequest,
  RecipeResponse,
  SearchFilterRequest,
} from "../types";

// Auth headers, token refresh and error conversion all happen in apiClient,
// so each call here is just the request itself. Errors arrive as ApiError.

export const getMyRecipes = async (): Promise<RecipeResponse[]> =>
  (await api.get<RecipeResponse[]>("/recipes/mine")).data;

export const getRecipeById = async (id: number): Promise<RecipeResponse> =>
  (await api.get<RecipeResponse>(`/recipes/${id}`)).data;

export const postRecipe = async (
  recipe: RecipeRequest,
  images: File[],
): Promise<RecipeResponse> => {
  const formData = new FormData();
  formData.append(
    "recipe",
    new Blob([JSON.stringify(recipe)], { type: "application/json" }),
  );
  images.forEach((file) => formData.append("images", file));
  return (await api.post<RecipeResponse>("/recipes", formData)).data;
};

export const searchRecipes = async (
  query: SearchFilterRequest,
): Promise<PageResponse<RecipeResponse>> =>
  (await api.post<PageResponse<RecipeResponse>>("/recipes/search", query)).data;

export const getFavs = async (): Promise<RecipeResponse[]> =>
  (await api.get<RecipeResponse[]>("/recipes/favs")).data;

// Toggles the favourite on/off and returns the updated recipe
export const favRecipe = async (id: number): Promise<RecipeResponse> =>
  (await api.post<RecipeResponse>(`/recipes/${id}/favourite`)).data;

export const inFavs = async (id: number): Promise<boolean> =>
  (await api.get<boolean>(`/recipes/${id}/isfav`)).data;

export const isRecipeOwned = async (recipeId: number): Promise<boolean> =>
  (await api.get<boolean>("/recipes/owned", { params: { recipeId } })).data;

export const rateRecipe = async (
  ratingRequest: RatingRequest,
): Promise<RatingResponse> =>
  (await api.post<RatingResponse>("/ratings", ratingRequest)).data;

// The current user's rating for a recipe, or null if they haven't rated it (204)
export const getMyRating = async (
  recipeId: number,
): Promise<RatingResponse | null> =>
  (await api.get<RatingResponse>("/ratings/mine", { params: { recipeId } })).data || null;
