package com.umerqureshicodes.backend.auth;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Custom OAuth2 User Service
 *
 * This service is called after the user successfully authenticates with Google.
 * It receives the user's profile information from Google and either:
 * 1. Loads an existing user from the database
 * 2. Creates a new user if they don't exist
 *
 * The OAuth2User object contains attributes like:
 * - sub (Google's unique ID for the user)
 * - email
 * - name
 * - picture (profile picture URL)
 */
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AppUserRepository appUserRepository;

    public CustomOAuth2UserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // First, get the user info from Google using the default implementation
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Extract information from the OAuth2User
        String provider = userRequest.getClientRegistration().getRegistrationId(); // "google"
        String providerId = oAuth2User.getAttribute("sub");  // Google's unique user ID
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        System.out.println("OAuth2 Login Attempt:");
        System.out.println("Provider: " + provider);
        System.out.println("Provider ID: " + providerId);
        System.out.println("Email: " + email);
        System.out.println("Name: " + name);

        Optional<AppUser> appUser = appUserRepository.findByEmail(email);
        AppUser user = null;

        if (appUser.isPresent()) {
            user = appUser.get();
            if (user.getProviderId() == null) {
                // Link accounts: store Google's providerId so we recognise them
                // next time, but keep provider as TRADITIONAL so password login
                // still works.
                user.setProviderId(providerId);
            }
        }
        else{
            //create user
            user = new AppUser(
                email,
                name,
                AuthProvider.GOOGLE,
                providerId
            );
        }

        appUserRepository.save(user);
        return new CustomOAuth2User(oAuth2User, user);
    }
}
