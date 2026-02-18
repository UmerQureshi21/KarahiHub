package com.umerqureshicodes.backend.controllers;

import com.umerqureshicodes.backend.dto.RecipeRequest;
import com.umerqureshicodes.backend.dto.RecipeResponse;
import com.umerqureshicodes.backend.dto.SearchFilterRequest;
import com.umerqureshicodes.backend.entities.AppUser;
import com.umerqureshicodes.backend.services.RecipeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public List<RecipeResponse> getAll() {
        return recipeService.getAllRecipes();
    }

    @GetMapping("/{id}")
    public RecipeResponse getById(@PathVariable Long id) {
        return recipeService.getById(id);
    }


    // POST /api/recipes/search — search by title + filter by categories, time, rating, servings + sort
    @PostMapping("/search")
    public List<RecipeResponse> searchAndFilter(@RequestBody SearchFilterRequest request) {
        return recipeService.searchAndFilter(request);
    }

    @PostMapping
    public RecipeResponse createRecipe(@RequestBody RecipeRequest request, @AuthenticationPrincipal AppUser user) {
        return recipeService.saveRecipe(request, user);
    }

    @GetMapping("/mine")
    public List<RecipeResponse> getMyRecipes(@AuthenticationPrincipal AppUser user) {
        return recipeService.getAllByEmail(user.getEmail());
    }

    // POST /api/recipes/5/favourite — toggles favourite on/off for the authenticated user
    @PostMapping("/{id}/favourite")
    public RecipeResponse toggleFavourite(@PathVariable Long id, @AuthenticationPrincipal AppUser user) {
        return recipeService.toggleFavourite(id, user.getEmail());
    }
}
