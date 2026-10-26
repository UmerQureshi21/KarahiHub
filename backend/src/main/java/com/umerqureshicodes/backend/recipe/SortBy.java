package com.umerqureshicodes.backend.recipe;

//Hibernate works with field names, not database column names
public enum SortBy {
    RATING("rating"),
    COOK_TIME("cookTime"),
    PREP_TIME("prepTime"),
    CREATED_AT("createdAt"),
    UPDATED_AT("updatedAt"),
    SERVING_COUNT("servingCount"),
    FAVOURITE_COUNT("favouriteCount"); //works even though this field not in db

    private final String field;

    SortBy(String field) {
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
