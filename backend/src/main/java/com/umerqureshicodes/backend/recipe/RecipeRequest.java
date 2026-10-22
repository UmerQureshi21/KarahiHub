package com.umerqureshicodes.backend.recipe;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record RecipeRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotEmpty List<IngredientRequest> ingredients,
        @NotEmpty List<String> instructions,
        @Min(0) int prepTime,
        @Min(0) int cookTime,
        @Min(1) int servingCount,
        @NotEmpty List<RecipeCategory> categories
) {
}
