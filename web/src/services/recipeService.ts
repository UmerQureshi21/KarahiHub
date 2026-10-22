import axios from "axios";
import { ApiError } from "../types";
import type {
  RatingRequest,
  RatingResponse,
  RecipeRequest,
  RecipeResponse,
  SearchFilterRequest,
} from "../types";
import {
  checkAuthOnError,
  getAccessToken,
  getErrorMessage,
} from "./userService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const getMyRecipes = async (
  _retried = false,
): Promise<RecipeResponse[]> => {
  try {
    const token = getAccessToken();
    const response = await axios.get(`${API_BASE_URL}/recipes/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (!_retried && (await checkAuthOnError(error))) {
      return await getMyRecipes(true);
    }
    throw new ApiError(getErrorMessage(error));
  }
};

export const postRecipe = async (
  recipe: RecipeRequest,
  images: File[],
  _retried = false,
): Promise<RecipeResponse> => {
  try {
    const token = getAccessToken();

    const formData = new FormData();
    formData.append(
      "recipe",
      new Blob([JSON.stringify(recipe)], { type: "application/json" }),
    );
    images.forEach((file) => formData.append("images", file));

    const response = await axios.post(`${API_BASE_URL}/recipes`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (!_retried && (await checkAuthOnError(error))) {
      return await postRecipe(recipe, images, true);
    }
    throw new ApiError(getErrorMessage(error));
  }
};

export const searchRecipes = async (
  query: SearchFilterRequest,
  _retried = false,
): Promise<RecipeResponse[]> => {
  try {
    const token = getAccessToken();
    const response = await axios.post(`${API_BASE_URL}/recipes/search`, query, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (!_retried && (await checkAuthOnError(error))) {
      return await searchRecipes(query, true);
    }
    throw new ApiError(getErrorMessage(error));
  }
};

export const getFavs = async (
  _retried = false,
): Promise<RecipeResponse[]> => {
  try {
    const token = getAccessToken();
    const response = await axios.get(`${API_BASE_URL}/recipes/favs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (!_retried && (await checkAuthOnError(error))) {
      return await getFavs(true);
    }
    throw new ApiError(getErrorMessage(error));
  }
};

export const favRecipe = async (
  id: number,
  _retried = false,
): Promise<RecipeResponse> => {
  try {
    const token = getAccessToken();
    const response = await axios.post(
      `${API_BASE_URL}/recipes/${id}/favourite`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (!_retried && (await checkAuthOnError(error))) {
      return await favRecipe(id, true);
    }
    throw new ApiError(getErrorMessage(error));
  }
};

export const inFavs = async (
  id: number,
  _retried = false,
): Promise<boolean> => {
  try {
    const token = getAccessToken();
    const response = await axios.get(`${API_BASE_URL}/recipes/${id}/isfav`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (!_retried && (await checkAuthOnError(error))) {
      return await inFavs(id, true);
    }
    throw new ApiError(getErrorMessage(error));
  }
};

export const isRecipeOwned = async (
  recipeId: number,
  _retried = false,
): Promise<boolean> => {
  try {
    const token = getAccessToken();
    const response = await axios.get(
      `${API_BASE_URL}/recipes/owned?recipeId=${recipeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (!_retried && (await checkAuthOnError(error))) {
      return await isRecipeOwned(recipeId, true);
    }
    throw new ApiError(getErrorMessage(error));
  }
};

export const rateRecipe = async (
  ratingRequest: RatingRequest,
  _retried = false,
): Promise<RatingResponse> => {
  try {
    const token = getAccessToken();
    const response = await axios.post(
      `${API_BASE_URL}/ratings`,
      ratingRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (!_retried && (await checkAuthOnError(error))) {
      return await rateRecipe(ratingRequest, true);
    }
    throw new ApiError(getErrorMessage(error));
  }
};
