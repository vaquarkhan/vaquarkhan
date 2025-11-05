package com.cardlinked.benefits.admin.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import lombok.Data;
import java.util.*;

@RestController
@RequestMapping("/api/admin/sso")
@PreAuthorize("hasRole('ADMIN')")
public class SsoConfigController {

    @GetMapping("/providers")
    public List<SsoProvider> getAllProviders() {
        return Arrays.asList(
            SsoProvider.builder()
                .id("mastercard")
                .name("Mastercard Bank Portal")
                .type("SAML")
                .status("ACTIVE")
                .logoUrl("/uploads/mastercard-logo.png")
                .customization(Map.of(
                    "primaryColor", "#eb001b",
                    "secondaryColor", "#f79e1b",
                    "portalName", "Mastercard Benefits"
                ))
                .build(),
            SsoProvider.builder()
                .id("visa")
                .name("Visa Bank Portal")
                .type("OAuth2")
                .status("ACTIVE")
                .logoUrl("/uploads/visa-logo.png")
                .customization(Map.of(
                    "primaryColor", "#1a1f71",
                    "secondaryColor", "#faa61a",
                    "portalName", "Visa Rewards"
                ))
                .build()
        );
    }

    @PostMapping("/providers")
    public ResponseEntity<SsoProvider> createProvider(@RequestBody SsoProvider provider) {
        provider.setId(UUID.randomUUID().toString());
        provider.setStatus("DRAFT");
        return ResponseEntity.ok(provider);
    }

    @PutMapping("/providers/{id}")
    public ResponseEntity<SsoProvider> updateProvider(@PathVariable String id, @RequestBody SsoProvider provider) {
        provider.setId(id);
        return ResponseEntity.ok(provider);
    }

    @PostMapping("/providers/{id}/logo")
    public ResponseEntity<Map<String, String>> uploadLogo(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        String logoUrl = "/uploads/" + id + "-" + file.getOriginalFilename();
        return ResponseEntity.ok(Map.of("logoUrl", logoUrl));
    }

    @PostMapping("/providers/{id}/customize")
    public ResponseEntity<SsoProvider> customizePortal(@PathVariable String id, @RequestBody Map<String, Object> customization) {
        SsoProvider provider = SsoProvider.builder()
            .id(id)
            .customization(customization)
            .build();
        return ResponseEntity.ok(provider);
    }

    @Data @lombok.Builder
    public static class SsoProvider {
        private String id;
        private String name;
        private String type;
        private String status;
        private String logoUrl;
        private String entityId;
        private String ssoUrl;
        private String certificate;
        private String clientId;
        private String clientSecret;
        private Map<String, Object> customization;
    }
}