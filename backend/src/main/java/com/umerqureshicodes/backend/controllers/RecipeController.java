package com.umerqureshicodes.backend.controllers;

import com.umerqureshicodes.backend.dto.RecipeRequest;
import com.umerqureshicodes.backend.dto.RecipeResponse;
import com.umerqureshicodes.backend.dto.SearchFilterRequest;
import com.umerqureshicodes.backend.entities.AppUser;
import com.umerqureshicodes.backend.services.RecipeService;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @GetMapping("/owned")
    public boolean recipeOwnedByAppUser(@AuthenticationPrincipal AppUser appUser, @RequestParam Long recipeId) {
        return recipeService.recipeOwnedByAppUser(appUser.getEmail(), recipeId);
    }


    // POST /api/recipes/search — search by title + filter by categories, time, rating, servings + sort
    @PostMapping("/search")
    public List<RecipeResponse> searchAndFilter(@RequestBody SearchFilterRequest request) {
        return recipeService.searchAndFilter(request);
    }

    // consumes MULTIPART_FORM_DATA — the request has two named parts:
    //   "recipe"  → JSON body, deserialized into RecipeRequest
    //   "images"  → binary files (optional, user might not upload any)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public RecipeResponse createRecipe(
            @RequestPart("recipe") RecipeRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal AppUser user) {
        return recipeService.saveRecipe(request, images, user);
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

    @GetMapping("/favs")
    public List<RecipeResponse> getFavouriteRecipes(@AuthenticationPrincipal AppUser user) {
        return recipeService.getFavouriteRecipes(user.getEmail());
    }

    @GetMapping("/{id}/isfav")
    public boolean isSelectedInFavs(@AuthenticationPrincipal AppUser user, @PathVariable Long id) {
        return recipeService.isSelectedInFavs(id, user.getEmail());
    }
}
