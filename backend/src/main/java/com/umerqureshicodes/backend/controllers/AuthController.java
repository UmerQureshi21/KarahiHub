package com.umerqureshicodes.backend.controllers;

import com.umerqureshicodes.backend.dto.AuthResponse;
import com.umerqureshicodes.backend.dto.LoginRequest;
import com.umerqureshicodes.backend.dto.RegisterRequest;
import com.umerqureshicodes.backend.services.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /api/auth/register
    // Takes { email, username, password }, returns { accessToken, email, username }
    // Also sets a refresh_token HTTP-only cookie.
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request,
            HttpServletResponse response // this is how we get access to the raw HTTP response object so we can add the refresh token cookie to it.
    ) {
        AuthResponse authResponse = authService.register(request);
        String refreshToken = authService.generateRefreshToken(request.email());
        addRefreshTokenCookie(response, refreshToken);
        return ResponseEntity.ok(authResponse);
    }

    // POST /api/auth/login
    // Takes { email, password }, returns { accessToken, email, username }
    // Also sets a refresh_token HTTP-only cookie.
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        AuthResponse authResponse = authService.login(request);
        String refreshToken = authService.generateRefreshToken(request.email());
        addRefreshTokenCookie(response, refreshToken);
        return ResponseEntity.ok(authResponse);
    }

    // POST /api/auth/refresh
    // No request body needed — the refresh token comes from the HTTP-only cookie,
    // which the browser sends automatically.
    // Returns a new access token + rotates the refresh token cookie.
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        // Extract the refresh token from cookies
        String refreshToken = extractRefreshTokenFromCookies(request);
        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }

        // Validate and get new access token
        AuthResponse authResponse = authService.refresh(refreshToken);

        // Rotate: issue a new refresh token cookie (old one is replaced)
        String newRefreshToken = authService.generateRefreshToken(authResponse.email());
        addRefreshTokenCookie(response, newRefreshToken);

        return ResponseEntity.ok(authResponse);
    }

    // Sets the refresh token as an HTTP-only cookie.
    // - HttpOnly: JavaScript cannot access it (XSS protection)
    // - Path=/api/auth: only sent to auth endpoints, not every request
    // - MaxAge=7 days: matches the refresh token expiration
    // - Secure=false: set to true in production (requires HTTPS)
    private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/api/auth");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);
    }

    private String extractRefreshTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if ("refresh_token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
