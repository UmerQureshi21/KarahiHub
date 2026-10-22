package com.umerqureshicodes.backend.auth;

import com.umerqureshicodes.backend.jwt.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * OAuth2 Authentication Success Handler
 *
 * This is called after successful OAuth2 login.
 * It needs to:
 * 1. Get the authenticated user (CustomOAuth2User)
 * 2. Generate a JWT token for them
 * 3. Redirect to the frontend with the token
 *
 * The frontend will receive the token and store it (localStorage/cookie)
 * for subsequent API requests.
 */
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

     private final JwtService jwtService;

     public OAuth2AuthenticationSuccessHandler(JwtService jwtService) {
         this.jwtService = jwtService;
     }

    private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/api/auth");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        // Get the authenticated user
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.
                getPrincipal();

        System.out.println(
                "OAuth2 login successful for: " + oAuth2User.getEmail()
        );

        String token = jwtService.generateAccessToken(
                oAuth2User.getAppUser()
        );

        String refreshToken = jwtService.generateRefreshToken(
                oAuth2User.getAppUser()
        );
        addRefreshTokenCookie(response, refreshToken);

        String frontendUrl = "http://localhost:5173";

        String targetUrl = UriComponentsBuilder.fromUriString(
                frontendUrl + "/oauth2/redirect")
                .queryParam("token", token)
                .build().toUriString();

        System.out.println("Redirecting to: " + targetUrl);

        // Redirect to frontend with token
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
