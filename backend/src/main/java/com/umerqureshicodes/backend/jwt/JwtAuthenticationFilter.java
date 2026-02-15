package com.umerqureshicodes.backend.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// Intercepts every request. Checks for Authorization: Bearer <token>, validates it, and sets the authenticated user in SecurityContext
// This filter runs ONCE per request (OncePerRequestFilter guarantees that).
// It sits in the filter chain BEFORE Spring's UsernamePasswordAuthenticationFilter.
//
// Flow:
// 1. Check for "Authorization: Bearer <token>" header
// 2. If missing, skip — the request continues unauthenticated (fine for public endpoints)
// 3. If present, extract email from token, validate signature + expiration
// 4. If valid, build auth token from claims (no DB query) and set in SecurityContext
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    // NOTE: if you switch back to the SAFE approach (DB lookup per request),
    // add UserDetailsService back here and inject it via constructor.
    // private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Get the Authorization header
        String authHeader = request.getHeader("Authorization");

        // 2. No header or not a Bearer token? Skip this filter.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extract the token (everything after "Bearer ")
        String token = authHeader.substring(7);

        // 4. Pull the email out of the token's "sub" claim
        String email = jwtService.extractEmail(token);

        // 5. Only authenticate if we got an email AND there's no existing authentication
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // --- FAST approach: no DB query, trust the token entirely ---
            // Only checks signature (was it signed with our secret?) + expiration (is it still valid?).
            // This is the whole point of JWT — the token is self-contained proof of identity.
            if (jwtService.isTokenValid(token)) {

                // Build a lightweight UserDetails from the token claims alone.
                // No database round-trip needed.
                UserDetails userDetails = new User(email, "", List.of());

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                List.of()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

            // TRADEOFF: if a user changes their password, gets deleted, or gets banned,
            // their existing token still works until it expires (15 min for access tokens).
            // That's the price of skipping the DB — you trade real-time accuracy for speed.

            // --- SAFE approach: queries DB on every request ---
            // Uncomment this block (and comment out the fast approach above) if you want
            // to verify the user still exists and is valid on every single request.
            //
            // UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            // if (jwtService.isTokenValid(token, userDetails)) {
            //     UsernamePasswordAuthenticationToken authToken =
            //             new UsernamePasswordAuthenticationToken(
            //                     userDetails,
            //                     null,
            //                     userDetails.getAuthorities()
            //             );
            //     authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            //     SecurityContextHolder.getContext().setAuthentication(authToken);
            // }
        }

        // 6. Always continue the filter chain
        filterChain.doFilter(request, response);
    }
}
