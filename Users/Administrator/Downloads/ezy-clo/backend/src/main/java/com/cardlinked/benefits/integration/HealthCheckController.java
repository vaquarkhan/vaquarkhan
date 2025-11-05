package com.cardlinked.benefits.integration;

import com.cardlinked.benefits.integration.mastercard.MastercardApiService;
import com.cardlinked.benefits.integration.visa.VisaApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    private final MastercardApiService mastercardApiService;
    private final VisaApiService visaApiService;

    public HealthCheckController(MastercardApiService mastercardApiService, 
                               VisaApiService visaApiService) {
        this.mastercardApiService = mastercardApiService;
        this.visaApiService = visaApiService;
    }

    @GetMapping("/integrations")
    public ResponseEntity<IntegrationHealthResponse> checkIntegrations() {
        Map<String, ServiceHealth> services = new HashMap<>();
        
        // Check Mastercard API
        services.put("mastercard", checkMastercardHealth());
        
        // Check Visa API
        services.put("visa", checkVisaHealth());
        
        boolean allHealthy = services.values().stream()
            .allMatch(health -> health.getStatus() == HealthStatus.UP);
        
        IntegrationHealthResponse response = new IntegrationHealthResponse();
        response.setOverallStatus(allHealthy ? HealthStatus.UP : HealthStatus.DOWN);
        response.setServices(services);
        response.setCheckedAt(LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }

    private ServiceHealth checkMastercardHealth() {
        try {
            // Simple health check - attempt to get benefits for a test BIN
            mastercardApiService.getAvailableBenefits("555555", "US");
            return new ServiceHealth(HealthStatus.UP, "Mastercard API is responsive", null);
        } catch (Exception e) {
            return new ServiceHealth(HealthStatus.DOWN, "Mastercard API error", e.getMessage());
        }
    }

    private ServiceHealth checkVisaHealth() {
        try {
            // Simple health check - attempt to get benefits for a test BIN
            visaApiService.getAvailableBenefits("411111");
            return new ServiceHealth(HealthStatus.UP, "Visa API is responsive", null);
        } catch (Exception e) {
            return new ServiceHealth(HealthStatus.DOWN, "Visa API error", e.getMessage());
        }
    }

    @Data
    public static class IntegrationHealthResponse {
        private HealthStatus overallStatus;
        private Map<String, ServiceHealth> services;
        private LocalDateTime checkedAt;
    }

    @Data
    public static class ServiceHealth {
        private HealthStatus status;
        private String message;
        private String error;

        public ServiceHealth(HealthStatus status, String message, String error) {
            this.status = status;
            this.message = message;
            this.error = error;
        }
    }

    public enum HealthStatus {
        UP, DOWN, UNKNOWN
    }
}