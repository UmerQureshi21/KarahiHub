package com.umerqureshicodes.backend.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

// Low-level JWT utility. Handles token generation, validation, and claim extraction.
// Knows nothing about HTTP, filters, or controllers.
@Service
public class JwtService {

    // Read from application.properties
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    // --- Token generation ---

    public String generateAccessToken(UserDetails userDetails) {
        return buildToken(userDetails, accessTokenExpiration);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(userDetails, refreshTokenExpiration);
    }

    // Builds a signed JWT with the user's email as the "sub" (subject) claim.
    // The token contains: sub (email), iat (issued at), exp (expiration), and a signature.
    private String buildToken(UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .subject(userDetails.getUsername())          // email goes into the "sub" claim
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())                   // signs with HMAC-SHA256
                .compact();                                  // serializes to "xxxxx.yyyyy.zzzzz"
    }

    // --- Token validation ---

    // Two checks: (1) email in token matches the UserDetails, (2) token isn't expired.
    // If the signature is invalid, parseSignedClaims() already throws before we get here.
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String email = extractEmail(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // No-DB validation: only checks signature (via parseSignedClaims) + expiration.
    // Trusts the token entirely — no user lookup needed.
    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // --- Claim extraction ---

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Generic claim extractor — pass any function that reads from Claims.
    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    // Parses and verifies the token in one step.
    // If signature is wrong or token is malformed, this throws.
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // --- Key management ---

    // Decodes the base64 secret from application.properties into a SecretKey.
    // Keys.hmacShaKeyFor() picks HS256/HS384/HS512 based on key length.
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
