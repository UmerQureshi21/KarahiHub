package com.umerqureshicodes.backend.entities;

import com.umerqureshicodes.backend.dto.RatingResponse;
import jakarta.persistence.*;

// A user's rating for a specific recipe. The primary key is the
// (user_email, recipe_id) pair — one rating per user per recipe.
@Entity
@IdClass(RatingId.class)
public class Rating {

    @Id
    @ManyToOne // allows jpa to know that its a reference to other entities
    @JoinColumn(name = "user_email")
    private AppUser author;

    @Id
    @ManyToOne
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    private int score;

    public Rating() {
    }

    public Rating(AppUser author, Recipe recipe, int score) {
        this.author = author;
        this.recipe = recipe;
        this.score = score;
    }

    public AppUser getAuthor() {
        return author;
    }

    public void setAuthor(AppUser author) {
        this.author = author;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public RatingResponse toResponse() {
        return new RatingResponse(this.recipe.getId(),this.score);
    }
}
