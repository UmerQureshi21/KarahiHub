package com.umerqureshicodes.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 *   A @Configuration class — Spring picks it up at startup and says "this class defines beans (objects) that I need to manage." It scans
 *   for any @Bean methods inside it and runs them, putting the returned objects into Spring's application context (basically a big
 *   container of managed objects).
 */

@Configuration
public class CorsConfig {



    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // allowCredentials(true) is required for the browser to send the refresh_token cookie.
                // CORS spec forbids allowedOrigins("*") when credentials are enabled,
                // so we specify the frontend origin explicitly.
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
