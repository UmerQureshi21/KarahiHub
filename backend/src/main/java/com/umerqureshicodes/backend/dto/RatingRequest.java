package com.umerqureshicodes.backend.dto;

public record RatingRequest(
        Long recipeId,
        int score
) {
}


