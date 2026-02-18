package com.umerqureshicodes.backend.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Category {

    @Id
    @Enumerated(EnumType.STRING)
    private RecipeCategory name;

    @ManyToMany(mappedBy = "categories")
    private List<Recipe> recipes= new ArrayList<>();

    public Category() {
    }

    public Category(RecipeCategory name, List<Recipe> recipes) {
        this.name = name;
        this.recipes = recipes;
    }

    public RecipeCategory getName() {
        return name;
    }

    public void setName(RecipeCategory name) {
        this.name = name;
    }

    public List<Recipe> getRecipes() {
        return recipes;
    }

    public void setRecipes(List<Recipe> recipes) {
        this.recipes = recipes;
    }
}
