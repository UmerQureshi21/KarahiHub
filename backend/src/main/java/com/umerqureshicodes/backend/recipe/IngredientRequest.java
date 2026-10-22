package com.umerqureshicodes.backend.recipe;

public record IngredientRequest(
        String name,
        String quantity,
        String unitOfMeasurement
) {
}
