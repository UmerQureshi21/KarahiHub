import axios from "axios";
import type { RecipeRequest, ErrorResponse } from "../types";
import { getAccessToken } from "./userService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.message || "Something went wrong";
  }
  return "Something went wrong";
};

// Posts a new recipe to the backend. Requires a valid access token in memory
// because the backend uses @AuthenticationPrincipal to tie the recipe to a user.
export const createRecipe = async (recipe: RecipeRequest) => {
  try {
    const token = getAccessToken();
    const response = await axios.post(`${API_BASE_URL}/recipes`, recipe, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getMyRecipes = async () => {
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
    throw new Error(getErrorMessage(error));
  }
};

export const postRecipe = async (recipe: RecipeRequest) => {
    try{
        const token = getAccessToken();
        const response = await axios.post(`${API_BASE_URL}/recipes`, recipe, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};
