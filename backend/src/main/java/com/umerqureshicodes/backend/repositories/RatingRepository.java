package com.umerqureshicodes.backend.repositories;

import com.umerqureshicodes.backend.entities.Rating;
import com.umerqureshicodes.backend.entities.RatingId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RatingRepository extends JpaRepository<Rating, RatingId> {

    // Returns the average score for a recipe across all ratings
    @Query(value = "SELECT AVG(score) FROM rating WHERE recipe_id = :recipeId", nativeQuery = true)
    Double getAverageScore(@Param("recipeId") Long recipeId);
}
