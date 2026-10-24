package com.umerqureshicodes.backend.recipe;

import java.util.List;

// all the search, filter, and sort params in one request body
public record SearchFilterRequest(
        String query,
        List<RecipeCategory> categories,
        int minPrep,
        int maxPrep,
        int minCook,
        int maxCook,
        double minRating,
        double maxRating,
        int minServings,
        int maxServings,
        SortBy sortBy,
        boolean ascending,
        int page,
        int size
) {
}
