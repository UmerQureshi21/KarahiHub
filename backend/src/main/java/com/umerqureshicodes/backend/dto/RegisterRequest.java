package com.umerqureshicodes.backend.dto;

public record RegisterRequest(
        String email,
        String username,
        String password
) {
}
