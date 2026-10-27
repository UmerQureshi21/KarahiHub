package com.umerqureshicodes.backend.rating;

import com.umerqureshicodes.backend.auth.AppUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping()
    public RatingResponse createRating(@RequestBody RatingRequest ratingRequest, @AuthenticationPrincipal AppUser user) {
        return ratingService.save(ratingRequest, user.getEmail());
    }

    // GET /api/ratings/mine?recipeId=5 — 200 with the user's rating, or 204 if they haven't rated it
    @GetMapping("/mine")
    public RatingResponse getMyRating(@RequestParam Long recipeId, @AuthenticationPrincipal AppUser user) {
        return ratingService.getMyRating(recipeId, user.getEmail());
    }

    @PutMapping
    public RatingResponse updateRating(@RequestBody RatingRequest ratingRequest, @AuthenticationPrincipal AppUser user) {
        return ratingService.updateRating(ratingRequest, user.getEmail());
    }
}
