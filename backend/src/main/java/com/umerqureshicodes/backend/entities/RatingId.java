package com.umerqureshicodes.backend.entities;

import java.io.Serializable;
import java.util.Objects;

// Composite primary key for Rating — the combination of (author, recipe)
// uniquely identifies a rating. JPA requires this class to be Serializable
// and have equals/hashCode based on the key fields.
// Field names must match the @Id field names on the Rating entity.
public class RatingId implements Serializable {

    private String author;   // maps to AppUser's @Id (email)
    private Long recipe;   // maps to Recipe's @Id (id)

    public RatingId() {
    }

    public RatingId(String author, Long recipe) {
        this.author = author;
        this.recipe = recipe;
    }

    public String getUser() {
        return author;
    }

    public void setUser(String author) {
        this.author = author;
    }

    public Long getRecipe() {
        return recipe;
    }

    public void setRecipe(Long recipe) {
        this.recipe = recipe;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RatingId ratingId = (RatingId) o;
        return Objects.equals(author, ratingId.author) && Objects.equals(recipe, ratingId.recipe);
    }

    @Override
    public int hashCode() {
        return Objects.hash(author, recipe);
    }
}
