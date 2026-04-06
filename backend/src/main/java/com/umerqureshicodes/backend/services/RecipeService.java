package com.umerqureshicodes.backend.services;

import com.umerqureshicodes.backend.dto.IngredientRequest;
import com.umerqureshicodes.backend.dto.RecipeRequest;
import com.umerqureshicodes.backend.dto.RecipeResponse;
import com.umerqureshicodes.backend.dto.SearchFilterRequest;
import com.umerqureshicodes.backend.entities.*;
import com.umerqureshicodes.backend.repositories.AppUserRepository;
import com.umerqureshicodes.backend.repositories.CategoryRepository;
import com.umerqureshicodes.backend.repositories.RecipeRepository;
import com.umerqureshicodes.backend.s3.S3Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final AppUserRepository appUserRepository;
    private final CategoryRepository categoryRepository;
    private final S3Service s3Service;

    public RecipeService(RecipeRepository recipeRepository, AppUserRepository appUserRepository,
                         CategoryRepository categoryRepository, S3Service s3Service) {
        this.recipeRepository = recipeRepository;
        this.appUserRepository = appUserRepository;
        this.categoryRepository = categoryRepository;
        this.s3Service = s3Service;
    }

    public RecipeResponse saveRecipe(RecipeRequest request, List<MultipartFile> images, AppUser appUser) {
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
        // look up the actual Category entities from the enum values sent by the frontend
        List<Category> categories = request.categories().stream()
                .map(cat -> categoryRepository.findById(cat).orElseThrow())
                .toList();
        recipe.setCategories(categories);
        recipe.setRating(0);
        recipe.setCreatedAt(new Date());
        recipe.setUpdatedAt(new Date());

        List<Ingredient> ingredients = request.ingredients().stream()
                .map(ing -> new Ingredient(ing.name(), ing.quantity(), ing.unitOfMeasurement(), recipe))
                .toList();
        recipe.setIngredients(ingredients);

        // Upload each image to S3, then create RecipeImage entities with the returned keys
        List<RecipeImage> recipeImages = (images != null ? images : Collections.<MultipartFile>emptyList())
                .stream()
                .map(file -> {
                    String s3Key = s3Service.uploadFile(file);
                    return new RecipeImage(s3Key, recipe);
                })
                .toList();
        recipe.setImages(recipeImages);

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

    public boolean recipeOwnedByAppUser(String email, Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
        return email.equals(recipe.getAppUser().getEmail());
    }

    // Toggles favourite: if already favourited, removes it. If not, adds it.
    // @Transactional means JPA tracks all changes to entities within this method
    // and auto-saves them when the method finishes — no manual save() needed.
    // If anything throws, all changes roll back automatically.
    @Transactional
    public RecipeResponse toggleFavourite(Long recipeId, String email) {
        AppUser user = appUserRepository.findByEmail(email).orElseThrow();
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();

        // Must update BOTH sides in memory so the DTO reflects the current state.
        // JPA only syncs the owning side (user.favourites) to the DB —
        // it doesn't auto-update recipe.favouritedBy in memory.
        if (user.getFavourites().contains(recipe)) {
            user.getFavourites().remove(recipe);
            recipe.getFavouritedBy().remove(user); // already updated in db, but i updated in memory object too so i can get accurate dto
        } else {
            user.getFavourites().add(recipe);
            recipe.getFavouritedBy().add(user);
        }

        return convertToDto(recipe);
    }

    public List<RecipeResponse> getFavouriteRecipes(String email) {
        AppUser user = appUserRepository.findByEmail(email).orElseThrow();
        return user.getFavourites().stream().map(this::convertToDto).toList();
    }

    public boolean isSelectedInFavs(Long recipeId, String email){
return recipeRepository.isSelectedInFavs(recipeId, email);
    }


    /* USE SQL AVG() TO GET AVERAGE RATING */


    public List<RecipeResponse> searchAndFilter(SearchFilterRequest request) {
        List<Recipe> results;

        // pick the right repo method based on sort direction
        if (request.ascending()) {
            results = recipeRepository.searchAndFilterAsc(
                    request.query(), request.categories(),
                    request.minPrep(), request.maxPrep(),
                    request.minCook(), request.maxCook(),
                    request.minRating(), request.maxRating(),
                    request.minServings(), request.maxServings(),
                    request.sortBy()
            );
        } else {
            results = recipeRepository.searchAndFilterDesc(
                    request.query(), request.categories(),
                    request.minPrep(), request.maxPrep(),
                    request.minCook(), request.maxCook(),
                    request.minRating(), request.maxRating(),
                    request.minServings(), request.maxServings(),
                    request.sortBy()
            );
        }

        return results.stream().map(this::convertToDto).toList();
    }

    public List<RecipeResponse> getAllByEmail(String email) {
        return recipeRepository.findByAppUserEmail(email).stream()
                .map(this::convertToDto)
                .toList();
    }

    public RecipeResponse convertToDto(Recipe recipe) {
        List<IngredientRequest> ingredients = recipe.getIngredients().stream()
                .map(ing -> new IngredientRequest(ing.getName(), ing.getQuantity(), ing.getUnitOfMeasurement().orElse(null)))
                .toList();

        // convert Category entities back to enum values for the API response
        List<RecipeCategory> categoryNames = recipe.getCategories().stream()
                .map(Category::getName)
                .toList();

        // generate a temporary presigned URL for each image so the frontend can display them
        List<String> imageUrls = recipe.getImages().stream()
                .map(img -> s3Service.generatePresignedUrl(img.getS3Key()))
                .toList();

        return new RecipeResponse(
                recipe.getId(),
                recipe.getAppUser().getDisplayName(),
                recipe.getTitle(),
                recipe.getDescription(),
                ingredients,
                imageUrls,
                recipe.getInstructions(),
                recipe.getPrepTime(),
                recipe.getCookTime(),
                recipe.getServingCount(),
                categoryNames,
                recipe.getFavouritedBy().size()
        );
    }
}
