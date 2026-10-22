package com.umerqureshicodes.backend.rating;

public record RatingRequest(
        Long recipeId,
        int score
) {
}


