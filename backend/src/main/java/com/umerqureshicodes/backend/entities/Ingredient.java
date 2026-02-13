package com.umerqureshicodes.backend.entities;

import java.util.Optional;

public class Ingredient {

    private String name;
    private String quantity;
    private String unitOfMeasurement;

    public Ingredient() {
    }

    public Ingredient(String name, String quantity, String unitOfMeasurement) {
        this.name = name;
        this.quantity = quantity;
        this.unitOfMeasurement = unitOfMeasurement;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public Optional<String> getUnitOfMeasurement() {
        return Optional.ofNullable(unitOfMeasurement);
    }

    public void setUnitOfMeasurement(String unitOfMeasurement) {
        this.unitOfMeasurement = unitOfMeasurement;
    }
}
