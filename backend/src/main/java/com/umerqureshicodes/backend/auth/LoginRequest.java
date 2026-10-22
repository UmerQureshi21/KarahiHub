package com.umerqureshicodes.backend.auth;

public record LoginRequest(
        String email,
        String password
) {
}
