package com.umerqureshicodes.backend.services;

import com.umerqureshicodes.backend.dto.RatingRequest;
import com.umerqureshicodes.backend.dto.RatingResponse;
import com.umerqureshicodes.backend.entities.AppUser;
import com.umerqureshicodes.backend.entities.Rating;
import com.umerqureshicodes.backend.entities.RatingId;
import com.umerqureshicodes.backend.entities.Recipe;
import com.umerqureshicodes.backend.exceptions.GeneralException;
import com.umerqureshicodes.backend.repositories.AppUserRepository;
import com.umerqureshicodes.backend.repositories.RatingRepository;
import com.umerqureshicodes.backend.repositories.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RatingService {
    private final RatingRepository ratingRepository;
    private final AppUserRepository appUserRepository;
    private final RecipeRepository recipeRepository;
    private final RecipeService recipeService;

    public RatingService(RatingRepository ratingRepository, AppUserRepository appUserRepository,
                         RecipeRepository recipeRepository, RecipeService recipeService) {
        this.ratingRepository = ratingRepository;
        this.appUserRepository = appUserRepository;
        this.recipeRepository = recipeRepository;
        this.recipeService = recipeService;
    }

    public RatingResponse save(RatingRequest ratingRequest, String authorEmail) {
        AppUser author = appUserRepository.findByEmail(authorEmail).orElseThrow();
        Recipe recipe = recipeRepository.findById(ratingRequest.recipeId()).orElseThrow();
        Optional<Rating> prevRating = ratingRepository.findById(new RatingId(authorEmail, ratingRequest.recipeId()));
        if (prevRating.isPresent()) {
            throw new GeneralException("Rating already exists");
        }
        Rating rating = new Rating();
        rating.setAuthor(author);
        rating.setRecipe(recipe);
        rating.setScore(ratingRequest.score());
        RatingResponse response = ratingRepository.save(rating).toResponse();

        // Recalculate and update the recipe's average rating
        Double avgScore = ratingRepository.getAverageScore(ratingRequest.recipeId());
        recipeService.updateRating(ratingRequest.recipeId(), avgScore != null ? avgScore : 0.0);

        return response;
    }

}
