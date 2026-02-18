package com.umerqureshicodes.backend.dto;

import java.util.List;

// all the search, filter, and sort params in one request body
public record SearchFilterRequest(
        String query,
        List<String> categories,
        int minPrep,
        int maxPrep,
        int minCook,
        int maxCook,
        double minRating,
        double maxRating,
        int minServings,
        int maxServings,
        String sortBy,       // "rating", "cook_time", "prep_time", or "created_at"
        boolean ascending
) {
}
