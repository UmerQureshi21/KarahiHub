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

    @Query(value = "SELECT * FROM recipe WHERE LOWER(title) LIKE LOWER(CONCAT('%', :query, '%'))", nativeQuery = true)
    List<Recipe> searchByTitle(@Param("query") String query);
}
