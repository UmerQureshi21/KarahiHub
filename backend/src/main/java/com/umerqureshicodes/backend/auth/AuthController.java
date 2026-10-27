package com.umerqureshicodes.backend.auth;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String REFRESH_COOKIE = "refresh_token";
    // matches the refresh token expiration
    private static final Duration REFRESH_COOKIE_MAX_AGE = Duration.ofDays(7);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST /api/auth/register
    // Takes { email, username, password }, returns { accessToken, email, username }
    // Also sets a refresh_token HTTP-only cookie.
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        String refreshToken = authService.generateRefreshToken(request.email());
        return withRefreshCookie(authResponse, refreshToken);
    }

    // POST /api/auth/login
    // Takes { email, password }, returns { accessToken, email, username }
    // Also sets a refresh_token HTTP-only cookie.
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        String refreshToken = authService.generateRefreshToken(request.email());
        return withRefreshCookie(authResponse, refreshToken);
    }

    // POST /api/auth/refresh
    // No request body needed — the refresh token comes from the HTTP-only cookie,
    // which the browser sends automatically.
    // Returns a new access token + rotates the refresh token cookie.
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            // @CookieValue pulls the cookie out of the request for us;
            // required = false so a missing cookie gives null instead of a 400
            @CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken
    ) {
        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }

        // Validate and get new access token
        AuthResponse authResponse = authService.refresh(refreshToken);

        // Rotate: issue a new refresh token cookie (old one is replaced)
        String newRefreshToken = authService.generateRefreshToken(authResponse.email());
        return withRefreshCookie(authResponse, newRefreshToken);
    }

    // POST /api/auth/logout
    // Clears the refresh_token cookie by sending an empty one with maxAge 0,
    // which tells the browser to delete it.
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie("", Duration.ZERO).toString())
                .build();
    }

    // 200 OK with the auth body, plus a Set-Cookie header carrying the refresh token
    private ResponseEntity<AuthResponse> withRefreshCookie(AuthResponse body, String refreshToken) {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie(refreshToken, REFRESH_COOKIE_MAX_AGE).toString())
                .body(body);
    }

    // Builds the refresh token cookie. Used both to set it and (with maxAge 0) to clear it,
    // so the two always match — a browser only deletes a cookie when the name and path match.
    // - HttpOnly: JavaScript cannot access it (XSS protection)
    // - Path=/api/auth: only sent to auth endpoints, not every request
    // - SameSite=Lax: what browsers already assume by default, now stated explicitly
    // - Secure=false: set to true in production (requires HTTPS)
    private ResponseCookie refreshCookie(String value, Duration maxAge) {
        return ResponseCookie.from(REFRESH_COOKIE, value)
                .httpOnly(true)
                .secure(false)
                .path("/api/auth")
                .sameSite("Lax")
                .maxAge(maxAge)
                .build();
    }
}
