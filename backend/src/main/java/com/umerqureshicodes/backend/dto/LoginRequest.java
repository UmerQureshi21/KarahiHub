package com.umerqureshicodes.backend.dto;

public record LoginRequest(
        String email,
        String password
) {
}
