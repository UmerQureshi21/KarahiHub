package com.umerqureshicodes.backend.rating;

import com.umerqureshicodes.backend.auth.AppUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Repository;
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
}
