package com.umerqureshicodes.backend.entities;

import java.util.ArrayList;
import java.util.List;

public class FullIngredient {

    private Ingredient actual;
    private List<Ingredient> replacements = new ArrayList<>();

    public FullIngredient() {
    }

    public FullIngredient(Ingredient actual, List<Ingredient> replacements) {
        this.actual = actual;
        this.replacements = replacements;
    }

    public Ingredient getActual() {
        return actual;
    }

    public void setActual(Ingredient actual) {
        this.actual = actual;
    }

    public List<Ingredient> getReplacements() {
        return replacements;
    }

    public void setReplacements(List<Ingredient> replacements) {
        this.replacements = replacements;
    }
}
