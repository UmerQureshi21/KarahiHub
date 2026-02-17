import axios from "axios";
import { ApiError } from "../types";
import type { RecipeRequest, RecipeResponse } from "../types";
import {
  checkAuthOnError,
  getAccessToken,
  getErrorMessage,
} from "./userService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";


export const getMyRecipes: () => Promise<RecipeResponse[]> = async () => {
  try {
    const token = getAccessToken();
    console.log("Access Token:", token); // Debugging line to check if token is retrieved
    const response = await axios.get(`${API_BASE_URL}/recipes/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (checkAuthOnError(error)) {
      return await getMyRecipes(); // Retry fetching recipes after refreshing token
    } else {
      throw new ApiError(getErrorMessage(error));
    }
  }
};

export const postRecipe: (recipe: RecipeRequest) => Promise<RecipeResponse> = async (recipe: RecipeRequest) => {
  try {
    const token = getAccessToken();
    const response = await axios.post(`${API_BASE_URL}/recipes`, recipe, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (checkAuthOnError(error)) {
      return await postRecipe(recipe); // Retry posting recipe after refreshing token
    } else {
      throw new ApiError(getErrorMessage(error));
    }
  }
};
