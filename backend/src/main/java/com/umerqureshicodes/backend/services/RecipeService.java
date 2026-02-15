package com.umerqureshicodes.backend.services;

import com.umerqureshicodes.backend.dto.IngredientRequest;
import com.umerqureshicodes.backend.dto.RecipeRequest;
import com.umerqureshicodes.backend.dto.RecipeResponse;
import com.umerqureshicodes.backend.entities.AppUser;
import com.umerqureshicodes.backend.entities.Ingredient;
import com.umerqureshicodes.backend.entities.Recipe;
import com.umerqureshicodes.backend.repositories.AppUserRepository;
import com.umerqureshicodes.backend.repositories.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final AppUserRepository appUserRepository;

    public RecipeService(RecipeRepository recipeRepository, AppUserRepository appUserRepository) {
        this.recipeRepository = recipeRepository;
        this.appUserRepository = appUserRepository;
    }

    public RecipeResponse saveRecipe(RecipeRequest request, AppUser appUser) {
        // The appUser from @AuthenticationPrincipal only has email (from the JWT).
        // Load the full user from the DB so JPA can properly set the foreign key.
        AppUser fullUser = appUserRepository.findByEmail(appUser.getEmail()).orElseThrow();

        Recipe recipe = new Recipe();
        recipe.setAppUser(fullUser);
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
        return convertToDto(recipe);
    }

    public List<RecipeResponse> getAllRecipes() {
        return recipeRepository.findAll().stream()
                .map(this::convertToDto)
                .toList();
    }

    public RecipeResponse getById(Long id) {
        return convertToDto(Objects.requireNonNull(recipeRepository.findById(id).orElse(null)));
    }

    public RecipeResponse convertToDto(Recipe recipe) {
        List<IngredientRequest> ingredients = recipe.getIngredients().stream()
                .map(ing -> new IngredientRequest(ing.getName(), ing.getQuantity(), ing.getUnitOfMeasurement().orElse(null)))
                .toList();

        return new RecipeResponse(
                recipe.getId(),
                recipe.getAppUser().getDisplayName() ,
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
