package com.umerqureshicodes.backend.config;

import com.umerqureshicodes.backend.jwt.JwtAuthenticationFilter;
import com.umerqureshicodes.backend.repositories.AppUserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AppUserRepository appUserRepository;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          AppUserRepository appUserRepository) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.appUserRepository = appUserRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF off — we're using stateless JWT, not session cookies
                .csrf(csrf -> csrf.disable())

                // STATELESS: no HTTP sessions. Every request is authenticated independently via JWT.
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Route permissions
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()     // login/register/refresh — must be open
                        //.requestMatchers("/api/recipes/**").permitAll()  // keep recipes public for now
                        .anyRequest().authenticated()                   // everything else needs a valid JWT
                )

                // Custom error responses for security-level rejections (before controllers).
                // These happen at the filter level, so @RestControllerAdvice can't catch them.
                .exceptionHandling(ex -> ex
                        // 401 — no token or invalid token
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"status\":401,\"message\":\"Authentication required\"}");
                        })
                        // 403 — authenticated but not allowed
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"status\":403,\"message\":\"You don't have permission to do this\"}");
                        })

                        //Filter level (SecurityConfig's exceptionHandling) — catches 401/403 from Spring Security before requests reach
                        //controllers. So i customizes to give proper error responses so

                )

                // Wire up our DaoAuthenticationProvider (handles login password checking)
                .authenticationProvider(authenticationProvider())

                // Insert our JWT filter BEFORE Spring's built-in username/password filter.
                // This means JWT auth is attempted first on every request.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // UserDetailsService: Spring Security calls this to load a user by "username" (email in our case).
    // It's used by DaoAuthenticationProvider during login, and by JwtAuthenticationFilter on every request.
    @Bean
    public UserDetailsService userDetailsService() {
        return email -> appUserRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    // BCrypt: industry standard password hashing. Handles salting automatically
    // and is deliberately slow to resist brute-force attacks.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // DaoAuthenticationProvider: connects UserDetailsService + PasswordEncoder.
    // When authenticationManager.authenticate() is called with email + password:
    //   1. Calls userDetailsService.loadUserByUsername(email) → gets the AppUser
    //   2. Calls passwordEncoder.matches(rawPassword, hashedPassword) → verifies
    //   3. If mismatch → throws BadCredentialsException → 401
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // AuthenticationManager: the entry point that AuthService.login() calls.
    // Spring auto-configures it to use our DaoAuthenticationProvider above.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
