package com.umerqureshicodes.backend.repositories;

import com.umerqureshicodes.backend.entities.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByAppUserEmail(String email);
    /*
      SELECT * FROM recipe WHERE user_id = ?

    * */
}
