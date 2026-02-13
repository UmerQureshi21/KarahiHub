package com.umerqureshicodes.backend.dto;

public record IngredientRequest(
        String name,
        String quantity,
        String unitOfMeasurement
) {
}
