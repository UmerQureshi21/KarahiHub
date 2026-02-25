package com.umerqureshicodes.backend.entities;

import jakarta.persistence.*;

@Entity
public class RecipeImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    // the S3 object key — used to generate presigned URLs and to delete from S3
    private String s3Key;

    public RecipeImage() {
    }

    public RecipeImage(String s3Key, Recipe recipe) {
        this.s3Key = s3Key;
        this.recipe = recipe;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }

    public String getS3Key() {
        return s3Key;
    }

    public void setS3Key(String s3Key) {
        this.s3Key = s3Key;
    }
}
