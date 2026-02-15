package com.umerqureshicodes.backend.dto;

// Only the access token goes in the response body.
// The refresh token is set as an HTTP-only cookie by the controller,
// so JavaScript (and XSS attacks) can never read it.
public record AuthResponse(
        String accessToken,
        String email,
        String username
) {
}
