package com.umerqureshicodes.backend.auth;

import com.umerqureshicodes.backend.recipe.Recipe;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

// Implements UserDetails so Spring Security can use this directly
// as the authenticated principal
@Entity
public class AppUser implements UserDetails {

    @Id
    private String email;
    private String username;
    private String password;
    @OneToMany(mappedBy = "appUser", cascade = CascadeType.ALL)
    private List<Recipe> recipes = new ArrayList<>();
    // The owning side of the many-to-many. JPA creates a join table called "user_favourites"
    // with two columns: user_email and recipe_id.
    // When you add/remove a recipe from this list and save, JPA updates the join table.
    @ManyToMany
    @JoinTable(
            name = "user_favourites",
            joinColumns = @JoinColumn(name = "user_email"),
            inverseJoinColumns = @JoinColumn(name = "recipe_id")
    )
    private List<Recipe> favourites = new ArrayList<>();
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;
    private String providerId;

    // methods

    public AppUser() {
    }

    public AppUser(String email, String username, String password) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.recipes = new ArrayList<>();
        this.provider = AuthProvider.TRADITIONAL;
        this.providerId = null;
    }

    public AppUser(String email, String username, String password, List<Recipe> recipes) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.recipes = recipes;
    }

    public AppUser(String email, String username, AuthProvider provider, String providerId) {
        this.email = email;
        this.username = username;
        this.password = null;  // OAuth users don't have passwords
        this.provider = provider;
        this.providerId = providerId;
        this.recipes = new ArrayList<>();
    }

    public List<Recipe> getRecipes() {
        return recipes;
    }

    public void setRecipes(List<Recipe> recipes) {
        this.recipes = recipes;
    }

    public List<Recipe> getFavourites() {
        return favourites;
    }

    public void setFavourites(List<Recipe> favourites) {
        this.favourites = favourites;
    }

    public AuthProvider getProvider() {
        return provider;
    }

    public void setProvider(AuthProvider provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Spring Security calls getUsername() to identify the user (the "principal").
    // We return email here because email is our @Id and login identifier.
    @Override
    public String getUsername() {
        return email;
    }

    // The actual display name field — use this when you need the user's chosen name.
    public String getDisplayName() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // No roles/authorities for now — just return an empty list.
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    // The remaining UserDetails methods (isAccountNonExpired, isAccountNonLocked,
    // isCredentialsNonExpired, isEnabled) default to true in Spring Security 6+,
    // so we don't need to override them.
}
