package com.umerqureshicodes.backend.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class, // don't geneartea random id, use actualy id propery tha's here
        property = "id" // uses id field as a unique identifier for each object
)
//  It tells Jackson: "track objects by their id. First encounter = serialize fully. Every encounter after that = just output the id
//  number."
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER) // make it eager, so that the whole appuser loads and then ican access display name, whereas with lazy, it doenst sllow custom getters
    @JoinColumn(name = "user_id")
    private AppUser appUser;

    private String title;
    private String description;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private List<Ingredient> ingredients = new ArrayList<>();
    private List<String> instructions = new ArrayList<>();
    private int prepTime;
    private int cookTime;
    private int servingCount;
    @ManyToMany
    @JoinTable(
            name = "recipe_categories",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "category_name")
    )
    private List<Category> categories= new ArrayList<>();
    private Date createdAt;
    private Date updatedAt;
    private double rating;

    // The non-owning side — just a read-only mirror of what's in the user_favourites join table.
    // mappedBy = "favourites" points to the favourites field on AppUser.
    @ManyToMany(mappedBy = "favourites")
    private List<AppUser> favouritedBy = new ArrayList<>();

    public Recipe() {
    }

    public Recipe(AppUser appUser, String title, String description, List<Ingredient> ingredients,
                  List<String> instructions, int prepTime, int cookTime, int servingCount,
                  List<Category> categories, Date createdAt, Date updatedAt, double rating) {
        this.appUser = appUser;
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.servingCount = servingCount;
        this.categories = categories;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.rating = rating;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AppUser getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Ingredient> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<Ingredient> ingredients) {
        this.ingredients = ingredients;
    }

    public List<String> getInstructions() {
        return instructions;
    }

    public void setInstructions(List<String> instructions) {
        this.instructions = instructions;
    }

    public int getPrepTime() {
        return prepTime;
    }

    public void setPrepTime(int prepTime) {
        this.prepTime = prepTime;
    }

    public int getCookTime() {
        return cookTime;
    }

    public void setCookTime(int cookTime) {
        this.cookTime = cookTime;
    }

    public int getServingCount() {
        return servingCount;
    }

    public void setServingCount(int servingCount) {
        this.servingCount = servingCount;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public List<AppUser> getFavouritedBy() {
        return favouritedBy;
    }

    public void setFavouritedBy(List<AppUser> favouritedBy) {
        this.favouritedBy = favouritedBy;
    }
}
