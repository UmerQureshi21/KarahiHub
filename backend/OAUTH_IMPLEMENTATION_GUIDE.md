# OAuth2 Implementation Guide

## What I've Done (Boilerplate)

1. ✅ Added `spring-boot-starter-oauth2-client` dependency
2. ✅ Created `application.properties.example` with OAuth config template
3. ✅ Created `AuthProvider` enum
4. ✅ Created `OAuth2SecurityConfig.java` (security configuration)
5. ✅ Created `CustomOAuth2UserService.java` (loads/creates users from OAuth)
6. ✅ Created `CustomOAuth2User.java` (wrapper class)
7. ✅ Created `OAuth2AuthenticationSuccessHandler.java` (generates JWT and redirects)

## What YOU Need to Do

### 1. Update AppUser Entity
**File:** `src/main/java/com/umerqureshicodes/backend/entities/AppUser.java`

Add these fields:
```java
@Enumerated(EnumType.STRING)
private AuthProvider provider;

private String providerId;
```

Add new constructor:
```java
public AppUser(String email, String username, AuthProvider provider, String providerId) {
    this.email = email;
    this.username = username;
    this.password = null;  // OAuth users don't have passwords
    this.provider = provider;
    this.providerId = providerId;
    this.recipes = new ArrayList<>();
}
```

Add getters/setters for the new fields. 

### 2. Get Google OAuth Credentials
1. Go to https://console.cloud.google.com/
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set redirect URI: `http://localhost:8080/login/oauth2/code/google`
6. Copy Client ID and Client Secret

### 3. Configure application.properties
Copy `application.properties.example` to `application.properties` and fill in:
- Database credentials
- JWT secret
- Google Client ID
- Google Client Secret

### 4. Implement User Creation Logic
**File:** `src/main/java/com/umerqureshicodes/backend/services/CustomOAuth2UserService.java`

In the `loadUser` method, implement:
```java
// Check if user exists
Optional<AppUser> existingUser = appUserRepository.findById(email);
AppUser user;

if (existingUser.isPresent()) {
    user = existingUser.get();

    // QUESTION: What if they signed up with email/password first,
    // then try to login with Google?
    // Option 1: Allow it and update provider
    // Option 2: Throw error saying "please use email/password login"

    // TODO: Decide and implement your logic

} else {
    // Create new user
    user = new AppUser(
        email,
        name,  // from Google
        AuthProvider.GOOGLE,
        providerId  // from Google's "sub" attribute
    );
    user = appUserRepository.save(user);
}

// Return wrapped user
return new CustomOAuth2User(oAuth2User, user);
```

### 5. Integrate with Your Existing JWT Service
**File:** `src/main/java/com/umerqureshicodes/backend/services/OAuth2AuthenticationSuccessHandler.java`

1. Find your JWT generation service (probably `JwtService` or similar)
2. Inject it into the success handler
3. Replace `"PLACEHOLDER_TOKEN"` with actual JWT generation:
   ```java
   String token = jwtService.generateToken(oAuth2User.getAppUser());
   ```

### 6. Merge with Existing Security Configuration
**File:** `src/main/java/com/umerqureshicodes/backend/config/OAuth2SecurityConfig.java`

You probably have an existing `SecurityFilterChain`. You need to:
1. Find your current security config
2. Add the OAuth2 configuration to it
3. Make sure your JWT filter chain still works
4. Configure CORS to allow your frontend origin

**HINT:** Look for a file like `SecurityConfig.java` or `WebSecurityConfig.java`

### 7. Frontend Integration

Create a page that handles the OAuth redirect:
```javascript
// Frontend: /oauth2/redirect
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
    localStorage.setItem('jwt', token);
    // Redirect to dashboard
    window.location.href = '/dashboard';
}
```

Add a "Login with Google" button:
```javascript
<a href="http://localhost:8080/oauth2/authorization/google">
    Login with Google
</a>
```

### 8. Handle OAuth Users in Your Existing Code

Remember: OAuth users have `password = null`

Update your login/authentication logic to check:
```java
if (user.getProvider() == AuthProvider.GOOGLE) {
    // Can't login with password, must use OAuth
    throw new Exception("Please login with Google");
}
```

## Testing Steps

1. Start your backend
2. Navigate to: `http://localhost:8080/oauth2/authorization/google`
3. You should be redirected to Google login
4. Login with Google account
5. You should be redirected back to your frontend with a token
6. Check your database - new user should be created with:
   - email from Google
   - username from Google
   - password = null
   - provider = GOOGLE
   - providerId = Google's sub ID

## Common Issues

### "redirect_uri_mismatch"
- Make sure Google Cloud Console has exact redirect URI: `http://localhost:8080/login/oauth2/code/google`

### "Invalid token"
- Check JWT generation is working
- Make sure you're using the same JWT secret

### "User already exists"
- Decide: allow linking accounts or force one auth method

### CORS errors
- Add your frontend URL to CORS configuration
- Make sure cookies/credentials are allowed

## Questions to Think About

1. **Account Linking:** What if someone signs up with email/password first, then tries Google login?
2. **Email Verification:** Google emails are pre-verified. How to handle this?
3. **Profile Updates:** Should you update username/picture every OAuth login?
4. **Multiple Providers:** What if they want to link both Google AND GitHub?

## Next Steps

1. Implement the TODO sections
2. Test the flow end-to-end
3. Handle edge cases (existing users, etc.)
4. Add error handling
5. Consider adding GitHub/Facebook OAuth using the same pattern

Good luck! Remember: OAuth is just another way to create/authenticate a user. The JWT flow after that is exactly the same as your traditional login.
