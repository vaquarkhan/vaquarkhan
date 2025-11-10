package com.premiummobility.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/chauffeurs", "/api/services", "/api/partner-offers/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/services/**", "/api/partner-offers/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/services/**", "/api/partner-offers/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/partner-offers/**").hasRole("ADMIN")
                .requestMatchers("/api/concierge/**", "/api/secure-chat/**", "/api/translator/**").hasAnyRole("CONCIERGE", "ADMIN")
                .requestMatchers("/api/bookings/**", "/api/experiences/**", "/api/esim/**", "/api/loyalty/transactions/**", "/api/customers/**").hasAnyRole("CONCIERGE", "ADMIN")
                .requestMatchers("/api/insurance/**").hasAnyRole("CONCIERGE", "ADMIN")
                .requestMatchers("/api/analytics/**", "/api/ai/interactions/**").hasAnyRole("ANALYST", "ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
