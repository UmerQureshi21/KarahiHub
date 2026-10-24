package com.umerqureshicodes.backend.recipe;

public enum SortBy {
    RATING("rating"),
    COOK_TIME("cookTime"),
    PREP_TIME("prepTime"),
    CREATED_AT("createdAt"),
    UPDATED_AT("updatedAt"),
    SERVING_COUNT("servingCount"),
    FAVOURITE_COUNT(null);

    private final String field;

    SortBy(String field) {
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
