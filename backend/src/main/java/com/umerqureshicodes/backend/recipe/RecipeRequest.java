package com.umerqureshicodes.backend.recipe;

import java.util.List;

public record RecipeRequest(
        String title,
        String description,
        List<IngredientRequest> ingredients,
        List<String> instructions,
        int prepTime,
        int cookTime,
        int servingCount,
        List<RecipeCategory> categories
) {
}
