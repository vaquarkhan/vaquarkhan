package com.cardlinked.benefits.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RateLimitingFilter rateLimitingFilter;
    private final SecurityHeadersFilter securityHeadersFilter;
    private final InputValidationFilter inputValidationFilter;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                         RateLimitingFilter rateLimitingFilter,
                         SecurityHeadersFilter securityHeadersFilter,
                         InputValidationFilter inputValidationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.rateLimitingFilter = rateLimitingFilter;
        this.securityHeadersFilter = securityHeadersFilter;
        this.inputValidationFilter = inputValidationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/api/auth/**", "/api/health/**", "/actuator/**").permitAll()
                
                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Offer management endpoints
                .requestMatchers("/api/offers/create", "/api/offers/*/update", "/api/offers/*/delete")
                    .hasAnyAuthority("OFFERS_WRITE", "OFFERS_ADMIN")
                .requestMatchers("/api/offers/**").hasAnyAuthority("OFFERS_READ", "OFFERS_WRITE", "OFFERS_ADMIN")
                
                // Customer management endpoints
                .requestMatchers("/api/customers/create", "/api/customers/*/update")
                    .hasAnyAuthority("CUSTOMERS_WRITE", "CUSTOMERS_ADMIN")
                .requestMatchers("/api/customers/**").hasAnyAuthority("CUSTOMERS_READ", "CUSTOMERS_WRITE", "CUSTOMERS_ADMIN")
                
                // Analytics endpoints
                .requestMatchers("/api/analytics/**").hasAnyAuthority("ANALYTICS_READ", "ANALYTICS_ADMIN")
                
                // Transaction endpoints
                .requestMatchers("/api/transactions/**").hasAnyAuthority("TRANSACTIONS_READ", "TRANSACTIONS_WRITE", "TRANSACTIONS_ADMIN")
                
                // Audit endpoints
                .requestMatchers("/api/audit/**").hasAnyAuthority("AUDIT_READ", "AUDIT_ADMIN")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            // Add custom filters in order
            .addFilterBefore(inputValidationFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(securityHeadersFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*", "https://localhost:*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Stronger hashing for banking
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}