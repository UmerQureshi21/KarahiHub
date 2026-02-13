package com.umerqureshicodes.backend.controllers;

import com.umerqureshicodes.backend.dto.RecipeRequest;
import com.umerqureshicodes.backend.entities.Ingredient;
import com.umerqureshicodes.backend.entities.Recipe;
import com.umerqureshicodes.backend.repositories.RecipeRepository;
import com.umerqureshicodes.backend.services.RecipeService;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public List<RecipeRequest> getAll() {
        return recipeService.getAllRecipes();
    }

    @PostMapping
    public RecipeRequest createRecipe(@RequestBody RecipeRequest request) {
        return recipeService.saveRecipe(request);
    }
}
