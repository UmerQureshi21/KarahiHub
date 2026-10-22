package com.umerqureshicodes.backend.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

/**
 * Custom OAuth2 User
 *
 * This class wraps both AppUser (our database entity) and OAuth2User (Spring's interface)
 * so we can access both throughout the authentication flow.
 *
 * Why do we need this?
 * - OAuth2User has the attributes from Google (email, name, picture, etc.)
 * - AppUser is our database entity
 * - We need both to generate a JWT and manage the user
 */
public class CustomOAuth2User implements OAuth2User {

    private final OAuth2User oauth2User;
    private final AppUser appUser;

    public CustomOAuth2User(OAuth2User oauth2User, AppUser appUser) {
        this.oauth2User = oauth2User;
        this.appUser = appUser;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oauth2User.getAuthorities();
    }

    @Override
    public String getName() {
        return oauth2User.getAttribute("name");
    }

    public AppUser getAppUser() {
        return appUser;
    }

    public String getEmail() {
        return oauth2User.getAttribute("email");
    }

    public String getPicture() {
        return oauth2User.getAttribute("picture");
    }
}
