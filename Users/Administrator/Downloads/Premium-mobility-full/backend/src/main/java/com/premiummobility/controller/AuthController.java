package com.premiummobility.controller;

import com.premiummobility.model.AdminUser;
import com.premiummobility.repository.AdminUserRepository;
import com.premiummobility.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final AdminUserRepository repo;
    private final JwtUtil jwtUtil;

    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AuthController(AdminUserRepository repo, JwtUtil jwtUtil, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "username and password required"));
        }
        return repo.findByUsername(username)
                .map(user -> {
                    // Use BCrypt password comparison
                    if (!passwordEncoder.matches(password, user.getPassword())) {
                        return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
                    }
                    String token = jwtUtil.generateToken(username, user.getRole());
                    return ResponseEntity.ok(Map.of(
                            "token", token,
                            "role", user.getRole()
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "invalid credentials")));
    }
}
