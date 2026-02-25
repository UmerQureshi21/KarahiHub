import axios from "axios";
import { ApiError } from "../types";
import type {
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

export const getMyRecipes: () => Promise<RecipeResponse[]> = async () => {
  try {
    const token = getAccessToken();
    console.log("Access Token:", token); // Debugging line to check if token is retrieved
    const response = await axios.get(`${API_BASE_URL}/recipes/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (checkAuthOnError(error)) {
      return await getMyRecipes(); // Retry fetching recipes after refreshing token
    } else {
      throw new ApiError(getErrorMessage(error));
    }
  }
};

export const postRecipe = async (
  recipe: RecipeRequest,
  images: File[],
): Promise<RecipeResponse> => {
  try {
    const token = getAccessToken();

    // Build multipart form: "recipe" part is a JSON blob, "images" part is the file list.
    // This matches the backend @RequestPart("recipe") + @RequestPart("images") signature.
    const formData = new FormData();
    formData.append(
      "recipe",
      new Blob([JSON.stringify(recipe)], { type: "application/json" }),
    );
    images.forEach((file) => formData.append("images", file));

    const response = await axios.post(`${API_BASE_URL}/recipes`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Let the browser set Content-Type with the multipart boundary automatically
      },
    });
    return response.data;
  } catch (error) {
    if (checkAuthOnError(error)) {
      return await postRecipe(recipe, images);
    } else {
      throw new ApiError(getErrorMessage(error));
    }
  }
};

// export const getRecipeById = async (id: number): Promise<RecipeResponse> => {
//   try {
//     const token = getAccessToken();
//     const response = await axios.get(`${API_BASE_URL}/recipes/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     if (checkAuthOnError(error)) {
//       return await getRecipeById(id);
//     } else {
//       throw new ApiError(getErrorMessage(error));
//     }
//   }
// };

export const searchRecipes: (
  query: SearchFilterRequest,
) => Promise<RecipeResponse[]> = async (query: SearchFilterRequest) => {
  try {
    const token = getAccessToken();
    const response = await axios.post(`${API_BASE_URL}/recipes/search`, query, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (checkAuthOnError(error)) {
      return await searchRecipes(query); // Retry searching recipes after refreshing token
    } else {
      throw new ApiError(getErrorMessage(error));
    }
  }
};
