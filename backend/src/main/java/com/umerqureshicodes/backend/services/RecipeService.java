package com.umerqureshicodes.backend.services;

import com.umerqureshicodes.backend.dto.IngredientRequest;
import com.umerqureshicodes.backend.dto.RecipeRequest;
import com.umerqureshicodes.backend.entities.Ingredient;
import com.umerqureshicodes.backend.entities.Recipe;
import com.umerqureshicodes.backend.repositories.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;

    public RecipeService(RecipeRepository recipeRepository) {this.recipeRepository = recipeRepository;}

    public RecipeRequest saveRecipe(RecipeRequest request) {
        Recipe recipe = new Recipe();
        recipe.setUserId(1L);
        recipe.setTitle(request.title());
        recipe.setDescription(request.description());
        recipe.setInstructions(request.instructions());
        recipe.setPrepTime(request.prepTime());
        recipe.setCookTime(request.cookTime());
        recipe.setServingCount(request.servingCount());
        recipe.setCategories(request.categories());
        recipe.setRating(0);
        recipe.setCreatedAt(new Date());
        recipe.setUpdatedAt(new Date());

        List<Ingredient> ingredients = request.ingredients().stream()
                .map(ing -> new Ingredient(ing.name(), ing.quantity(), ing.unitOfMeasurement(), recipe))
                .toList();
        recipe.setIngredients(ingredients);

        recipeRepository.save(recipe);
        return request;
    }

    public List<RecipeRequest> getAllRecipes() {
        return recipeRepository.findAll().stream()
                .map(this::convertToDto)
                .toList();
    }

    public RecipeRequest convertToDto(Recipe recipe) {
        List<IngredientRequest> ingredients = recipe.getIngredients().stream()
                .map(ing -> new IngredientRequest(ing.getName(), ing.getQuantity(), ing.getUnitOfMeasurement().orElse(null)))
                .toList();

        return new RecipeRequest(
                recipe.getTitle(),
                recipe.getDescription(),
                ingredients,
                recipe.getInstructions(),
                recipe.getPrepTime(),
                recipe.getCookTime(),
                recipe.getServingCount(),
                recipe.getCategories()
        );
    }
}
