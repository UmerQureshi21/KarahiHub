package com.umerqureshicodes.backend.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

// Implements UserDetails so Spring Security can use this directly
// as the authenticated principal — no need for a separate wrapper class.
@Entity
public class AppUser implements UserDetails {

    @Id
    private String email;

    private String username;
    private String password;

    @OneToMany(mappedBy = "appUser", cascade = CascadeType.ALL)
    private List<Recipe> recipes = new ArrayList<>();

    public AppUser() {
    }

    public AppUser(String email, String username, String password) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.recipes = new ArrayList<>();
    }

    public AppUser(String email, String username, String password, List<Recipe> recipes) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.recipes = recipes;
    }

    public List<Recipe> getRecipes() {
        return recipes;
    }

    public void setRecipes(List<Recipe> recipes) {
        this.recipes = recipes;
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
