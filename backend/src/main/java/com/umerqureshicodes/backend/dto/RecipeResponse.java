package com.umerqureshicodes.backend.dto;

import com.umerqureshicodes.backend.entities.RecipeCategory;

import java.util.List;

public record RecipeResponse(
        Long id,
        String uploadedBy,
        String title,
        String description,
        List<IngredientRequest> ingredients,
        List<String> imageUrls,
        List<String> instructions,
        int prepTime,
        int cookTime,
        int servingCount,
        List<RecipeCategory> categories,
        int favouriteCount
) {

}
