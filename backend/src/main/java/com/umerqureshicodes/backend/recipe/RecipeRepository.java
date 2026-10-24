package com.umerqureshicodes.backend.recipe;

import com.umerqureshicodes.backend.auth.AppUser;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByAppUserEmail(String email);

    // Search + filter with pagination (Spring appends ORDER BY and LIMIT/OFFSET from Pageable)
    // countQuery exists only to give the total count metadata that Page<T> returns
    // DISTINCT because the categories join returns one row per matching category —
    // without it a recipe in 2 categories fills 2 slots on a page and is counted twice
    @Query(value = "SELECT DISTINCT r FROM Recipe r JOIN r.categories c " +
            "WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "AND c.name IN :categories " +
            "AND r.prepTime BETWEEN :minPrep AND :maxPrep " +
            "AND r.cookTime BETWEEN :minCook AND :maxCook " +
            "AND r.rating BETWEEN :minRating AND :maxRating " +
            "AND r.servingCount BETWEEN :minServings AND :maxServings",
            countQuery = "SELECT COUNT(DISTINCT r) FROM Recipe r JOIN r.categories c " +
            "WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "AND c.name IN :categories " +
            "AND r.prepTime BETWEEN :minPrep AND :maxPrep " +
            "AND r.cookTime BETWEEN :minCook AND :maxCook " +
            "AND r.rating BETWEEN :minRating AND :maxRating " +
            "AND r.servingCount BETWEEN :minServings AND :maxServings")
    Page<Recipe> searchAndFilter(
            @Param("query") String query,
            @Param("categories") List<RecipeCategory> categories,
            @Param("minPrep") int minPrep, @Param("maxPrep") int maxPrep,
            @Param("minCook") int minCook, @Param("maxCook") int maxCook,
            @Param("minRating") double minRating, @Param("maxRating") double maxRating,
            @Param("minServings") int minServings, @Param("maxServings") int maxServings,
            Pageable pageable
    );

    // Returns true if the given recipe is in the user's favourites
    @Query("SELECT COUNT(r) > 0 FROM AppUser u JOIN u.favourites r WHERE u.email = :email AND r.id = :recipeId")
    Boolean isSelectedInFavs(@Param("recipeId") Long recipeId, @Param("email") String email);
}
