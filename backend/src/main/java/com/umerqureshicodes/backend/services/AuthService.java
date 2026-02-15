package com.umerqureshicodes.backend.services;

import com.umerqureshicodes.backend.dto.AuthResponse;
import com.umerqureshicodes.backend.dto.LoginRequest;
import com.umerqureshicodes.backend.dto.RegisterRequest;
import com.umerqureshicodes.backend.entities.AppUser;
import com.umerqureshicodes.backend.exceptions.GeneralException;
import com.umerqureshicodes.backend.jwt.JwtService;
import com.umerqureshicodes.backend.repositories.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    // Register flow:
    // 1. Hash the password with BCrypt (never store raw passwords)
    // 2. Save the user to PostgreSQL
    // 3. Generate an access token and return it
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase();
        AppUser user = new AppUser(
                email,
                request.username(),
                passwordEncoder.encode(request.password())
        );
        if (appUserRepository.findByEmail(email).isPresent()) {
            //throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
            throw new GeneralException("This user already exists!");
        }
        appUserRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        return new AuthResponse(accessToken, user.getEmail(), user.getDisplayName());
    }

    // Login flow:
    // 1. authenticationManager.authenticate() triggers the DaoAuthenticationProvider:
    //    - It calls UserDetailsService.loadUserByUsername(email) to get the AppUser
    //    - It calls BCryptPasswordEncoder.matches(rawPassword, hashedPassword)
    //    - If wrong password → throws BadCredentialsException → 401
    // 2. If we reach here, authentication passed. Load user and generate tokens.
    public AuthResponse login(LoginRequest request) {
        String email = request.email().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password())
        );

        AppUser user = appUserRepository.findByEmail(email).orElseThrow();

        String accessToken = jwtService.generateAccessToken(user);
        return new AuthResponse(accessToken, user.getEmail(), user.getDisplayName());
    }

    // Generate a refresh token for a given email. Called by the controller
    // to set the HTTP-only cookie.
    public String generateRefreshToken(String email) {
        AppUser user = appUserRepository.findByEmail(email.toLowerCase()).orElseThrow();
        return jwtService.generateRefreshToken(user);
    }

    // Refresh flow:
    // 1. Parse the refresh token and extract the email
    // 2. Load the user from DB
    // 3. Validate the token (signature + expiration + email match)
    // 4. If valid, return a new access token
    public AuthResponse refresh(String refreshToken) {
        String email = jwtService.extractEmail(refreshToken);
        AppUser user = appUserRepository.findByEmail(email).orElseThrow();

        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String accessToken = jwtService.generateAccessToken(user);
        return new AuthResponse(accessToken, user.getEmail(), user.getDisplayName());
    }
}
