package com.premiummobility;

import com.premiummobility.model.AdminUser;
import com.premiummobility.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    private final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner init(AdminUserRepository adminRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            createUserIfMissing(adminRepo, passwordEncoder, "admin", "adminpass", "ADMIN");
            createUserIfMissing(adminRepo, passwordEncoder, "concierge", "conciergepass", "CONCIERGE");
            createUserIfMissing(adminRepo, passwordEncoder, "analyst", "analystpass", "ANALYST");
        };
    }

    private void createUserIfMissing(AdminUserRepository adminRepo, PasswordEncoder passwordEncoder,
                                     String username, String rawPassword, String role) {
        adminRepo.findByUsername(username).orElseGet(() -> {
            String hashed = passwordEncoder.encode(rawPassword);
            AdminUser user = new AdminUser(username, hashed, role);
            log.info("Creating default {} user (username={})", role.toLowerCase(), username);
            return adminRepo.save(user);
        });
    }
}
