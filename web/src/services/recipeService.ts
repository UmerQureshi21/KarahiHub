import axios from 'axios';
import type { RecipeRequest } from '../types';
import { userService } from './userService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173/api';

// Posts a new recipe to the backend. Requires a valid access token in memory
// because the backend uses @AuthenticationPrincipal to tie the recipe to a user.
export const createRecipe = async (recipe: RecipeRequest) => {
    const token = userService.getAccessToken();
    const response = await axios.post(`${API_BASE_URL}/recipes`, recipe, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
