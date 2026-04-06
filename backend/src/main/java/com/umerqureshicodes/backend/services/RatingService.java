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
    public RatingService(RatingRepository ratingRepository, AppUserRepository appUserRepository, RecipeRepository recipeRepository) {
        this.ratingRepository = ratingRepository;
        this.appUserRepository = appUserRepository;
        this.recipeRepository = recipeRepository;
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
        return ratingRepository.save(rating).toResponse();
    }

}
