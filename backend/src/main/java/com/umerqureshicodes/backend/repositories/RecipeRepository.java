package com.umerqureshicodes.backend.repositories;

import com.umerqureshicodes.backend.entities.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByAppUserEmail(String email);

    // full search + filter + sort ascending
    // CASE turns the sortBy param into the actual column to sort by,
    // casting everything to DOUBLE PRECISION so all branches return the same type
    @Query(value = "SELECT * FROM " +
            "(SELECT * FROM recipe WHERE LOWER(title) LIKE LOWER(CONCAT('%', :query, '%'))) AS recipesMatchingTitle " +
            "WHERE id IN (SELECT recipe_id FROM recipe_categories WHERE category_name IN (:categories)) " +
            "AND prep_time BETWEEN :minPrep AND :maxPrep " +
            "AND cook_time BETWEEN :minCook AND :maxCook " +
            "AND rating BETWEEN :minRating AND :maxRating " +
            "AND serving_count BETWEEN :minServings AND :maxServings " +
            "ORDER BY CASE :sortBy " +
            "WHEN 'rating' THEN CAST(rating AS DOUBLE PRECISION) " +
            "WHEN 'cook_time' THEN CAST(cook_time AS DOUBLE PRECISION) " +
            "WHEN 'prep_time' THEN CAST(prep_time AS DOUBLE PRECISION) " +
            "WHEN 'created_at' THEN EXTRACT(EPOCH FROM created_at) " +
            "END ASC", nativeQuery = true)
    List<Recipe> searchAndFilterAsc(
            @Param("query") String query,
            @Param("categories") List<String> categories,
            @Param("minPrep") int minPrep, @Param("maxPrep") int maxPrep,
            @Param("minCook") int minCook, @Param("maxCook") int maxCook,
            @Param("minRating") double minRating, @Param("maxRating") double maxRating,
            @Param("minServings") int minServings, @Param("maxServings") int maxServings,
            @Param("sortBy") String sortBy
    );

    // full search + filter + sort descending
    @Query(value = "SELECT * FROM " +
            "(SELECT * FROM recipe WHERE LOWER(title) LIKE LOWER(CONCAT('%', :query, '%'))) AS recipesMatchingTitle " +
            "WHERE id IN (SELECT recipe_id FROM recipe_categories WHERE category_name IN (:categories)) " +
            "AND prep_time BETWEEN :minPrep AND :maxPrep " +
            "AND cook_time BETWEEN :minCook AND :maxCook " +
            "AND rating BETWEEN :minRating AND :maxRating " +
            "AND serving_count BETWEEN :minServings AND :maxServings " +
            "ORDER BY CASE :sortBy " +
            "WHEN 'rating' THEN CAST(rating AS DOUBLE PRECISION) " +
            "WHEN 'cook_time' THEN CAST(cook_time AS DOUBLE PRECISION) " +
            "WHEN 'prep_time' THEN CAST(prep_time AS DOUBLE PRECISION) " +
            "WHEN 'created_at' THEN EXTRACT(EPOCH FROM created_at) " +
            "END DESC", nativeQuery = true)
    List<Recipe> searchAndFilterDesc(
            @Param("query") String query,
            @Param("categories") List<String> categories,
            @Param("minPrep") int minPrep, @Param("maxPrep") int maxPrep,
            @Param("minCook") int minCook, @Param("maxCook") int maxCook,
            @Param("minRating") double minRating, @Param("maxRating") double maxRating,
            @Param("minServings") int minServings, @Param("maxServings") int maxServings,
            @Param("sortBy") String sortBy
    );
}
