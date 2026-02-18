package com.umerqureshicodes.backend.repositories;

import com.umerqureshicodes.backend.entities.Category;
import com.umerqureshicodes.backend.entities.RecipeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, RecipeCategory> {
}
